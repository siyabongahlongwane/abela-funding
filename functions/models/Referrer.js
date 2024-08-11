const mongoose = require('mongoose');

const Referrer = mongoose.model('referrer', {
    personalDetails: {
        type: Object,
        required: false
    },
    contactDetails: {
        type: Object,
        required: false
    },
    refId: {
        type: String,
        required: false
    },
});

module.exports = Referrer;