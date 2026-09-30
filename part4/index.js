const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

logger.info('Connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message);
  });
