import axios from './base';

const createPhoto = () => axios.post('/api/v1/faces', {}, {});

const getFaceId = photoId =>
  axios.get(`/api/v1/faces/photo/${photoId}`, {}, {});

const newFaceId = photoId =>
  axios.post(
    `/api/v1/faces/photo/${photoId}`,
    {
      photoId: photoId,
    },
    {},
  );

export { createPhoto, getFaceId, newFaceId };
