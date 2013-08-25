var express=require('express'), http=require('http');
var app=express();
var server=http.createServer(app);
app.set('views',__dirname+'/views'); // declara la carpeta que va a tener html
app.configure(function(){
	app.use(express.static(__dirname));
});
app.get('/', function(req, res){
	res.render('index.jade', {layout: false});
});
app.listen(8080);

// lo de websockets
var io=require('socket.io').listen(server);
var usuariosConectados={};
io.sockets.on('connection', function(socket){
	socket.on('enviarNombre', function(datos){
		if(usuariosConectados[datos]){
			socket.emit('errorName');
		}else{
			socket.nickname=datos;
			usuariosConectados[datos]=socket.nickname;
		}
		data=[datos, usuariosConectados];
		io.sockets.emit('mensaje', data);
	});
	socket.on('enviarMensaje', function(mensaje){
		var data=[socket.nickname, mensaje];
		io.socketsemit('newMessage', data);
	});
	sockets.on('disconnect', function(){
		delete usuariosConectados[socket.nickname];
		data=[usuariosConectados, socket.nickname];
		io.sockets.emit('usuariosCoenctado', data);
	});
});
