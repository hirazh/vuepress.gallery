require('dotenv').config()
const fs = require('fs');
const yaml = require('js-yaml');
const firebase = require('firebase');

var config = {
  apiKey: process.env.API_KEY,
  authDomain: "vuepressgallery.firebaseapp.com",
  databaseURL: "https://vuepressgallery.firebaseio.com",
  projectId: "vuepressgallery",
  storageBucket: "vuepressgallery.appspot.com",
  messagingSenderId: "125790916337"
};
firebase.initializeApp(config);

const db = firebase.firestore();
var themesRef = db.collection('themes');

async function createThemeFiles() {
  const snapshot = await themesRef.get()

  return snapshot.forEach(data => {
    const theme = data.data();
    const fileName = theme.title.replace(/[\s_]+/g, '-').toLowerCase();
    const filePath = 'gallery/gallery/' + fileName + '.md';
    const fileContent = '---\n' + yaml.safeDump(theme) + '---';
    try {
      fs.writeFileSync(filePath, fileContent, { flag: 'wx' })
      console.log('file written for ' + theme.title)
    } catch(e) {
      console.log('The file already exists')
    }
  })
}

const run = async () => {
  await createThemeFiles();
  process.exit();
}

run()
