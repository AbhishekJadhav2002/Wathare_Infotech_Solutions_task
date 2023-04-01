import crypto from 'node:crypto';
import AppError from './appError.mjs';
import jwt from 'jsonwebtoken';

function createHash(text, _salt) {
    try {
        const salt = _salt || crypto.randomBytes(16).toString("hex")
        const hash = crypto.pbkdf2Sync(text, salt, 10, 32, "sha512").toString("hex")
        return [salt, hash]
    } catch (error) {
        throw new AppError(500, 'Error while encrypting data')
    }
}

async function createToken(payload) {
    try {
        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
        return token
    } catch (error) {
        throw new AppError(500, 'Error while creating token')
    }
}

async function verifyToken(token) {
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        return decoded
    } catch (error) {
        throw new AppError(500, 'Error while verifying token')
    }
}

export {
    createHash,
    createToken,
    verifyToken,
}