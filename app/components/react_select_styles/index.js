export const mainStyle = {
  container: (base, state) => ({
    ...base,
    // marginRight: '-16px',
  }),
  control: (base, { isDisabled, isFocused }) => ({
    ...base,
    borderRadius: 0,
    width: '100%',
    backgroundColor: '#f5f5f5',
    border: 'none',
    borderBottom: 'solid 1px #e0e0e0',
    height: '3.36rem',
    borderColor: isDisabled ? '#e0e0e0' : isFocused ? '#9e9e9e' : '#f5f5f5',
    boxShadow: isFocused ? `0 0 0 1px #e0e0e0` : null,
    '&:hover': { borderColor: 'hsl(0, 0%, 80%)' },
  }),
  indicatorSeparator: (base, state) => ({
    ...base,
    backgroundColor: 'transparent',
  }),
  // dropdownIndicator: (base, state) => ({
  //   ...base,
  //   backgroundImage:
  //     "url(data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='50' fill='%23dedede'><polygon points='0,0 100,0 50,50'/></svg>) !important",
  //   backgroundSize: '10px',
  //   backgroundPosition: 'calc(100% - 16px) center',
  //   backgroundRepeat: 'no-repeat',
  //   padding: '.5rem 1rem',
  // }),
  option: (base, { isSelected, isFocused }) => ({
    ...base,
    backgroundColor: isSelected ? '#9e9e9e' : isFocused ? '#e0e0e0' : 'transparent',
    ':active': { backgroundColor: '#f5f5f5' },
    '&:hover': { backgroundColor: '#e0e0e0' },
  }),
  menu: (base, state) => ({
    ...base,
    borderRadius: 0,
    marginTop: 0,
  }),
};
