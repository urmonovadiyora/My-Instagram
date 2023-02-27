import { Button, Input, Link } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import App from "./App";
import { auth, db, storage } from "./firebase";
import "./Login.css";
import { FiCamera } from 'react-icons/fi';

function Login() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [LS, setLS] = useState(true);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authuser) => {
        db.collection("users")
          .doc(authuser.user.uid)
          .set({
            Name: name,
            Email: email,
            Username: username,
            likedPosts: [""],
            // ProfilePic: url,
          });
        const uploadTask = storage.ref(`users/${username}`).put(image);

        uploadTask.on(
          "state_changed",
          (snap) => {
            console.log(snap)
          },
          (err) => {
            console.log(err);
          },() => {
            storage
            .ref("users")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {

              db.collection("users").doc(authuser.user.uid).set({
                Name: name,
                Email: email,
                Username: username,
                ProfilePic: url,
              })

            });
          });

        return authuser.user.updateProfile({
          displayName: name,
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authuser) => {
      if (authuser) {
        console.log(authuser);
        setUser(authuser);
        storage
            .ref("users")
            .child(username)
            .getDownloadURL()
            .then((url) => {
              db. collection("users").doc('tempdoc').add({
                Name: name,
                Email: email,
                Username: username,
                ProfilePic: url,
              })
            }).catch(err => console.log(err));
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [user, username]);

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
  };

  return (
    <div className="fon">
      {user ? (
        <App />
      ) : (
        <div className="login">
          {LS ? (
            <div className="login__upform">
              <form className="login__signup">
                <center>
                  <img
                    className="login__headerImage"
                    src="https://1000logos.net/wp-content/uploads/2017/02/Logo-Instagram.png"
                    alt=""/>
                </center>

                <center className="login__dp">
                  <label for="files" class="btn" onChange={handleChange}>
                     <FiCamera />
                  </label>
                  <input
                    id="files"
                    style={{ visibility: "hidden" }}
                    type="file"
                  />
                </center>
                <progress
                  className="progress"
                  value={progress}
                  max="100"
                />
                <input
                  placeholder="Full Name"
                  type="text"
                  value={name}
                  className="login__input"
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  placeholder="Username"
                  className="login__input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <input
                  placeholder="Email"
                  className="login__input"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  placeholder="Password"
                  className="login__input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button className="login__btns" type="submit" onClick={signUp}>
                  Sign up
                </button>
                <p className="text">
                  Have an account?{" "}
                  <Link style={{ color: "#0BA2FA" }} onClick={() => setLS(false)}>
                    Log in
                </Link>
              </p>
              </form>
            </div>
          ) : (
            <div className="login__upform">
              <form className="login__signin">
                <center>
                  <img
                    className="login__headerImage"
                    src="https://1000logos.net/wp-content/uploads/2017/02/Logo-Instagram.png"
                    alt=""
                  />
                </center>

                <input
                  placeholder="Email"
                  className="login__input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  placeholder="Password"
                  type="password"
                  className="login__input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button className="login__btns" type="submit" onClick={signIn}>
                  Sign In
                </button>
                <p className="text">
                  Don't have an account?{" "}
                  <Link style={{ color: "#0BA2FA"}} onClick={() => setLS(true)}>
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          )}

          
        </div>
      )}
    </div>
  );
}

export default Login;
