import {
  getClientPrincipal,
  getOperationIdOverride,
} from '../Shared/utils.mjs';
import appInsights from 'applicationinsights';
appInsights.setup();
const client = appInsights.defaultClient;
import { SearchClient, AzureKeyCredential } from '@azure/search-documents';
import { OpenAIClient } from '@azure/openai';
import prompts from '../promptengineering/prompts.json' assert { type: 'json' };
import { setLogLevel } from '@azure/logger';

import tokenizer from 'gpt-tokenizer';

setLogLevel('info');

const MAX_TOTAL_TOKENS = 3500;
const MAX_COMPLETION_TOKENS = 500;
const MAX_PROMPT_TOKENS = MAX_TOTAL_TOKENS - MAX_COMPLETION_TOKENS;
const MODEL_NAME = 'gpt-3.5-turbo-0301';

function stringTemplateParser(expression, valueObj) {
  const templateMatcher = /{{\s?([^{}\s]*)\s?}}/g;
  let text = expression.replace(templateMatcher, (substring, value, index) => {
    value = valueObj[value];
    return value;
  });
  return text;
}

function limitHistory(history) {
  if (tokenizer.encodeChat(history, MODEL_NAME).length <= MAX_PROMPT_TOKENS) {
    return history;
  }

  let alwaysHave = 3; // Always include the system message and first interaction
  let limitedHistory = history.slice(0, alwaysHave);

  let index = history.length - 1;
  let counter = 0;

  while (
    tokenizer.encodeChat(limitedHistory, MODEL_NAME).length <
      MAX_PROMPT_TOKENS &&
    index > alwaysHave - 1
  ) {
    limitedHistory.splice(limitedHistory.length - counter, 0, history[index]);
    index--;
    counter++;
  }

  // Removing last added item to guaranteed meet the limit
  limitedHistory.splice(limitedHistory.length - counter, 1);

  return limitedHistory;
}

function nonewlines(s) {
  if (!s) return '';
  return s.replace(/\n/g, ' ').replace(/\r/g, ' ');
}

async function sendMessage(context, req) {
  let operationIdOverride = getOperationIdOverride(context);

  if (req.headers['api_key'] !== process.env.API_KEY) {
    client.trackException({
      exception: new Error('Unauthorized!'),
      tagOverrides: operationIdOverride,
    });
    context.log.error('Unauthorized!');
    context.res = { status: 401, body: 'Unauthorized!' };
    return;
  }

  if (
    !req.body ||
    !(
      req.body.messages &&
      Array.isArray(req.body.messages) &&
      req.body.messages.length
    )
  ) {
    client.trackException({
      exception: new Error('No required parameter!'),
      tagOverrides: operationIdOverride,
    });

    context.log.error('No required parameter!');
    context.res = { status: 404, body: 'No required parameter!' };
    return;
  }

  let messages = req.body.messages;

  const openAIClient = new OpenAIClient(
    process.env['AZURE_OPENAI_ENDPOINT'],
    new AzureKeyCredential(process.env['AZURE_OPENAI_KEY'])
  );

  // Replacing with more strict system message
  messages.splice(0, 1, { role: 'system', content: prompts.system });

  messages = limitHistory(messages);

  context.log(messages);

  const chatCompletions = await openAIClient.getChatCompletions(
    process.env['AZURE_OPENAI_CHAT_DEPLOYMENT'],
    messages,
    {
      maxTokens: MAX_COMPLETION_TOKENS,
      temperature: req.body.overrides?.['temperature'] || 0.7,
      n: 1,
    }
  );

  // STEP 3: Generate a contextual and content specific answer using the search results and chat history

  context.res = {
    body: {
      answer: chatCompletions.choices[0].message.content,
      usage: chatCompletions.usage,
    },
  };
}

export default sendMessage;
