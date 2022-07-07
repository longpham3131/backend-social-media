import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { useForm, Controller } from "react-hook-form";
const CustomStyleTextField = styled(TextField)({
  "& .MuiInputLabel-root": {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: "1rem",
    fontWeight: "600",
    color: "var(--color-text-alt-2)",
  },
  "& .MuiInputLabel-root.Mui-error": {
    color: "#d32f2f",
  },
  "& label.Mui-focused": {
    color: "var(--color-secondary)",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "var(--color-secondary)",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    fontFamily: "'Rajdhani', sans-serif",

    "& fieldset": {
      borderColor: "var(--color-border)",
    },
    "&:hover fieldset": {
      borderColor: "var(--color-border)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "var(--color-secondary)",
    },
  },
  "& .MuiOutlinedInput-root.Mui-error": {
    "&:hover fieldset": {
      borderColor: "#d32f2f",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#d32f2f",
    },
  },
  "& .MuiFormHelperText-root.Mui-error": {
    fontFamily: "'Rajdhani', sans-serif",
    color: "#d32f2f",
  },
});

const SNTextField = (props) => {
  const { name, type, rules, label, control, error, helperText, onEnter } =
    props;
  const isTypePass = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => {
        return (
          <CustomStyleTextField
            label={label}
            onChange={field.onChange}
            onKeyPress={(ev) => {
              if (ev.key === "Enter") {
                // Do code here
                console.log("Enter");
                ev.preventDefault();
                return onEnter();
              }
            }}
            required={rules?.required ? true : false}
            helperText={helperText}
            variant="outlined"
            error={error}
            type={showPassword || !isTypePass ? "text" : "password"}
            InputProps={{
              endAdornment: isTypePass ? (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ) : (
                <></>
              ),
            }}
          />
        );
      }}
    />
  );
};

export default SNTextField;
