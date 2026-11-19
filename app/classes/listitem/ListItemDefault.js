/*11/12/2019*/
'use strict';
const ListItemEmpty = AbstractListItem.extend({	
	events: {},	
	className: 'row empty',
	template: 'listitem_empty'
});
const ListItemHtml = AbstractListItem.extend({
	events: {},
	className: 'row html',
	template: 'listitem_html'
});
const ListItemLink = AbstractListItem.extend({
	className: 'row link',
	template: 'listitem_link',
	__touchEnd: function(event, childElement) {
		return System.handle_openLink(event, this.model.get('link'));			
	}
});
const ListItemText = AbstractListItem.extend({
	className: 'row text',
	template: 'listitem_text'
});
const ListItemPage = AbstractListItem.extend({
	className: 'row menu',
	template: 'listitem_page',
	__touchEnd: function(event, childElement) {
		if (this.model.get('fade')) System.navigate(this.model.get('route'), 'fade');
		else System.navigate(this.model.get('route'), 'slide', 'left');
		return false;
	}
});
const ListItemPushButton = AbstractListItem.extend({
	className: 'row pushbutton',
	template: 'listitem_pushbutton',
	__touchEnd: function(event, childElement) {			
		return true;
	},
	_touchEndB: function(event, childElement) {
		System.navigate(childElement.getAttribute('data-route'), 'fade');													
		return false;
	}
});