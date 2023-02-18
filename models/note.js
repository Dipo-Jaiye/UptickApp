const { Schema, model, } = require("mongoose");
const docOptions = {
    virtuals: true,
    versionKey: false,
    hide: '__v',
    transform: (doc, ret, options) => {
        if (options.hide) {
            options.hide.split(' ').forEach(function (prop) {
                delete ret[prop];
            });
        }
        return ret;
    },
};

const noteSchema = new Schema({
    text: String,

    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
}, {
    timestamps: true,
    toJSON: docOptions,
    toObject: docOptions,
});


module.exports = model("Note", noteSchema);