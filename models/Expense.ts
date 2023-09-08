import { Schema, model } from 'mongoose';
import IExpense from './Interface';

export const ExpenseSchema = new Schema({
    total: {
        type: String,
        required: true
    },
    currency: {
        type: String, 
        required: true
    },
    type: {
        type: String, 
        required: true
    },
    where: {
        type: String, 
        required: true
    },
    datetime: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    }
})

const Expense = model<IExpense>('Expense', ExpenseSchema)
export default Expense;