import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

export default function ResetPwd() {
  const [emailReset, setEmailReset] = useState("");

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[700]),
    margin: "15px",
    width: "250px",
    backgroundColor: grey[900],
    "&:hover": {
      backgroundColor: grey[700],
    },
  }));

  const auth = getAuth();
  sendPasswordResetEmail(auth, emailReset)
    .then(() => {
      // Password reset email sent!
      // ..
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });

  return (
    <>
      <TextField
        margin="normal"
        fullWidth
        variant="standard"
        type="email"
        placeholder="E-MAIL"
        value={emailReset}
        onChange={(e) => {
          setEmailReset(e.target.value);
        }}
      />
      <ColorButton variant="contained" onClick={sendPasswordResetEmail}>
        Восстановить пароль
      </ColorButton>
    </>
  );
}
