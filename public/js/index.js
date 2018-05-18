var socket = io();

socket.on( 'connect', function()
{
	console.log( 'Connected to server' );
});

socket.on( 'disconnect', function()
{
	console.log( 'Disconnected from server' );
});

socket.on( 'newMessage', function( message )
{
	// console.log( 'New message', message );
	// document.querySelector( 'p' ).textContent = message.text;
	document.getElementById( 'createdAt' ).textContent = message.createdAt.toString();
	document.getElementById( 'from' ).textContent = message.from;
	document.getElementById( 'to' ).textContent = message.to;
	document.getElementById( 'message' ).textContent = message.text;
});