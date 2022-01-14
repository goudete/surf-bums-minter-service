const express = require('express');

const app = express();
const port = 3000;


app.get('/', (req, res) => {
   res.send('Surf Bums Minter Initialized...')
});

app.get('/mintPlatinumCharacter', require('./handlers/mintPlatinumCharacter'));
app.get('/mintSilverCharacter', require('./handlers/mintSilverCharacter'));

app.listen(port, () => {
   console.log(`Listening at http://localhost:${port}`);
});
