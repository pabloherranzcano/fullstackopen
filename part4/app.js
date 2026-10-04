const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const BlogRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

app.use(cors())
app.use(express.json())

app.use('/api/blogs', BlogRouter)

app.use(middleware.errorHandler);
module.exports = app;