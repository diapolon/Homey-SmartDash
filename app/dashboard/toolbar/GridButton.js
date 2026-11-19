/*04/06/2024*/
'use strict';
const GridButton = {
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
			if (this.model.get('panel') == 0) this.el.classList.add('on');
		},
		_domReady: function() {					
			let self = this;							
			this.listenTo(Data, 'show_'+ this.model.get('panel'), function() { self._click(); });		
		},
		__touchEnd: function(event, childElement) {	
			this.parent.resetHomeyControl();	
			return this._click();
		},
		_click: function() {	
			this.parent.current = this.model.get('panel');
			this.parent.updateBackground();				
			document.querySelectorAll('.panel').forEach(ele => { ele.classList.remove('show'); });	
			document.querySelectorAll('.grid.button').forEach(ele => { ele.classList.remove('on'); });				
			document.getElementById('panel_'+ this.model.get('panel')).classList.add('show');		
			this.el.classList.add('on');
			Data.trigger('updateTime');
			return false;
		}	
	})
}