const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const routes = require('./routes');
const { setupWebsocket } = require('./websocket');

const app = express();
// Extrair servidor http do express
const server = http.Server(app);

setupWebsocket(server);

// Conexão com o MongoDB Atlas
mongoose.connect('mongodb+srv://omnistack-yves:omnistack@cluster0-phxbl.mongodb.net/week10?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

// CORS
app.use(cors());

// Entender o body da requisição como JSON
app.use(express.json());

// Rotas
app.use(routes);

// Ouve a porta passada no parâmetro
server.listen(3333);