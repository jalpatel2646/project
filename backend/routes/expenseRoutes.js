const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, expenseController.getExpenses);
router.post('/', auth, expenseController.addExpense);
router.delete('/:id', auth, expenseController.deleteExpense);
router.get('/analytics', auth, expenseController.getAnalytics);

module.exports = router;
