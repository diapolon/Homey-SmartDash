/*07/09/2023*/
'use strict';	
const AbstractView = Backbone.View.extend({
	template: '',		
	template_compiled: undefined,		
	events: {
	},
	initialize: function(options) {
		this.listenToOnce(this, 'domReady', this.domReady);
		this.isTouching = false;
		this.isMoving = false;
		this.params = { config: CONFIG, language: LANG };
		this._initialize(options);
	},
	_initialize: function(options) { },
	render: function() {	
		this.template_compiled = Handlebars.templates[this.template];
		this._render();
		return this;
	},
	_render: function() {			
		this.__render();
		this.el.innerHTML = this.template_compiled(this.params);
	},
	__render: function() {
	},
	domReady: function() {
		this._domReady();
	},
	_domReady: function() {	},		
	touchMove: function(event, childElement) {
		this._touchMove();
		childElement.classList.remove('tapped');
	},
	touchCancel: function(event, childElement) {
		this._touchCancel();
		childElement.classList.remove('tapped');
	},
	touchStart: function(event, childElement) {
		if (this._touchStart()) return;
		childElement.classList.add('tapped');		
	},
	_touchMove: function() {
		this.isTouching = false;
		this.isMoving = true;
	},
	_touchCancel: function() {
		this.isTouching = false;
		this.isMoving = false;
	},
	_touchStart: function() {
		if (this.isTouching) return true;
		this.isTouching = true;
		this.isMoving = false;		
		return false;	
	},
	touchEnd: function(event, childElement) { 
		childElement.classList.remove('tapped');
		if (this.isTouching) {
			this.isTouching = false;
			if (!this.isMoving) return this._touchEnd(event, childElement);				
		}
		return false;
	},
	_touchEnd: function(event, childElement) {
		return false;
	},
	onClose: function() {
		this._onClose();
	},
	_onClose: function() { }
});
