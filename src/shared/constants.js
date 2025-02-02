import ShareIcon from '@assets/icons/share.svg';
import DetailsIcon from '@assets/icons/details.svg';

export const SORT_TYPES = {
  RECENT: 'most recent',
  SUBJECT: 'subject name',
  OPERATOR: 'field operator',
};

export const SORT_OPTIONS = [
  {
    value: SORT_TYPES.RECENT,
    label: 'Most recent',
  },
  {
    value: SORT_TYPES.SUBJECT,
    label: 'Subject name',
  },
  {
    value: SORT_TYPES.OPERATOR,
    label: 'Field operator',
  },
];

export const CUSTOM_SORT_OPTIONS = [
  {
    value: 'new',
    label: 'Newest',
  },
  {
    value: 'old',
    label: 'Oldest',
  },
];

export const SIGNATURE_SORT_OPTIONS = [
  {
    value: 'most recent',
    label: 'Newest',
  },
  {
    value: 'signee name',
    label: 'Signee name',
  },
];

export const FORM_OPTIONS = [
  {
    icon: ShareIcon,
    value: 'share',
    label: 'Share',
  },
  {
    icon: DetailsIcon,
    value: 'details',
    label: 'Details',
  },
];

export const NEW_SIGNATURE_STEPS = {
  mobileAndEmail: {
    id: 1,
    title: 'Who is signing',
    step: 1,
  },
  verify: {
    id: 2,
    title: 'Verify signee',
    step: 2,
  },
  photo: {
    id: 3,
    title: 'Signee photo',
    step: 3,
  },
  confirm: {
    id: 4,
    title: 'Confirm face',
    step: 3,
  },
  signeeInfo: {
    id: 5,
    title: 'Signee personal info',
    step: 4,
  },
};

export const ORIENTATION = {
  portrait: 'PORTRAIT',
  landscape: 'LANDSCAPE',
};

export const DEFAULT_FORM_FILTER = {
  _id: 0,
  form_name: 'All docs',
};

export const LOCATION_VALUES = [
  'country',
  'city',
  'street',
  'streetNumber',
  'postalCode',
];

export const APP_NAME = 'Everysign';

export const PLACEHOLDER_AVATAR = require('@assets/placeholder.png');

export const BOTTOM_LINKS = [
  {
    id: 0,
    title: 'Privacy Policy',
    href: 'https://everysign.com/privacy_policy',
  },
  {
    id: 1,
    title: 'Terms & Conditions',
    href: 'https://everysign.com/terms_of_use',
  },
];
