const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Expense = require('../models/Expense')

router.get('/expenses', (req, res) => {
  res.status(200).json({
    message: "message"
  });
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
        message: "Error saving a new expense",
        description: err
      });
    }

    res.status(200).json({
      message: "Expense data registered successfully",
      id: exp._id,
      datetime: exp.datetime
    });
  });
});

router.get('/expenses/month', (req, res) => {
});

router.get('/expenses/week', (req, res) => {
});

router.get('/expenses/top', (req, res) => {
});



module.exports = router;