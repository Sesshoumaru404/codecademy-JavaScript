const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

module.exports = app;

const PORT = process.env.PORT || 4000;

// Add middware for parsing request bodies here:
app.use(bodyParser.json());

// Logging Middleware
if (!process.env.IS_TEST_ENV) {
  app.use(morgan('dev'));
}

// Mount your existing apiRouter below at the '/api' path.
const artistRouter = require('./server/artist');
const seriesRouter = require('./server/series');

app.use('/api/artists', artistRouter);

app.use('/api/series', seriesRouter);


// This conditional is here for testing purposes:
if (!module.parent) { 
//   // Add your code to start the server listening at PORT below:
//
  	app.listen(PORT, () => {
 	 console.log(`Server is listening on port ${PORT}`);
 	});
}
