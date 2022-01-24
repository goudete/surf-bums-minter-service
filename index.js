const express = require('express');

const app = express();
const port = 3000;


app.get('/', (req, res) => {
   res.send('welcome to the minter engine...')
});

app.get('/mintCharacter', require('./handlers/mintCharacter'));


app.listen(port, () => {
   console.log(`minter listening at http://localhost:${port}`);
});
