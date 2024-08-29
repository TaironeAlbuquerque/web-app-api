const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

// Criar tarefa
router.post('/', async (req, res) => {
  const { title } = req.body;
  try {
    const task = await Task.create({ title, user: req.userId });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
});

// Listar tarefas
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar tarefas' });
  }
});

// Editar tarefa
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(id, { title, completed }, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao editar tarefa' });
  }
});

// Deletar tarefa
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.json({ message: 'Tarefa deletada' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
});

module.exports = router;
