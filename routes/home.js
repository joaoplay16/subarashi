const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Anime')
//require('../models/Episodio')
const Anime = mongoose.model('animes')
//const Episodio = mongoose.model('episodios')
//const Categoria = mongoose.model('categorias')


router.get('/animes', (req, res)=>{
	Anime.find().populate('categoria').then((animes)=>{
		res.render('home/animes', {animes})
	}).catch(err=>{
		console.log(err)
	})
})

router.get('/assistir/:id', (req, res)=>{
	Anime.findById(req.params.id).populate('categoria').then((anime)=>{
		anime.episodios.sort((a, b)=>{
			return a.numero - b.numero;
		})
		res.render('home/detalheanime', {anime})
	}).catch(err =>{
		console.log(err)
	})
})


module.exports = router