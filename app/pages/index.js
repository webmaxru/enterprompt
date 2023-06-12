import React, { useEffect, useState, useMemo } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '../src/ProTip';
import Link from '../src/Link';
import useAxios from 'axios-hooks';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ChatHistory from '../src/ChatHistory';
import defaultSuggestions from '../promptengineering/suggestions.json';
import defaultQuickStarts from '../promptengineering/quick_starts.json';
import { toast } from 'react-toastify';
import prompts from '../api/promptengineering/prompts.json';
import { decodeGenerator, encode } from 'gpt-tokenizer';
import Paper from '@mui/material/Paper';

const CHAT_PARAMS = {
  approach: 'rrr',
  overrides: {
    semantic_ranker: true,
    semantic_captions: false,
    top: 3,
    suggest_followup_questions: false,
  },
};

export default function Index(props) {
  const [chatHistory, setChatHistory] = React.useState([]);
  const [tokenizedMessage, setTokenizedMessage] = React.useState([]);

  const devMode = props.devMode;

  const sendMessageValidationSchema = yup.object({
    message: yup
      .string('Enter your message')
      .max(1024, 'Message should be of maximum 1024 characters length')
      .required('Message is required'),
  });

  const sendMessageFormik = useFormik({
    initialValues: {
      message: '',
    },
    validationSchema: sendMessageValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      setTokenizedMessage([]);
      sendMessage(values.message);
      setSubmitting(false);
    },
  });

  const [
    { data: chatData, loading: chatLoading, error: chatError },
    executeChat,
  ] = useAxios({
    url: 'chat',
    method: 'POST',
  });

  useEffect(() => {
    handleTokenizeMessage(sendMessageFormik.values.message);
  }, [devMode]);

  useEffect(() => {
    if (chatHistory.length > 0) {
      let answer;
      let suggestions = [];

      if (chatData.answer.includes('<<')) {
        // Extracting suggestions <<...>> from the answer
        answer = chatData.answer.slice(0, chatData.answer.indexOf('<<'));
        let suggestion = chatData.answer.slice(chatData.answer.indexOf('<<'));

        suggestions = suggestion
          .split(/<<(.*?)>>/)
          .map((item) => item.trim())
          .filter(Boolean)
          .filter(
            (item) =>
              ['\n', '\n\n', '.', 'Next Questions.', '1.', '2.', '3.'].indexOf(
                item
              ) == -1
          );

        if (suggestions.length > 0) {
          setSuggestions(suggestions);
        } else {
          setSuggestions(defaultSuggestions);
        }
      } else {
        answer = chatData.answer;
      }

      // Extracting citations [...] from the answer
      let citations = [];
      answer.replace(/\[(.*?)\]/g, (match, pattern) => {
        citations.push(pattern);
      });

      answer = answer.replace(/ *\[[^\]]*]/g, '');

      let lastMessage = chatHistory.pop()['user'];
      setChatHistory([
        ...chatHistory,
        {
          user: lastMessage,
          chatPromptUsage: chatData.chatPromptUsage,
          searchPromptUsage: chatData.searchPromptUsage,
          bot: answer,
          thoughts: chatData.thoughts,
          data_points: chatData.data_points,
          citations: citations,
          suggestions: suggestions,
        },
      ]);
    }
  }, [chatData]);

  const sendMessage = (message) => {
    sendMessageFormik.setFieldValue('message', '');
    sendMessageFormik.setFieldTouched('message', false);
    chatHistory.push({ user: message });
    executeChat({
      data: {
        ...{
          history: chatHistory.map((item) => {
            return {
              user: `${item.user} }`, // ${prompts.follow_up_questions_prompt_content
              bot: item.bot,
            };
          }),
        },
        ...CHAT_PARAMS,
      },
    })
      .then(() => {
        console.log('Success sending request');
      })
      .catch((err) => {
        console.error('Error sending request: ', err);
        toast.error('Error sending request');
      });
  };

  const handleSendMessage = () => {
    sendMessageFormik.handleSubmit();
  };

  const handleTokenizeMessage = (message) => {
    setTokenizedMessage(encode(message));
  };

  const [quickStarts, setQuickStarts] = useState(defaultQuickStarts);

  const [suggestions, setSuggestions] = useState(defaultSuggestions);

  const handleQuickStartClick = (index) => {
    sendMessageFormik.setFieldValue('message', quickStarts[index]).then(() => {
      sendMessageFormik.handleSubmit();
    });
  };

  const handleSuggestionClick = (index) => {
    sendMessageFormik.setFieldValue('message', suggestions[index]).then(() => {
      sendMessageFormik.handleSubmit();
    });
  };

  const TokenizedText = ({ tokens }) => (
    <div
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        height: '50px',
        overflowY: 'auto',
        padding: '8px',
        lineHeight: '1.5',
        alignContent: 'flex-start',
        mb: 1,
      }}
    >
      {tokens.map((token, index) => (
        <span
          key={index}
          style={{
            backgroundColor: pastelColors[index % pastelColors.length],
            padding: '0 0px',
            borderRadius: '3px',
            marginRight: '0px',
            marginBottom: '4px',
            display: 'inline-block',
            height: '1.5em',
          }}
        >
          {
            <pre
              style={{
                margin: '0px',
              }}
            >
              {String(token)
                .replaceAll(' ', '\u00A0')
                .replaceAll('\n', '<newline>')}
            </pre>
          }
        </span>
      ))}
    </div>
  );

  const pastelColors = [
    'rgba(107,64,216,.3)',
    'rgba(104,222,122,.4)',
    'rgba(244,172,54,.4)',
    'rgba(239,65,70,.4)',
    'rgba(39,181,234,.4)',
  ];

  const decodedMessage = useMemo(() => {
    const tokens = [];
    for (const token of decodeGenerator(tokenizedMessage)) {
      tokens.push(token);
    }
    return tokens;
  }, [tokenizedMessage]);

  return (
    <Container maxWidth="sm" sx={{ mt: 2, mb: 4 }}>
      {chatHistory.length > 0 ? (
        <ChatHistory
          chatHistory={chatHistory}
          chatError={chatError}
          devMode={devMode}
        />
      ) : (
        <Stack direction="column" spacing={1} sx={{ mb: 2 }}>
          <Typography variant="caption">Quick starts:</Typography>
          {quickStarts.map((item, index) => {
            return (
              <Chip
                label={item}
                key={index}
                variant="outlined"
                onClick={() => handleQuickStartClick(index)}
                sx={{ bgcolor: '#fff' }}
              />
            );
          })}
        </Stack>
      )}

      <Box
        component="div"
        sx={{
          display: 'flex',
          mb: 2,
        }}
      >
        <TextField
          id="message"
          label="Your message"
          multiline
          rows={3}
          placeholder="Type in your question here"
          variant="outlined"
          fullWidth
          value={sendMessageFormik.values.message}
          onChange={(e) => {
            if (devMode) handleTokenizeMessage(e.target.value);
            sendMessageFormik.handleChange(e);
          }}
          error={
            sendMessageFormik.touched.message &&
            Boolean(sendMessageFormik.errors.message)
          }
          helperText={
            sendMessageFormik.touched.message &&
            sendMessageFormik.errors.message
          }
          sx={{
            backgroundColor: '#fff',
          }}
        />
        <Button
          variant="contained"
          type="button"
          onClick={() => handleSendMessage()}
          color="primary"
        >
          Send
        </Button>
      </Box>

      {devMode ? (
        <Paper sx={{ mb: 2, paddingX: 2, paddingY: 1 }}>
          <Typography component="div" variant="body1">
            Tokenized message
          </Typography>

          <TokenizedText tokens={decodedMessage} />

          <Typography component="div" variant="caption">
            {tokenizedMessage.length} tokens,{' '}
            {sendMessageFormik.values.message.length} characters
          </Typography>
        </Paper>
      ) : null}

      {chatHistory.length > 0 ? (
        <Stack direction="column" spacing={1} sx={{ mb: 4 }}>
          <Typography variant="caption">Quick suggestions:</Typography>
          {suggestions.map((item, index) => {
            return (
              <Chip
                label={item}
                key={index}
                variant="outlined"
                onClick={() => handleSuggestionClick(index)}
                sx={{ bgcolor: '#fff' }}
              />
            );
          })}
          <Chip
            label="Start over"
            variant="filled"
            onClick={() => {
              setChatHistory([]);
              setSuggestions(defaultSuggestions);
            }}
            color="secondary"
          />
        </Stack>
      ) : null}

      <Link href="/about" color="secondary">
        Details about the project
      </Link>
      <ProTip />
    </Container>
  );
}
