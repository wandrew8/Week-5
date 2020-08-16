const { Router } = require("express");
const router = Router();
const middleware = require('./middleware');
const orderDAO = require("../daos/order");

//-------------- Middleware Functions -----------------//

router.use(async (req, res, next) => {
    console.log(`${req.method} orders${req.path}`);
    next();
});

router.use(middleware.isAuthorized);

//-------------- Route Endpoints -----------------//

router.post("/", async (req, res, next) => {
    const userId = req.user._id;
    const { items } = req.body;
    const total = await orderDAO.getTotal(items);
    try {
        const newOrder = await orderDAO.addOrder(userId, items, total)
        if (newOrder) {
            res.json(newOrder);
        } else {
            res.status(401).send("Order not added");
        }
    } catch (err) {
        res.status(500).send("Oops, server error!")
    }
})

router.get("/", async (req, res, next) => {
    try {
        const userId = req.user._id;
        const userItems = await orderDAO.getOrder(userId);
        if (userItems) {
            res.json(userItems);
        } else {
            res.status(404).send("You have no items in your cart")
        }
    } catch (err) {
        res.status(500).send("Oops, server error!")
    }
})

router.get("/:id", middleware.isAdmin, async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;
    if(req.user.roles.includes('admin')) {
        try {
            const order = await orderDAO.getAnyOrder(id)
            if(order) {
                res.json(order);
            } else {
                res.status(401).send("Could not find the note you were looking for")
            }
        }
        catch (err) {
            res.status(500).send("Oops, server error!")
        }
    } else {
        try {
            const order = await orderDAO.getUsersOrder(id, userId)
            if (order) {
                res.json(order);
            } else {
                res.status(401).send("You have no orders")
            }
        } catch (err) {
            res.status(500).send("Oops, server error!")
        }
    }
})

module.exports = router;
