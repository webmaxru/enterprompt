import * as React from 'react';
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
import Switch from '@mui/material/Switch';
import Link from '@mui/material/Link';

export default function SeedMessageForm(props) {
  const seedMessageFormik = props.seedMessageFormik;

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ mt: 3 }} id="notification">
        Notification properties
      </Typography>

      <Typography variant="body1" color="text.secondary">
        These properties are in use both by instant and multi-device options
        above
      </Typography>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <form
            onSubmit={seedMessageFormik.handleSubmit}
            id="seedMessageForm"
          >
            <Typography variant="h5" gutterBottom>
              Standard properties
            </Typography>

            <Typography variant="body2" gutterBottom>
              A full list (except deprecated) of the Notification API's{' '}
              <Link
                color="secondary"
                href="https://notifications.spec.whatwg.org/#object-members"
              >
                Notification object
              </Link>{' '}
              members
            </Typography>

            <FormControl>
              <FormLabel id="pronouns-label">Pronouns</FormLabel>
              <RadioGroup
                aria-labelledby="pronouns-label"
                defaultValue=""
                name="pronouns"
                id="pronouns"
                value={seedMessageFormik.values.pronouns}
                onChange={seedMessageFormik.handleChange}
                error={
                  seedMessageFormik.touched.pronouns &&
                  Boolean(seedMessageFormik.errors.pronouns)
                }
                size="small"
                sx={{ mb: 2 }}
              >
                <FormControlLabel
                  value="he"
                  control={<Radio />}
                  label="He/him/his"
                  style={{ display: 'inline-block' }}
                  title="for someone who might identify as male"
                />
                <FormControlLabel
                  value="she"
                  control={<Radio />}
                  label="She/her/hers"
                  style={{ display: 'inline-block' }}
                  title="for someone who might identify as female"
                />
                <FormControlLabel
                  value="they"
                  control={<Radio />}
                  label="They/them/their "
                  style={{ display: 'inline-block' }}
                  title="for someone who might not identify as male or female, these pronouns are ‘gender neutral’; they are also used when referring to multiple people"
                />
                <FormHelperText>
                  {seedMessageFormik.touched.pronouns &&
                    seedMessageFormik.errors.pronouns}
                </FormHelperText>
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              id="firstname"
              name="firstname"
              label="First name"
              value={seedMessageFormik.values.firstname}
              onChange={seedMessageFormik.handleChange}
              error={
                seedMessageFormik.touched.firstname &&
                Boolean(seedMessageFormik.errors.firstname)
              }
              helperText={
                seedMessageFormik.touched.firstname &&
                seedMessageFormik.errors.firstname
              }
              size="small"
              sx={{ mb: 2 }}
            />
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
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  name="requireInteraction"
                  checked={seedMessageFormik.values.requireInteraction}
                  onChange={seedMessageFormik.handleChange}
                />
              }
              label="Require interaction"
            />

            <FormControl>
              <FormLabel id="project_role-label">Pronouns</FormLabel>
              <RadioGroup
                aria-labelledby="project_role-label"
                defaultValue="leader"
                name="project_role"
                id="project_role"
                value={seedMessageFormik.values.project_role}
                onChange={seedMessageFormik.handleChange}
                error={
                  seedMessageFormik.touched.project_role &&
                  Boolean(seedMessageFormik.errors.project_role)
                }
                size="small"
                sx={{ mb: 2 }}
              >
                <FormControlLabel
                  value="leader"
                  control={<Radio />}
                  label="Leader"
                  style={{ display: 'inline-block' }}
                />
                <FormControlLabel
                  value="collaborator"
                  control={<Radio />}
                  label="Collaborator"
                  style={{ display: 'inline-block' }}
                />
                <FormHelperText>
                  {seedMessageFormik.touched.pronouns &&
                    seedMessageFormik.errors.pronouns}
                </FormHelperText>
              </RadioGroup>
            </FormControl>
          </form>

          <hr />

          <Typography variant="body2" gutterBottom color="text.secondary">
            Customizing actions will be added in the next version of Push.Foo
          </Typography>
        </CardContent>
      </Card>
    </>
  );
}
