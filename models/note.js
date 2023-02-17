const { Schema, model, } = require("mongoose");

const noteSchema = new Schema({
    text: String,

    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
}, {
    timestamps: true
});


module.exports = model("Note", noteSchema);