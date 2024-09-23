const router = require('express').Router();
const helloRoutes = require('./hello');
const todosRoutes = require('./todos');

router.use('/hello', helloRoutes);

router.use('/todos', todosRoutes);

module.exports = router;
