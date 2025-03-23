export const mapFormsToSignatures = (projects, signatures) => {
  const forms = (projects || []).flatMap(project => project.forms);

  // Create map for both form name and form owner
  const formMap = forms.reduce((map, form) => {
    map[form._id] = {
      form_name: form.form_name,
      form_owner: form.form_owner
    };
    return map;
  }, {});

  const userCards = [];
  (signatures || []).forEach(signature => {
    const formId = signature.form_id.split('_')[1];
    const mappedForm = formMap[formId] || {
      form_name: signature.form_name,
      form_owner: 'Unknown Owner'
    };
    
    (signature.users || []).forEach(user => {
      let fullName = '';
      if (typeof user.name === 'object' && user.name !== null) {
        fullName = [user.name.first_name, user.name.middle_name, user.name.last_name]
          .filter(Boolean)
          .join(' ');
      } else {
        fullName = user.name;
      }
      userCards.push({
        date: user.date,
        photo_url: user.photo_url,
        name: fullName,
        signed_doc_url: signature.signed_doc_url,
        form_name: mappedForm.form_name,
        form_owner: mappedForm.form_owner, // Add form owner to the card
        project_name: signature.project_name,
        consentee_name: signature.consentee_name,
      });
    });
  });
  return userCards;
};