/*14/07/2023*/
'use strict';
const AbstractListItem = AbstractView.extend({
	events: {
		'touchstart': 'touchStart',
		'touchcancel': 'touchCancel',
		'touchmove': 'touchMove',
		'touchend': 'touchEnd',
		'touchend .button': 'touchEndB'
	},
	tagName: 'li',
	className: 'row',
	_initialize: function(options) {
		this.parent = options.parent;			
	},
	_render: function() {			
		if (this.model.get('css')) { 
			for (let i = 0; i < this.model.get('css').length; i++) this.el.classList.add(this.model.get('css')[i]);
		}
		if (this.model.get('disabled')) this.el.classList.add('disabled');
		if (this.model.get('readonly')) this.el.classList.add('readonly');
		this.__render();		
		let json = _.extend(this.model.toJSON(), { 'lang': LANG });
		this.el.innerHTML = this.template_compiled(json);
	},
	__render: function() {
	},
	_touchEnd: function(event, childElement) {
		if (this.model.get('readonly') || this.model.get('disabled')) return false;
		return this.__touchEnd(event, childElement);
	},
	__touchEnd: function(event, childElement) {			
		return false;
	},
	touchEndB: function(event, childElement) {
		if (!this.isMoving) {
			if (!this.model.get('disabled')) return this._touchEndB(event, childElement);				
		}
		return false;
	},
	_touchEndB: function(event, childElement) {
		return false;
	}
});
