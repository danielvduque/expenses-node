export interface IExpense {
    total: number,
    currency: string,
    type: string,
    where: string,
    datetime: string,
    description: string
}

export default IExpense;
