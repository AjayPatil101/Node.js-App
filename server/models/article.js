const user = require('./User');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const articleSchema = new Schema ({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    creatorId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    }
    
});

module.exports = mongoose.model("articles", articleSchema,'article');

