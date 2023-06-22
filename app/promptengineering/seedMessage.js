export const buildSeedMessage = (values) => {
  return `Write 5-7 sentences about ${values.first_name} (pronouns ${values.pronouns.toLowerCase()}).
  
  ${
    values.selected_characteristics
      ? 'Mention ' +
        values.selected_characteristics.join(', ').toLowerCase() +
        '.'
      : ''
  }

  ${
    values.custom_characteristic
      ? "Specifically mention person's " +
        values.custom_characteristic.toLowerCase() +
        '.'
      : ''
  }

  ${
    values.project_name
      ? "Mention this person's participation as a " +
        values.project_role.toLowerCase() +
        " on the project called '" +
        values.project_name +
        "'."
      : ''
  }
  
`;
};

export default { buildSeedMessage };
