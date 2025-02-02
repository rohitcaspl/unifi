import PropTypes from 'prop-types';
import TabFilter from '@components/TabFilter';
import CustomDropdown from '@components/CustomDropdown';

const Filter = ({
  data,
  onChange,
  selected,
  showTabs,
  labelKey,
  customStyle,
  placeholder,
}) => {
  return showTabs ? (
    <TabFilter data={data} onChange={onChange} selected={selected} />
  ) : data?.length > 0 ? (
    <CustomDropdown
      defaultValue={data[0]}
      options={data}
      selectedValue={selected}
      identifier={'_id'}
      labelKey={labelKey}
      customStyle={customStyle}
      setSelectedValue={value => {
        onChange(value);
      }}
      placeholder={placeholder}
    />
  ) : null;
};

Filter.propTypes = {
  data: PropTypes.PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.object,
  showTabs: PropTypes.bool,
  labelKey: PropTypes.string,
  placeholder: PropTypes.string,
  customStyle: PropTypes.object,
};

export default Filter;
