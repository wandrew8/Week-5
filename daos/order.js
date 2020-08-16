const Order = require('../models/order');
const Item = require('../models/item');
module.exports = {};

module.exports.getOrder = (userId) => {
    const allItems = Order.find({ userId: userId });
    if(allItems.length > 0) {
        return allItems
    } else {
        return false;
    }
}

module.exports.getTotal = async(itemsArray) => {
    let totalPrice = 0;
    for(itemId of itemsArray) {
        const item = await Item.findOne({ _id: itemId });
        totalPrice += item.price;
    }
    return totalPrice;
}

module.exports.addOrder = async (userId, items, total) => {
    return Order.create({ userId: userId, items: items, total: total });
}

module.exports.getAnyOrder = async (id) => {
    return Order.findOne({ _id: id }).populate('items');
}

module.exports.getUsersOrder = async (id, userId) => {
    const order = await Order.findOne({ _id: id }).lean();
    if (order.userId === userId) {
        return await (await Order.findOne({ _id: id })).populate('items');
    } else {
        return false;
    }
}