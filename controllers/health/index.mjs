import AppError from '../../utils/appError.mjs';

function healthCheck(req, res) {
    res.status(200).send(`Hello, ${req.hostname}!`)
}

function globalErrorHandler(err, _, res, __) {
    if (!(err instanceof Object)) {
        err = new Error(err)
    }
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message || err.toString(),
        stack: err.stack,
        data: null
    })
}

function undefinedRouteHandler(req, _) {
    throw new AppError(404, `Route ${req.method} ${req.originalUrl} not found`)
}

export {
    healthCheck,
    globalErrorHandler,
    undefinedRouteHandler,
}