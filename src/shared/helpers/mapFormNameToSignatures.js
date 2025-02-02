export const mapFormsToSignatures = (projects, signatures) => {
  const forms = (projects || []).flatMap(project => project.forms);

  const formMap = forms.reduce((map, form) => {
    map[form._id] = form.form_name;
    return map;
  }, {});

  const updatedSignatures = (signatures || []).map(signature => {
    const formId = signature.form_id.split('_')[1];
    const formName = formMap[formId];
    return { ...signature, form_name: formName };
  });

  return updatedSignatures;
};
