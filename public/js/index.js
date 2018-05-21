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
	// var li = jQuery( '<li></li>' );
	var li = document.createElement( 'li' );
	// li.text( `${ message.from }: ${ message.text }` );
	li.innerHTML = `${ message.from }: ${ message.text }`;

	// jQuery( '#messages' ).append( li );
	document.getElementById( 'messages' ).appendChild( li );
});

socket.on( 'newLocationMessage', function( message )
{
	// var li = jQuery( '<li></li>' );
	var li = document.createElement( 'li' );
	// var a = jQuery( '<a target="_blank">My current location</a>');
	var a = document.createElement( 'a' );
	a.innerHTML = 'My current location';
	a.target = '_blank';

	// li.text( `${ message.from }: ` );
	li.innerHTML = `${ message.from }: `;
	// a.attr( 'href', message.url );
	a.href = message.url;
	li.append( a );
	document.getElementById( 'messages' ).appendChild( li );
});

/**
socket.emit( 'createMessage',
{
	from: 'Frank',
	text: 'Hi'
}, function( data )
{
	console.log( 'Got it!', data );
});
*/
var messageInput = document.getElementsByName( 'message' )[ 0 ];

document.getElementById( 'message-form' ).addEventListener( 'submit', function( e )
{
	e.preventDefault();

	socket.emit( 'createMessage',
	{
		from: 'User',
		text: messageInput.value
	}, function()
	{
		messageInput.value = '';
	});
});

// jQuery( '#message-form' ).on( 'submit', function( e )
// {
// 	e.preventDefault();

// 	socket.emit( 'createMessage',
// 	{
// 		from: 'User',
// 		text: jQuery( '[name=message]' ).val()
// 	}, function()
// 	{

// 	});
// });

var locationButton = document.getElementById( 'send-location' );

locationButton.addEventListener( 'click', function()
{
	if ( ! navigator.geolocation )
	{
		return alert( 'Geolocation not supported by your browser.' );
	}
	locationButton.disabled = 'true';
	locationButton.innerHTML = 'Sending location...';

	navigator.geolocation.getCurrentPosition( function( position )
	{
		socket.emit( 'createLocationMessage',
		{
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	}, function()
	{
		alert( 'Unable to fetch location' );
	});

	messageInput.focus();
	locationButton.removeAttribute( 'disabled' );
	locationButton.innerHTML = 'Send location';
});