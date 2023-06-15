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
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

export default function ChatHistory(props) {
  const chatHistory = props.chatHistory;
  const chatError = props.chatError;
  const devMode = props.devMode;

  const [accExpanded, setAccExpanded] = React.useState(false);

  const handleAccChange = (panel) => (event, isAccExpanded) => {
    setAccExpanded(isAccExpanded ? panel : false);
  };

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper', mb: 2 }}>
      {chatHistory.map((item, index) => {
        return (
          <div key={index}>
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
                      }}
                    >
                      <Typography
                        sx={{ display: 'block' }}
                        component="div"
                        variant="body2"
                        color="text.primary"
                      >
                        {item['user']}
                      </Typography>

                      {devMode &&
                      item['chatPromptUsage'] &&
                      item['searchPromptUsage'] ? (
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="caption"
                        >
                          Search query generation request is{' '}
                          {item['searchPromptUsage']['totalTokens']} tokens
                          total (text-davinci-003)
                          <br />
                          Chat prompt is{' '}
                          {item['chatPromptUsage']['promptTokens']} tokens incl.
                          metaprompt and history (gpt-35-turbo)
                        </Typography>
                      ) : null}
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
                      ) : item['bot'] ? (
                        <>
                          <Typography
                            sx={{ display: 'block' }}
                            component="div"
                            variant="body2"
                            color="text.primary"
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item['bot'],
                              }}
                            />
                          </Typography>
                          {item['citations'].length > 0 ? (
                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{ mt: 1 }}
                              useFlexGap
                              flexWrap="wrap"
                            >
                              {item['citations'].map((item, index) => {
                                return (
                                  <Chip
                                    label={item}
                                    key={index}
                                    variant="outlined"
                                    sx={{ bgcolor: '#fff' }}
                                  />
                                );
                              })}
                            </Stack>
                          ) : null}

                          {devMode && item['chatPromptUsage'] ? (
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="caption"
                            >
                              Chat completion is{' '}
                              {item['chatPromptUsage']['completionTokens']}{' '}
                              tokens incl. citations and suggestions
                              (gpt-35-turbo)
                            </Typography>
                          ) : null}
                        </>
                      ) : (
                        <CircularProgress disableShrink />
                      )}
                    </Paper>

                    {item['thoughts'] && devMode ? (
                      <Accordion
                        expanded={accExpanded === 'panel1' + index}
                        onChange={handleAccChange('panel1' + index)}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={'panel1' + index + '-content'}
                          id={'panel1' + index + '-header'}
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
                    {item['data_points'] && devMode ? (
                      <Accordion
                        expanded={accExpanded === 'panel2' + index}
                        onChange={handleAccChange('panel2' + index)}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={'panel2' + index + '-content'}
                          id={'panel2' + index + '-header'}
                        >
                          <Typography variant="caption">
                            Data sources
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {item['data_points'].map((item, index) => {
                            return (
                              <Typography
                                variant="body2"
                                gutterBottom
                                key={index}
                              >
                                {item}
                              </Typography>
                            );
                          })}
                        </AccordionDetails>
                      </Accordion>
                    ) : null}
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
          </div>
        );
      })}
    </List>
  );
}
