const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');


const PORT = process.env.PORT || 4000;

// Add middware for parsing request bodies here:
app.use(bodyParser.json());

// Add CORS 
app.use(cors());

// Mount your existing apiRouter below at the '/api' path.
const employeesRouter = require('./api/employees');
const menusRouter = require('./api/menus');

app.use('/api/employees', employeesRouter);
app.use('/api/menus', menusRouter);

// Add Error Handing
app.use(errorhandler());

// Start listening 
app.listen(PORT, () => {
 console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
