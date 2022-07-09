import React, { useState } from "react";
import SNWidgetBox from "@/components/SNWidgetBox";
import SNButton from "@/components/SNButton";
import SNTextField from "@/components/SNTextField";
import { useForm } from "react-hook-form";
import { message } from "antd";
import userAPI from "@/apis/userAPI";
const UpdatePassword = () => {
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm();
  const onFinish = async (data) => {
    try {
      await userAPI.updatePassword(data);
      message.success("Update password success.");
    } catch (err) {
      message.error(err.response.data.message);
    }
  };
  return (
    <SNWidgetBox
      title={"Update Password"}
      content={
        <form className="flex flex-col gap-[2rem]">
          <SNTextField
            name="oldPassword"
            label={"Old password"}
            type={"password"}
            control={control}
            rules={{ required: "Old password is required" }}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <SNTextField
            name="newPassword"
            label={"New password"}
            type={"password"}
            control={control}
            rules={{
              required: "New password is required",
              minLength: {
                value: 8,
                message: "New password must be 8 chars",
              },
              validate: (value) => {
                return (
                  [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].every((pattern) =>
                    pattern.test(value)
                  ) ||
                  "New password must include lower, upper, number, and special chars"
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
                value === getValues("newPassword") ||
                "Confirm password does not match",
            }}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
          <SNButton
            text={"Update"}
            type="submit"
            onClick={handleSubmit(onFinish)}
          />
        </form>
      }
    />
  );
};

export default UpdatePassword;
