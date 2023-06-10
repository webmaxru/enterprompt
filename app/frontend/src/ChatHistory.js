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
import { green, pink } from '@mui/material/colors';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function ChatHistory(props) {
  const chatHistory = props.chatHistory;

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {chatHistory.map((item, index) => {
        return (
          <div key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: green[500] }}>
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
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {item['user']}
                      </Typography>
                    </Paper>
                  </React.Fragment>
                }
              />
            </ListItem>
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
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {item['bot'] != '...' ? (
                          item['bot']
                        ) : (
                          <CircularProgress disableShrink />
                        )}
                      </Typography>
                    </Paper>

                    {item['thoughts'] ? (
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={'panel' + index + '-content'}
                          id={'panel' + index + '-header'}
                        >
                          <Typography variant="caption">
                            Prompt details
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="caption">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item['thoughts'],
                              }}
                            />
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    ) : null}
                  </React.Fragment>
                }
              />
              <ListItemAvatar sx={{ paddingLeft: '14px' }}>
                <Avatar sx={{ bgcolor: pink[500] }}>
                  <SmartToyIcon />
                </Avatar>
              </ListItemAvatar>
            </ListItem>
          </div>
        );
      })}
    </List>
  );
}
