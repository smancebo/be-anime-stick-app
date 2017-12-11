const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const api = require('./api/v1');
const Client = require('./api/db/client');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/api', api);
const port =  process.env.PORT || 4000
app.listen(port, () => {console.log(`service running on port ${port}`)})

