import { ClientCloud, initMyCloud } from "biqpod/ui/apis";
const myCloud = initMyCloud({
  // cloud config 🥰
});
export const cloud = new ClientCloud("main", myCloud);
export const { nosql: db, auth, storage } = cloud.app;
export const {
  getDoc,
  getDocs,
  collections,
  createDoc,
  upsertDoc: setDoc,
  deleteDoc,
  onCollectionSnapshot,
  onDocSnapshot,
  onAutoSnapshot,
} = myCloud.app.nosql;
export const {
  signIn,
  signOut,
  getUserToken,
  onAuthStateChanged,
  deleteUser,
  signInWithCustomToken,
  getCurrentAuth,
} = myCloud.app.auth;
export const {
  upsertFile: uploadFile,
  deleteFile,
  getDownloadURL,
  getFileContent: getContent,
} = myCloud.app.storage;
