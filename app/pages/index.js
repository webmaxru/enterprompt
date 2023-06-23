import React, { useEffect, useState, useMemo } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '../src/ProTip';
import Link from '../src/Link';
import useAxios from 'axios-hooks';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ChatHistory from '../src/ChatHistory';
import defaultSuggestions from '../promptengineering/suggestions.json';
import { toast } from 'react-toastify';
import { decodeGenerator, encode } from 'gpt-tokenizer';
import Paper from '@mui/material/Paper';
import SeedMessageForm from '../src/SeedMessageForm';
import SendIcon from '@mui/icons-material/Send';
import prompts from '../promptengineering/prompts.json' assert { type: 'json' };
import { sendMessageValidationSchema } from '../src/shared/validationSchemas';
import {
  useAppInsightsContext,
  useTrackEvent,
} from '@microsoft/applicationinsights-react-js';


const CHAT_PARAMS = {
  overrides: {
    temperature: 1,
  },
};

const INITIAL_MESSAGES = [
  {
    role: 'system',
    content: prompts.system,
  },
];

export default function Index(props) {
  const [messages, setMessages] = React.useState(INITIAL_MESSAGES);
  const [tokenizedMessage, setTokenizedMessage] = React.useState([]);

  //const appInsights = useAppInsightsContext();

  let eventName = 'default_event';
  const trackEvent = function(){} // useTrackEvent(appInsights, eventName);

  const devMode = props.devMode;

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
    if (chatData) {
      setMessages(
        messages.toSpliced(messages.length - 1, 1, {
          role: 'assistant',
          content: chatData.answer,
        })
      );
    }
  }, [chatData]);

  const sendMessage = (message) => {
    sendMessageFormik.setFieldValue('message', '');
    sendMessageFormik.setFieldTouched('message', false);
    messages.push({ role: 'user', content: message });
    executeChat({
      data: {
        ...{
          messages: messages,
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

        eventName = 'error_sending_request';
        trackEvent({ eventName: 'error_sending_request' });

      });
    messages.push({ role: 'assistant', content: '' }); // To show the loading indicator
  };

  const handleSendMessage = () => {
    sendMessageFormik.handleSubmit();

    eventName = 'click_send_message';
    trackEvent({ eventName: 'click_send_message' });

  };

  const handleTokenizeMessage = (message) => {
    setTokenizedMessage(encode(message));
  };

  const [suggestions, setSuggestions] = useState(defaultSuggestions);

  const handleSuggestionClick = (index) => {
    sendMessageFormik.setFieldValue('message', suggestions[index]).then(() => {
      sendMessageFormik.handleSubmit();
    });

    eventName = 'click_suggestion';
    trackEvent({ eventName: 'click_suggestion' });

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
      <ChatHistory
        messages={messages}
        chatError={chatError}
        chatLoading={chatLoading}
        devMode={devMode}
      />

      {messages.length > 2 ? (
        <>
          <Typography variant="caption">
            Quick suggestions: (or write your own instruction below)
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            {suggestions.map((item, index) => {
              return (
                <Chip
                  label={item}
                  key={index}
                  variant="outlined"
                  onClick={() => handleSuggestionClick(index)}
                  sx={{ bgcolor: '#fff' }}
                  disabled={chatLoading}
                />
              );
            })}
          </Stack>

          <Box
            component="div"
            sx={{
              display: 'flex',
              mb: 4,
            }}
          >
            <TextField
              id="message"
              label="Your message"
              multiline
              rows={2}
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
              onKeyUp={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  sendMessageFormik.handleSubmit();
                }
              }}
            />

            <Button
              variant="contained"
              type="button"
              onClick={() => handleSendMessage()}
              color="primary"
              startIcon={<SendIcon />}
              disabled={chatLoading}
            >
              Send
            </Button>
          </Box>
        </>
      ) : (
        <SeedMessageForm sendMessage={sendMessage} />
      )}

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

      {messages.length > 1 ? (
        <Stack direction="column" spacing={1} sx={{ mb: 4 }}>
          <Chip
            label="Start over"
            variant="filled"
            onClick={() => {
              setMessages([INITIAL_MESSAGES[0]]);
              setSuggestions(defaultSuggestions);
            }}
            color="secondary"
            disabled={chatLoading}
          />
        </Stack>
      ) : null}

      <Link href="/about" color="primary">
        Details about the project
      </Link>
      <ProTip />
    </Container>
  );
}
