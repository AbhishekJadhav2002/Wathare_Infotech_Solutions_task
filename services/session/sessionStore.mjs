import MongoStore from 'connect-mongo';
import session from 'express-session';

function sessionStore() {
    return session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 2 * 60 * 60 * 1000
        },
        store: MongoStore.create({
            mongoUrl: process.env.SESSION_DB_URL,
            autoRemove: 'interval',
            stringify: false,
            autoRemoveInterval: 10,
            crypto: {
                secret: process.env.SESSION_SECRET
            },
        })
    })
}

export default sessionStore;