const { markers } = require('./markerdata');
const { findMarkerPos } = require('./lib');
const m = markers.split('');

const { result } = findMarkerPos(m);
console.log( {result} );