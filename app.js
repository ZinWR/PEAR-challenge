const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const routes = require('./server/routes');
const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '50mb' })); 
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' })); 

// Serve static files from the client app
app.use(express.static(path.join(__dirname, './client/dist')));

// api routes
app.use(routes);

// serve client routes as fall back
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
