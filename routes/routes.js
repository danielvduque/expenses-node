const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Expense = require('../models/Expense');

router.get('/expenses', async (req, res) => {
  const expenses = await Expense.find().sort({created_at: -1}).limit(10);
  res.status(200).json(expenses);
});

const postValidations = [
  check('total').notEmpty().withMessage('Total is required').isNumeric().withMessage('Must be number'),
  check('currency').notEmpty().withMessage('Currency is required').isString().withMessage('Must be one a three letters code: CLP, USD, EUR'),
  check('type').notEmpty().withMessage('Type is required').isString().withMessage('type must be string'),
  check('where').notEmpty().withMessage('Where is required').isString().withMessage('Where must be string'),
  check('datetime').notEmpty().withMessage('Datetime is required').isDate().withMessage('Datetime is a date'),
  check('description').notEmpty().withMessage('Description is required').isString().withMessage('Description must be string'),
];
router.post('/expenses', postValidations, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(errors);
  }

  const { total, currency, type, where, datetime, description } = req.body;
  let newExpense = new Expense();
  newExpense.total = total;
  newExpense.currency = currency;
  newExpense.type = type;
  newExpense.where = where;
  newExpense.datetime = datetime;
  newExpense.description = description;
  await newExpense.save((err, exp) => {
    if (err) {
      console.log(err);
      res.status(400).json({
        message: 'Error saving a new expense',
        description: err
      });
    }

    res.status(200).json({
      message: 'Expense data registered successfully',
      id: exp._id,
      datetime: exp.datetime
    });
  });
});

const putValidations = [
  check('id').notEmpty().withMessage('ID is required').isLength({ min: 24, max:24 }).withMessage('id must be a 24 string length')
];
router.put('/expenses', putValidations, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(errors);
  }

  let dataToUpdate = {};
  const indexes = Object.keys(req.body);
  indexes.forEach((ind) => {
    dataToUpdate[ind] = req.body[ind];
  });
  console.log('Data to update ', dataToUpdate);

  try {
    const expense = await Expense.findByIdAndUpdate(req.body.id, dataToUpdate);
    let message = expense ? 'Updated successfully' : 'Something happened. please verify';
    res.status(200).json({
      id: req.body.id,
      message
    }); 
  }catch (e){
    console.error(e);
    res.status(500).json(e);
  }
});

const deleteValidations = [
  check('id').notEmpty().withMessage('ID is required').isLength({ min: 24, max:24 }).withMessage('id must be a 24 string length')
];
router.delete('/expenses', deleteValidations, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(errors);
  }

  try {
    const expense = await Expense.findOneAndRemove({_id: req.body.id});
    await expense.delete();
    let message = expense ? 'Deleted successfully' : 'Something happened. please verify';
    res.status(200).json({
      id: req.body.id,
      message
    }); 
  }catch (e){
    console.error(e);
    res.status(500).json({error: e});
  }
});

router.get('/expenses/week', async (req, res) => {
  // Get the current date and last week's date
  const currentDate = new Date();
  const lastWeekDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  // Find all expenses from the last week
  const lastWeekExpenses = await Expense.find({
    'date': {
      $gte: lastWeekDate,
      $lt: currentDate
    }
  }).toArray();

  // Summarize the data
  let totalExpenses = 0;
  let totalByCurrency = {};
  let totalByExpenseType = {};
  let totalByWhere = {};
  lastWeekExpenses.forEach((expense) => {
    totalExpenses += expense.total;
    !totalByCurrency[expense.currency] ? totalByCurrency[expense.currency] += expense.currency : 0;
    !totalByExpenseType[expense.expenseType] ? totalByExpenseType[expense.expenseType] += expense.expenseType : 0;
    !totalByWhere[expense.where] ? totalByWhere[expense.where] += expense.where : 0;
  });
  
  // Create the JSON response
  const response = {
    totalExpenses,
    totalByCurrency,
    totalByExpenseType,
    totalByWhere
  };
  
  // Send the JSON response
  res.json(response);
});

router.get('/expenses/month', (req, res) => {
});

router.get('/expenses/top', (req, res) => {
});

router.get('/expenses/most', async (req, res) => {
  const mostExpensedPlace = await Expense.aggregate([
    {
      $group: {
        _id: '$where',
        total: { $sum: '$total' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { total: -1 }
    },
    {
      $limit: 1
    }
  ]).toArray();
  // Send the JSON response
  res.json({place: mostExpensedPlace[0]._id, total: mostExpensedPlace[0].total});
});


module.exports = router;