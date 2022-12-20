import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";
import "./homepage.css";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckIcon from "@mui/icons-material/Check";
import TextField from "@mui/material/TextField";

export default function Homepage() {
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
        navigate("/");
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
    <div className="homepage">
      <div className="ordered1">
        <form onSubmit={writeToDatabase} className="orders">
          <TextField
            key={1}
            name="order"
            type="text"
            placeholder="Название товара"
            onChange={handleChange}
          />
          <TextField
            key={2}
            name="links"
            type="text"
            placeholder="цена"
            onChange={handleChange}
          />
        </form>
        <div>
          <AddIcon onClick={writeToDatabase} className="add-confirm-icon" />
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
        <div className="ordered">
          <div className="todo">
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
            className="delete-button"
          />
        </div>
      ))}

      <LogoutIcon onClick={handleSignOut} className="logout-icon" />
    </div>
  );
}
