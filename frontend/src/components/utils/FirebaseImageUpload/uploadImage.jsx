// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import imageDb from './ConfigImage';
// import { v4 } from 'uuid';

// const uploadImage = (file) => {
//   return new Promise((resolve, reject) => {
//     if (!file) {
//       reject('No file provided');
//       return;
//     }

//     const storageRef = ref(imageDb, `Recipedia/${v4()}`);
//     const uploadTask = uploadBytesResumable(storageRef, file);

//     uploadTask.on(
//       'state_changed',
//       (snapshot) => {},
//       (error) => {
//         reject(error);
//       },
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//           resolve(downloadURL);
//         });
//       }
//     );
//   });
// };

// export default uploadImage;

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import imageDb from './ConfigImage';
import { v4 } from 'uuid';

const uploadImage = async (file) => {
  if (!file) {
    throw new Error('No file provided');
  }

  const storageRef = ref(imageDb, `Recipedia/${v4()}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {},
      (error) => {
        reject(new Error('Image upload failed'));
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(new Error('Image upload failed'));
        }
      }
    );
  });
};

const uploadImageHandler = async (file) => {
  try {
    const imageUrl = await uploadImage(file);
    return imageUrl;
  } catch (error) {
    return '404 error';
  }
};

export { uploadImageHandler };
