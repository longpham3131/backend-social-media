import React, { useRef, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Form, Input, Button, Row, Col, message } from "antd";
import _, { debounce } from "lodash";
import { countDown } from "@/util/countDown";
import authAPI from "@/apis/authApi";
import { ArrowLeftOutlined } from "@ant-design/icons";
import moment from "moment";
const ForgetPassword=({onSuccess})=> {
  const [isDisableSend, setIsDisableSend] = useState(false);
  const [isVisibleCountDown, setIsVisibleCountDown] = useState(false);
  const [form] = Form.useForm();
  const [formVerify] = Form.useForm();
  const [step, setStep] = useState(1);
  const [reRenderCountDown, setReRenderCountDown] = useState(moment());
  const [code,setCode] = useState("")
  const sendCode = async () => {
    let emailForm = formVerify.getFieldValue("email");
    console.log(emailForm);
    await authAPI.sendCode({ email: emailForm });
  };
  const delaySendEmailBtn = useCallback(
    debounce(() => {
      setIsDisableSend(false);
    }, 1000 * 60),
    []
  );
  const verifyCode = async() => {
    let code = formVerify.getFieldValue("code");
    let rs = await authAPI.verifyCode({ code });
    console.log(rs)
    if (!rs.data.success) {
      message.error(rs.data.message);
      return;
    }
    setCode(code)
    setStep(2);
  };
  const changePassword = async() => {
    let newPassword = form.getFieldValue("newPassword");
    let rs = await authAPI.changePasswordByCode({ code ,newPassword});
    if (!rs.data.success) {
      message.error(rs.data.message);
      return;
    }
    form.resetFields()
    onSuccess()
  };
  return (
    <div className="App">
      {step == 1 && (
        <Form form={formVerify} onFinish={verifyCode} layout={"vertical"}>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                label="Your Email"
                name="email"
                hasFeedback
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please enter your email.",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Button
                style={{ marginBottom: "2rem" }}
                disabled={isDisableSend}
                onClick={() => {
                  setIsDisableSend(true);
                  setReRenderCountDown(moment());
                  setIsVisibleCountDown(true);
                  sendCode();
                  delaySendEmailBtn();
                }}
              >
                Send code
              </Button>
            </Col>
            <Col span={3}>
              <div className="timer-wrapper">
                {isVisibleCountDown == true && (
                  <CountdownCircleTimer
                    isPlaying
                    duration={60}
                    colors={[["#10b981", 1]]}
                    size={30}
                    strokeWidth={2}
                    key={reRenderCountDown}
                    onComplete={() => {
                      console.log("aloo"), setIsVisibleCountDown(false);
                    }}
                  >
                    {countDown}
                  </CountdownCircleTimer>
                )}
              </div>
            </Col>
          </Row>
          {/* <Row gutter={24} >
          
          </Row> */}
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                label="Code"
                name="code"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please enter your new password.",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <div className="w-full flex gap-[0.8rem] justify-end">
              <Button
                type="primary"
                htmlType="submit"
                className="bg-green-4"
              >
                Verify
              </Button>
            </div>
          </Row>
        </Form>
      )}
      {step == 2 && (
        <Form form={form} onFinish={changePassword} layout={"vertical"}>
          <ArrowLeftOutlined
            style={{ color: "#10b981", marginBottom: "2rem" }}
            onClick={() => setStep(1)}
          />
          <Form.Item
            label="New password"
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Please enter your new password.",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Confirm password incorrect.",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Confirm password incorrect.")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <div className="w-full flex gap-[0.8rem] justify-end">
            <Button type="primary" htmlType="submit" className="bg-green-4">
              Change Password
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}

export default ForgetPassword;
