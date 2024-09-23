const router = require('express').Router();
const { readDB, writeDB } = require('../../../services/dbHelpers');

router.get('/', (req, res) => {
  const todos = readDB();
  res.status(200).json(todos);
});

router.post('/', (req, res) => {
  const todos = readDB();
  const newTodo = req.body;
  todos.push(newTodo);
  writeDB(todos);
  res.status(200).json(newTodo);
});

// Update a sub-todo
router.put('/:id', (req, res) => {
  const todos = readDB();
  const updatedTodo = req.body;
  const todoIndex = todos.findIndex((todo) => todo.id === parseInt(req.params.id));
  
  if (todoIndex > -1) {
    todos[todoIndex] = updatedTodo;
    writeDB(todos);
    res.status(200).json(updatedTodo);
  } else {
    res.status(404).send('Todo not found');
  }
});

module.exports = router;
