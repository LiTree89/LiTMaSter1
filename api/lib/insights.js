// App Insights helper for custom event logging
const appInsights = require('applicationinsights');
appInsights.setup(process.env.APP_INSIGHTS_KEY).start();
const client = appInsights.defaultClient;

module.exports = {
  logEvent: (name, properties) => {
    client.trackEvent({ name, properties });
  },
  logException: (error, properties) => {
    client.trackException({ exception: error, properties });
  }
};
