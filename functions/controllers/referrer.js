const express = require('express');
const router = express.Router();
const Referrer = require('../models/Referrer');

const fetchReferrers = async (req, res) => {
    await Referrer.find().then(referrals => {
        try {
            if (referrals) {
                res.send(referrals);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ msg: "Error Fetching Referrals" })
        }
    }).catch(err => {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" })
    })
};

const fetchReferrer = async (req, res) => {
    await Referrer.find(req.query).then(referrer => {
        try {
            if (referrer) {
                res.send(referrer);
            } else throw new Error('Referrer does not exist');
        } catch (error) {
            console.log(error);
            res.status(500).send({ msg: "Error Fetching Referrer" })
        }
    }).catch(err => {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" })
    })
};

const addReferrer = async (req, res) => {
    await Referrer.create(req.body).then(referrer => {
        try {
            if (referrer) {
                res.send({ msg: 'Details saved successfully' });
            } else throw new Error('Error adding referrer');
        } catch (error) {
            console.log(error);
            res.status(500).send({ msg: 'Error adding referrer' })
        }
    }).catch(err => {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" })
    })
};

router.get('/fetchReferrers', fetchReferrers);
router.get('/fetchReferrer', fetchReferrer);
router.post('/addReferrer', addReferrer);
module.exports = router;

