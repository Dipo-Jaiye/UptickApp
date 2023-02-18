const Note = require("../models/note");

module.exports = {
    // create
    create: async (req, res, next) => {
        try {
            let { body, user, } = req;
            let { text, } = body;

            Note.create({
                text,
                author: user._id
            })
                .then(async note => {
                    if (!note) {
                        const err = new Error("New note not created");
                        err.statusCode = 400;
                        return next(err);
                    }

                    //await note.populate("author", "name");

                    return res.status(201).json({
                        error: false,
                        message: "success",
                        data: note,
                    });
                })
                .catch(err => {
                    console.error("Error occurred creating note: %o", err);
                    return next(err);
                });

        } catch (err) {
            console.error("Error occurred while creating note: %o", err);
            return next(err);
        }
    },

    // read
    read: async (req, res, next) => {
        try {
            let { user, params, query, } = req;

            if (params.id !== undefined && params.id !== null && params.id !== "") {

                let note = await Note.findOne({ _id: params.id, author: user._id }).lean();
                if (!note) {
                    const err = new Error("Note not found");
                    err.statusCode = 404;
                    return next(err);
                }

                //await note.populate("author", "name");

                return res.status(200).json({ error: false, message: "success", data: note });
            }

            let { size, page, } = query;
            size = parseInt(size);
            page = parseInt(page);

            let notes = await Note.find({ author: user._id })
                .lean()
                .sort({ createdAt: -1 })
                .skip((page - 1) * size)
                .limit(size);

            if (!notes) {
                const err = new Error("Notes not found");
                err.statusCode = 404;
                return next(err);
            }

            return res.status(200).json({ error: false, message: "success", data: { page, size, notes } });
        } catch (err) {
            console.error("Error occurred while reading note: %o", err);
            return next(err);
        }
    },

    // update
    update: async (req, res, next) => {
        try {
            let { user, params, body, } = req;

            Note.findOneAndUpdate({ _id: params.id, author: user._id },
                {
                    $set: {
                        text: body.text
                    }
                })
                .then(note => {
                    if (!note) {
                        const err = new Error("Note not found");
                        err.statusCode = 404;
                        return next(err);
                    }

                    return res.status(200).json({ error: false, message: "success", data: note });
                })
                .catch(err => {
                    console.error("Error occurred while updating note: %o", err);
                    return next(err);
                });

        } catch (err) {
            console.error("Error occurred while updating note: %o", err);
            return next(err);
        }
    },

    // delete
    remove: async (req, res, next) => {
        try {
            let { user, params, } = req;

            Note.findOneAndDelete({ _id: params.id, author: user._id })
                .then(note => {
                    if (!note) {
                        const err = new Error("Note not found");
                        err.statusCode = 404;
                        return next(err);
                    }

                    return res.status(200).json({ error: false, message: "success", data: note });
                })
                .catch(err => {
                    console.error("Error occurred while deleting note: %o", err);
                    return next(err);
                });
        } catch (err) {
            console.error("Error occurred while deleting note: %o", err);
            return next(err);
        }
    },
};