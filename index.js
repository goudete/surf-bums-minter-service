const express = require('express');
const res = require('express/lib/response');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
   res.send('Surf Bums Minter Initialized...')
});

app.get('/generatePlatinumCharacter', (req, res) => {
   return res.send('generating platinum character...');
});

app.get('/generateSilverCharacter', (req, res) => {
   return res.send('generating silver character...');
});

app.listen(port, () => {
   console.log(`Listening at http://localhost:${port}`);
});
