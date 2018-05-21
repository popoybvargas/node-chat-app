// Jan 1st 1970 00:00:00 am (UTC) - unix timestamp epoch
const moment = require( 'moment' );

var date = moment();
// date.subtract( 2, 'years' ).add( 8, 'months' );
// console.log( date.format( 'MMM Do, YYYY' ) );

// console.log( date.format( 'h:mm a' ) );

var someTimestamp = moment().valueOf();
console.log( someTimestamp );

var createdAt = 1234;
var date = moment( createdAt );
console.log( date.format( 'h:mm a' ) );