import express from 'express';
const router = express.Router();
import Expense from '../models/Expense';
import multer from 'multer';
import Validations from '../utils/validations';
import { ExpensesModifications } from '../services/ExpensesModifications';
import GetInformation from '../services/GetInformation';
import FileUpload from '../services/FileUpload';

const validations = new Validations();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const modifications = new ExpensesModifications();
const getEndpoints = new GetInformation();
const fileUpload = new FileUpload();

// validations
const postValidations = validations.post();
const putValidations = validations.put()
const deleteValidations = validations.delete()

router.get('/expenses', async (req: express.Request, res: express.Response) => {
  const expenses = await Expense.find().sort({ _id: -1 }).limit(12);
  return res.status(200).json(expenses);
});

router.post('/expenses', postValidations, (req: express.Request, res: express.Response) => {
  validations.validateMissingData(req, res);
  return modifications.newExpense(req,res);
});

router.put('/expenses', putValidations, (req: express.Request, res: express.Response) => {
  validations.validateMissingData(req, res);
  return modifications.updateExpense(req,res);
});

router.delete('/expenses', deleteValidations, (req: express.Request, res: express.Response) => {
  validations.validateMissingData(req, res);
  return modifications.deleteExpense(req,res);
});

router.get('/expenses/week', (req: express.Request, res: express.Response) => {
  return getEndpoints.getWeekExpenses(res);
});

router.get('/expenses/month/:currency', (req: express.Request, res: express.Response) => {
  return getEndpoints.getMonthByCurrency(req, res);
});

router.get('/expenses/daily', (req: express.Request, res: express.Response) => {
  return getEndpoints.getDailyExpenses(res);
});

// router.post('/expenses/upload/:type', upload.single('file'), (req: express.Request, res: express.Response) => {
//   return fileUpload.addByFile(req, res);
// });

module.exports = router;