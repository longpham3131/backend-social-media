import Login from "./Login";

import Register from "./Register";
const AuthPage = () => {
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
export default AuthPage;
