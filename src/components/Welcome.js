import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import { grey } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
import styles from "./welcome.module.css";
export default function Welcome() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerInformation, setRegisterInformation] = useState({
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  });

  const TextField1 = styled(Button)({
    width: "250px",
  });
  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[700]),
    margin: "15px",
    width: "250px",
    backgroundColor: grey[900],
    "&:hover": {
      backgroundColor: grey[700],
    },
  }));

  const BackButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[700]),
    color: grey[500],
    "&:hover": {
      backgroundColor: grey[500],
      color: grey[50],
    },
  }));

  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/homepage");
      }
    });
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/homepage");
      })
      .catch((err) => alert(err.message));
  };

  const handleRegister = () => {
    if (registerInformation.email !== registerInformation.confirmEmail) {
      alert("Please confirm that email are the same");
      return;
    } else if (
      registerInformation.password !== registerInformation.confirmPassword
    ) {
      alert("Please confirm that password are the same");
      return;
    }
    createUserWithEmailAndPassword(
      auth,
      registerInformation.email,
      registerInformation.password
    )
      .then(() => {
        navigate("/homepage");
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className={styles.welcome}>
      <div className={styles.loginRegisterContainer}>
        {isRegistering ? (
          <>
            <TextField
              variant="standard"
              type="email"
              placeholder="E-MAIL"
              value={registerInformation.email}
              onChange={(e) =>
                setRegisterInformation({
                  ...registerInformation,
                  email: e.target.value,
                })
              }
            />
            <TextField
              variant="standard"
              label="email"
              placeholder="Confirm E-MAIL"
              value={registerInformation.confirmEmail}
              onChange={(e) =>
                setRegisterInformation({
                  ...registerInformation,
                  confirmEmail: e.target.value,
                })
              }
            />
            <TextField
              variant="standard"
              type="password"
              placeholder="Пароль"
              value={registerInformation.password}
              onChange={(e) =>
                setRegisterInformation({
                  ...registerInformation,
                  password: e.target.value,
                })
              }
            />
            <TextField
              variant="standard"
              type="password"
              placeholder="Повторите Пароль"
              value={registerInformation.confirmPassword}
              onChange={(e) =>
                setRegisterInformation({
                  ...registerInformation,
                  confirmPassword: e.target.value,
                })
              }
            />
            <ColorButton variant="contained" onClick={handleRegister}>
              Регистрация
            </ColorButton>
            <BackButton
              variant="text"
              className="create-account-button"
              onClick={() => setIsRegistering(false)}
            >
              Назад
            </BackButton>
          </>
        ) : (
          <>
            <div className={styles.header}>
              <div className={styles.headerline}>
                <span className={styles.headerS}>Вход</span>
                <TextField
                  variant="standard"
                  type="email"
                  placeholder="E-MAIL"
                  onChange={handleEmailChange}
                  value={email}
                />
                <TextField
                  variant="standard"
                  type="password"
                  onChange={handlePasswordChange}
                  value={password}
                  placeholder="Пароль"
                />
                <ColorButton variant="contained" onClick={handleSignIn}>
                  Вход
                </ColorButton>
              </div>
              <div className={styles.headerline}>
                <span className={styles.headerS}>Регистрация</span>
                <span className={styles.headerText}>
                  Если вы не зарегистрированы, используйте эту КНОПКУ? для
                  перехода к форме регистрации
                  {"\n"}
                  <br />
                  Мы используем данную информацию для подтверждения ваших
                  заказов и связи с вами
                </span>
                <ColorButton
                  color="primary"
                  onClick={() => setIsRegistering(true)}
                  variant="text"
                >
                  Регистрация
                </ColorButton>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
