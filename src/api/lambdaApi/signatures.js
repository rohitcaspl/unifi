import axios from './base';

const createVideo = () => axios.post(`/api/v1/signatures/video`, {}, {});

const createDoc = () => axios.post(`/api/v1/signatures/doc`, {}, {});

const postSignature = signature =>
  axios.post(`/api/v1/signatures`, signature, {});

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
  getAllProjectSignatures,
  getAllFormSignatures,
  getAllAgentSignatures,
};