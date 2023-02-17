const { json, urlencoded, } = require("express");
const cors = require("cors");
const passport = require("passport");
const { passjwt, } = require("../controllers/userController");
const User = require("../models/User");

module.exports = (app) => {
    app.use(cors());
    app.options(cors({
        origin: true,
        credentials: true,
        maxAge: 86400
    }));
    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.use(passport.initialize());
    passport.use(User.createStrategy());
    passport.use(passjwt);
    return app;
}