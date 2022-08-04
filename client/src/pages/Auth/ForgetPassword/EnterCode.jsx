import SNButton from "@/components/SNButton";
import SNTextField from "@/components/SNTextField";
import { message } from "antd";
import authAPI from "@/apis/authAPI";
import React from "react";
import { useForm } from "react-hook-form";

const EnterCode = ({ onFinished }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const verifyCode = async (data) => {
    const { code } = data;
    let rs = await authAPI.verifyCode({ code });
    if (!rs.data.success) {
      message.error(rs.data.message);
      return;
    }
    onFinished(code);
  };
  return (
    <form className="flex flex-col gap-[2rem]">
      <SNTextField
        name="code"
        label={"Code"}
        control={control}
        rules={{
          required: "Code is required",
        }}
        error={!!errors.code}
        helperText={errors.code?.message}
      />
      <SNButton
        type="submit"
        text={"Enter code"}
        onClick={handleSubmit(verifyCode)}
      />
    </form>
  );
};
export default EnterCode;
