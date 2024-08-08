const mongoose = require('mongoose');

const Application = mongoose.model('application', {
    personalDetails: {
        type: Object,
        required: true
    },
    addressDetails: {
        type: Object,
        required: true
    },
    subjects: {
        type: Array,
        required: true
    },
    applicant: {
        type: String,
        required: false
    },
    status: {
        type: Object,
        required: false,
        default: {
            current: 'Pending',
            comment: null
        }
    },
    documentExtraData: {
        type: Object,
        required: false
    },
    documents: {
        type: Array,
        required: false,
        default: []
    },
    submittedDocs: {
        type: Boolean,
        required: false,
        default: false
    },
    dateCreated: {
        type: String,
        required: true,
    },
    dateModified: {
        type: String,
        required: false
    },
    acceptedTerms: {
        type: String,
        required: false
    },
    owner: {
        type: String,
        required: true
    }
});

module.exports = Application;