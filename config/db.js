if(process.env.NODE_ENV == 'production'){
	module.exports = {mongoURI: 'mongodb+srv://subarashi:Ny.L00K5@cluster0.gsnq4.gcp.mongodb.net/subarashi?retryWrites=true&w=majority'}
}else{
	module.exports = {mongoURI: 'mongodb://localhost/subarashi'}
}
