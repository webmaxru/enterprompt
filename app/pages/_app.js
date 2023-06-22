import * as React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';
import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { configure } from 'axios-hooks';
import Axios from 'axios';
import Copyright from '../src/Copyright';
import NextLink from 'next/link';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import SchoolIcon from '@mui/icons-material/School';
import { SvgIcon } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ServiceWorkerRegistration from '../src/ServiceWorkerRegistration';
import AzureAppInsights from "../src/AzureAppInsights";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const drawerWidth = 240;
const navItems = [
  {
    caption: 'Praise',
    link: '/',
    icon: <VolunteerActivismIcon />,
  },
  {
    caption: 'About',
    link: '/about',
    icon: <SchoolIcon />,
  },
  {
    caption: 'Author',
    link: 'https://twitter.com/webmaxru/',
    icon: <PersonIcon />,
  },
];

const logo = 'PraiseGPT';
const title = 'PraiseGPT - Praise your colleagues on a large scale!';
const description =
  'ChatGPT-powered bot whose only goal is to help you write positive feedback to your colleagues';
const host = 'praise.promptengineering.rocks';

export default function MyApp(props) {
  const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
      API_KEY: process.env.NEXT_PUBLIC_API_KEY,
    },
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

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [devMode, setDevMode] = React.useState(false);

  const devModeToggle = () => {
    setDevMode((prevState) => !prevState);
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        {logo}
      </Typography>
      <Divider />
      <List component="nav" suppressHydrationWarning={true}>
        {navItems.map((item) => (
          <ListItemButton component={NextLink} href={item.link} key={item.link}>
            <ListItemIcon>
              <SvgIcon>{item.icon}</SvgIcon>
            </ListItemIcon>
            <ListItemText primary={item.caption} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={description} />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/icons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/icons/favicon-16x16.png"
        />
        <link rel="manifest" href="/app.webmanifest" />
        <meta name="msapplication-TileColor" content="#fd7344" />
        <meta
          name="msapplication-TileImage"
          content="/images/icons/mstile-150x150.png"
        />
        <meta property="og:url" content={'https://' + host} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta
          property="og:image"
          content={'https://' + host + '/images/social.png'}
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content={host} />
        <meta property="twitter:url" content={'https://' + host} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta
          name="twitter:image"
          content={'https://' + host + '/images/social.png'}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <AzureAppInsights>
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar component="nav">
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: 'block' } }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ flexGrow: 1, alignItems: 'center' }}
                >
                  <VolunteerActivismIcon sx={{ fontSize: 20 }} /> {logo}
                </Typography>
                <Box sx={{ display: { sm: 'block' } }}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={devMode}
                          onChange={devModeToggle}
                          name="devmode"
                          color="secondary"
                        />
                      }
                      label="Developer"
                    />
                  </FormGroup>
                </Box>
              </Toolbar>
            </AppBar>
            <Box component="nav">
              <Drawer
                container={container}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                  display: { xs: 'block', sm: 'block' },
                  '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    width: drawerWidth,
                  },
                }}
              >
                {drawer}
              </Drawer>
            </Box>
            <Box
              component="main"
              sx={{
                backgroundColor: (theme) => theme.palette.grey[100],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
              }}
            >
              <Toolbar />

              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              <Component {...pageProps} devMode={devMode} />
              <Copyright sx={{ pt: 4 }} />
            </Box>
          </Box>
          <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
          <ServiceWorkerRegistration />
        </AzureAppInsights>
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
