const express = require('express');
const app = express();

app.use('/', require('./routes/opniaoRoutes'));

app.listen(3000);

