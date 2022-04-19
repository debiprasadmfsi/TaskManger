const app = require('./app');
const db = require('./models/dbConfig');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
const port = process.env.PORT || 3000;

db.initDb((err, db) => {
  if (err) {
      console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`App is running on port ${port}...`);
    });
  }
});
