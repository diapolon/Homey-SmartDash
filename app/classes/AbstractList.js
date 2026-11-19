/*11/06/2024*/
'use strict';
const AbstractList = AbstractView.extend({
	listClass: 'rows',
	views: [],
	types: { 
		'Empty': 'ListItemEmpty',
		'Html': 'ListItemHtml',		
		'MenuBar': 'ListItemMenuBar',
		'BottomBar': 'ListItemBottomBar',
		'Page': 'ListItemPage',				
		'Link': 'ListItemLink',
		'PushButton': 'ListItemPushButton',				
		'TextBox': 'FormItemTextBox',		
		'SelectList': 'FormItemSelectList'
	 },
	_initialize: function(options) {
		//this.listenToOnce(this, 'refresh', this.refresh);
		this.views = this.initializeItems(this.model);
		this.__initialize(options);
	},
	__initialize: function(options) { },
	_domReady: function() {	
		this.list = document.getElementById(this.id).getElementsByClassName(this.listClass)[0];		
		this.renderItems(this.views, this.list);
		this.__domReady();
	},
	__domReady: function() { },
	_onClose: function() {
		 _.invoke(this.views, 'close');
		this.views = [];
		this.__onClose();
	},
	__onClose: function() { },
	getType: function(type) {	
		if (this.types[type] == undefined) type = 'Unknown';
		return eval(this.types[type]);
	},
	initializeItems: function(model) {	
		let views = [];		
		let self = this;		
		_.each(model, function(content, index) {			
			const type = content.get('type');			
			const obj = self.getType(type);
			const view = new obj({ model: content, parent: self });			
			view.render();
			views.push(view);
		});			
		return views;
	},
	renderItems: function(views, list) {			
		if (views.length) {
			while (list.lastChild) list.removeChild(list.lastChild);
			let fragment = document.createDocumentFragment();
			_.each(views, function(view) {
				fragment.appendChild(view.el);				
  			});
			list.appendChild(fragment);
			_.each(views, function(view) {				
				view.trigger('domReady');
  			});
		}			
	},
	refresh: function(model) {		
		if (model) this.model = model;
		this.views = this.initializeItems(this.model);
		let self = this;
		window.setTimeout(function() {								
			self.renderItems(self.views, self.list);			
		}, 500);
	}		
});

const AbstractForm = AbstractList.extend({
	listClass: 'form',
	types: {
			'Empty': 'ListItemEmpty',
			'Page': 'FormItemPage',				
			'TextBox': 'FormItemTextBox', 
			'Hidden': 'FormItemHidden', 
			'Html': 'FormItemHtml',
			'Image': 'FormItemImage',
			'Password': 'FormItemPassword',
			'Number': 'FormItemNumber',
			'Date': 'FormItemDate',
			'Email': 'FormItemEmail',			
			'TextArea': 'FormItemTextArea',
			'CheckBox': 'FormItemCheckBox',						
			'OptionBox': 'FormItemOptionBox',
			'SelectList': 'FormItemSelectList',			
			'SelectMultiple': 'FormItemSelectMultiple',			
			'Size': 'FormItemSize',			
			'IconPicker': 'FormItemIconPicker',						
			'ColorPicker': 'FormItemColorPicker',			
			'PushButton': 'FormItemPushButton'
		 }
});