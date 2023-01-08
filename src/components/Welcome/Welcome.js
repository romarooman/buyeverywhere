import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase.js";

import { useNavigate } from "react-router-dom";
import { grey } from "@mui/material/colors";
import { TextField, Checkbox, Button, styled } from "@mui/material";
import styles from "./Welcome.module.css";
import validator from "validator";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";

const Welcome = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerInformation, setRegisterInformation] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    surname: "",
    phone: "",
  });
  const [errorEmail, setErrorEmail] = useState(false);
  const [msgErrorEmail, setmsgErrorEmail] = useState("");

  const [pwdError, setPwdError] = useState(false);
  const [msgErrorPwd, setMsgErrorPwd] = useState("");

  const [phoneError, setPhoneError] = useState(false);
  const [msgErrorPhone, setmsgErrorPhone] = useState("");

  const [msgAgree, setmsgAgree] = useState("");
  const [handlerrorAgree, sethandlerrorAgree] = useState(false);

  const [msgSign, setmsgSign] = useState("");
  const [handlerrorSingn, setHandlerrorSingn] = useState(false);

  const inputStyle = {
    WebkitBoxShadow: "0 0 0 1000px white inset",
  };

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const [checked, setChecked] = useState(true);

  const handleChange = (event) => {
    setmsgAgree("");
    sethandlerrorAgree(false);
    setChecked(event.target.checked);
  };
  const [checkedAgree, setCheckedAgree] = useState(true);

  const handleChangeAgree = (event) => {
    setmsgAgree("");
    sethandlerrorAgree(false);
    setCheckedAgree(event.target.checked);
  };

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[700]),
    margin: "15px 15px 15px 0",
    width: "250px",
    backgroundColor: grey[900],
    "&:hover": {
      backgroundColor: grey[700],
    },
  }));

  const BackButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[700]),
    color: grey[500],
    width: "250px",
    "&:hover": {
      backgroundColor: grey[500],
      color: grey[50],
    },
  }));

  const FieldText = styled(Button)(({ theme }) => ({
    marginTop: "2px",
    marginBottom: "2px",
    width: "100%",
    minHeight: "55px",
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
    setmsgSign("");
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setmsgSign("");
    setPassword(e.target.value);
  };

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/homepage");
      })
      .catch((err) => {
        if (err.code === "auth/wrong-password") {
          setHandlerrorSingn(true);
          setmsgSign("Неверный пароль");
        } else if (err.code === "auth/user-not-found") {
          setHandlerrorSingn(true);
          setmsgSign("Неверный E-MAIL");
        }
      });
  };

  const handleRegister = () => {
    const EMAIL_REGEXP =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

    if (registerInformation.email === "") {
      setErrorEmail(true);
      setmsgErrorEmail("E-mail не может быть пустым");
      return;
    } else if (!EMAIL_REGEXP.test(registerInformation.email)) {
      setErrorEmail(true);
      setmsgErrorEmail("Введите корректный E-mail");
      return;
    } else if (registerInformation.password === "") {
      setPwdError(true);
      setMsgErrorPwd("Пароль не может быть пустым");
      return;
    } else if (registerInformation.password.length < 6) {
      setPwdError(true);
      setMsgErrorPwd("Пароль должен содержать мин 6 символов");
      // alert("Please confirm that password are the same");
      return;
    } else if (!validator.isMobilePhone(registerInformation.phone, ["ru-RU"])) {
      setPhoneError(true);
      setmsgErrorPhone("Введите корректный номер телефона");
      // alert("Please confirm that password are the same");
      return;
    } else if (!checked || !checkedAgree) {
      sethandlerrorAgree(true);
      setmsgAgree("Поддтевердите согласие");

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
      registerInformation.password,
      registerInformation.name,
      registerInformation.surname,
      registerInformation.phone
    )
      .then(() => {
        navigate("/homepage");
      })
      .catch((err) => {
        console.log(err.code);
        if (err.code === "auth/email-already-in-use") {
          setErrorEmail(true);
          setmsgErrorEmail("Такой E-MAIL уже существует");
        }
      });
  };

  return (
    <div className={styles.welcome}>
      <div className={styles.loginRegisterContainer}>
        {isRegistering ? (
          <>
            <div className={styles.item}>
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
                type="name"
                placeholder="Имя"
                // error={pwdError}
                // helperText={msgErrorPwd}
                value={registerInformation.name}
                onChange={(e) => {
                  setRegisterInformation({
                    ...registerInformation,
                    name: e.target.value,
                  });
                }}
              />
            </div>
            <div className={styles.item}>
              <TextField
                inputProps={{ style: inputStyle }}
                margin="normal"
                fullWidth
                variant="standard"
                type="tel"
                placeholder="Номер телефона"
                error={phoneError}
                helperText={msgErrorPhone}
                value={registerInformation.phone}
                onChange={(e) => {
                  setPhoneError(false);
                  setmsgErrorPhone("");
                  setRegisterInformation({
                    ...registerInformation,
                    phone: e.target.value,
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
              <TextField
                inputProps={{ style: inputStyle }}
                margin="normal"
                fullWidth
                variant="standard"
                type="surname"
                placeholder="Фамилия"
                // error={pwdError}
                // helperText={msgErrorPwd}
                value={registerInformation.surname}
                onChange={(e) => {
                  setRegisterInformation({
                    ...registerInformation,
                    surname: e.target.value,
                  });
                }}
              />
            </div>

            <div className={styles.item}>
              <FormControl required error={handlerrorAgree}>
                <FormControlLabel
                  control={
                    <Checkbox checked={checked} onChange={handleChange} />
                  }
                  label={
                    <div className={styles.politika}>
                      Я согласен с{" "}
                      <Link color="inherit" href="/agreement">
                        {"условиями использования"}
                      </Link>
                    </div>
                  }
                />
                <FormHelperText>{msgAgree}</FormHelperText>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkedAgree}
                      onChange={handleChangeAgree}
                    />
                  }
                  label={
                    <div className={styles.politika}>
                      Я согласен с{" "}
                      <Link color="inherit" href="/politika-konfidentsialnosti">
                        {"политикой конфиденциальности"}
                      </Link>
                    </div>
                  }
                />
                <FormHelperText>{msgAgree}</FormHelperText>
              </FormControl>
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
            </div>
          </>
        ) : (
          <>
            <div className={styles.header}>
              <div className={styles.headerline}>
                <span className={styles.headerS}>Вход</span>
                <FormControl required error={handlerrorSingn}>
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
                  <FormHelperText>{msgSign}</FormHelperText>
                  <span
                    onClick={() => navigate("/reset")}
                    className={styles.text}
                  >
                    {"\n"}
                    Забыли пароль?
                    {"\n"}
                  </span>
                  <ColorButton variant="contained" onClick={handleSignIn}>
                    Вход
                  </ColorButton>
                </FormControl>
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
};

export { Welcome };
