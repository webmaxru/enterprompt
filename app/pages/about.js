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
        This is an alternative app (frontend and backend) for the{' '}
        <Link href="https://github.com/Azure-Samples/azure-search-openai-demo/">
          ChatGPT + Enterprise data with Azure OpenAI and Cognitive Search
        </Link>{' '}
        project.
        <p align="center">
          <img src="/images/appcomponents.png" width="100%" />
        </p>
        Your{' '}
        <Link href="https://github.com/webmaxru/enterprompt/issues">
          comments, bug reports, and pull requests
        </Link>{' '}
        are very welcome!
        <br />
        <br />
        <Button variant="contained" component={Link} noLinkStyle href="/">
          Back to chat
        </Button>
      </Box>
    </Container>
  );
}
