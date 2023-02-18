const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRY, } = process.env;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
var jwtopts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
};

module.exports = {
    passjwt: new JwtStrategy(jwtopts, function (jwt_payload, done) {
        User.findOne({ _id: jwt_payload.data }, "name email createdAt updatedAt", function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }),

    protect: async (req, res, next) => {
        try {
            passport.authenticate("jwt", { session: false }, (err, user) => {
                if (err) return next(err);
                if (user) {
                    req.user = user;
                    return next();
                } else {
                    const err = new Error("Invalid token");
                    err.statusCode = 401;
                    return next(err);
                }
            })(req, res, next);
        } catch (err) {
            console.error("Failed to log in user because: %o", err);
            return next(err);
        }

    },

    //sign up
    signUp: async (req, res, next) => {
        try {
            const { password, name, email, } = req.body; // get the text contents

            let newUser = new User({
                name,
                email,
            });
            User.register(newUser, password, (err, user) => {
                if (err) {
                    console.error("Failed to create and retrieve user account because: %o", err);
                    return next(err);
                }

                return res.status(201).json({ error: false, message: "success", data: user });
            });
        } catch (err) {
            console.error("Failed to create user account because: %o", err);
            return next(err);
        }
    },

    //sign in
    logIn: async (req, res, next) => {
        try {
            passport.authenticate("local", (err, user, info) => {
                if (err) return next(err);

                if (!user) {
                    const err = new Error("Invalid details");
                    err.statusCode = 400;
                    return next(err);
                }

                console.log("user obj is %o", user);

                jwt.sign({
                    data: user._id,
                    exp: Math.floor(Date.now() / 1000) + parseInt(JWT_EXPIRY)
                }, JWT_SECRET, (err, token) => {
                    
                    if (err) return next(err);

                    return res.status(200).json({ error: false, message: "success", data: { user, token, } });
                });
            })(req, res, next);
        } catch (err) {
            console.error("Failed to log in user because: %o", err);
            return next(err);
        }
    },
};