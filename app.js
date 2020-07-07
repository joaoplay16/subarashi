const express = require('express')
const handlebars = require('express-handlebars')
const Handlebars = require('handlebars');
//const HandlebarsIntl = require('handlebars-intl');
const bodyParser = require('body-parser')
const app = express()
const home = require('./routes/home')
const admin = require('./routes/admin')

const usuarios = require('./routes/usuario')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
//require('./models/Postagem')
//const Postagem = mongoose.model('postagens')
//require('./models/Categoria')
//const Categoria = mongoose.model('categorias')
require('./models/Usuario')
const Usuario = mongoose.model('usuarios')
const passport = require("passport")
require('./config/auth')(passport)
const db = require('./config/db')

app.use(session({
	secret: "subarashi",
	resave: true,
	saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

//Midleware
app.use((req, res, next) => {
	res.locals.success_msg = req.flash("success_msg"),
		res.locals.error_msg = req.flash("error_msg"),
		res.locals.error = req.flash('error'),
		res.locals.user = req.user || null
	next()
})

//Body Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//Handlebars
app.engine('handlebars', handlebars({
	extname: 'handlebars',
	defaultLayout: 'main',
	layoutsDir: __dirname + '/views/layouts/'
}))
app.set('view engine', 'handlebars')
//Mongoose
mongoose.Promise = global.Promise
mongoose.connect(db.mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log("Conectado")
}).catch(err => {
	console.log("Erro ao conectar " + err)
})


//Public
//configuracao para reconher o bootstrap
app.use(express.static(path.join(__dirname, 'public')))

//Rotas
app.use('/admin', admin)
app.use('/', home)
app.use('/usuarios', usuarios)
app.get('/', (req, res)=>{
	res.redirect('/animes')
})


Handlebars.registerHelper('ifEquals', function (a, b, options) {
	console.log(' A = ' + a + ' B = ' + b)
	if (a != undefined && b != undefined) {
		if (a.toString() == b.toString()) {

			return options.fn(this);
		}
		return options.inverse(this);
	}
	return options.inverse(this);
});

Handlebars.registerHelper('datef', function (date, options) {
	if (date!= null && date != undefined) {
		var dia = date.getDate()
		if(dia < 10){
			dia = "0"+ dia
		}
		var mes = date.getMonth() +1
		if(mes < 10){
			mes = "0"+ mes
		}
		var ano = date.getFullYear()

		return dia + '/' + mes + '/' + ano;
	}
	return options.inverse(this);
});

const PORT = process.env.PORT || 8088



app.listen(PORT, () => {
	console.log("Servidor inicializado")
})

