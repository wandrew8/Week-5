const { Router } = require("express");
const router = Router();
const middleware = require('./middleware');
const itemDAO = require("../daos/item");

//-------------- Middleware Functions -----------------//

router.use(middleware.isAuthorized);

//-------------- Route Endpoints -----------------//

router.get("/", async (req, res, next) => {
   const items = await itemDAO.findAllItems();
   if(items) {
       res.json(items)
   } else {
       res.status(400).send("No items found")
   }
})

router.post("/", middleware.isAdmin, async (req, res, next) => {
    const { title, price } = req.body;
    if (!title || !price) {
        res.status(400).send('title and price required');
    } else {
        try {
            console.log(req.user)
            const newItem = await itemDAO.addItem(title, price);
            res.json(newItem);
        }
        catch(err) {
            res.status(500).send("Server error! " + err.message);
        }
    }
})


router.put("/:id", middleware.isAdmin, async (req, res, next) => {
    const { title, price } = req.body;
    const { id } = req.params;
    if (!title || !price) {
        res.status(400).send('title and price required');
    } else {
        try {
            const updatedItem = await itemDAO.updateItem(id, title, price)
            if(updatedItem) {
                res.json(updatedItem)
            } else {
                res.status(400).send("Item not updated")
            }
        }
        catch(err) {
            res.status(500).send("Server error! " + err.message);
        }
    }
})

module.exports = router;
