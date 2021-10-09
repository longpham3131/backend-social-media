import FormInput from "compoents/Form/Input";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "store/auth/auth.action";
import jwt_decode from "jwt-decode";
import { getUserProfile } from "store/user/user.action";
const Login = () => {
  const dispatch = useDispatch();
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notifyForm, setNotifyForm] = useState("");
  const loginReducer = useSelector((state) => state.authReducer.auth);

  useEffect(() => {
    setNotifyForm("");
    if (loginReducer?.status === 200) {
      localStorage.setItem("token", loginReducer?.data?.accessToken);

      const decodeJWT = jwt_decode(loginReducer?.data?.accessToken);

      localStorage.setItem("userId", decodeJWT?.userId);

      dispatch(getUserProfile(decodeJWT?.userId));

      history.push("/");

      window.location.reload();
    } else if (loginReducer?.status === 400) {
      setNotifyForm(loginReducer?.data?.message);
    }
  }, [loginReducer]);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(login(username, password));
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
      <p
        style={{
          display: notifyForm !== "" ? "block" : "none",
          color: "red",
          textAlign: "center",
          fontWeight: "500",
        }}
      >
        {notifyForm}
      </p>
      <div style={{ textAlign: "right" }}>
        <button type="submit" className="btn btn-primary w-100">
          Đăng nhập
        </button>
      </div>
    </form>
  );
};

export default Login;
