const expect = require( 'expect' );

var { generateMessage, generateLocationMessage } = require( './message' );

describe( 'generateMessage', () =>
{
	it( 'should generate correct message object', () =>
	{
		var from = 'Popoy';
		var text = 'Pack my box full of five dozen liquor jugs';
		var message = generateMessage( from, text );

		expect( message ).toMatchObject( { from, text } );
		expect( typeof message.createdAt ).toBe( 'number' );
	});
});

describe( 'generateLocationMessage', () =>
{
	it( 'should generate correct location object', () =>
	{
		var from = 'Popoy';
		var latitude = 1;
		var longitude = 1;
		var url = 'https://www.google.com/maps?q=1,1';
		var message = generateLocationMessage( from, latitude, longitude );

		expect( message ).toMatchObject( { from, url } );
		expect( message.url ).toBe( url );
		expect( typeof message.createdAt ).toBe( 'number' );
	});
});