import { message } from "antd";
import authAPI from "@/apis/authAPI";
import SNButton from "@/components/SNButton";
import SNTextField from "@/components/SNTextField";
import React from "react";
import { useForm } from "react-hook-form";

const ResetPassword = ({ onFinished, code }) => {
  const {
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const newPassword = data.password;
    let rs = await authAPI.changePasswordByCode({ code, newPassword });
    if (!rs.data.success) {
      message.error(rs.data.message);
      return;
    }
    onFinished();
  };
  return (
    <div className="flex flex-col gap-[2rem]">
      <SNTextField
        name="password"
        label={"Password"}
        type={"password"}
        control={control}
        rules={{
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be 8 chars",
          },
          validate: (value) => {
            return (
              [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].every((pattern) =>
                pattern.test(value)
              ) ||
              "Password must include lower, upper, number, and special chars"
            );
          },
        }}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <SNTextField
        name="confirmPassword"
        label={"Confirm password"}
        type={"password"}
        control={control}
        rules={{
          required: "Confirm password is required",
          validate: (value) =>
            value === getValues("password") ||
            "Confirm password does not match",
        }}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />
      <SNButton
        text={"Change password"}
        type="submit"
        onClick={handleSubmit(onSubmit)}
      />
    </div>
  );
};

export default ResetPassword;
