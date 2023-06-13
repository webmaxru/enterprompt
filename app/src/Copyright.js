import * as React from 'react';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';
import Container from '@mui/material/Container';
import { isMobile } from 'react-device-detect';

export default function Copyright() {
  return (
    <Container maxWidth="sm" sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary" align="center">
        Made in {isMobile ? '🇳🇴' : 'Norway'} by&nbsp;
        <MuiLink color="inherit" href="https://twitter.com/webmaxru/">
          Maxim Salnikov
        </MuiLink>{' '}
        |&nbsp;
        <MuiLink color="inherit" href="https://github.com/webmaxru/enterprompt">
          GitHub
        </MuiLink>
      </Typography>
    </Container>
  );
}
