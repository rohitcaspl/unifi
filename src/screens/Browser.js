import PropTypes from 'prop-types';
import WebView from 'react-native-webview';

import Layout from '@components/Layout';

import { View, StyleSheet } from 'react-native';

const Browser = ({ route }) => {
  const { url, title } = route.params;

  return (
    <Layout title={title}>
      <View style={styles.container}>
        <WebView source={{ uri: url }} />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

Browser.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
    }),
  }),
};

export default Browser;
