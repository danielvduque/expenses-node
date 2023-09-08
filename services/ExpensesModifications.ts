import express from 'express';
import Expense from '../models/Expense';
import CONSTANTS from '../utils/constants';

export default class ExpensesModifications {
    async newExpense(req: express.Request, res: express.Response) {
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
            return res.status(CONSTANTS.statusBadRequest).json({
              message: 'Error saving a new expense',
              description: err
            });
          }
      
          return res.status(CONSTANTS.statusOk).json({
            message: 'Expense data registered successfully',
            id: exp._id,
            datetime: exp.datetime
          });
        });
    }

    async updateExpense(req: express.Request, res: express.Response) {
      try {
        const expense = await Expense.findByIdAndUpdate(req.body.id, req.body);
        let message = expense ? 'Updated successfully' : 'Something happened. please verify';
        return res.status(200).json({
          id: req.body.id,
          message
        });
      } catch (e) {
        console.error(e);
        return res.status(500).json(e);
      }
    }

    async deleteExpense(req: express.Request, res: express.Response) {
      try {
        const expense = await Expense.findOneAndRemove({ _id: req.body.id });
        await expense.delete();
        let message = expense ? 'Deleted successfully' : 'Something happened. please verify';
        return res.status(200).json({
          id: req.body.id,
          message
        });
      } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e });
      }
    }
}