const { Schema, model } = require('mongoose');

const reviewSchema = new Schema({
	author: { type: Schema.Types.ObjectId, ref: 'User' },
	title: String,
	game: { type: Schema.Types.ObjectId, ref: 'Game' },
	description: String,
    imageUrl: String,
    videoUrl: String,
	likes: [String],
	comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', default: [] }]
},
{
  timestamps: true
});

const Review = model('Review', reviewSchema);

module.exports = Review;