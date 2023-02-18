const router = require("express").Router();
const { signUp, logIn, } = require("../controllers/userController");
const { credentialValidator, nameValidator, } = require("./validators/userValidator");

router.post("/signup", credentialValidator, nameValidator, signUp);
router.post("/login", credentialValidator, logIn);

module.exports = router;