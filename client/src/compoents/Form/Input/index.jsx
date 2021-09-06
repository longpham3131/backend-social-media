import { useEffect, useState } from "react";
import "./style.scss";
const FormInput = ({
  label,
  type,
  onChangeValue,
  validate = "none",
  isInputValid,
}) => {
  const [valid, setValid] = useState(true);
  const [alert, setAlert] = useState("");

  const checkValid = (value) => {
    setAlert("");
    setValid(true);

    switch (validate) {
      case "username": {
        if (value.trim() === "") {
          setAlert("Hãy nhập tài khoản");
          setValid(false);
          return isInputValid(false);
        }
        return isInputValid(true);
      }
      case "email": {
        if (value.trim() === "") {
          setAlert("Hãy nhập email");
          setValid(false);
          return isInputValid(false);
        }
        return isInputValid(true);
      }
      case "password": {
        if (value.trim() === "") {
          setAlert("Hãy nhập mật khẩu");
          setValid(false);
          return isInputValid(false);
        }
        return isInputValid(true);
      }

      default: {
        setAlert("");
        setValid(true);
        break;
      }
    }
  };

  return (
    <div className="form-group pb-2">
      <label style={{ color: valid ? "" : "red" }} htmlFor={type}>
        {label}:
      </label>
      <input
        type={type}
        className={valid ? "form-control" : "form-control invalid"}
        id={type}
        onChange={(e) => onChangeValue(e.target.value)}
        onBlur={(e) => checkValid(e.target.value)}
      />
      <span
        className="invalid-message"
        style={{ visibility: valid ? "invisible" : "visible" }}
      >
        {alert}
      </span>
    </div>
  );
};

export default FormInput;
