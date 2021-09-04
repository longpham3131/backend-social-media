import { useState } from "react";
import "./style.scss";
const FormInput = ({ label, type, onChangeValue, validate = "none" }) => {
  const [valid, setValid] = useState(true);
  const [alert, setAlert] = useState("");

  const checkValid = (value) => {
    switch (validate) {
      case "username": {
        setAlert("");
        setValid(true);
        if (value.trim() === "") {
          setAlert("Hãy nhập tài khoản");
          setValid(false);
        }
        break;
      }
      case "email": {
        setAlert("");
        setValid(true);
        if (value.trim() === "") {
          setAlert("Hãy nhập email");
          setValid(false);
        }
        break;
      }
      case "password": {
        setAlert("");
        setValid(true);
        if (value.trim() === "") {
          setAlert("Hãy nhập mật khẩu");
          setValid(false);
        }
        break;
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
      <label style={{ color: valid ? "" : "red" }} htmlFor={label + type}>
        {label}:
      </label>
      <input
        type={type}
        className={valid ? "form-control" : "form-control invalid"}
        id={label + type}
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
