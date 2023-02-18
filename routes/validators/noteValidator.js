const validator = require("validator");
const { ObjectId } = require("mongoose").Types;

module.exports = {
    textValidator: (req, res, next) => {
        try {
            let { body, } = req;
            let { text, } = body;
            if (text === undefined || text === null || text === "") {
                const err = new Error("body text cannot be empty");
                err.statusCode = 400;
                return next(err);
            }

            req.body.text = validator.trim(validator.blacklist(text, `<>&"/'`));

            return next();

        } catch (err) {
            console.error("Error occurred while validating post: %o", err);
            return next(err);
        }
    },

    getValidator: (req, res, next) => {
        try {
            let { params, query, } = req;
            let { page, size, } = query;

            if (params.id !== undefined && params.id !== null && params.id !== "") {
                return this.idValidator(req, res, next);
            }

            delete params.id;

            if (page !== undefined && page !== null && page !== "") {
                let isNumeric = validator.isNumeric(`${page}`);
                if (!isNumeric) {
                    const err = new Error("Page has to be numeric");
                    err.statusCode = 400;
                    return next(err);
                }
                page = parseInt(page);
                if (parseInt(page) < 1) {
                    page = 1;
                }
                req.query.page = page;
            } else {
                req.query.page = 1;
            }

            if (size !== undefined && size !== null && size !== "") {
                let isNumeric = validator.isNumeric(`${size}`);
                if (!isNumeric) {
                    const err = new Error("Size has to be numeric");
                    err.statusCode = 400;
                    return next(err);
                }
                size = parseInt(size);
                if (parseInt(size) < 1) {
                    size = 20;
                }
                req.query.size = size;
            } else {
                req.query.size = 1;
            }

            return next();
        } catch (err) {
            console.error("Error occurred while validating get: %o", err);
            return next(err);
        }
    },

    idValidator: (req, res, next) => {
        try {
            let { params, } = req;

            if (params.id !== undefined && params.id !== null && params.id !== "") {
                params.id = validator.trim(validator.whitelist(params.id, "0-9a-fA-F"));

                if (!validator.isLength(params.id, { min: 24, max: 24 })) {
                    console.error(`Invalid note id: ${params.id}`);
                    const err = new Error("Invalid note id");
                    err.statusCode = 400;
                    return next(err);
                }

                const newId = new ObjectId(params.id);
                if (newId.toString() !== params.id) {
                    console.error(`Invalid note id: ${params.id}`);
                    const err = new Error("Invalid note id");
                    err.statusCode = 400;
                    return next(err);
                }

                req.params.id = params.id;

                return next();
            } else {
                const err = new Error("Note id is required for update");
                err.statusCode = 400;
                return next(err);
            }

        } catch (err) {
            console.error("Error occurred while validating note id: %o", err);
            return next(err);
        }
    },
};