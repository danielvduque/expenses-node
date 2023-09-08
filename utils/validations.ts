import { check } from 'express-validator';
export default class Validations {
    post() {
        return [
            check('total').notEmpty().withMessage('Total is required').isNumeric().withMessage('Must be number'),
            check('currency').notEmpty().withMessage('Currency is required').isString().withMessage('Must be one a three letters code: CLP, USD, EUR'),
            check('type').notEmpty().withMessage('Type is required').isString().withMessage('type must be string'),
            check('where').notEmpty().withMessage('Where is required').isString().withMessage('Where must be string'),
            check('datetime').notEmpty().withMessage('Datetime is required').isDate().withMessage('Datetime is a date'),
            check('description').notEmpty().withMessage('Description is required').isString().withMessage('Description must be string'),
        ];
    }

    put() {
        return [
            check('id').notEmpty().withMessage('ID is required').isLength({ min: 24, max: 24 }).withMessage('id must be a 24 string length')
        ];
    }

    delete() {
        return [
            check('id').notEmpty().withMessage('ID is required').isLength({ min: 24, max: 24 }).withMessage('id must be a 24 string length')
        ];
    }
}