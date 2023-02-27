import "./App.css";
import React, { useState, useEffect } from "react";
import Post from "./Post";
import Profile from "./profile";
import { auth, db } from "./firebase";
import {
  Button,
  Input,
  Modal,
  IconButton,
  Avatar,
  Link,
} from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import Tooltip from "@material-ui/core/Tooltip";
import { PersonIcon, PlusCircleIcon, SignOutIcon, HomeIcon } from "@primer/octicons-react";
import StickyBox from "react-sticky-box/dist/esnext";

function App() {
  const [posts, setPosts] = useState([]);
  const [upload, setUpload] = useState(false);
  const [user, setUser] = useState(null);
  const [usrName, setName] = useState("");
  const [dp, setDP] = useState("");
  const [prfl, setPrfl] = useState(false);
  // const [postName, setPostName]
  // const [postName, setPostName]

  const closemodal = (change) => {
    
  }

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => {
        setPosts(
          snap.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authuser) => {
      if (authuser) {
        // console.log(authuser);
        setUser(authuser);
        console.log(authuser.uid);
        db.collection("users")
          .doc(authuser.uid)
          .onSnapshot(
            (snap) => {
              if (snap) {
                setDP(snap.data().ProfilePic);
                setName(snap.data().Username);
                console.log(dp);
              }
              // console.log(snap.data());
            },
            (err) => {
              console.log(err);
            }
          );
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <div>
      {prfl ? (
        <Profile />
      ) : (
        <div className="App">
          <div className="app__header">
            <a href="#">
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
                alt=""
              />
            </a>

            <input type="text" class="search" placeholder="Search" />

            {user ? (
              <div >
                <div>
                <Tooltip title="Home" arrow>
                    <IconButton >
                      <HomeIcon  className="btns" size={24} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Upload" arrow>
                    <IconButton onClick={() => setUpload(true)}>
                      <PlusCircleIcon className="btns"/>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Person" arrow>
                    <IconButton>
                    <div onClick={() => setPrfl(true)}>
                        <PersonIcon className="btns"/>
                      </div>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Logout" arrow>
                    <IconButton>
                      <div onClick={() => auth.signOut()}>
                        <SignOutIcon className="btns" />
                      </div>
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            ) : null}
          </div>
          <div className="app__posts">
            <div className="app__posts-left">
              {posts.map(({ post, id }) => (
                <Post
                  key={id}
                  dp={dp}
                  postID={id}
                  time={post.timestamp}
                  user={user}
                  caption={post.caption}
                  username={post.username}
                  imgURL={post.imgURL}
                />
              ))}
            </div>
            {user && (
              <span>
                <StickyBox offsetTop={150} offsetBottom={10}>
                  <div className="app__userInfo">
                    <div className="app__avatarOut">
                      <Avatar src={dp} alt="h" className="app__avatar" />
                    </div>
                    <span>
                      <h3 className="app__user">
                        <a onClick={() => setPrfl(true)}>
                          {user ? usrName : "dummy"}
                        </a>
                      </h3>{" "}
                      <p className="app__username">{user.displayName}</p>
                    </span>
                    <span>
                      <button className="app__logout" onClick={() => auth.signOut()}>
                        Log Out
                      </button>
                    </span>
                  </div>
                </StickyBox>
              </span>
            )}
          </div>

          {user?.displayName ? (
            <Modal open={upload} onClose={() => setUpload(false)}>
              <ImageUpload closeme={(e) => setUpload(e)} usern={usrName} />
            </Modal>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default App;
