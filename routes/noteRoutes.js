const router = require("express").Router();
const { create, read, update, remove, } = require("../controllers/noteController");
const { idValidator, getValidator, textValidator, } = require("./validators/noteValidator");

router.post("/", textValidator, create);
router.get("/:id", getValidator, read);
router.put("/:id", idValidator, textValidator, update);
router.delete("/:id", idValidator, remove);

module.exports = router;