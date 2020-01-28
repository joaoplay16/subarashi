const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Anime')
require('../models/Episodio')
require('../models/Categoria')
const Anime = mongoose.model('animes')
const Episodio = mongoose.model('episodios')
const Categoria = mongoose.model('categorias')




router.get('/categorias', (req, res)=>{
	Categoria.find().sort({date:'desc'}).then((categorias)=>{
		console.log(categorias)
		res.render('admin/categorias', {categorias: categorias})
	}).catch(err =>{
		req.flash('error_msg', 'Houve um erro listar categorias')
		res.redirect('/admin')
	})
})

router.get('/categorias/add', (req, res)=>{
	res.render('admin/addcategorias')
})

router.post('/categorias/salvar', (req, res)=>{
	var erros = []

	if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
		erros.push({texto: "nome inválido"})
	}

	if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
		erros.push({texto: "Slug inválido"})
	}

	if (req.body.nome.length < 2) {
		erros.push({texto: 'Nome da categoria e muito pequeno cara'})
	}

	if (erros.length > 0) {
		res.render('admin/addcategorias', {erros: erros})
	}else{
		const novaCategoria = {
			nome: req.body.slug,
			slug: req.body.slug
		}

		new Categoria(novaCategoria).save().then(()=>{
			req.flash('success_msg', 'Categoria criada com sucesso!')
			res.redirect('/admin/categorias')
		}).catch(err => {
			req.flash('error_msg', 'Erro ao salvar categoria')
		})		
	}
})

router.get('/categorias/editar/:id', (req, res)=>{
	Categoria.findOne({_id:req.params.id}).then((categoria)=>{
		res.render('admin/editcategorias', {categoria: categoria})
	}).catch(err =>{
		req.flash("error_msg", "Erro ao editar categoria")
		res.redirect('/admin/categorias')
	})
})

router.post('/categorias/editar', (req, res)=>{
	Categoria.findOne({_id:req.body.id}).then((categoria)=>{
		categoria.nome = req.body.nome
		categoria.slug = req.body.slug

		categoria.save().then(()=>{
			req.flash("success_msg", "Categoria salva com sucesso")
			res.redirect('/admin/categorias')
		}).catch(err =>{
			req.flash("error_msg", "Erro ao salvar: \n" + err)
			res.redirect('/admin/categorias')
		})
	}).catch(err =>{
		req.flash("error_msg", "Categoria nao encontrada")
		res.redirect('/admin/categorias')
	})
})

router.post('/categorias/delete', (req, res)=>{

})



router.get('/animes', (req, res)=>{

})

router.get('/animes/add', (req, res)=>{

})

router.post('/animes/salvar', (req, res)=>{

})

router.get('/animes/editar/:id', (req, res)=>{

})

router.post('/animes/editar', (req, res)=>{

})

router.post('/animes/deletar/', (req, res)=>{

})




router.get('/episodios', (req, res)=>{

})

router.get('/episodios/add', (req, res)=>{

})

router.post('/episodios/salvar', (req, res)=>{

})

router.get('/episodios/editar/:id', (req, res)=>{

})

router.post('/episodios/editar', (req, res)=>{

})

router.post('/episodios/deletar/', (req, res)=>{

})

module.exports = router