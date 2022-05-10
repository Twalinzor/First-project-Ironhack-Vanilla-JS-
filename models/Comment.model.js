const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
	author: String,
    text: String
},
{
  timestamps: true
});

const Comment = model('Comment', commentSchema);

module.exports = Comment;