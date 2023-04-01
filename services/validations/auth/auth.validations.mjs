import { body } from 'express-validator';

function loginValidations() {
    return [
        body('email').trim().escape().isEmail().normalizeEmail({ gmail_remove_dots: false }).withMessage('Invalid email'),
        body('password').trim().escape().isLength({ min: 8, max: 50 }).withMessage('Password length required is [8, 50]'),
    ]
}

export {
    loginValidations,
}