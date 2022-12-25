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
  const [errorEmail, setErrorEmail] = useState(false);
  const [msgErrorEmail, setmsgErrorEmail] = useState("");
  const [pwdError, setPwdError] = useState(false);
  const [msgErrorPwd, setMsgErrorPwd] = useState("");

  const inputStyle = { WebkitBoxShadow: "0 0 0 1000px white inset" };

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
    const EMAIL_REGEXP =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

    if (registerInformation.email !== registerInformation.confirmEmail) {
      setErrorEmail(true);
      setmsgErrorEmail("E-mail не совпадают");
      return;
    } else if (registerInformation.email === "") {
      setErrorEmail(true);
      setmsgErrorEmail("E-mail не может быть пустым");
      return;
    } 

    else if (!EMAIL_REGEXP.test(registerInformation.email)) {
      setErrorEmail(true);
      setmsgErrorEmail("Введите корректный E-mail");
      return;
    } 
    
    else if (registerInformation.password === "") {
      setPwdError(true);
      setMsgErrorPwd("Пароль не может быть пустым");
      return;
    } else if (registerInformation.password.length <= 6) {
      setPwdError(true);
      setMsgErrorPwd("Пароль должен содержать мин 6 символов");
      // alert("Please confirm that password are the same");
      return;
    } else if (
      registerInformation.password !== registerInformation.confirmPassword
    ) {
      setPwdError(true);
      setMsgErrorPwd("Пароли не совпадают");
      // alert("Please confirm that password are the same");
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
              inputProps={{ style: inputStyle }}
              margin="normal"
              fullWidth
              variant="standard"
              type="email"
              placeholder="E-MAIL"
              error={errorEmail}
              helperText={msgErrorEmail}
              value={registerInformation.email}
              onChange={(e) => {
                setErrorEmail(false);
                setmsgErrorEmail("");
                setRegisterInformation({
                  ...registerInformation,
                  email: e.target.value,
                });
              }}
            />
            <TextField
              inputProps={{ style: inputStyle }}
              margin="normal"
              fullWidth
              variant="standard"
              placeholder="Повторите E-MAIL"
              value={registerInformation.confirmEmail}
              onChange={(e) => {
                setErrorEmail(false);
                setmsgErrorEmail("");
                setRegisterInformation({
                  ...registerInformation,
                  confirmEmail: e.target.value,
                });
              }}
            />
            <TextField
              inputProps={{ style: inputStyle }}
              margin="normal"
              fullWidth
              variant="standard"
              type="password"
              placeholder="Пароль"
              error={pwdError}
              helperText={msgErrorPwd}
              value={registerInformation.password}
              onChange={(e) => {
                setPwdError(false);
                setMsgErrorPwd("");
                setRegisterInformation({
                  ...registerInformation,
                  password: e.target.value,
                });
              }}
            />
            <TextField
              inputProps={{ style: inputStyle }}
              margin="normal"
              fullWidth
              variant="standard"
              type="password"
              placeholder="Повторите Пароль"
              value={registerInformation.confirmPassword}
              onChange={(e) => {
                setPwdError(false);
                setMsgErrorPwd("");
                setRegisterInformation({
                  ...registerInformation,
                  confirmPassword: e.target.value,
                });
              }}
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
                  margin="normal"
                  fullWidth
                  variant="standard"
                  inputProps={{ style: inputStyle }}
                  type="email"
                  placeholder="E-MAIL"
                  onChange={handleEmailChange}
                  value={email}
                />
                <TextField
                  inputProps={{ style: inputStyle }}
                  margin="normal"
                  fullWidth
                  variant="standard"
                  type="password"
                  onChange={handlePasswordChange}
                  value={password}
                  placeholder="Пароль"
                />
                <span className={styles.headerText}>
                  {"\n"}
                  {"\n"}
                </span>
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
