import express from 'express';

const app = express();
const hostname = 'localhost';
const port = 1306;

app.get('/', function (req, res) {
  res.send('<h1>Hello World Nodejs AnhDuongDev!</h1>');
});

app.listen(port, hostname, () => {
    console.log(`Hello AnhDuongDev, Server running at http://${hostname}:${port}/`);
    }
);