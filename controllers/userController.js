const db = require("../models");

// Defining methods for the userController
module.exports = {
    findAll: function (req, res) {
        db.User
            .find(req.query)
            .sort({
                date: -1
            })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    findById: function (req, res) {
        db.User
            .findById(req.params.id)
            .populate("rabUrl")
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    findByUserName: function (req, res) {
        db.User
            .findOne({"username": req.params.username})
            .populate("rabUrl")
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    create: function (req, res) {
        db.User
            .create(req.body)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    update: function (req, res) {
        db.User
            .findOneAndUpdate({
                _id: req.params.id
            }, req.body)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    remove: function (req, res) {
        db.User
            .findById({
                _id: req.params.id
            })
            .then(db.RabUrl.remove({
                "_id": {$in: dbModel.rabUrl}}))
            .then(dbModel => dbModel.remove())          
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    }
};