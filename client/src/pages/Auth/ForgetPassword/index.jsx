import React, { useRef, useState, useCallback } from "react";
import { Step, StepLabel, stepLabelClasses, Stepper } from "@mui/material";
import SendEmail from "./SendEmail";
import EnterCode from "./EnterCode";
import ResetPassword from "./ResetPassword";
import styled from "@emotion/styled";
import { useNavigate } from "react-router";
import { message } from "antd";

const ForgetPassword = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const ColorlibStepLabel = styled(StepLabel)(() => ({
    [`& .${stepLabelClasses.label}`]: {
      fontFamily: "'Rajdhani', sans-serif",
    },
  }));
  const steps = [
    "Send code to your email",
    "Enter the code received from the email ",
    "Reset your password",
  ];
  const onFinishedEnterCode = (code) => {
    setCode(code);
    setActiveStep(2);
  };
  const onFinishedResetPassword = () => {
    message.success("Your password updated");
    navigate("/login");
  };
  return (
    <div className="flex flex-col gap-[2rem]">
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <ColorlibStepLabel {...labelProps}>{label}</ColorlibStepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === 0 && <SendEmail onFinshed={() => setActiveStep(1)} />}
      {/* Step 2 */}
      {activeStep === 1 && <EnterCode onFinished={onFinishedEnterCode} />}
      {/* Step 3 */}
      {activeStep === 2 && (
        <ResetPassword onFinished={onFinishedResetPassword} code={code} />
      )}
    </div>
  );
};

export default ForgetPassword;
