require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');

const { NODE_ENV } = require('./config');
const app = express();
const BookmarksService = require('./bookmarks-service');

const morganOption = (NODE_ENV === 'production') ?
  'tiny' :
  'common';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: 'info.log'
    })
  ]
});

if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// set up middleware
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
// app.use(validateBearerToken);


// token validation
// eslint-disable-next-line no-unused-vars
function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({
      error: 'Unauthorized request'
    });
  }
  next();
}


// request handling
app.get('/', (req, res) => {
  res.status(200).send('Hello, world!');
});

app.get('/bookmarks', (req, res) => {
  const db = app.get('db');
  BookmarksService.getAllBookmarks(db)
    .then(bookmarks => {
      return res.status(200).json(bookmarks);
    });
});


app.patch('/bookmarks/:bookmark_id', (req, res) => {
  const db = app.get('db');
  const { bookmark_id  } = req.params;
  const { title, description, url, rating } = req.body;
  const data = {title, description, url, rating };

  console.log('/bookmarks/:bookmark_id')
  // BookmarksService.updateBookmark(db, bookmark_id, data)
  //   .then(bookmarks => {
  //     return res.status(200).json(bookmarks);
  //   });
});

app.get('/bookmarks/:bookmark_id', (req, res) => {
  const { bookmark_id } = req.params;
  const db = app.get('db');

  BookmarksService.getBookmarkByID(db, bookmark_id)
    .then(bookmark => {
      if (!bookmark) {
        logger.error(`Bookmark with id ${bookmark_id} not found.`);
        return res
          .status(404)
          .send('Bookmark Not Found');
      }

      return res.status(200).json(bookmark);

    });
  
});



// error handling
// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  let response;
  if (NODE_ENV === 'production') {
    response = {
      error: {
        message: 'Server error'
      }
    };
  } else {
    response = {
      message: error.message,
      error
    };
  }

  res.status(500).json(response);
};

app.use(errorHandler);



// the bottom line, literally
module.exports = app;