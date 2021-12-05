// import FormInput from "compoents/Form/Input";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "store/auth/auth.action";
import jwt_decode from "jwt-decode";
import userAPI from "apis/userAPI";
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

      dispatch(userAPI.getProfile(decodeJWT?.userId));

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
   <div></div>
  );
};

export default Login;
