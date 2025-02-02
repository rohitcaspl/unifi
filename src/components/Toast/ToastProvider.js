import { ToastProvider as Provider } from 'react-native-toast-notifications';
import PropTypes from 'prop-types';
import ToastMessageSuccess from './ToastMessageSuccess';

const ToastProvider = ({ children }) => {
  return (
    <Provider
      placement='top'
      offsetTop={50}
      renderType={{
        success: toast => <ToastMessageSuccess toast={toast} />,
      }}
    >
      {children}
    </Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ToastProvider;
