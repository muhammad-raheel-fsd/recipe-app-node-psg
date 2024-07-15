import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBqyVMcFovEiU9Zm6Q3R3BsimX2qHvbRsQ",
  authDomain: "practiceimageupload.firebaseapp.com",
  databaseURL: "https://practiceimageupload-default-rtdb.firebaseio.com",
  projectId: "practiceimageupload",
  storageBucket: "practiceimageupload.appspot.com",
  messagingSenderId: "509012771687",
  appId: "1:509012771687:web:209c6c53da1c132e0f65c2",
  measurementId: "G-FR0GH33HZS"
};

const app = initializeApp(firebaseConfig);

const imageDb = getStorage(app);

export default imageDb;