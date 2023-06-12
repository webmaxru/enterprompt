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
import defaultSuggestions from '../promptengineering/suggestions.json';
import defaultQuickStarts from '../promptengineering/quick_starts.json';
import { toast } from 'react-toastify';

const CHAT_PARAMS = {
  approach: 'rrr',
  overrides: {
    semantic_ranker: true,
    semantic_captions: false,
    top: 3,
    suggest_followup_questions: false, // Doesn't work good, pasting into prompt instead
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
      // Removing suggestions <<...>> from the answer

      let answer = chatData.answer.slice(0, chatData.answer.indexOf('<<'));
      let suggestion = chatData.answer.slice(chatData.answer.indexOf('<<'));

      if (suggestion) {
        let suggestionsData = suggestion
          .split(/<<(.*?)>>/)
          .map((item) => item.trim())
          .filter(Boolean)
          .filter((item) => ['\n', '\n\n', '.', 'Next Questions.', '1.', '2.', '3.'].indexOf(item) == -1);

        if (suggestionsData.length > 0) {
          setSuggestions(suggestionsData);
        } else {
          setSuggestions(defaultSuggestions);
        }
      }

      let lastMessage = chatHistory.pop()['user'];
      setChatHistory([
        ...chatHistory,
        {
          user: lastMessage,
          bot: answer,
          thoughts: chatData.thoughts,
          data_points: chatData.data_points,
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
              user: `${item.user}`, // ${prompts.follow_up_questions_prompt_content}
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

  return (
    <Container maxWidth="sm" sx={{ mt: 2, mb: 4 }}>
      {chatHistory.length > 0 ? (
        <ChatHistory chatHistory={chatHistory} />
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
          onChange={sendMessageFormik.handleChange}
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
