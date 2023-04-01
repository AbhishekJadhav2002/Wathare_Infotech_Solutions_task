import moment from 'moment/moment.js';
import Book from '../../models/books/books.models.mjs';
import AppError from '../../utils/appError.mjs';

const limit_ = 3

async function getBooks(req, res, next) {
    try {
        const { page: _page, limit: _limit, q, date, group, sort_order, deleted } = req.query
        let aggregate_options = []

        //PAGINATION
        let page = parseInt(_page) || 1
        let limit = parseInt(_limit) || limit_

        const options = {
            page, limit,
            collation: { locale: 'en' },
            select: 'title author description publishedDate',
            customLabels: {
                totalDocs: 'totalBooks',
                docs: 'books'
            }
        }

        //FILTERING AND PARTIAL TEXT SEARCH -- FIRST STAGE
        let match = {}

        //filter by deletedAt
        match.deletedAt = deleted ? { $exists: true } : { $ne: '' }

        //filter by name - use $regex in mongodb - add the 'i' flag if you want the search to be case insensitive.
        if (q) match['$or'] = [{ title: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }, { author: { $regex: q, $options: 'i' } }]

        //filter by date
        if (date) {
            let d = moment(date)
            let next_day = moment(d).add(1, 'days') // add 1 day

            match.createdAt = { $gte: new Date(d), $lt: new Date(next_day) }
        }

        aggregate_options.push({ $match: match })

        //GROUPING -- SECOND STAGE
        if (group !== 'false' && parseInt(group) !== 0) {
            let group = {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, // Group By Expression
                data: { $push: '$$ROOT' }
            }

            aggregate_options.push({ $group: group })
        }

        //SORTING -- THIRD STAGE
        let sortOrder = sort_order && sort_order === 'desc' ? -1 : 1
        aggregate_options.push({ $sort: { createdAt: sortOrder } })

        const myAggregate = Book.aggregate(aggregate_options)
        const books = await Book.aggregatePaginate(myAggregate, options)
        return res.status(200).json(books)
    } catch (error) { next(error) }
}

async function createBook(req, res, next) {
    try {
        const { title, author, description, publishedDate } = req.body
        const { _id } = req.user
        await Book.create({ title, author, description, publishedDate, createdBy: _id })
        return res.status(201).end()
    } catch (error) { next(error) }
}

async function getBook(req, res, next) {
    try {
        const { _id } = req.params
        const book = await Book.findById(_id, 'title author description publishedDate')
        if (!book) throw new AppError(404, 'Book not found')
        if (book.deletedAt) throw new AppError(404, 'Book not found')
        return res.status(200).json(book)
    } catch (error) { next(error) }
}

async function updateBook(req, res, next) {
    try {
        const { _id } = req.params
        const book = await Book.findById(_id)
        if (!book) throw new AppError(404, 'Book not found')
        if (req.user._id !== book.createdBy.toString()) throw new AppError(403, 'You are not allowed to update this book')
        if (book.deletedAt) throw new AppError(404, 'Book not found')
        const { title, author, description, publishedDate } = req.body
        await Book.updateOne({ _id: book._id }, { title, author, description, publishedDate })
        return res.status(200).end()
    } catch (error) { next(error) }
}

async function deleteBook(req, res, next) {
    try {
        const { _id } = req.params
        const book = await Book.findById(_id)
        if (!book) throw new AppError(404, 'Book not found')
        if (book.deletedAt) throw new AppError(404, 'Book not found')
        if (req.user._id !== book.createdBy.toString()) throw new AppError(403, 'You are not allowed to delete this book')
        await Book.updateOne({ _id: book._id }, { deletedAt: Date.now() })
        return res.status(200).end()
    } catch (error) { next(error) }
}

export {
    getBooks,
    createBook,
    getBook,
    updateBook,
    deleteBook,
}