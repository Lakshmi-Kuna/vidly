import React from "react";
const Input = ({ name, label, error, ...rest }) => {
  return (
    <div className="from-group">
      <label htmlFor={name}>{label}</label>
      <input
        {...rest}
        className="form-control m-2"
        autoFocus
        // ref={this.username}
        id={name}
        name={name}
      />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Input;
