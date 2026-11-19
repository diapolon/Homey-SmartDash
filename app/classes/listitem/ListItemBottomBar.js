/*30/11/2023*/
'use strict';
const ListItemBottomBar = AbstractListItem.extend({
	className: 'row listitem',
	template: 'listitem_bottombar',
	_initialize: function(options) {
		this.parent = options.parent;		
	},
	_render: function() {		
		if (this.model.get('css')) { 
			for (let i = 0; i < this.model.get('css').length; i++) this.el.classList.add(this.model.get('css')[i]);
		}
		if (this.model.get('selected') == 1) this.el.classList.add('selected');
		this.el.innerHTML = this.template_compiled(this.model.toJSON());
	},
	__touchEnd: function(event, childElement) {
		let elements = this.parent.el.getElementsByClassName('listitem selected');			
		if (elements.length) elements[0].classList.remove('selected');
		childElement.classList.add('selected');	
		System.navigate_resetHistory();
  		System.navigate(this.model.get('route'), 'fade');
		return false;
	}
});
