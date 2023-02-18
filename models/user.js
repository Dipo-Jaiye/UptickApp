const { Schema, model, } = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const docOptions = {
    virtuals: true,
    versionKey: false,
    hide: '__v salt hash',
    transform: (doc, ret, options) => {
        if (options.hide) {
            options.hide.split(' ').forEach(function (prop) {
                delete ret[prop];
            });
        }
        return ret;
    },
};

const userSchema = new Schema({
    name: String,

    email: {
        type: String,
        unique: true
    },
}, {
    timestamps: true,
    toJSON: docOptions,
    toObject: docOptions,
});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = model("User", userSchema);