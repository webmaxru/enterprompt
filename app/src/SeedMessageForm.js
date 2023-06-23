import React, { useState } from 'react';
import Typography from '@mui/material/Typography';

import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import Switch from '@mui/material/Switch';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import { Button } from '@mui/material';
import { useFormik } from 'formik';

import { seedMessageValidationSchema } from '../src/shared/validationSchemas';
import { buildSeedMessage } from '../promptengineering/seedMessage.js';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import {
  useAppInsightsContext,
  useTrackEvent,
} from '@microsoft/applicationinsights-react-js';

export default function SeedMessageForm(props) {
  const appInsights = useAppInsightsContext();

  const DEFAULT_PRONOUNS = ['They/Them/their', 'She/Her/Hers', 'He/Him/His'];

  const DEFAULT_CHARACTERISTICS = [
    'Positive attitude',
    'Customer obsession',
    'Communication skills',
    'Team player',
  ];

  const DEFAULT_PROJECT_ROLES = ['Leader', 'Collaborator', 'Partner', 'Mentor'];

  const [selectedCharacteristics, setSelectedCharacteristics] = React.useState(
    DEFAULT_CHARACTERISTICS
  );

  const DEFAULT_SEED_MESSAGE = {
    first_name: '',
    pronouns: '',
    custom_characteristic: '',
    project_name: '',
    project_role: '',
  };

  const handleCharacteristicChange = (event) => {
    const item = event.target.name;
    setSelectedCharacteristics((selectedCharacteristics) =>
      selectedCharacteristics.includes(item)
        ? selectedCharacteristics.filter((f) => f !== item)
        : [...selectedCharacteristics, item]
    );
  };

  const seedMessageFormik = useFormik({
    initialValues: DEFAULT_SEED_MESSAGE,
    validationSchema: seedMessageValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      values['selected_characteristics'] = selectedCharacteristics;

      const message = buildSeedMessage(values);

      props.sendMessage(message);

      appInsights.trackEvent({
        name: 'send_seed_message',
      });

      setSubmitting(false);
    },
  });

  return (
    <>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <form onSubmit={seedMessageFormik.handleSubmit} id="seedMessageForm">
            <FormControl sx={{ mb: 1 }}>
              <FormLabel id="pronouns-label">Pronouns</FormLabel>
              <RadioGroup
                aria-labelledby="pronouns-label"
                name="pronouns"
                id="pronouns"
                value={seedMessageFormik.values.pronouns}
                onChange={seedMessageFormik.handleChange}
                size="small"
                sx={{ flexDirection: 'row' }}
              >
                {DEFAULT_PRONOUNS.map((item, index) => {
                  return (
                    <FormControlLabel
                      key={item}
                      value={item}
                      control={<Radio />}
                      label={item}
                    />
                  );
                })}
              </RadioGroup>
              <FormHelperText
                error={
                  seedMessageFormik.touched.pronouns &&
                  Boolean(seedMessageFormik.errors.pronouns)
                }
              >
                {seedMessageFormik.touched.pronouns &&
                  seedMessageFormik.errors.pronouns}
              </FormHelperText>
            </FormControl>

            <TextField
              fullWidth
              id="first_name"
              name="first_name"
              label="First name"
              value={seedMessageFormik.values.first_name}
              onChange={seedMessageFormik.handleChange}
              error={
                seedMessageFormik.touched.first_name &&
                Boolean(seedMessageFormik.errors.first_name)
              }
              helperText={
                seedMessageFormik.touched.first_name &&
                seedMessageFormik.errors.first_name
              }
              size="small"
              sx={{ mb: 4 }}
            />

            <FormControl sx={{ mb: 1 }} component="div" variant="standard">
              <FormLabel component="legend">
                What personal characteristics of your colleague would you
                highlight?
              </FormLabel>
              <FormGroup
                sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}
              >
                {DEFAULT_CHARACTERISTICS.map((item, index) => {
                  return (
                    <FormControlLabel
                      key={item}
                      sx={{ width: { xs: '90%', sm: '45%' } }}
                      control={
                        <Checkbox
                          checked={selectedCharacteristics.includes(item)}
                          name={item}
                          onChange={handleCharacteristicChange}
                        />
                      }
                      label={item}
                    />
                  );
                })}
              </FormGroup>
            </FormControl>

            <TextField
              fullWidth
              id="custom_characteristic"
              name="custom_characteristic"
              label="More characteristics (comma-separated, optional)"
              value={seedMessageFormik.values.custom_characteristic}
              onChange={seedMessageFormik.handleChange}
              error={
                seedMessageFormik.touched.custom_characteristic &&
                Boolean(seedMessageFormik.errors.custom_characteristic)
              }
              helperText={
                seedMessageFormik.touched.custom_characteristic &&
                seedMessageFormik.errors.custom_characteristic
              }
              size="small"
              sx={{ mb: 4 }}
            />

            <FormLabel component="legend" sx={{ mb: 1 }}>
              Do you want to also mention a particular project? (optional)
            </FormLabel>

            <TextField
              fullWidth
              id="project_name"
              name="project_name"
              label="Project name"
              value={seedMessageFormik.values.project_name}
              onChange={seedMessageFormik.handleChange}
              error={
                seedMessageFormik.touched.project_name &&
                Boolean(seedMessageFormik.errors.project_name)
              }
              helperText={
                seedMessageFormik.touched.project_name &&
                seedMessageFormik.errors.project_name
              }
              size="small"
              sx={{ mb: 1 }}
            />

            <FormControl sx={{ mb: 1 }}>
              <FormLabel id="project_role-label">
                Their role in that project
              </FormLabel>

              <RadioGroup
                aria-labelledby="project_role-label"
                defaultValue=""
                name="project_role"
                id="project_role"
                value={seedMessageFormik.values.project_role}
                onChange={seedMessageFormik.handleChange}
                size="small"
                sx={{ flexDirection: 'row' }}
              >
                {DEFAULT_PROJECT_ROLES.map((item, index) => {
                  return (
                    <FormControlLabel
                      key={item}
                      value={item}
                      control={<Radio />}
                      label={item}
                      disabled={!seedMessageFormik.values.project_name}
                    />
                  );
                })}
              </RadioGroup>
              <FormHelperText
                error={Boolean(seedMessageFormik.errors.project_role)}
              >
                {seedMessageFormik.touched.project_role &&
                  seedMessageFormik.errors.project_role}
              </FormHelperText>
            </FormControl>
          </form>

          <Typography variant="body2">
            The app itself does not store any data and only tracks number of
            usages using Azure Application Insights. Cloud data operations
            follow{' '}
            <Link
              href="https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy"
              color="primary"
            >
              Data, privacy, and security for Azure OpenAI Service
            </Link>{' '}
            and{' '}
            <Link
              href="https://learn.microsoft.com/en-us/azure/azure-monitor/app/data-retention-privacy"
              color="primary"
            >
              Data collection, retention, and storage in Application Insights
            </Link>
            .
          </Typography>
          <Typography variant="body2" color="error.main">
            Anyway, DO NOT enter any sensitive/NDA information.
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            form="seedMessageForm"
            fullWidth
            startIcon={<VolunteerActivismIcon />}
          >
            Praise {seedMessageFormik.values.first_name}!
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
