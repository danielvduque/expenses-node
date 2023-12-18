import express from 'express';
import Expense from '../models/Expense';
// import xlsx from 'xlsx';
import IExpense from '../models/Interface';

export default class FileUpload {
    // async addByFile (req: express.Request, res: express.Response) {
    //     const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    //     const sheet = workbook.Sheets[workbook.SheetNames[0]];
    //     const expenses: IExpense[] = xlsx.utils.sheet_to_json(sheet);
      
    //     const promises = expenses.map(async (expense) => {
    //       const expenseToInsert = new Expense({
    //         total: expense.total,
    //         description: expense.description,
    //         where: expense.where,
    //         type: req.params.type.charAt(0).toUpperCase() + req.params.type.slice(1),
    //         currency: 'CLP',
    //         datetime: new Date(expense.datetime),
    //       });
      
    //       return expenseToInsert.save();
    //     });
      
    //     await Promise.all(promises);
    //     return res.status(200).json({ message: `${expenses.length-1} ${req.params.type} expenses inserted successfully.` });
    // }
}