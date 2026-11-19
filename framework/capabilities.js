/*18/03/2024*/
'use strict';
const Capabilities = {				
	power: function(num) { return (num ? (Math.round((Math.abs(num) >= 1000 ? (num / 1000) : num.toFixed(0)) * 100) / 100) : 0); }
};