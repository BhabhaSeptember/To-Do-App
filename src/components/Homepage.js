import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";
import "./homepage.css";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import DoneIcon from '@mui/icons-material/Done';


export default function Homepage() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [tempUidd, setTempUidd] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
          setTodos([]);
          const data = snapshot.val();
          if (data !== null) {
            Object.values(data).map((todo) => {
              setTodos((oldArray) => [...oldArray, todo]);
            });
          }
        });
      } else if (!user) {
        navigate("/");
      }
    });
  }, []);

  const handleSignout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  //READ
  //ADD
  const writeToDatabase = () => {
    const uidd = uid(); //todo item id
    set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
      todo: todo,
      uidd: uidd,
    });
    setTodo("");
  };

  //UPDATE
  const handleUpdate = (todo) => {
    setIsEditing(true);
    setTodo(todo.todo);
    setTempUidd(todo.uidd);
  };

  const handleEditConfirm = () => {
    update(ref(db, `/${auth.currentUser.uid}/${tempUidd}`), {
      todo: todo,
      tempUidd: tempUidd,
    });
    setTodo("");
    setIsEditing(false);
  };

  //DELETE
  const handleDelete = (uidd) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uidd}`)).then(() => {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.uidd !== uidd));
    });
  };

  return (
    <div className="homepage">
      <input
        className="add-edit-input"
        type="text"
        placeholder="Add todo..."
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      />

      {todos.map((todo) => (
        <div className="todo">
          <h1>{todo.todo}</h1>
          <EditIcon 
          font-size="large"
          onClick={() => handleUpdate(todo)} 
          className="edit-icon"/>

          <DeleteIcon 
          font-size="large"
          onClick={() => handleDelete(todo.uidd)} 
          className="delete-icon"/>
        </div>
      ))}
      {isEditing ? (
        <div>
          <DoneIcon onClick={handleEditConfirm} className="add-confirm-icon" />
        </div>
      ) : (
        <div>
            <AddIcon onClick={writeToDatabase} className="add-confirm-icon"/>
        </div>
      )}
      <LogoutIcon onClick={handleSignout} className="logout-icon" />
    </div>
  );
}
