import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '../src/ProTip';
import Link from '../src/Link';
import Copyright from '../src/Copyright';
import useAxios from 'axios-hooks';
import { configure } from 'axios-hooks';
import Axios from 'axios';
import Button from '@mui/material/Button';

const DATA_SAMPLE = {
  history: [
    {
      user: 'What is included in my Northwind Health Plus plan that is not in standard?',
    },
  ],
  approach: 'rrr',
  overrides: {
    semantic_ranker: true,
    semantic_captions: false,
    top: 3,
    suggest_followup_questions: false,
  },
};

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

configure({
  axios,
  defaultOptions: {
    manual: true,
    useCache: false,
    ssr: false,
    autoCancel: false,
  },
});

export default function Index() {
  const [
    { data: chatData, loading: chatLoading, error: chatError },
    executeChat,
  ] = useAxios({
    url: 'chat',
    method: 'POST',
  });

  const postMessage = () => {
    executeChat({
      data: DATA_SAMPLE,
    })
      .then(() => {
        console.log('Success');
      })
      .catch(() => {
        console.log('Error');
      });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Material UI - Next.js example
        </Typography>
        <Button
          variant="contained"
          fullWidth
          type="button"
          onClick={() => postMessage()}
        >
          Post message
        </Button>
        <p>{chatData?.answer}</p>
        <Link href="/about" color="secondary">
          Go to the about page
        </Link>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
