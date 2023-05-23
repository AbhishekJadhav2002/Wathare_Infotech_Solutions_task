import { Router } from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser } from '../../controllers/index.mjs';
import { auth, validator } from '../../middlewares/index.mjs';
import { idParamValidations, insertUserValidations } from '../../services/validations/index.mjs';

const usersRouter = Router()
const userRouter = Router()

function usersRoutes() {
    userRouter.route('/')
        .post(insertUserValidations(), validator, createUser)

    usersRouter.route('/')
        .get(getUsers)

    userRouter.use(auth)
    userRouter.route('/:_id')
        .all(idParamValidations(), validator)
        .get(getUser)
        .put(insertUserValidations(), validator, updateUser)
        .delete(deleteUser)

    return {
        usersRouter,
        userRouter,
    }
}

export default usersRoutes;
