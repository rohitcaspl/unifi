import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import CustomHeaderLeft from '@navigation/components/CustomHeaderLeft/CustomHeaderLeft';
import colors from '@theme/colors';

const useSetNavigationOptions = ({
  title,
  headerRight,
  defaultNav,
  disableBack,
  isLogin,
  backdrop,
  headerLeftIcon,
  headerLeftStyle,
}) => {
  const navigation = useNavigation();

  useEffect(() => {
    if (backdrop) {
      navigation.setOptions({
        headerStyle: {
          backgroundColor: colors.transparentBlack,
        },
      });
    } else {
      navigation.setOptions({
        headerStyle: {
          backgroundColor: colors.layout,
        },
      });
    }
  }, [backdrop, navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => headerRight,
      headerLeft: () =>
        !defaultNav ? (
          <CustomHeaderLeft
            headerLeftIcon={headerLeftIcon}
            disableBack={disableBack}
            customStyle={headerLeftStyle}
          >
            {title}
          </CustomHeaderLeft>
        ) : null,
    });
  }, [
    navigation,
    title,
    headerRight,
    defaultNav,
    disableBack,
    isLogin,
    headerLeftIcon,
    headerLeftStyle,
  ]);
};

export default useSetNavigationOptions;
