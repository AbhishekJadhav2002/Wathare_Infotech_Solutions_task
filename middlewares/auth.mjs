import User from '../models/users/users.models.mjs';
import AppError from '../utils/appError.mjs';
import { verifyToken } from '../utils/hashing.mjs';

async function auth(req, _, next) {
    try {
        const { token } = req.session
        if (!token) {
            throw new AppError(401, 'Unauthorized')
        }
        const decoded = await verifyToken(token)
        if (!decoded) throw new AppError(401, 'Unauthorized')
        const user = await User.findById(decoded._id, 'name email permissionLevel avatar')
        if (!user) throw new AppError(401, 'Unauthorized')
        if (user.deletedAt) throw new AppError(401, 'Unauthorized')
        if (req.params._id && (req.params._id !== user._id.toString() & user.permissionLevel > 1)) throw new AppError(401, 'Unauthorized')
        req.user = { ...user, _id: user._id.toString() }
        next()
    } catch (error) { next(error) }
}

export default auth;