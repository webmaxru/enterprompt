import React, { useEffect, useState } from 'react';
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
import TextField from '@mui/material/TextField';
import * as yup from 'yup';
import { useFormik } from 'formik';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';

const drawerWidth = 240;
const navItems = ['Home', 'About', 'Contact'];

let chatHistory = [];
let lastMessage = '';

const CHAT_PARAMS = {
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

export default function Index(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Enterprise AI Chatbot
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

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
      setChatHistory(
        chatHistory.toSpliced(-1, 1, {
          user: lastMessage,
          bot: chatData?.answer,
        })
      );
    }
  }, [chatData]);

  const sendMessage = (message) => {
    lastMessage = message;
    sendMessageFormik.values.message = '';
    chatHistory.push({ user: message, bot: '...' });
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
      .catch(() => {
        console.log('Error');
      });
  };

  const handleSendMessage = () => {
    sendMessageFormik.handleSubmit();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Enterprise AI Chatbot
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: '#fff' }}>
                {item}
              </Button>
            ))}
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
            display: { xs: 'block', sm: 'none' },
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
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <ul>
            {chatHistory.map((item, index) => {
              return (
                <li key={index}>
                  User: {item['user']}
                  <br />
                  Bot: {item['bot']}
                </li>
              );
            })}
          </ul>
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
            fullWidth
            type="button"
            onClick={() => handleSendMessage()}
          >
            Post message
          </Button>

          <Link href="/about" color="secondary">
            Go to the about page
          </Link>
          <ProTip />

          <Copyright sx={{ pt: 4 }} />
        </Container>
      </Box>
    </Box>
  );
}
