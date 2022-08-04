import { message } from "antd";
import authAPI from "@/apis/authAPI";
import React from "react";
import chatAPI from "@/apis/chatAPI";
import SNTextField from "@/components/SNTextField";
import SNButton from "@/components/SNButton";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
const Register = () => {
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const res = await authAPI.register(data);
      await localStorage.setItem("token", res.data.accessToken);
      message.success("Welcome to Vikinger");
      navigate("/");
    } catch (error) {
      message.error(error.response);
    }
  };
  return (
    <div className="flex flex-col gap-[2rem]">
      <SNTextField
        name={"username"}
        label={"Username"}
        control={control}
        rules={{
          required: "Username is required",
        }}
        error={!!errors.username}
        helperText={errors.username?.message}
      />
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
      <SNTextField
        name="fullName"
        label={"Full name"}
        control={control}
        rules={{
          required: "Fullname is required",
        }}
        error={!!errors.fullname}
        helperText={errors.fullname?.message}
      />
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
        text={"Sign up"}
        type="submit"
        onClick={handleSubmit(onSubmit)}
      />
    </div>
  );
};
export default Register;
