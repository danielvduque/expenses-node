import express from 'express';
import Expense from '../models/Expense';

export default class GetInformation {
    async getWeekExpenses(res: express.Response) {
        const date = new Date();
        const currentDate = date.toISOString();
        const lastWeekDate = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const lastWeekExpenses = await Expense.find({
            datetime: {
                $gte: lastWeekDate,
                $lt: currentDate
            }
        });

        let totalExpenses = 0;
        let totalByCurrency: { [currencies: string]: number } = {}
        let totalByExpenseType: { [types: string]: number } = {}
        let totalByWhere: { [locations: string]: number } = {}
        lastWeekExpenses.forEach((expense) => {
            totalExpenses += expense.total;
            !totalByCurrency[expense.currency] ? totalByCurrency[expense.currency] = expense.total : totalByCurrency[expense.currency] += expense.total;
            !totalByExpenseType[expense.type] ? totalByExpenseType[expense.type] = expense.total : totalByExpenseType[expense.type] += expense.total;
            !totalByWhere[expense.where] ? totalByWhere[expense.where] = expense.total : totalByWhere[expense.where] += expense.total;
        });

        const response = {
            totalExpenses,
            totalByCurrency,
            totalByExpenseType,
            totalByWhere
        };

        return res.json(response);
    }

    async getMonthByCurrency(req: express.Request, res: express.Response) {
        const currentDate = new Date();
        const lastMonthDate = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        const lastMonthExpenses = await Expense.find({
            'datetime': {
                $gte: lastMonthDate,
                $lt: currentDate
            },
            'currency': req.params.currency.toUpperCase()
        });

        let totalExpenses = 0;
        let totalByExpenseType: { [x: string]: number };
        let totalByWhere: { [x: string]: number };

        lastMonthExpenses.forEach((expense) => {
            totalExpenses += expense.total;
            !totalByExpenseType[expense.type] ? totalByExpenseType[expense.type] = expense.total : totalByExpenseType[expense.type] += expense.total;
            !totalByWhere[expense.where] ? totalByWhere[expense.where] = expense.total : totalByWhere[expense.where] += expense.total;
        });

        const response = {
            startDate: lastMonthDate,
            endDate: currentDate,
            totalExpenses,
            totalByExpenseType,
            totalByWhere
        };

        return res.json(response);
    }

    async getDailyExpenses(res: express.Response) {
        const currentDate = new Date();
        const lastWeekDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        const lastWeekExpenses = await Expense.find({
            'datetime': {
                $gte: lastWeekDate,
                $lt: currentDate
            }
        });

        let expensesByDayAndCurrency: { [x: string]: { [z: string]: number } };
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

        let response: { [x: string]: { [z: string]: number } };
        for (const date in expensesByDayAndCurrency) {
            response[date] = expensesByDayAndCurrency[date];
        }

        return res.json(response);
    }
}