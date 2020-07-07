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
		type:String,
		default: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_16ff26bc8dd%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_16ff26bc8dd%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2293.65833282470703%22%20y%3D%2296.9%22%3EImage%20cap%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'
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