var socket = io();

socket.on( 'connect', function()
{
	console.log( 'Connected to server' );
});

socket.on( 'disconnect', function()
{
	console.log( 'Disconnected from server' );
});

var messagesList = document.getElementById( 'messages' );

socket.on( 'newMessage', function( message )
{
	var formattedTime = moment( message.createdAt ).format( 'h:mm a' );
	// var template = jQuery( '#message-template' ).html();
	var template = document.getElementById( 'message-template' ).innerHTML;
	var html = Mustache.render( template,
	{
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});

	// jQuery( '#messages' ).append( html );
	messagesList.innerHTML += html;
	/**
	// var li = jQuery( '<li></li>' );
	var li = document.createElement( 'li' );
	// li.text( `${ message.from }: ${ message.text }` );
	li.innerHTML = `${ message.from } ${ formattedTime }: ${ message.text }`;

	// jQuery( '#messages' ).append( li );
	document.getElementById( 'messages' ).appendChild( li );
	*/
});

socket.on( 'newLocationMessage', function( message )
{
	var formattedTime = moment( message.createdAt ).format( 'h:mm a' );
	var template = document.getElementById( 'location-message-template' ).innerHTML;
	var html = Mustache.render( template,
	{
		url: message.url,
		from: message.from,
		createdAt: formattedTime
	});

	messagesList.innerHTML += html;
	/**
	var li = document.createElement( 'li' );
	// var a = jQuery( '<a target="_blank">My current location</a>');
	var a = document.createElement( 'a' );
	a.innerHTML = 'My current location';
	a.target = '_blank';

	li.innerHTML = `${ message.from } ${ formattedTime }: `;
	// a.attr( 'href', message.url );
	a.href = message.url;
	li.append( a );
	messagesList.appendChild( li );
	*/
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
/**
jQuery( '#message-form' ).on( 'submit', function( e )
{
	e.preventDefault();

	socket.emit( 'createMessage',
	{
		from: 'User',
		text: jQuery( '[name=message]' ).val()
	}, function()
	{

	});
});
*/
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