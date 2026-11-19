'use strict';	
const Models = {
	initialize: function() {
		this.ListItem = Backbone.Model.extend({ defaults: { name: '', desc: '', section: '', options: [], css: [], callback: [] } });
	}
};
const Collections = {
	AbstractCollection: Backbone.Collection.extend({
		'sort_key': 'ordering',
		'comparator': function(item) { return item.get(this.sort_key); },
		'sortByField': function(field) {
				this.sort_key = field;
				this.sort();
		},		
		'exists': function(uid) { return (this.findWhere({ uid: uid }) !== undefined); },		
	}),
	initialize: function() {
		Models.initialize();		
		this.ListItems = this.AbstractCollection.extend({ 'model': Models.ListItem });		
	}
};

