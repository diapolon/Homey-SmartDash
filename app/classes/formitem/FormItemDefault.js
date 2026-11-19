/*07/02/2024*/
'use strict';
const FormItemDate = AbstractListItem.extend({				
	template: 'formitem_date'		
});
const FormItemEmail = AbstractListItem.extend({				
	events: { },		
	className: 'field textbox email',
	template: 'formitem_email'		
});
const FormItemHidden = AbstractListItem.extend({
	events: { },				
	className: 'field hidden',
	template: 'formitem_hidden'
});
const FormItemHtml = AbstractListItem.extend({
	events: {},
	className: 'field html',
	template: 'formitem_html'
});
const FormItemTextBox = AbstractListItem.extend({
	events: { },				
	className: 'field textbox',
	template: 'formitem_textbox'
});
const FormItemTextArea = AbstractListItem.extend({
	events: { },				
	className: 'field textarea',
	template: 'formitem_textarea'
});
const FormItemPage = AbstractListItem.extend({
	className: 'field page',
	template: 'listitem_page',
	__touchEnd: function(event, childElement) {
		if (this.model.get('fade')) System.navigate(this.model.get('route'), 'fade');
		else System.navigate(this.model.get('route'), 'slide', 'left');
		return false;
	}
});
