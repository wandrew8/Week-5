const { Router } = require("express");
const router = Router();
const login = require("./login");
const items = require("./items");
const orders = require("./orders")

router.use("/login", login);
router.use("/items", items);
router.use('/orders', orders);

module.exports = router;