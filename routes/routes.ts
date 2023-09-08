import express from 'express';
const router = express.Router();
import Expense from '../models/Expense';
import multer from 'multer';
import xlsx from 'xlsx';
import Validations from '../utils/validations';
import { validationResult } from 'express-validator';
import IExpense from '../models/Interface';
import Modifications from '../services/ExpensesModifications';
import CONSTANTS from '../utils/constants';

const validations = new Validations();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const modifications = new Modifications();

const validateMissingData = (req: express.Request, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(CONSTANTS.statusBadRequest).send(errors);
  }
}

router.get('/expenses', async (res: express.Response) => {
  const expenses = await Expense.find().sort({ created_at: -1 }).limit(10);
  res.status(200).json(expenses);
});

const postValidations = validations.post();
router.post('/expenses', postValidations, async (req: express.Request, res: express.Response) => {
  validateMissingData(req, res);
  return modifications.newExpense(req,res);
});

const putValidations = validations.put()
router.put('/expenses', putValidations, async (req: express.Request, res: express.Response) => {
  validateMissingData(req, res);
  return modifications.updateExpense(req,res);
});

const deleteValidations = validations.delete()
router.delete('/expenses', deleteValidations, async (req: express.Request, res: express.Response) => {
  validateMissingData(req, res);
  return modifications.deleteExpense(req,res);
});

router.get('/expenses/week', async (req: express.Request, res: express.Response) => {
  // Get the current date and last week's date
  const currentDate = new Date();
  const lastWeekDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Find all expenses from the last week
  const lastWeekExpenses = await Expense.find({
    'datetime': {
      $gte: lastWeekDate,
      $lt: currentDate
    }
  });

  // Summarize the data
  let totalExpenses = 0;
  let totalByCurrency: { [currencies:string]: number };
  let totalByExpenseType: { [types:string]: number };
  let totalByWhere: { [locations:string]: number };
  lastWeekExpenses.forEach((expense) => {
    totalExpenses += expense.total;
    !totalByCurrency[expense.currency] ? totalByCurrency[expense.currency] = expense.total : totalByCurrency[expense.currency] += expense.total;
    !totalByExpenseType[expense.type] ? totalByExpenseType[expense.type] = expense.total : totalByExpenseType[expense.type] += expense.total;
    !totalByWhere[expense.where] ? totalByWhere[expense.where] = expense.total : totalByWhere[expense.where] += expense.total;
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

router.get('/expenses/month/:currency', async (req: express.Request, res: express.Response) => {
  const currentDate = new Date();
  const lastMonthDate = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);

  const lastMonthExpenses = await Expense.find({
    'datetime': {
      $gte: lastMonthDate,
      $lt: currentDate
    },
    'currency': req.params.currency.toUpperCase()
  });

  // Summarize the data
  let totalExpenses = 0;
  let totalByExpenseType: { [x:string]: number };
  let totalByWhere: { [x:string]: number };

  lastMonthExpenses.forEach((expense) => {
    totalExpenses += expense.total;
    !totalByExpenseType[expense.type] ? totalByExpenseType[expense.type] = expense.total : totalByExpenseType[expense.type] += expense.total;
    !totalByWhere[expense.where] ? totalByWhere[expense.where] = expense.total : totalByWhere[expense.where] += expense.total;
  });

  // Create the JSON response
  const response = {
    startDate: lastMonthDate,
    endDate: currentDate,
    totalExpenses,
    totalByExpenseType,
    totalByWhere
  };

  // Send the JSON response
  res.json(response);
});

router.get('/expenses/daily', async (req: express.Request, res: express.Response) => {
  const currentDate = new Date();
  const lastWeekDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

  const lastWeekExpenses = await Expense.find({
    'datetime': {
      $gte: lastWeekDate,
      $lt: currentDate
    }
  });

  // Group expenses by day and currency
  let expensesByDayAndCurrency: { [x:string]: {[z:string]: number} };
  lastWeekExpenses.forEach(expense => {
    const date = new Date(expense.datetime).toDateString();
    const currency = expense.currency;
    if (!expensesByDayAndCurrency[date]) {
      expensesByDayAndCurrency[date] = {};
    }
    if (!expensesByDayAndCurrency[date][currency]) {
      expensesByDayAndCurrency[date][currency] = 0;
    }
    expensesByDayAndCurrency[date][currency] += expense.total;
  });

  // Create the JSON response
  let response: { [x:string]: {[z:string]: number} };
  for (const date in expensesByDayAndCurrency) {
    response[date] = expensesByDayAndCurrency[date];
  }

  // Send the JSON response
  res.json(response);
});

router.post('/expenses/upload/:type', upload.single('file'), async (req: express.Request, res: express.Response) => {
  const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const expenses: IExpense[] = xlsx.utils.sheet_to_json(sheet);

  const promises = expenses.map(async (expense) => {
    const expenseToInsert = new Expense({
      total: expense.total,
      description: expense.description,
      where: expense.where,
      type: req.params.type.charAt(0).toUpperCase() + req.params.type.slice(1),
      currency: 'CLP',
      datetime: new Date(expense.datetime),
    });

    return expenseToInsert.save();
  });

  await Promise.all(promises);
  res.status(200).json({ message: `${expenses.length-1} ${req.params.type} expenses inserted successfully.` });
});

module.exports = router;