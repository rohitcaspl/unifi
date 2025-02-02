import axios from './base';

export const getFormDetails = async ({ formId, tenant }) => {
  console.log('Fetching form details:', { formId, tenant });
  const response = await axios.post('/forms/get_one_form', {
    form_id: formId,
    company_name: tenant,
  });
  return response;
};
