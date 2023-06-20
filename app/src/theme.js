import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#fd7344',
    },
    secondary: {
      main: '#012f59',
    },
    error: {
      main: red.A400,
    },
    grey: {
      100: '#f0f0f0',
    }
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export default theme;
