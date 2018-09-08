import React from 'react';

const SelectWithError = ({
  input,
  meta: { touched, error, warning },
  children
}) => (
  <div className="SelectWithError">
    {(touched && (error && <span className="error">{error}</span>)) ||
      (warning && <span>{warning}</span>)}
    <select {...input}>{children}</select>
  </div>
);

export default SelectWithError;
