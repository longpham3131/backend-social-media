import FormInput from "../../../compoents/Form/Input";
import { useState } from "react";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("USERNAME - PASSWORD", username, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label={"Tài khoản"}
        type={"text"}
        onChangeValue={(value) => {
          setUsername(value);
        }}
      />
      <FormInput
        label={"Mật khẩu"}
        type={"password"}
        onChangeValue={(value) => {
          setPassword(value);
        }}
      />
      <div style={{ textAlign: "right" }}>
        <button type="submit" className="btn btn-primary w-100">
          Đăng nhập
        </button>
      </div>
    </form>
  );
};

export default Login;
