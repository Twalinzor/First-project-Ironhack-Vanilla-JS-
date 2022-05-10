const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
	username: String,
	password: String,
	email: String,
	profilePic: {
		type: String,
		default: "https://cdn-icons-png.flaticon.com/512/86/86483.png"},
	reviews: [{ type: Schema.Types.ObjectId, ref: 'Review', default: [] }],
	comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', default: [] }]
},
{
  timestamps: true
});

const User = model('User', userSchema);

module.exports = User;
