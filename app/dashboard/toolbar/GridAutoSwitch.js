/*29/01/2024*/
'use strict';
const GridAutoSwitch = {
	dashboard: AbstractListItem.extend({
		className: 'grid button',
		template: 'grid_button',		
		events: {
			'touchstart': 'touchStart',
			'touchcancel': 'touchCancel',
			'touchmove': 'touchMove',
			'touchend': 'touchEnd'
		},	
		__render: function() {
			if (DATABASE.autoplay.enabled == 1) this.el.classList.add('on');
		},
		__touchEnd: function(event, childElement) {					
			System.navigate(this.model.get('route'), 'fade');													
			return false;
		}
	})
}