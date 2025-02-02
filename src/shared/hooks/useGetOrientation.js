import { ORIENTATION } from '@shared/constants';
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

const useGetOrientation = () => {
  const [orientation, setOrientation] = useState('');

  const determineOrientation = () => {
    if (Dimensions.get('window').width < Dimensions.get('window').height)
      setOrientation(ORIENTATION.portrait);
    else setOrientation(ORIENTATION.landscape);
  };

  useEffect(() => {
    determineOrientation();

    const subscription = Dimensions?.addEventListener(
      'change',
      determineOrientation,
    );

    return () => subscription.remove();
  }, []);

  return orientation;
};

export default useGetOrientation;
