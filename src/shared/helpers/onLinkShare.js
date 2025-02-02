import Share from 'react-native-share';

import * as Sentry from '@sentry/react-native';

const onLinkShare = (link, onShareEnd) => {
  Share.open({ url: link })
    .then(() => onShareEnd())
    .catch(err => {
      if (err != 'Error: User did not share' && err != 'User did not share') {
        Sentry.captureException(err);
      }
    });
};

export default onLinkShare;
