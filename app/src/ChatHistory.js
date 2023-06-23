import React from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import Avatar from '@mui/material/Avatar';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Button from '@mui/material/Button';

export default function ChatHistory(props) {
  const messages = props.messages;
  const chatError = props.chatError;
  const devMode = props.devMode;


  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper', mb: 2 }}>
      {messages.map((item, index) => {
        return (
          <div key={index}>
            {item['role'] == 'user' ? (
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar
                    sx={(theme) => ({
                      backgroundColor: theme.palette.primary.main,
                    })}
                  >
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Paper
                        elevation={1}
                        sx={{
                          paddingX: 2,
                          paddingY: 1,
                          minHeight: '44px',
                          display: 'block',
                          backgroundColor: (theme) => theme.palette.grey[100],
                          alignItems: 'center',
                          display: 'flex',
                        }}
                      >
                        <Typography
                          sx={{ display: 'block' }}
                          component="div"
                          variant="body2"
                          color="text.primary"
                        >
                          {item['content']}
                        </Typography>
                      </Paper>
                    </React.Fragment>
                  }
                />
              </ListItem>
            ) : (
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Paper
                        elevation={1}
                        sx={{
                          paddingX: 2,
                          paddingY: 1,
                          minHeight: '44px',
                          display: 'block',
                        }}
                      >
                        {chatError ? (
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="error"
                          >
                            There is an error while sending your message:{' '}
                            {chatError['message']}. Please try again.
                          </Typography>
                        ) : item['content'] ? (
                          <>
                            <Typography
                              sx={{ display: 'block' }}
                              component="div"
                              variant="body2"
                              color="text.primary"
                            >
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: item['content'],
                                }}
                              />

                              {index > 1 ? (
                                <CopyToClipboard
                                  sx={{ mt: 1 }}
                                  text={item['content']}
                                  onCopy={() =>
                                    toast.info('Copied to clipboard')
                                  }
                                >
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<ContentCopyIcon />}
                                  >
                                    Copy to clipboard
                                  </Button>
                                </CopyToClipboard>
                              ) : null}
                            </Typography>
                          </>
                        ) : (
                          <CircularProgress disableShrink />
                        )}
                      </Paper>
                    </React.Fragment>
                  }
                />
                <ListItemAvatar sx={{ paddingLeft: '14px' }}>
                  <Avatar
                    sx={(theme) => ({
                      backgroundColor: theme.palette.secondary.main,
                    })}
                  >
                    <SmartToyIcon />
                  </Avatar>
                </ListItemAvatar>
              </ListItem>
            )}
          </div>
        );
      })}
    </List>
  );
}
