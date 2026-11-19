"use strict";
Handlebars.registerHelper('ceil',function(num){return (num? Math.ceil(num) : 0)});
Handlebars.registerHelper('toFixed',function(num){return (num? (num/1000).toFixed(1) : 0)});
Handlebars.registerHelper('toPercent',function(num){return (num ? Math.ceil(num*100) : 0)});
Handlebars.registerHelper('toHue',function(num){return Math.round(num * 360)});
Handlebars.registerHelper('toMinute',function(sec){return(sec-(sec%=60))/60+(9<sec?':':':0')+Math.floor(sec)});

// Tronca il testo a `t` caratteri, all'ultimo spazio utile, aggiungendo "...".
Handlebars.registerHelper('truncate', function(e, t) {
	if (e.length > t) {
		var n = e.substr(0, t + 1);
		while (n.length) {
			var r = n.substr(-1);
			n = n.substr(0, -1);
			if (r == ' ') {
				break;
			}
		}
		if (n == '') {
			n = e.substr(0, t);
		}
		return new Handlebars.SafeString(n + '...');
	}
	return e;
});

// Confronto condizionale nei template: {{#ifCond a '==' b}}…{{else}}…{{/ifCond}}
Handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {
	switch (operator) {
		case '==':  return v1 == v2 ? options.fn(this) : options.inverse(this);
		case '!=':  return v1 != v2 ? options.fn(this) : options.inverse(this);
		case '===': return v1 === v2 ? options.fn(this) : options.inverse(this);
		case '!==': return v1 !== v2 ? options.fn(this) : options.inverse(this);
		case '&&':  return v1 && v2 ? options.fn(this) : options.inverse(this);
		case '||':  return v1 || v2 ? options.fn(this) : options.inverse(this);
		case '<':   return v1 < v2 ? options.fn(this) : options.inverse(this);
		case '<=':  return v1 <= v2 ? options.fn(this) : options.inverse(this);
		case '>':   return v1 > v2 ? options.fn(this) : options.inverse(this);
		case '>=':  return v1 >= v2 ? options.fn(this) : options.inverse(this);
		default:    return eval('' + v1 + operator + v2) ? options.fn(this) : options.inverse(this);
	}
});