const path = require('path')
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const { graphqlHTTP } = require('express-graphql');

const qraphqlSchema = require('./graphql/schema');
const qraphqlResolver = require('./graphql/resolvers');
const Auth = require('./middleware/auth');

dotenv.config();

const app = express();
app.use(helmet({ contentSecurityPolicy: (process.env.NODE_ENV === 'production') ? undefined : false }));
app.use(compression());
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

// upload image 
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        // for windows .replace(/:/g, '-')
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

app.use(Auth);
app.use('/graphql', graphqlHTTP({
    schema: qraphqlSchema,
    rootValue: qraphqlResolver,
    graphiql: true,
    customFormatErrorFn(err) {
        if (err.originalError) {
            return ({
                message: err.originalError.message || "Oops! an error occured",
                code: err.originalError.code || 500,
                data: err.originalError.data
            })
        }
        return err
    }
}));

mongoose
    .connect(MONGO_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => {
        console.log("connected to db");
        app.listen(PORT, err => {
            if (!err) console.log(`start new server on port ${PORT}`);
        });
    })
    .catch(err => {
        console.log(err);
        next(new Error(err));
    });
