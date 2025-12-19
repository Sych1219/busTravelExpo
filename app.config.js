require('dotenv/config');

const appJson = require('./app.json');

module.exports = {
  expo: {
    ...appJson.expo,
    extra: {
      ...(appJson.expo.extra || {}),
      googleApiKey: process.env.GOOGLE_API_KEY || '',
    },
  },
};
