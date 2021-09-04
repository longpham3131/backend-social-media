import Login from "./Login";
import "./style.scss";
import Dialog from "../../compoents/Dialog";
import { useState } from "react";
import Register from "./Register";
const LoginAndRegister = () => {
  const [isShowDialog, setisShowDialog] = useState(false);

  return (
    <div style={{ backgroundColor: "#f0f2f5", width: "100%", height: "100vh" }}>
      <div className="wrapper">
        <div className="d-flex justify-content-center align-items-center w-100">
          <div className="background-image"></div>
          <div className="wrapper__form">
            <Login />
            <p>Quên mật khẩu?</p>
            <hr />
            <button
              className="btn btn-success w-100"
              onClick={() => {
                setisShowDialog(true);
              }}
            >
              Tạo tài khoản mới
            </button>
            <Dialog
              title={"Đăng ký"}
              isShow={isShowDialog}
              handleHideDialog={() => {
                setisShowDialog(false);
              }}
              content={<Register />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginAndRegister;
