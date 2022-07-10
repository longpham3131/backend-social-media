import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

const CustomStyleButton = styled(Button)({
  borderRadius: "12px",
  fontFamily: "'Rajdhani', sans-serif",
  backgroundColor: "var(--color-secondary)",
  height: "54px",
  fontSize: "1rem",
  fontWeight: "700",
  textTransform: "none",
  width: "100%",
});

const SNButton = ({ text, onClick, isSubmit = true }) => {
  return (
    <CustomStyleButton
      type={isSubmit ? "submit" : "button"}
      variant="contained"
      onClick={() => onClick}
    >
      {text}
    </CustomStyleButton>
  );
};
export default SNButton;
