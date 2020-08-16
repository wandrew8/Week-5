const Item = require('../models/item');
module.exports = {};

module.exports.findAllItems = () => {
    return Item.find({}).lean();;
}

module.exports.addItem = (title, price) => {
    return Item.create({ title: title, price: price });
}

module.exports.updateItem = (id, title, price) => {
    return Item.updateOne({ _id: id }, {$set: {title: title, price: price}});
}

module.exports.findById = (id) => {
    return Item.findOne({ _id: id }).lean();
}

