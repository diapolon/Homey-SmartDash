/*28/06/2023*/
'use strict';
const ListItemMenuBar = AbstractListItem.extend({
	className: 'row menuitem',
	template: 'listitem_menubar',
	_initialize: function(options) {
		this.parent = options.parent;			
		this.selected = options.selected;
	},
	_render: function() {
		this.model.set('name', LANG.menu[this.model.get('name')].name);
		if (this.model.get('css')) { 
			for (let i = 0; i < this.model.get('css').length; i++) this.el.classList.add(this.model.get('css')[i]);
		}
		if (this.selected) this.el.classList.add('selected');
		this.el.innerHTML = this.template_compiled(this.model.toJSON());
	},
	__touchEnd: function(event, childElement) {
		let elements = this.parent.el.getElementsByClassName('menuitem selected');			
		if (elements.length) elements[0].classList.remove('selected');
		childElement.classList.add('selected');				
		if (this.model.get('link') != '') return System.handle_openLink(event, this.model.get('link'));					
		this.parent.menuClose(true);
		let self = this;
		window.setTimeout(function () {
	  		System.navigate(self.model.get('route'), 'fade');
		});
		return false;
	}
});
