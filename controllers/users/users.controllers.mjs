import User from '../../models/users/users.models.mjs';
import AppError from '../../utils/appError.mjs';
import { createToken } from '../../utils/hashing.mjs';

async function createUser(req, res, next) {
    try {
        const { name, email, password, permissionLevel, avatar } = req.body
        const user = await User.findOne({ email })
        if (user && user.deletedAt) {
            await User.updateOne({ _id: user._id }, { $set: { name, password, permissionLevel, avatar, deletedAt: null } })
        } else if (user && user.deletedAt === null) {
            throw new AppError(400, 'User already exists')
        } else {
            await User.create({ name, email, password, permissionLevel, avatar })
        }
        return res.status(201).end()
    } catch (error) { next(error) }
}

async function getUsers(req, res, next) {
    try {
        const { deleted } = req.query
        const users = await User.find(deleted ? {} : { deletedAt: null }, 'name email permissionLevel avatar')
        return res.status(200).json(users)
    } catch (error) { next(error) }
}

async function getUser(req, res, next) {
    try {
        const { _id } = req.params
        const user = await User.findById(_id)
        if (!user) throw new AppError(404, 'User not found')
        const { email, name, permissionLevel, avatar } = user
        return res.status(200).json({ email, name, permissionLevel, avatar })
    } catch (error) { next(error) }
}

async function updateUser(req, res, next) {
    try {
        const { _id } = req.params
        const { name, password, permissionLevel, avatar } = req.body
        const user = await User.findById(_id)
        if (user) {
            await User.updateOne({ _id }, { name, password, permissionLevel, avatar })
        } else if (!user) throw new AppError(404, 'User not found')
        return res.status(200).end()
    } catch (error) { next(error) }
}

async function deleteUser(req, res, next) {
    try {
        const { _id } = req.params
        const user = await User.findById(_id)
        if (user) {
            await User.updateOne({ _id }, { deletedAt: Date.now() })
        } else if (!user) throw new AppError(404, 'User not found')
        req.session.destroy((err) => { if (err) throw new AppError(500, 'Error destroying session') })
        return res.status(200).end()
    } catch (error) { next(error) }
}

async function loginUser(req, res, next) {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) throw new AppError(404, 'User not found')
        const passwordMatch = await user.comparePassword(password)
        if (passwordMatch) {
            req.user = { _id: user._id, email: user.email, name: user.name, permissionLevel: user.permissionLevel }
            req.session.token = await createToken({ _id: user._id })
            return res.status(200).end()
        } else throw new AppError(401, 'Invalid credentials')
    } catch (error) { next(error) }
}

export {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    loginUser,
}