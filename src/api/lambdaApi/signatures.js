import axios from './base';

const createVideo = () => axios.post(`/api/v1/signatures/video`, {}, {});

const createDoc = () => axios.post(`/api/v1/signatures/doc`, {}, {});

const postSignature = signature =>
  axios.post(`/api/v1/signatures`, signature, {});

const getSignedDoc = async (params) => {
  const { project_id, ...queryParams } = params;
  const response = await axios.get(`/api/v1/signatures/projects/${project_id}`, {params: queryParams});
  return response;
};
const getAllProjectSignatures = (projectId, nextPk, nextSk, limit) =>
  
  axios.get(
    `/api/v1/signatures/projects/${projectId}`,
    {},
    {
      params: {
        nextPk: nextPk,
        nextSk: nextSk,
        limit: limit,
      },
    },
  );

const getAllFormSignatures = (projectId, formId, nextPk, nextSk, limit) =>
  axios.get(
    `/api/v1/signatures/projects/${projectId}/forms/${projectId}_${formId}`,
    {},
    {
      params: {
        nextPk: nextPk,
        nextSk: nextSk,
        limit: limit,
      },
    },
  );

const getAllAgentSignatures = (agentId, nextPk, nextSk, limit) =>
  axios.get(
    `/api/v1/signatures/agents/${agentId}`,
    {},
    {
      params: {
        nextPk: nextPk,
        nextSk: nextSk,
        limit: limit,
      },
    },
  );

export {
  createVideo,
  createDoc,
  postSignature,
  getSignedDoc,
  getAllProjectSignatures,
  getAllFormSignatures,
  getAllAgentSignatures,
};
