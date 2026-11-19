/*03/06/2024*/
'use strict';
const GridMenu = {
	dashboard: GridButton.dashboard.extend({
		template: 'grid_menu',
		__render: function() {
			if (DATABASE.pin.enabled == 1) this.el.classList.add('locked');
		},
		__touchEnd: function(event, childElement) {					
			let section = 'sections/panels/'+ this.parent.current;
			const elements = this.parent.parent.bottombar.el.getElementsByClassName('listitem');			
			elements[0].classList.remove('selected');
			elements[1].classList.add('selected');
			if (DATABASE.pin.enabled == 1 && this.parent.parent.pinpad.locked) { 
				this.parent.parent.pinpad.show(section);	
			} else {
				System.navigate(section, 'fade');													
			}
			return false;
		}	
	})
}