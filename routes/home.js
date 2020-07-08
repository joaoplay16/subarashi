const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
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

router.get('/categorias', (req, res) => {
	Categoria.find().sort({ date: 'desc' }).then((categorias) => {
		res.render('home/categorias', { categorias: categorias })
	}).catch(err => {
		req.flash('error_msg', 'Houve um erro listar categorias')
		res.redirect('/')
	})
})

router.get('/categorias/:slug', (req, res)=>{
		Categoria.findOne({slug: req.params.slug}).then((categoria)=>{

			if(categoria){

				Anime.find({categoria: categoria._id}).populate('categoria').then((animes)=>{
					console.log(animes)
					
					res.render('home/animes', {animes, categoria})
				}).catch(err => {
					req.flash('error_msg', 'Erro ao listar animes ' + err )
					res.redirect('/')
					
				})
			}else{
				req.flash('error_msg', 'Categoria nao existe')
				res.redirect('/')
			}

			
		}).catch(err=>{
			req.flash('error_msg', 'Erro interno')
			res.redirect('/')
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