/*06/02/2025*/
'use strict';
const WidgetGenericThermostat = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget thermostat',
		template: 'widget_genericthermostat',
		events: {
			'touchstart .button': 'touchStart',
			'touchcancel .button': 'touchCancel',
			'touchmove .button': 'touchMove',
			'touchend .button': 'touchEnd'
		},		
		states: { 'off': { color: 'off', icon: 'power-standby' }, 'onoff': { color: 'onoff', icon: 'power-standby' }, 'cool': { color: 'blue', icon: 'snowflake' }, 'cooling': { color: 'blue', icon: 'snowflake' }, 'heat': { color: 'orange', icon: 'fire' }, 'heating': { color: 'orange', icon: 'fire' }, 'dry': { color: 'green', icon: 'water-percent' }, 'fanonly': { color: 'orange', icon: 'fan' }, 'auto': { color: 'off', icon: 'thermostat-auto' }, 'timer': { color: 'off', icon: 'timer' }, 'schedule': { color: 'off', icon: 'timer' }, 'manual': { color: 'off', icon: 'hand-back-left' } },
		___render: function() {		
			let buttons = [];
			
			let target = false;		
			let measure = false;					
			let mode = false;		
			let onoff = false;		
			
			if (this.model.get('data')['target_temperature'] != undefined) target = 'target_temperature';
			else if (this.model.get('data')['target_temperature_indoor'] != undefined) target = 'target_temperature.indoor';
			
			if (target) {
				if (this.model.get('data')[target].step == undefined) this.model.get('data')[target].step = 0.5;
				if (this.model.get('data')[target].min == undefined) this.model.get('data')[target].min = 12;
				if (this.model.get('data')[target].max == undefined) this.model.get('data')[target].max = 32;
				this.model.set('target', this.model.get('data')[target]);									
			}
			
			if (this.model.get('data')['measure_temperature'] != undefined) measure = 'measure_temperature';
			else if (this.model.get('data')['measure_temperature_indoortemperature'] != undefined) measure = 'measure_temperature.indoortemperature';					
			
			if (measure) {	
				this.model.set('measure', this.model.get('data')[measure]);									
			}
			
			if (this.model.get('data')['thermostat_mode'] != undefined) mode = 'thermostat_mode';
			else if (this.model.get('data')['climate_mode'] != undefined) mode = 'climate_mode';					
			else if (this.model.get('data')['netatmo_thermostat_mode'] != undefined) mode = 'netatmo_thermostat_mode';					
			else if (this.model.get('data')['thermostat_mode_operation'] != undefined) mode = 'thermostat_mode.operation';					
			else if (this.model.get('data')['thermostat_cmode'] != undefined) mode = 'thermostat_cmode';					
			else if (this.model.get('data')['operation_mode'] != undefined) mode = 'operation_mode';					
			else if (this.model.get('data')['target_ac_mode1'] != undefined) mode = 'target_ac_mode1';					
			
			if (mode) {
				for (const v of Object.values(this.model.get('data')[mode].values)) {										
					if (this.states[v.id.toLowerCase()] != undefined) {						
						buttons.push({ value: v.id, icon: this.states[v.id.toLowerCase()].icon, active: (this.model.get('data')[mode].value == v.id) });
					}
				}				
				this.model.set('mode', this.model.get('data')[mode]);
			}
						
			if (this.model.get('data')['onoff'] != undefined) onoff = 'onoff';				
			else if (this.model.get('data')['onoff_onoff'] != undefined) onoff = 'onoff.onoff';
			
			if (onoff) {					
				buttons.push({ value: onoff, icon: this.states['onoff'].icon, active: (this.model.get('data')[onoff].value) });
				this.model.set('onoff', this.model.get('data')[onoff]);									
			}
			if (buttons.length > 0) this.model.set('buttons', buttons);
		},
		___touchEnd: function(event, childElement) {		
			const device = this.model.get('widget').device;
			const op = childElement.getAttribute('data-op');		
			let value;
			let capability;
			let target;
			switch(op)	{
				case 'up':				
					//capability = 'target_temperature';				
					capability = this.model.get('target').id;
					target = this.model.get('target');
					if (target.value + target.step <= target.max) value = target.value + target.step;
					break;
				case 'down':				
					//capability = 'target_temperature';
					capability = this.model.get('target').id;
					target = this.model.get('target');
					if (target.value + target.step >= target.min) value = target.value - target.step;				
					break;
				case 'onoff':
				case 'onoff_onoff':
					//capability = 'onoff';
					capability = this.model.get('onoff').id;
					value = !this.model.get('onoff').value;						
					break;
				default:
					capability = this.model.get('mode').id;
					value = op;
					break;
			}							
			if (this.model.get('data')[capability].setable) this.updateCapability(device, capability, value);
			return false;
		}
	}),
	edit: AbstractWidget.edit,
	save: AbstractWidget.save			
}