import Login from "./Login";
import "./style.scss";
import Register from "./Register";
const LoginAndRegister = () => {
  return (
    <div style={{ backgroundColor: "#f0f2f5", width: "100%", height: "100vh" }}>
      <div className="wrapper">
        <div className="d-flex justify-content-center align-items-center w-100">
          <div className="background-image"></div>
          <div className="wrapper__form">
            <Login />
            <p className="forgotPass">Quên mật khẩu?</p>
            <hr />
            <Register />
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginAndRegister;
