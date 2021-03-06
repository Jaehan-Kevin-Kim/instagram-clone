import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import firebase from 'firebase';
import { storage, db } from './firebase';
import './ImageUpload.css';

const ImageUpload = ({ username }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  //   const [url, setUrl] = useState('');
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    console.log(image);
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    //아래 코드는 진행 bar를 표현하기 위한 코드
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // progress function ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        //Error Function ...
        console.log(error);
        alert(error.message);
      },
      () => {
        // complete function ...
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            //post image inside db

            db.collection('posts').add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });

            setProgress(0);
            setCaption('');
            setImage(null);
          });
      }
    );
  };

  return (
    <div className='imageUpload'>
      {/* I want to have.... */}
      {/* Caption input */}
      {/* File picker */}
      {/* Post button */}
      <progress className='imageUploadProgress' value={progress} max='100' />
      <input
        type='text'
        placeholder='Enter a caption...'
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
      />
      <input type='File' onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
};

export default ImageUpload;
