export interface IExpense {
    total: number,
    currency: string,
    type: string,
    where: string,
    datetime: Date,
    description: string
}

export default IExpense;
