import { body } from 'express-validator';

function insertUserValidations() {
    return [
        body('name').trim().escape().isLength({ min: 2, max: 50 }).withMessage('Name length required is [2, 50]').isAlphanumeric('en-US', { ignore: ' @,-_.()\'' }).withMessage('Name is required'),
        body('email').trim().escape().isEmail().normalizeEmail({ gmail_remove_dots: false }).withMessage('Invalid email'),
        body('password').trim().escape().isLength({ min: 8, max: 50 }).withMessage('Password length required is [8, 50]'),
        //body('permissionLevel').trim().escape().isInt({ min: 1, max: 20 }).withMessage('Invalid permission level'),
        //body('avatar').trim().escape().isURL().withMessage('Invalid avatar url'),
    ]
}

export {
    insertUserValidations,
}
