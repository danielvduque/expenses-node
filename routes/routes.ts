import express from 'express';
const router = express.Router();
import Expense from '../models/Expense';
import multer from 'multer';
import Validations from '../utils/validations';
import { validationResult } from 'express-validator';
import Modifications from '../services/ExpensesModifications';
import GetInformation from '../services/GetInformation';
import FileUpload from '../services/FileUpload';
import CONSTANTS from '../utils/constants';

const validations = new Validations();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const modifications = new Modifications();
const getEndpoints = new GetInformation();
const fileUpload = new FileUpload();

const validateMissingData = (req: express.Request, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(CONSTANTS.statusBadRequest).send(errors);
  }
}

router.get('/expenses', async (req: express.Request, res: express.Response) => {
  const expenses = await Expense.find().sort({ _id: -1 }).limit(10);
  return res.status(200).json(expenses);
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
  return getEndpoints.getWeekExpenses(res);
});

router.get('/expenses/month/:currency', async (req: express.Request, res: express.Response) => {
  return getEndpoints.getMonthByCurrency(req, res);
});

router.get('/expenses/daily', async (req: express.Request, res: express.Response) => {
  return getEndpoints.getDailyExpenses(res);
});

router.post('/expenses/upload/:type', upload.single('file'), async (req: express.Request, res: express.Response) => {
  return fileUpload.addByFile(req, res);
});

module.exports = router;