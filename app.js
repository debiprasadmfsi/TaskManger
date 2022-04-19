const express = require('express');
const morgan = require('morgan');
const app = express();
const AppError = require('./utils/appError');
const cors = require('cors');
const globalErrorHandler = require('./controllers/errorController');
const usersRoute = require('./routers/user');
const listsRoute = require('./routers/list');
const taskRoute = require('./routers/task');
app.use(express.json());
app.use(cors());
app.options('*',cors());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

app.use('/api/v1/users',usersRoute);
app.use('/api/v1/lists',listsRoute);
app.use('/api/v1/tasks',taskRoute);



app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports =app;