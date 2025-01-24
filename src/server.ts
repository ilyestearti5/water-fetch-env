import { initMyCloud } from "biqpod/ui/apis";
export const cloud = initMyCloud({
  // cloud config 🥰
});
// this is needed in the project for default informations
cloud.setAsMain();
export const { nosql: db, auth, storage } = cloud.app;
export const {
  getDoc,
  getDocs,
  getCollections,
  createDoc,
  upsertDoc: setDoc,
  deleteDoc,
  onCollectionSnapshot,
  onDocSnapshot,
  onAutoSnapshot,
} = cloud.app.nosql;
export const {
  signIn,
  signOut,
  generateToken,
  onAuthStateChanged,
  deleteUser,
  signInWithCustomToken,
  getCurrentAuth,
} = cloud.app.auth;
export const {
  upsertFile: uploadFile,
  deleteFile,
  getDownloadURL,
  getFileContent: getContent,
} = cloud.app.storage;
