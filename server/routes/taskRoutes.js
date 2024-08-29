const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Criar uma nova tarefa
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  const task = new Task({ title, description });
  await task.save();
  res.json(task);
});

// Obter todas as tarefas
router.get('/', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Atualizar uma tarefa
router.put('/:id', async (req, res) => {
  const { title, description, completed } = req.body;
  const task = await Task.findByIdAndUpdate(req.params.id, {
    title,
    description,
    completed,
  }, { new: true });
  res.json(task);
});

// Atualizar status de conclusão
router.patch('/:id/completed', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, {
    completed: req.body.completed,
  }, { new: true });
  res.json(task);
});

// Deletar uma tarefa
router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Tarefa deletada' });
});

module.exports = router;
