import { globalErrorHandler, healthCheck, loginUser, undefinedRouteHandler } from '../controllers/index.mjs';
import usersRoutes from '../routes/users/users.routes.mjs';
import booksRoutes from '../routes/books/books.routes.mjs';
import { loginValidations } from '../services/validations/index.mjs';
import { validator } from '../middlewares/index.mjs';

function connectRouter(server) {
    server.get('/', healthCheck)
    server.post('/login', loginValidations(), validator, loginUser)

    const { usersRouter, userRouter } = usersRoutes()
    server.use('/users', usersRouter)
    server.use('/user', userRouter)

    const { booksRouter, bookRouter } = booksRoutes()
    server.use('/books', booksRouter)
    server.use('/book', bookRouter)

    server.use(undefinedRouteHandler)
    server.use(globalErrorHandler)
    return server
}

export default connectRouter;