import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import styles from "./resetPwd.module.css";
import { useNavigate } from "react-router-dom";
export default function ResetPwd() {
  const [emailReset, setEmailReset] = useState("");
  const [isReset, setIsReset] = useState(false);

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[700]),
    margin: "15px",
    width: "250px",
    backgroundColor: grey[900],
    "&:hover": {
      backgroundColor: grey[700],
    },
  }));

  const navigate = useNavigate();

  const auth = getAuth();
  const ClikHandlerResrt = () => {
    sendPasswordResetEmail(auth, emailReset)
      .then(() => {
        // Password reset email sent!
        // ..
        setIsReset(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  return (
    <div className={styles.welcome}>
      <div className={styles.loginRegisterContainer}>
        {isReset ? (
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
            <ColorButton variant="contained" onClick={ClikHandlerResrt}>
              Восстановить пароль
            </ColorButton>
          </>
        ) : (
          <>
            <TextField      multiline variant="standard" margin="normal" fullWidth value="Письмо с 
            восстановлением пароля отправлено на вашу почту"></TextField>
            <ColorButton
              variant="contained"
              onClick={() => navigate("/buyeverywhere")}
            >
              Назад на Главную страницу
            </ColorButton>
          </>
        )}
      </div>
    </div>
  );
}
