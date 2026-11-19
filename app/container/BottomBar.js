/*11/12/2019*/
'use strict';
const BottomBar = AbstractList.extend({
	template: 'bottombar',
	id: 'bottom_bar',
	__initialize: function(options) {
		this.parent = options.parent;			
	}
});
