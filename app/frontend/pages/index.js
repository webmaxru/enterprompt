import React, { useEffect, useState } from 'react';
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
    if (chatHistory.length > 0) {
      let lastMessage = chatHistory.pop()['user'];
      setChatHistory([
        ...chatHistory,
        {
          user: lastMessage,
          bot: chatData?.answer,
          thoughts: chatData?.thoughts,
        },
      ]);
    }
  }, [chatData]);

  const sendMessage = (message) => {
    sendMessageFormik.setFieldValue('message', '');
    sendMessageFormik.setFieldTouched('message', false);
    chatHistory.push({ user: message, bot: '...', thoughts: '' });
    executeChat({
      data: {
        ...{
          history: chatHistory,
        },
        ...CHAT_PARAMS,
      },
    })
      .then(() => {
        console.log('Success');
      })
      .catch((err) => {
        console.error('Error sending request: ', err);
      });
  };

  const handleSendMessage = () => {
    sendMessageFormik.handleSubmit();
  };

  const [quickStartsData, setQuickStartsData] = useState([
    {
      key: 0,
      label:
        'What is included in my Northwind Health Plus plan that is not in standard?',
    },
    { key: 1, label: 'What can I ask?' },
    { key: 2, label: 'What is in standard plan?' },
  ]);

  const [quickSuggestionsData, setQuickSuggestionsData] = useState([
    {
      key: 0,
      label: 'What is about eye exams?',
    },
    { key: 1, label: 'What is about dental check?' },
    { key: 2, label: 'More details?' },
  ]);

  const handleQuickStartClick = (key) => {
    sendMessageFormik.setFieldValue(
      'message',
      quickStartsData.filter((item) => item.key === key)[0].label
    );
  };

  const handleQuickSuggestionClick = (key) => {
    sendMessageFormik.setFieldValue(
      'message',
      quickSuggestionsData.filter((item) => item.key === key)[0].label
    );
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      {chatHistory.length > 0 ? (
        <ChatHistory chatHistory={chatHistory} />
      ) : (
        <Stack direction="column" spacing={1} sx={{ mb: 1 }}>
          <Typography variant="caption">Quick starts:</Typography>
          {quickStartsData.map((data) => {
            return (
              <Chip
                label={data.label}
                key={data.key}
                variant="outlined"
                onClick={() => handleQuickStartClick(data.key)}
              />
            );
          })}
        </Stack>
      )}

      <Box
        component="div"
        sx={{
          display: 'flex',
          mb: 1,
        }}
      >
        <TextField
          id="message"
          label="Your message"
          multiline
          rows={4}
          placeholder="Type in your question here"
          variant="filled"
          fullWidth
          value={sendMessageFormik.values.message}
          onChange={sendMessageFormik.handleChange}
          error={
            sendMessageFormik.touched.message &&
            Boolean(sendMessageFormik.errors.message)
          }
          helperText={
            sendMessageFormik.touched.message &&
            sendMessageFormik.errors.message
          }
        />
        <Button
          variant="contained"
          type="button"
          onClick={() => handleSendMessage()}
        >
          Send
        </Button>
      </Box>

      {chatHistory.length > 0 ? (
        <Stack direction="column" spacing={1} sx={{ mb: 1 }}>
          <Typography variant="caption">Quick suggestions:</Typography>
          {quickSuggestionsData.map((data) => {
            return (
              <Chip
                label={data.label}
                key={data.key}
                variant="outlined"
                onClick={() => handleQuickSuggestionClick(data.key)}
              />
            );
          })}
        </Stack>
      ) : null}

      <Link href="/about" color="secondary">
        Details about the project
      </Link>
      <ProTip />
    </Container>
  );
}
