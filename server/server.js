const express = require( 'express' );
const http = require( 'http' );
const path = require( 'path' );
const socketIO = require( 'socket.io' );

const publicPath = path.join( __dirname, '../public' );
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer( app );
var io = socketIO( server );

app.use( express.static( publicPath ) );

io.on( 'connection', ( socket ) =>
{
	console.log( 'New user connected' );

	var initMessage =
	{
		createdAt: new Date().getTime(),
		from: 'Admin',
		text: 'Welcome to the chat app!'
	};
	socket.emit( 'newMessage', initMessage );

	initMessage.text = 'New user joined';
	socket.broadcast.emit( 'newMessage', initMessage );
	
	socket.on( 'createMessage', ( message ) =>
	{
		message.createdAt = new Date().getTime();
		io.emit( 'newMessage', message );
	});

	socket.on( 'disconnect', () =>
	{
		console.log( 'User disconnected' );
	});
});

server.listen( port, () => console.log( `Started on port ${ port }` ) );