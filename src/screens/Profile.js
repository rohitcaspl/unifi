import colors from '@theme/colors';

import Button from '@components/Button/Button';
import CustomText from '@components/CustomText';
import Layout from '@components/Layout';
import TextField from '@components/TextField';
import SignoutModal from '@features/signoutModal';
import CustomHeaderRight from '@navigation/components/CustomHeaderRight';

import { useNavigation } from '@react-navigation/native';
import { BOTTOM_LINKS } from '@shared/constants';
import { defaultUserImg } from '@shared/helpers/userHelpers';
import { useAuthContext } from 'context/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const Profile = () => {
  const { userData: user } = useAuthContext();

  const [openSignOutModal, setOpenSignOutModal] = useState(false);

  const navigation = useNavigation();

  const defaultValues = useMemo(() => {
    return {
      full_name: user.data?.data?.full_name,
      email: user.data?.data?.email,
      phone: user.data?.data?.mobile,
      country: {
        label: user?.data?.data?.country,
      },
      image: { uri: user.data?.data?.image?.url || '' },
    };
  }, [user]);
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const { control, getValues, reset } = useForm({
    mode: 'onBlur',
    defaultValues,
  });

  return (
    <Layout
      defaultNav
      headerRight={
        <CustomHeaderRight
          customStyle={styles.headerRight}
          onPress={() => setOpenSignOutModal(true)}
        >
          <View style={styles.headerRightInner}>
            <CustomText size={12} bold>
              Sign out
            </CustomText>
          </View>
        </CustomHeaderRight>
      }
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.flex}>
        <View style={styles.formContainer}>
          <View style={styles.mb}>
            <View style={styles.nameContainer}>
              <View style={styles.imageContainer}>
                <Image
                  resizeMode='cover'
                  source={{
                    uri: getValues('image').uri || defaultUserImg,
                  }}
                  style={styles.image}
                />
              </View>
              {user?.data?.data?.full_name ? (
                <CustomText size={18} bold>
                  {user.data.data.full_name}
                </CustomText>
              ) : null}
            </View>
            <TextField
              name='email'
              control={control}
              placeholder='Email'
              label='Email'
              customStyle={styles.formInput}
              disabled
            />
            <TextField
              name='phone'
              control={control}
              placeholder='Phone number'
              customStyle={styles.formInput}
              disabled
            />
          </View>
        </View>
        <SignoutModal setOpen={setOpenSignOutModal} open={openSignOutModal} />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <View style={styles.privacyPolicyLinkContainer}>
          {BOTTOM_LINKS.map(link => (
            <TouchableOpacity
              key={link.id}
              onPress={() => {
                navigation.navigate('Browser', {
                  url: link.href,
                  title: link.title,
                });
              }}
            >
              <CustomText style={styles.privacyPolicyText}>
                {link.title}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>
        <Button
          text='Edit Profile'
          onPress={() => navigation.navigate('EditProfile')}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  buttonContainer: {
    padding: 16,
  },
  headerRightInner: {
    paddingVertical: 8,
    height: 34,
    paddingHorizontal: 16,
  },

  headerRight: {
    borderRadius: 6,
    backgroundColor: colors.yellow,
    marginRight: 16,
  },

  container: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },

  imageContainer: {
    alignSelf: 'center',
    marginBottom: 16,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  icon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 8,
    backgroundColor: colors.white,
    borderRadius: 50,
    zIndex: 2,
  },

  formInput: {
    marginBottom: 20,
  },

  mb: {
    marginBottom: 24,
  },

  nameContainer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  privacyPolicyLinkContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  privacyPolicyText: {
    color: colors.textLightGray,
    textDecorationLine: 'underline',
  },
  formContainer: {
    flex: 1,
  },
});

export default Profile;
