import mongoose, { Schema } from 'mongoose';
import { createHash } from '../../utils/hashing.mjs';

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        immutable: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    permissionLevel: {
        type: Number,
        required: [true, 'Permission level is required'],
    },
    avatar: {
        type: String,
        required: [true, 'Avatar is required'],
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    this.password = await createHash(this.password).join('#')
    next()
})

userSchema.methods.comparePassword = async function (password) {
    const [salt, hash] = this.password.split('#')
    const [newSalt, newHash] = await createHash(password, salt)
    return hash === newHash
}

export default mongoose.model('User', userSchema);