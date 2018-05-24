var socket = io();

function deparam( uri )
{
    if ( uri === undefined ) uri = window.location.search;

    var queryString = {};
    uri.replace(
        new RegExp(
        "([^?=&]+)(=([^&#]*))?", "g"
        ),
        function( $0, $1, $2, $3 )
        {
            queryString[ $1 ] = decodeURIComponent( $3.replace( /\+/g, '%20' ) );
        }   
    );
    return queryString;
}

function scrollToBottom()
{
	// selectors
	// var messages = jQuery( '#messages' );
	var messages = document.getElementById( 'messages' );
	// var newMessage = messages.children( 'li:last-child' );
	var newMessage = messages.lastElementChild;
	// heights
	// var clientHeight = messages.prop( 'clientHeight' );
	var clientHeight = messages.clientHeight;
	// var scrollTop = messages.prop( 'scrollTop' );
	var scrollTop = messages.scrollTop;
	// var scrollHeight = messages.prop( 'scrollHeight' );
	var scrollHeight = messages.scrollHeight;
	// var newMessageHeight = newMessage.innerHeight();
	var newMessageHeight = window.getComputedStyle( newMessage, null ).getPropertyValue( 'height' );
	// var lastMessageHeight = newMessage.prev().innerHeight();
	var lastMessage = messages.lastChild.previousElementSibling;
	var lastMessageHeight = window.getComputedStyle( lastMessage, null ).getPropertyValue( 'height' );

	var currentHeight = parseInt( clientHeight ) + parseInt( scrollTop) + parseInt( newMessageHeight ) + parseInt( lastMessageHeight );
	
	if ( currentHeight >= scrollHeight )
	{
		messages.scrollTop = scrollHeight;
	}
}

socket.on( 'connect', function()
{
	console.log( 'Connected to server' );
	// var params = jQuery.deparam( window.location.search );
	var params = deparam();

	socket.emit( 'join', params, function( err )
	{
		if ( err )
		{
			alert( err );
			window.location.href = '/';
		}
		else
		{
			console.log( 'No error' );
		}
	});
});

socket.on( 'disconnect', function()
{
	console.log( 'Disconnected from server' );
});

socket.on( 'updateUserList', function( users )
{
	// var ol = jQuery( '<ol></ol>' );
	var ol = document.createElement( 'ol' );

	users.forEach( function( user )
	{
		// ol.append( jQuery( '<li></li>' ).text( user ) );
		var li = document.createElement( 'li' );
		li.innerText = user;
		ol.appendChild( li );
	});
	
	// jQuery( '#users' ).html( ol );
	var usersDiv = document.getElementById( 'users' );
	usersDiv.innerHTML = '';
	usersDiv.append( ol );
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
	scrollToBottom();
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
	scrollToBottom();
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

locationButton.onclick = function()
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
};