import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { setUser, getUser } from '@storage/user';

const AuthContext = createContext({
  enteredPhoneNumber: false,
  setLoggedIn: () => {},
});

export const AuthProvider = ({ children }) => {
  const [enteredPhoneNumber, setEnteredPhoneNumber] = useState(false);
  const [userData, setUserData] = useState();

  useEffect(() => {
    getUser().then(user => {
      setUserData(user);
      setEnteredPhoneNumber(!!user);
    });
  }, []);

  const setLoggedIn = useCallback(data => {
    setUser(data);
    setUserData(data);
    setEnteredPhoneNumber(!!data);
  }, []);

  const value = useMemo(
    () => ({
      enteredPhoneNumber,
      setLoggedIn,
      userData,
    }),
    [enteredPhoneNumber, setLoggedIn, userData],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.any,
};

export const useAuthContext = () => useContext(AuthContext);
