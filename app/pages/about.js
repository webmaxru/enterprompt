import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '../src/Link';

export default function About() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          How does it work?
        </Typography>
        Using some magic of the prompt engineering and the power of the{' '}
        <Link href="https://learn.microsoft.com/en-us/azure/cognitive-services/openai/how-to/chatgpt">
          Chat Completion API of the Azure OpenAI Service
        </Link>
        .
        <br />
        <br />
        The code is open source. Your{' '}
        <Link href="https://github.com/webmaxru/enterprompt/issues">
          comments, bug reports, and pull requests
        </Link>{' '}
        are very welcome!
        <br />
        <br />
        <Button variant="contained" component={Link} noLinkStyle href="/">
          Back to giving a praise
        </Button>
      </Box>
    </Container>
  );
}
