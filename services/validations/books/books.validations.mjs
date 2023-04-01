import { body, param, query } from 'express-validator';

function insertBookValidations() {
    return [
        body('title').trim().isLength({ min: 2, max: 100 }).withMessage('title length required is [2, 100]').isAlphanumeric('en-US', { ignore: ' .,:;()"\'/!?&%-_=+|~@' }).withMessage('Invalid character in title').escape().withMessage('Invalid title'),
        body('author').isArray({ min: 1, max: 20 }).withMessage('author length required is [1, 20]'),
        body('author.*').trim().isLength({ min: 1, max: 50 }).withMessage('Author name length required is [1, 50]').isAlphanumeric('en-US', { ignore: ' ,.()_-@\'' }).withMessage('Invalid character in author name').escape().withMessage('Invalid author name'),
        body('description').trim().isLength({ min: 5, max: 300 }).withMessage('description length required is [5, 300]').escape().withMessage('Invalid description'),
        body('publishedDate').trim().isDate().withMessage('Invalid published date (YYYY-MM-DD)'),
    ]
}

function idParamValidations() {
    return [
        param('_id').trim().escape().isMongoId().withMessage('Invalid id passed'),
    ]
}

function getBooksValidations() {
    return [
        query('page').optional().trim().escape().isInt({ min: 1 }).withMessage('Invalid page number'),
        query('limit').optional().trim().escape().isInt({ min: 1, max: 100 }).withMessage('Invalid limit number'),
        query('q').optional().trim().escape().isLength({ min: 1, max: 100 }).withMessage('Invalid search query'),
        query('date').optional().trim().isDate().withMessage('Invalid date'),
        query('sort_order').optional().trim().escape().isIn(['asc', 'desc']).withMessage('Invalid sort order (asc, desc)'),
        query('deleted').optional().trim().escape().isBoolean().withMessage('Invalid deleted query value (true)'),
        query('group').optional().trim().escape().withMessage('Invalid group query value (true)'),
    ]
}

export {
    insertBookValidations,
    idParamValidations,
    getBooksValidations,
}