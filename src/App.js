import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db } from './firebase';

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    //this is where the code runs
    db.collection('posts').onSnapshot((snapshot) => {
      // setPosts(snapshot.docs.map((doc) => doc.data()));
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
    }); // every time a new post is added, this code fires up
  }, []);

  return (
    <div className='app'>
      <div className='app__header'>
        <img
          className='app__headerImage'
          src='https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo.png'
          alt='logo'
        />
      </div>
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
