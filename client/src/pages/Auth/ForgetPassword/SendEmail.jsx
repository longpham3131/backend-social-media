import SNTextField from "@/components/SNTextField";
import SNButton from "@/components/SNButton";
import React from "react";
import { useForm } from "react-hook-form";
import authAPI from "@/apis/authAPI";
import { message } from "antd";

const SendEmail = ({ onFinshed }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const sendCode = async (data) => {
    try {
      await authAPI.sendCode({ email: data.email });
      onFinshed();
    } catch {
      message.error("Send code failed");
    }
  };
  return (
    <form className="flex flex-col gap-[2rem]">
      <SNTextField
        name="email"
        label={"Email"}
        control={control}
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "invalid",
          },
        }}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <SNButton
        type="submit"
        text={"Send code"}
        onClick={handleSubmit(sendCode)}
      />
    </form>
  );
};

export default SendEmail;
