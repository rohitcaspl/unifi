import { createContext, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const MediaContext = createContext({
  video: {},
  setVideo: () => {},
  signature: '',
  setSignature: () => '',
});

export const MediaProvider = ({ children }) => {
  const [video, setVideo] = useState();
  const [signature, setSignature] = useState();

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
