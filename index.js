const http = require('http');
const express = require('express');
const routes = require('./routes');
const app = express();
const PORT = 3000;

routes(app)

app.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT);
    console.log('http://localhost:'+PORT);
});
