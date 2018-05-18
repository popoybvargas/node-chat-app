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
	/**
	socket.emit( 'newMessage',
	{
		from: 'popoy@example.com',
		text: 'Hey, what is going on?',
		createdAt: new Date().toString()
	});
	*/
	socket.on( 'createMessage', ( message ) =>
	{
		// console.log( 'createMessage', newMessage );
		message.createdAt = new Date().toString();

		socket.emit( 'newMessage', message );
	});

	socket.on( 'disconnect', () =>
	{
		console.log( 'User disconnected' );
	});
});

server.listen( port, () => console.log( `Started on port ${ port }` ) );