import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  //아래 내용이 firebaseDB에서 data 가져올때 필요한 전부
  useEffect(() => {
    //this is where the code runs
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        // setPosts(snapshot.docs.map((doc) => doc.data()));
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      }); // every time a new post is added, this code fires up
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      // console.log(auth);
      if (authUser) {
        //user has logged in..
        console.log(authUser);
        setUser(authUser);

        // if (authUser.displayName) {
        //   // don't update username
        // } else {
        //   // if we just created someone
        //   return authUser.updateProfile({
        //     displayName: username,
        //   });
        // }
      } else {
        //user has logged out...
        setUser(null);
      }

      return () => {
        // perform some cleanup actions
        unsubscribe();
      };
    });
  }, [user, username]);

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    // console.log(user);
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  return (
    <div className='app'>
      {/* I want to have.... */}
      {/* Caption input */}
      {/* File picker */}
      {/* Post button */}
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to login to upload</h3>
      )}

      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signup'>
            <center>
              <img
                className='app__headerImage'
                src='https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo.png'
                alt='logo'
              />
            </center>
            <Input
              type='text'
              placeholder='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type='text'
              placeholder='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type='password'
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signup'>
            <center>
              <img
                className='app__headerImage'
                src='https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo.png'
                alt='logo'
              />
            </center>
            <Input
              type='text'
              placeholder='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type='password'
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      <div className='app__header'>
        <img
          className='app__headerImage'
          src='https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo.png'
          alt='logo'
        />
      </div>

      {user ? (
        <Button onClick={() => auth.signOut()}>Logout</Button>
      ) : (
        <div className='app__loginContainer'>
          <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
          <Button onClick={() => setOpen(true)}>Sign up</Button>
        </div>
      )}

      {/* Header */}
      <h1>Test</h1>

      {posts.map(({ id, post }) => (
        <Post
          key={id}
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
        />
      ))}

      <Post
        username='cleverqazi'
        caption='WOW it works'
        imageUrl='https://www.andreasreiterer.at/wp-content/uploads/2017/11/react-logo-825x510.jpg'
      />
      <Post
        username='kevin'
        caption='DOPE'
        imageUrl='https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png'
      />
      <Post
        username='jaehan'
        caption='This is a fun project'
        imageUrl='https://image.shutterstock.com/image-vector/js-logo-monogram-emblem-style-260nw-1715326756.jpg'
      />

      {/* Posts */}
      {/* Posts */}
    </div>
  );
}

export default App;
