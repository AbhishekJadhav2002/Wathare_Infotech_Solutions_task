import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
const Types = mongoose.Schema.Types;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: [String],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    publishedDate: {
        type: Date,
        required: true,
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true })

bookSchema.index({ title: 'text', description: 'text', author: 'text' })

bookSchema.plugin(mongooseAggregatePaginate)

export default mongoose.model('Book', bookSchema);