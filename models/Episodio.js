const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Episodio = new Schema({

	url:{
		type: String,
		required: true
	},
	numero: {
		type: Number,
		required: true
	},
	data: {
		type: Date,
		default: Date.now()
	},
	views: {
		type: String,
		required: true
	},
	minutos: {
		type: Number,
		required: true
	},
	anime: {
		type: Schema.Types.ObjectId,
		ref: 'animes',
		required: true
	}
})

mongoose.model('episodios', Episodio)