const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const firebaseAdmin = require('firebase-admin');
const { getFirestore, collection } = require('firebase/firestore');
const firebaseConfig = {
  apiKey: 'AIzaSyB_fnyINGmhzldtb-KQoZG0Cr3dTazW7vU',
  authDomain: 'testapp-f44d4.firebaseapp.com',
  projectId: 'testapp-f44d4',
  databaseURL: 'https://testapp-f44d4.firebaseio.com',
  storageBucket: 'testapp-f44d4.appspot.com',
  messagingSenderId: '318748543005',
  appId: '1:318748543005:web:f2a3fd3ab6c97f8f3b5ef4',
  measurementId: 'G-ZXXQ9GR847',
};
let _app;
let _admin;

const initDb = (callback) => {
  if (_app) {
    console.log('Db is already initialized!');
    return callback(null, _app);
  }
  try {
    _app = initializeApp(firebaseConfig);
    _admin = firebaseAdmin.initializeApp(firebaseConfig).auth();
    callback(null, _app);
  } catch (err) {
    callback(err);
  }
};

const getFbapp = () => {
  if (!_app) {
    throw Error('Database not initialize!');
  }
  return getAuth(_app);
};
const getFbAuth = () => {
  if (!_app) {
    throw Error('Database not initialize!');
  }
  return getAuth(_app);
};
const getFbAdminAuth = () => {
  if (!_app) {
    throw Error("Database not initialize!");
  }
  return _admin;
};
const getFbStore = () => {
  if (!_app) {
    throw Error('Database not initialize!');
  }
  return getFirestore(_app);
};
const getCollections = (collectionName) => {
  if (!_app) {
    throw Error('Database not initialize!');
  }
  return collection(getFbStore(), collectionName);
};

module.exports = {
  initDb,
  getFbapp,
  getFbAuth,
  getFbAdminAuth,
  getCollections,
};
