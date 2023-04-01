import { Router } from 'express';
import { getBooks, createBook, getBook, updateBook, deleteBook } from '../../controllers/index.mjs';
import { auth, validator } from '../../middlewares/index.mjs';
import { insertBookValidations, idParamValidations } from '../../services/validations/index.mjs';

const booksRouter = Router()
const bookRouter = Router()

function booksRoutes() {
    booksRouter.get('/', getBooks)

    bookRouter.use(auth)
    bookRouter.post('/', insertBookValidations(), validator, createBook)

    bookRouter.route('/:_id')
        .all(idParamValidations(), validator)
        .get(getBook)
        .put(insertBookValidations(), validator, updateBook)
        .delete(deleteBook)


    return {
        booksRouter,
        bookRouter,
    }
}

export default booksRoutes;