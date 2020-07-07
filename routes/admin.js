const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Anime')
require('../models/Categoria')
const Anime = mongoose.model('animes')
const Categoria = mongoose.model('categorias')




router.get('/categorias', (req, res) => {
	Categoria.find().sort({ date: 'desc' }).then((categorias) => {
		console.log(categorias)
		res.render('admin/categorias', { categorias: categorias })
	}).catch(err => {
		req.flash('error_msg', 'Houve um erro listar categorias')
		res.redirect('/admin')
	})
})

router.get('/categorias/add', (req, res) => {
	res.render('admin/addcategorias')
})

router.post('/categorias/salvar', (req, res) => {
	var erros = []

	if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
		erros.push({ texto: "nome inválido" })
	}

	if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
		erros.push({ texto: "Slug inválido" })
	}

	if (req.body.nome.length < 2) {
		erros.push({ texto: 'Nome da categoria e muito pequeno cara' })
	}

	if (erros.length > 0) {
		res.render('admin/addcategorias', { erros: erros })
	} else {
		const novaCategoria = {
			nome: req.body.slug,
			slug: req.body.slug
		}

		new Categoria(novaCategoria).save().then(() => {
			req.flash('success_msg', 'Categoria criada com sucesso!')
			res.redirect('/admin/categorias')
		}).catch(err => {
			req.flash('error_msg', 'Erro ao salvar categoria')
		})
	}
})

router.get('/categorias/editar/:id', (req, res) => {
	Categoria.findOne({ _id: req.params.id }).then((categoria) => {
		res.render('admin/editcategorias', { categoria: categoria })
	}).catch(err => {
		req.flash("error_msg", "Erro ao editar categoria")
		res.redirect('/admin/categorias')
	})
})

router.post('/categorias/editar', (req, res) => {
	Categoria.findOne({ _id: req.body.id }).then((categoria) => {
		categoria.nome = req.body.nome
		categoria.slug = req.body.slug

		categoria.save().then(() => {
			req.flash("success_msg", "Categoria salva com sucesso")
			res.redirect('/admin/categorias')
		}).catch(err => {
			req.flash("error_msg", "Erro ao salvar: \n" + err)
			res.redirect('/admin/categorias')
		})
	}).catch(err => {
		req.flash("error_msg", "Categoria nao encontrada")
		res.redirect('/admin/categorias')
	})
})

router.post('/categorias/delete', (req, res) => {

})

router.get('/animes', (req, res) => {
	Anime.find().populate('categoria').then((animes) => {
		res.render('admin/animes', { animes: animes })
	}).catch(err => {
		console.log(err)
	})
})

router.get('/anime/add', (req, res) => {
	Categoria.find().then((categorias) => {
		res.render('admin/addanime', {categorias: categorias})
		console.log(categorias)
	}).catch(err => {
		console.log(err)
	})
})

router.post('/anime/salvar', (req, res) => {
	const anime = {
		nome: req.body.nome,
		descricao: req.body.descricao,
		categoria: req.body.categoria,
		status: req.body.status,
		views: req.body.views
	}

	new Anime(anime).save().then(() => {
		req.flash('success_msg', 'Anime salvo com sucesso')
		res.redirect('/admin/animes')
	}).catch(err => {
		req.flash('error_msg', 'Erro ao salvar o anime')
		res.redirect('/admin/animes')
	})
})

router.get('/anime/editar/:id', (req, res) => {
	Anime.findOne({ _id: req.params.id }).populate('categoria').then((anime) => {
		Categoria.find().then((categorias) => {

			res.render('admin/addanime', { anime, categorias })
		}).catch(err => {
			req.flash('error_msg', 'Erro interno')
			res.redirect('/admin/animes')
		})
	}).catch(err => {
		req.flash('error_msg', 'Erro ao editar o anime')
		res.redirect('/admin/animes')
	})
})

router.post('/anime/editar', (req, res) => {
	Anime.findById(req.body.id).then((anime) => {
		anime.nome = req.body.nome
		anime.capa = req.body.capa
		anime.descricao = req.body.descricao
		anime.categoria = req.body.categoria
		anime.status = req.body.status
		anime.views = req.body.views

		anime.episodios.sort((a, b)=>{
			return a.numero - b.numero;
		})

		console.log(anime.data_postagem.toLocaleDateString())

		anime.save().then(() => {
			req.flash('success_msg', 'Anime atualizado com sucesso')
			res.redirect('/admin/animes')
		}).catch(err => {
			req.flash('error_msg', 'Erro ao atualizar anime' + err)
			res.redirect('/admin/animes')
		})
	}).catch(err => {
		req.flash('error_msg', 'Erro interno ' + err)
		res.redirect('/admin/animes')
	})
})

router.get('/animes/remover/:id', (req, res) => {
	Anime.deleteOne({ _id: req.params.id }).then(() => {
		req.flash('success_msg', req.params.id + ' removido com sucesso')
		res.redirect('/admin/animes')
	}).catch(err => {
		req.flash('error_msg', 'Erro interno' + err)
		res.redirect('/admin/animes')
	})
})

router.get('/episodios', (req, res) => {

})

router.get('/episodios/add/:id', (req, res) => {
	Anime.findOne({ _id: req.params.id }).then((anime) => {
		anime.episodios.sort((a, b)=>{
			return a.numero - b.numero;
		})

		res.render('admin/addepisodio', { anime })
	}).catch(err => {
		req.flash('error_msg', 'Erro ao adicionar episódio' + err)
		res.redirect('/admin/animes')
	})
})

router.post('/episodios/salvar', (req, res) => {
	Anime.findById(req.body.id).then((anime) => {

		if (req.body.epId) {
			const episodio = anime.episodios.id(req.body.epId)
			episodio['url'] = req.body.url
			episodio['numero'] = req.body.numero
			episodio['minutos'] = req.body.minutos
			episodio['views'] = req.body.views
		} else {
			const eps = {
				url: req.body.url,
				numero: req.body.numero,
				views: req.body.views,
				minutos: req.body.minutos
			}
			anime.episodios.push(eps)
		}
		anime.episodios.sort((a, b)=>{
			return a.numero - b.numero;
		})

		anime.save().then(() => {
			console.log('Ep adicionado!')
			res.render('admin/addepisodio', { anime })
		}).catch(err => {
			req.flash('error_message', 'Erro ao adicionar episódio ' + err)
			res.redirect('/admin/animes')
		})
	}).catch(err => {
		req.flash('error_msg', 'Erro interno' + err)
		res.redirect('/admin/animes')
	})
})


router.post('/episodio/editar', (req, res) => {
	Anime.findById(req.body.animeId).then((anime) => {
		const episodio = anime.episodios.id(req.body.epId)

		res.render('admin/addepisodio', { anime, episodio })
	}).catch(err => {
		console.log(err)
		req.flash('error_msg', 'Erro interno' + err)
		res.redirect('/admin/animes')
	})
})

router.get('/episodios/del/:animeid/:epid', (req, res) => {
	console.log(req.params)
	Anime.findById(req.params.animeid).then((anime) => {
		anime.episodios.id(req.params.epid).remove()

		anime.save().then(() => {
			console.log('Ep excluido!')
			res.redirect('back')
		}).catch(err => {
			req.flash('error_message', 'Erro ao remover episódio ' + err)
			res.redirect('/admin/animes')
		})
	}).catch(err => {
		console.log(err)
		req.flash('error_msg', 'Erro interno' + err)
		res.redirect('/admin/animes')
	})
})

module.exports = router