import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";
import styles from "./Homepage.module.css";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckIcon from "@mui/icons-material/Check";
import TextField from "@mui/material/TextField";

const Homepage = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [tempUidd, setTempUidd] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // read
        onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
          setTodos([]);
          const data = snapshot.val();
          if (data !== null) {
            Object.values(data).map((todo) => {
              console.log(todo);
              setTodos((oldArray) => [...oldArray, todo]);
            });
          }
        });
      } else if (!user) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/buyeverywhere");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const handleChange = (event) => {
    setTodo({
      ...todo,
      [event.target.name]: event.target.value,
    });
  };
  console.log(todo);

  // add
  const writeToDatabase = () => {
    const uidd = uid();
    set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
      order: todo.order,
      links: todo.links,
      uidd: uidd,
    });

    setTodo("");
  };

  // update
  const handleUpdate = (event) => {
    setIsEdit(true);
    setTodo({
      ...todo,
      [event.target.name]: event.target.value,
    });
    setTempUidd(todo.uidd);
  };

  const handleEditConfirm = () => {
    update(ref(db, `/${auth.currentUser.uid}/${tempUidd}`), {
      order: todo.order,
      links: todo.links,
      tempUidd: tempUidd,
    });

    setTodo("");
    setIsEdit(false);
  };

  // delete
  const handleDelete = (uid) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uid}`));
  };

  return (
    <div className={styles.homepage}>
      <div className={styles.orders}>
        <h2>Новый заказ</h2>
        <form onSubmit={writeToDatabase} className={styles.order}>
          <TextField
            margin="normal"
            fullWidth
            variant="standard"
            key={1}
            name="link"
            type="text"
            placeholder="Ссылка на товар"
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            variant="standard"
            key={2}
            name="nameItem"
            type="text"
            placeholder="Название товара, как в магазине"
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            variant="standard"
            key={3}
            name="price"
            type="text"
            placeholder="Стоимость за штуку"
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            variant="standard"
            key={4}
            name="amount"
            type="text"
            placeholder="Количество"
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            variant="standard"
            key={5}
            name="size"
            type="text"
            placeholder="Размер"
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            variant="standard"
            key={6}
            name="article"
            type="text"
            placeholder="Артикул"
            onChange={handleChange}
          />
        </form>
        <div>
          <AddIcon
            onClick={writeToDatabase}
            className={styles.addConfirmIcon}
          />
        </div>
        {/* {isEdit ? (
          <div>
            <CheckIcon
              onClick={handleEditConfirm}
              className="add-confirm-icon"
            />
          </div>
        ) : (
          <div>
            <AddIcon onClick={writeToDatabase} className="add-confirm-icon" />
          </div>
        )} */}
      </div>

      {todos.map((todo, numbers) => (
        <div className={styles.ordered}>
          <div className={styles.todo}>
            <duv>Заказ {numbers + 1}</duv>
            <TextField
              onChange={handleChange}
              defaultValue={todo.order}
            ></TextField>
            <TextField
              onChange={handleChange}
              defaultValue={todo.links}
            ></TextField>
          </div>
          {/* <EditIcon
            fontSize="large"
            onClick={() => handleUpdate(todo)}
            className="edit-button"
          /> */}
          <DeleteIcon
            fontSize="large"
            onClick={() => handleDelete(todo.uidd)}
            className={styles.deleteButton}
          />
        </div>
      ))}

      <LogoutIcon onClick={handleSignOut} className={styles.logoutIcon} />
    </div>
  );
};

export { Homepage };
