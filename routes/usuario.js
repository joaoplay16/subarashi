const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt= require('bcryptjs')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')
const passport = require('passport')

router.get('/', (req, res)=>{
	Usuario.find().then((usuarios)=>{
		res.render('usuarios/lista', {usuarios:usuarios})
		console.log(usuarios)
	}).catch(err =>{
		req.flash('error_msg', 'Erro ao listar usuarios')
		res.redirect('/usuarios/')
	})
})

router.get('/registro', (req, res) =>{
	res.render('usuarios/registro')
})

router.post('/registro', (req, res) =>{
	var erros = validaUsuario(req, res)

	if (erros.length > 0) {
		res.render('usuarios/registro', {erros})
		console.log(erros)
	}else{
		Usuario.findOne({email:req.body.email}).then((usuario)=>{
			if(usuario){
				req.flash("error_msg", "Já existe uma conta com este e-mail")
				res.redirect("/usuarios/registro")
			}else{
				const novoUsuario = new Usuario({ 
					nome: req.body.nome,
					email: req.body.email,
					senha: req.body.senha
				})

				bcrypt.genSalt(10, (erro, salt) =>{
					bcrypt.hash(novoUsuario.senha, salt, (erro, hash)=>{
						if (erro) {
							req.flash("error_msg", "Houve um erro ao salvar o usuario")
							res.redirect('/')
						}
						novoUsuario.senha = hash

						novoUsuario.save().then(() => {
							req.flash("success_msg", "Usuario criado com sucesso")
							res.redirect('/')
						}).catch(err => {
							req.flash("error_msg", "Houve um erro ao criar usuario, tente novamente")
							res.redirect('/usuarios/registro')
							console.log(erro)
						})
					})
				})
			}
		}).catch(err => {
			req.flash("error_msg", "Houve um erro interno " + err)
			res.redirect('/')
			console.log(erro)
		})
	}
})

router.get('/edit/:id', (req, res)=>{
	Usuario.findOne({_id: req.params.id}).then((usuario) =>{
		res.render('usuarios/editar', {usuario: usuario})
	}).catch(err => {
		req.flash('error_msg', 'Erro ao buscar usuario: ' + err)
		res.redirect('/')
	})	
})

router.post('/edit', (req, res) => {
	
	var erros = validaUsuario(req, res)

	Usuario.findOne({_id: req.body.id}).then((usuario)=>{
		usuario.nome = req.body.nome
		usuario.email = req.body.email
		usuario.senha = req.body.senha
		//usuario.eAdmin = 1

		if (erros.length > 0) {
			res.render('usuarios/editar', {erros, usuario})
		}else{
			bcrypt.genSalt(10, (erro, salt) =>{
				bcrypt.hash(usuario.senha, salt, (erro, hash)=>{
					if (erro) {
						req.flash("error_msg", "Houve um erro ao salvar o usuario")
						res.redirect('/')
					}

					usuario.senha = hash

					usuario.save().then(()=>{
						req.flash('success_msg', 'Usuario editado com successo')
						res.redirect('/')
					}).catch(err => {
						req.flash('error_msg', 'Erro ao salvar edicao de usuario: ' + err)
						res.redirect('/')
					})
				})
			})			
		}
	})
})


router.get('/login', (req, res)=>{
	res.render('usuarios/login')
})

router.post('/login', (req, res, next)=>{
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/usuarios/login',
		failureFlash: true
	}) (req, res, next)
})

router.get('/logout', (req, res)=>{
	req.logout()
	req.flash("success_msg", "Deslogado")
	res.redirect('/')
})


function validaUsuario(req, res){
	var erros = []

	if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
		erros.push({texto:'Nome inválido'})
	}
	if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
		erros.push({texto: 'E-mail inválido'})
	}
	if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
		erros.push({texto: 'Senha inválido'})
	}

	if (req.body.senha.length < 4) {
		erros.push({texto: 'Senha muito curta'})
	}

	if (req.body.senha != req.body.senha2) {
		erros.push({texto: 'Senhas diferentes tente novamente!'})
	}

	return erros
}

module.exports = router