const express = require('express');

const app = express();

app.use('/', express.static(__dirname + '/build'));

app.listen(process.env.PORT || 8081, () => {console.log(`Your app is listening on port 8081`);})