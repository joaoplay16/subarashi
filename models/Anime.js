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
	}
})


const Anime = new Schema({
	nome: {
		type: String,
		required: true
	},
	categoria: {
		type: Schema.Types.ObjectId,
		ref: "categorias",
		required: true
	},
	descricao: {
		type: String,
		required: true
	},
	capa: {
		type:String
	},
	status: {
		type: String,
		required: true
	},
	views: {
		type: Number
	},
	data_postagem: {
		type: Date,
		default: Date.now()
	},
	episodios: [Episodio]
})

mongoose.model("animes", Anime)

// var Ani = mongoose.model('animes')

// var ani = new Ani({
// 	nome: 'Black Clover',
// 	categoria: '5e2897e94818687bfb99b171',
// 	descricao: 'Mahou kono ningua nasoiuy nakemasd',
// 	capa: 'http://imgens.com/cap2.jpg',
// 	status: 'Em andamento',
// 	views: '28154'
// })

// /*var eps =*/ ani.episodios.push({
// 	url: 'http://anime.com',
// 	numero: 1,
// 	views: 1500,
// 	minutos: 22
// 	})

// 	ani.episodios.push({
// 		url: 'http://anime.com',
// 		numero: 2,
// 		views: 1000,
// 		minutos: 22
// 		})

// 		ani.episodios.push({
// 			url: 'http://anime.com',
// 			numero: 3,
// 			views: 1800,
// 			minutos: 22
// 			})

//ani.episodios = eps
// var subdoc = ani.episodios[0]
// console.log(subdoc)
// //console.log(subdoc.isNew)

// 	ani.save(err=>{
// 	if (err) 
// 		console.log(err);
// 	console.log('Sucesso')
// })