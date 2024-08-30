const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const connectDB = require('./config/db');

const app = express();

// Conectar ao MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Rota principal de tarefas
app.use('/api/tasks', taskRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
