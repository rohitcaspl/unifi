
import { createContext, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const MediaContext = createContext({
  video: {},
  setVideo: () => {},
  signature: '',
  setSignature: () => '',
});

export const MediaProvider = ({ children }) => {
  const [video, _setVideo] = useState();
  const [signature, setSignature] = useState();

  const setVideo = (videoObj) => {
    if (!videoObj) return;

    const uriWithPrefix = videoObj?.path?.startsWith('file://')
      ? videoObj.path
      : `file://${videoObj.path}`;

    _setVideo({
      ...videoObj,
      uri: uriWithPrefix,
    });
  };

  const value = useMemo(
    () => ({
      video,
      setVideo,
      signature,
      setSignature,
    }),
    [video, setVideo, signature, setSignature],
  );

  return (
    <MediaContext.Provider value={value}>{children}</MediaContext.Provider>
  );
};

MediaProvider.propTypes = {
  children: PropTypes.any,
};

export const useMediaContext = () => useContext(MediaContext);
