const mongoose = require("mongoose");
const { MONGO_URI, MONGO_USER, MONGO_PASS, MONGO_DB, } = process.env;

module.exports = () => {
    return mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: MONGO_USER,
        pass: MONGO_PASS,
        dbName: MONGO_DB,
        retryWrites: true,
        w: "majority"
    });
};