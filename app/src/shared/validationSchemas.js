import * as yup from 'yup';

export const seedMessageValidationSchema = yup.object().shape({
  first_name: yup
    .string('Enter first name')
    .max(256, 'First name be of maximum 256 characters length')
    .required('First name is required'),
  pronouns: yup.string('Enter pronouns').required('Pronouns is required'),
  custom_characteristic: yup
    .string('Enter custom characteristic')
    .max(256, 'Custom_characteristic be of maximum 256 characters length'),
  project_name: yup
    .string('Enter project name')
    .max(256, 'First name be of maximum 256 characters length'),
  project_role: yup.string().when('project_name', {
    is: (project_name) => project_name && project_name.length > 0,
    then: () =>
      yup.string('Enter project role').required('Project role is required'),
    otherwise: () => yup.string('Enter project role'),
  }),
});

export const sendMessageValidationSchema = yup.object({
  message: yup
    .string('Enter your message')
    .max(1024, 'Message should be of maximum 1024 characters length')
    .required('Message is required'),
});

export default {
  sendMessageValidationSchema,
  seedMessageValidationSchema,
};
