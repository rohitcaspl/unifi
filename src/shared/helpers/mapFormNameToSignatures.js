export const mapFormsToSignatures = (projects, signatures) => {
  const forms = (projects || []).flatMap(project => project.forms);

  const formMap = forms.reduce((map, form) => {
    map[form._id] = form.form_name;
    return map;
  }, {});

  // For each signature, iterate over its "users" array to create one card per user
  const userCards = [];
  (signatures || []).forEach(signature => {
    // Get the mapped form name using the form_id; fallback to the signature value if needed
    const formId = signature.form_id.split('_')[1];
    const mappedFormName = formMap[formId] || signature.form_name;
    
    // For each user, create a card object merging user and signature data
    (signature.users || []).forEach(user => {
      let fullName = '';
      if (typeof user.name === 'object' && user.name !== null) {
        // Combine first, middle and last names if available
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
        form_name: mappedFormName,
        project_name: signature.project_name // Will default to "Unknown Project" in card if not set
      });
    });
  });
  return userCards;
};
