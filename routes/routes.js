const express = require('express');
const router = express.Router();
// const { check, validationResult } = require('express-validator');

router.get('/expenses/month', (req, res) => {
});

router.get('/expenses/week', (req, res) => {
});

router.get('/expenses/top', (req, res) => {
});

router.post('/expenses', async (req, res) => {
    const {satellite} = req.params;
    res.status(200).json({
        message: "message"
    });
}); 

module.exports = router;