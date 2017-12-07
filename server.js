/* Attempt to make a spreadsheet thing */

const express = require("express");
const app = express();

app.use(express.static("www"));

app.get('/help', (req, res) => {
  res.send(`boo
hoo
hoo`);
});

app.listen(3000, () => console.log('sheets now listening on port 3000'));

// server.js ends here
