const validator = require("validator");
const User = require("../../models/user");

module.exports = {
    nameValidator: (req, res, next) => {
        try {
            let { body, } = req;
            let { name, } = body;
            if (name !== undefined && name !== null && name !== "") {
                req.body.name = validator.trim(validator.blacklist(name, `<>&"/'`));
                return next();
            }

            req.body.name = "";
            return next();
        } catch (err) {
            console.error("Error while validating name: %o", err);
            return next(err);
        }
    },

    credentialValidator: async (req, res, next) => {
        try {
            let { body, } = req;
            let { email, password, } = body;
            if (email) {
                email = validator.trim(validator.blacklist(email, `<>&"/' `));
                if (validator.isEmail(email)) {
                    req.body.email = validator.normalizeEmail(email);
                } else {
                    const err = new Error("Invalid email");
                    err.statusCode = 400;
                    return next(err);
                }
            } else {
                const err = new Error("Email is required");
                err.statusCode = 400;
                return next(err);
            }

            if (password) {
                password = validator.trim(validator.blacklist(password, `<>&'"/`));
                if (!validator.isLength(password, { min: 8 })) {
                    const err = new Error("Password must be at least 8 characters long");
                    err.statusCode = 400;
                    return next(err);
                }
                req.body.password = password;
            } else {
                const err = new Error("Password is required");
                err.statusCode = 400;
                return next(err);
            }

            return next();
        } catch (err) {
            console.error("Error while validating credentials: %o", err);
            return next(err);
        }
    },

    emailExists: async (req, res, next) => {
        try {
            let { body, } = req;
            let { email, } = body;
            if (await User.exists({ email: email }) !== null) {
                const err = new Error("Email already exists");
                err.statusCode = 400;
                return next(err);
            }
            return next();
        } catch (err) {
            console.error("Error while validating email exists: %o", err);
            return next(err);
        }
    },
};