import { message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import authAPI from "@/apis/authAPI";
import React, { useState } from "react";
import SNTextField from "@/components/SNTextField";
import SNButton from "@/components/SNButton";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

const Login = () => {
  let navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onFinish = async (data) => {
    const { username, password } = data;
    try {
      const res = await authAPI.login({ username, password });
      localStorage.setItem("token", res.data.accessToken);
      navigate("/");
    } catch (error) {
      console.log("error");
      message.error("Invalid username or password");
    }
  };

  return (
    <form className="flex flex-col gap-[2rem]">
      <SNTextField
        name="username"
        label={"Username"}
        rules={{ required: "Username is required" }}
        control={control}
        error={!!errors.username}
        helperText={errors.username?.message}
      />
      <SNTextField
        name="password"
        label={"Password"}
        type={"password"}
        control={control}
        rules={{ required: "Username is required" }}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <SNButton
        text={"Log in"}
        type="submit"
        onClick={handleSubmit(onFinish)}
      />

      <div className="mt-[1rem]">
        <Link
          to={"/forget-password"}
          className=" font-semi-bold text-[0.875rem] text-color-text hover:text-color-primary"
        >
          Lost your password?
        </Link>
      </div>
      <div className="mt-[0.25rem] text-left">
        <Link
          to={"/register"}
          className=" text-color-text-alt-2 font-semi-bold text-[0.875rem]  hover:text-color-primary"
        >
          ← Go to Vikinger
        </Link>
      </div>
    </form>
  );
};

export default Login;
