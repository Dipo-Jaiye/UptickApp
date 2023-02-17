const { Schema, model, } = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    name: String,

    email: {
        type: String,
        unique: true
    },
}, {
    timestamps: true
});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = model("User", userSchema);