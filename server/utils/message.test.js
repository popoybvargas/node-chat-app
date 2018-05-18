const expect = require( 'expect' );

var { generateMessage } = require( './message' );

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