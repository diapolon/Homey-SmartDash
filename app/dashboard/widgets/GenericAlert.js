/*10/05/2024*/
'use strict';
const WidgetGenericAlert = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget genericalert',
		template: 'widget_genericalert',
		___render: function() {				
			if (this.model.get('widget').capability) {
				this.model.set('capability', this.model.get('data')[this.model.get('widget').capability]);					
			}
		},
		domRefresh: function() {	
			if (this.model.get('capability')) {
				if (this.model.get('capability').value == '' || this.model.get('capability').value == '-') this.el.classList.remove('on');				
				else this.el.classList.add('on');							
			}
		}
	}),
	edit: AbstractWidget.edit,
	save: AbstractWidget.save			
}