import { validationResult } from 'express-validator';
import AppError from '../utils/appError.mjs';

function validator(req, _, next) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push(JSON.stringify({ [err.param]: err.msg })))

    next(new AppError(422, extractedErrors))
}

export default validator;