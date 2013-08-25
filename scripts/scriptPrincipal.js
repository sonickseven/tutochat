var nombre;
var arrayNames={};
var websocket = io.connect(); // error no found 404
$(document).on('ready', iniciar);

function iniciar(){
	$('#forname').on('submit', function(e){
		e.preventDefault();
		var bandera=0;
		var nombreAyuda=$('#name').val();
		for(var i=0; i<arrayNames.length; i++){
			if(nombreAyuda==arrayNames[i])
				bandera=1;
		}
		if(bandera===0){
			sendNames();
		}else{
			alert('Ese nombre ya existe');
		}
	});

	$('#body').css({height:screen.height, width: screen.width});
	var pantallas=[$('#setNombre')];
	$('#formMsg').on('submit', function(e){
		e.preventDefault();
		sendMesage();
	});
	//recive y maneja las funciones que vienen del servidor
	websocket.on('mensaje', procesarusuario);
	websocket.on('newMessage', procesarMensaje);
	websocket.on('usuarioDesconectado', procesarusuarios);
	websocket.on('errorName', repetirNombre);
}

function sendMesage(){
	var msg=$('#msg').val();
	if((msg.indexOf('<')!=-1)){
		alert('mensaje Incorrecto');
	}else if((msg.indexOf('>')!=-1)){
		alert('mensaje Incorrecto');
	}else if((msg.indexOf(';')!=-1)){
		alert('mensaje Incorrecto');
	}else{
		$('#msg').val('');
		websocket.emit('enviarMensaje', msg);
	}
}

function sendNames(){
	nombre=$('#name').val();
	$('#forname').fadeOut(800);
	var datos=new Array;
	if(localStorage){
		localStorage.nombreChatUsuario=nombre;
		websocket.emit('enviarNombre', nombre);
	}
}

function procesarusuario(mensaje){
	$('#users').html('');
	for(i in mensaje[1]){
		$('#users').append($('<p>').text(mensaje[1][i]));
		arrayNames[i]=mensaje[1][i];
	}
}

function procesarMensaje(data){
	$('#chatInsite').append($('<p>').html('<span>'+data[0]+' says: </span>'+data[1]));
	$('#chat').animate({scrollTop: $('#chatInsite').height()}, 800);
}

function procesarusuarios(mensaje){
	$('#users'). html('');
	for(i in mensaje[2]){
		$('#users').append($('<p>').text(mensaje[0][i]));
		arrayNames[i]=mensaje[0][i];
	}
}

function repetirNombre(){
	alert('el nombre ya esta ocupado');
	location.reload(true);
}
