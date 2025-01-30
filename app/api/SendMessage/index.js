const utils = require('../Shared/utils');
const appInsights = require('applicationinsights');
appInsights.setup();
const client = appInsights.defaultClient;
const { SearchClient, AzureKeyCredential } = require('@azure/search-documents');
const { OpenAIClient } = require('@azure/openai');
const prompts = require('../promptengineering/prompts.json');
const { setLogLevel } = require('@azure/logger');

setLogLevel('info');

function stringTemplateParser(expression, valueObj) {
  const templateMatcher = /{{\s?([^{}\s]*)\s?}}/g;
  let text = expression.replace(templateMatcher, (substring, value, index) => {
    value = valueObj[value];
    return value;
  });
  return text;
}

function get_chat_history_as_text(
  history,
  include_last_turn = true,
  approx_max_tokens = 1000
) {
  let history_text = ``;
  for (
    let i = include_last_turn ? history.length - 1 : history.length - 2;
    i >= 0;
    i--
  ) {
    let h = history[i];
    history_text =
      `<|im_start|>user 
      ${h['user']} 
      <|im_end|> 
      <|im_start|>assistant 
      ${h['bot'] ? h['bot'] + `<|im_end|>` : ``} 
      ${history_text}`;
    if (history_text.length > approx_max_tokens * 4) {
      break;
    }
  }
  return history_text;
}

function nonewlines(s) {
  if (!s) return '';
  return s.replace(/\n/g, ' ').replace(/\r/g, ' ');
}

module.exports = async function (context, req) {
  let operationIdOverride = utils.getOperationIdOverride(context);

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
    !req.body.approach ||
    !(
      req.body.history &&
      Array.isArray(req.body.history) &&
      req.body.history.length
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

  const use_semantic_captions = req.body.overrides['semantic_captions']
    ? true
    : false;
  const top = req.body.overrides['top'] || 3;
  const exclude_category = req.body.overrides['exclude_category'] || null;
  const filter = exclude_category
    ? `category ne '${exclude_category.replace("'", "''")}'`
    : null;

  // https://learn.microsoft.com/en-us/javascript/api/overview/azure/search-documents-readme?view=azure-node-latest
  const searchClient = new SearchClient(
    process.env['AZURE_SEARCH_ENDPOINT'],
    process.env['AZURE_SEARCH_INDEX'],
    new AzureKeyCredential(process.env['AZURE_SEARCH_KEY'])
  );

  // https://learn.microsoft.com/en-us/azure/cognitive-services/openai/quickstart?tabs=command-line&pivots=programming-language-javascript
  const openAIClient = new OpenAIClient(
    process.env['AZURE_OPENAI_ENDPOINT'],
    new AzureKeyCredential(process.env['AZURE_OPENAI_KEY'])
  );

  // STEP 1: Generate an optimized keyword search query based on the chat history and the last question
  let prompt = stringTemplateParser(prompts.query_prompt_template, {
    chat_history: get_chat_history_as_text(req.body.history, false),
    question: req.body.history.slice(-1)[0]['user'],
  });

  context.log('Prompt for generating search query', prompt);

  const result = await openAIClient.getCompletions(
    process.env['AZURE_OPENAI_GPT_DEPLOYMENT'],
    prompt,
    {
      maxTokens: 32,
      temperature: 0.0,
      n: 1,
      stop: ['\n'],
    }
  );

  let q = result.choices[0].text;
  let searchPromptUsage = result.usage

  context.log('Resulting search query', q);

  // STEP 2: Retrieve relevant documents from the search index with the GPT optimized query

  let searchResults;

  if (req.body.overrides['semantic_ranker']) {
    searchResults = await searchClient.search(q, {
      filter: filter,
      top: top,
      queryType: 'full',
      queryLanguage: 'en-us',
      querySpeller: 'lexicon',
      semanticConfigurationName: 'default',
      queryCaption: use_semantic_captions ? 'extractive|highlight-false' : null,
    });
  } else {
    searchResults = await searchClient.search(q, {
      filter: filter,
      top: top,
    });
  }

  const output = [];
  for await (const result of searchResults.results) {
    output.push(result);
  }

  context.log('Search results', output);

  let results;

  if (use_semantic_captions) {
    results = output.map(
      (item) =>
        item['document']['sourcepage'] +
        ': ' +
        nonewlines(
          ' . ' +
            item['document']['@search.captions'].map((c) => c.text).join('')
        )
    );
  } else {
    results = output.map(
      (item) =>
        item['document']['sourcepage'] +
        ': ' +
        nonewlines(item['document']['content'])
    );
  }
  const content = results.join('\n');

  let follow_up_questions_prompt = req.body.overrides[
    'suggest_followup_questions'
  ]
    ? prompts.follow_up_questions_prompt_content
    : '';

  context.log('Follow up questions prompt', follow_up_questions_prompt);

  // Allow client to replace the entire prompt, or to inject into the exiting prompt using >>>

  let prompt_override = req.body.overrides['prompt_template'];

  if (prompt_override == null) {
    prompt = stringTemplateParser(prompts.prompt_prefix, {
      injected_prompt: '',
      sources: content,
      chat_history: get_chat_history_as_text(req.body.history),
      follow_up_questions_prompt: follow_up_questions_prompt,
    });
  } else if (prompt_override.startsWith('>>>')) {
    prompt = stringTemplateParser(prompts.prompt_prefix, {
      injected_prompt: prompt_override.slice(3) + '\n',
      sources: content,
      chat_history: get_chat_history_as_text(req.body.history),
      follow_up_questions_prompt: follow_up_questions_prompt,
    });
  } else {
    prompt = stringTemplateParser(prompts.prompt_prefix, {
      sources: content,
      chat_history: get_chat_history_as_text(req.body.history),
      follow_up_questions_prompt: follow_up_questions_prompt,
    });
  }

  context.log('Final prompt', prompt);

  // STEP 3: Generate a contextual and content specific answer using the search results and chat history

  const completion = await openAIClient.getCompletions(
    process.env['AZURE_OPENAI_CHAT_DEPLOYMENT'],
    prompt,
    {
      maxTokens: 1024,
      temperature: req.body.overrides['temperature'] || 0.7,
      n: 1,
      stop: ['<|im_end|>', '<|im_start|>'],
    }
  );

  context.res = {
    body: {
      data_points: results,
      answer: completion.choices[0].text,
      thoughts: `<strong>Database search query:</strong><br>${q}<br><br><strong>Resulting prompt:</strong><br>${prompt.replace(
        /(?:\r\n|\r|\n)/g,
        '<br>'
      )}`,
      searchPromptUsage: searchPromptUsage,
      chatPromptUsage: completion.usage
    },
  };
};
