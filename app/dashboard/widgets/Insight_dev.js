/*03/01/2025*/
'use strict';
const WidgetInsight = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget insight',
		template: 'widget_insight',
		___render: function() {						
			this.chart_colors = { white: '#ffffff', blue: '#4d6ab4', green: '#00b765', red: '#f5413b', orange: '#febb1b', yellow: '#f5ec06', violet: '#a066ae', grey: '#969696', black: '#39393a' };			
		},
		_domReady: function() {			    	
			this.el.classList.add('shadow');
		    const canvas = this.el.getElementsByClassName('chart')[0];	    
		    //this.chart = new Chart(canvas.getContext('2d'), { type: 'line', data: { labels: [], datasets: [] },  options: this.chart_options  });
		    this.chart = echarts.init(canvas, null, { width: this.el.offsetWidth, height: this.el.offsetHeight });
		    this.series = [];
		    
		    const widget = this.model.get('widget');
		    
		    this.insight_resolution = widget.insight.resolution;	    
		    		    
			this.insight_devices = widget.device.split('|');
			
			this.insight_values = widget.insight.value.split('|');
			this.insight_types = widget.insight.type.split('|');
			this.insight_colors = widget.insight.color.split('|');
			
			this.mode = '';
			if (this.insight_devices.length > 1) {		
				this.units = HOMEY.data.insights[this.insight_devices[0]][this.insight_values[0]].units;		
				//this.chart.options.scales.y.title.text = this.units;
				if (this.allEqual(this.insight_devices)) {
					this.mode = 'device';
					//this.chart.options.plugins.title.text += HOMEY.data.devices[this.insight_devices[0]].name +': ';
				} else if (this.allEqual(this.insight_values)) {
					this.mode = 'insight';
					//this.chart.options.plugins.title.text += HOMEY.data.insights[this.insight_devices[0]][this.insight_values[0]].name + ': ';
				}
			}
			
			this.chart.setOption({ animation: false, legend: {}, xAxis: [{ type: 'category' }], yAxis: [{ type: 'value' }], series: [] });
			this.chart.showLoading();
			this.domRefresh();		
		},
		domRefresh: function() {					
			for (const i in this.insight_devices) {						
				if (this.insight_devices[i] != '') {					
					this.updateInsight(i, this.insight_devices[i], this.insight_values[i], this.insight_types[i], this.insight_colors[i], this.insight_resolution);				
				}	
			}		  			 
		},
		updateInsight: function(dataset, device, insight, type, color, resolution) {							
			let self = this;		     
		    Homey.getInsight(device, insight, resolution, function(json) {		    
		    	const day = ['today', 'yesterday'].includes(resolution);
		        let labels = [];
		        let data = [];		        
		        let values = {};		        
		        for (const i in json.values) {	
		        	const val = json.values[i];    		        	
		            const v = parseFloat(val.v == null ? 0 : val.v);	            		            
		            const t = (day ? self.getTime(val.t, null): getTime(val.t, null));
	            	if (t) {
	            		if (!values[t]) values[t] = [];
	            		values[t].push(v);			            	
				    }			        
		        }	
		        
		        for (const i in values) {	
		        	//if (self.chart.data.datasets.length == 0) 
		        	labels.push(i);		        	
		        	data.push(self.getAverage(values[i], 2));
		        }
		        //if (day) alert(JSON.stringify(labels));
		        let text = '';
		        if (self.mode != 'device') text += HOMEY.data.devices[device].name + ': ';
		        if (self.mode != 'insight') text += HOMEY.data.insights[device][insight].name;
		        switch(type) {
		        	case 'sum_k':
		        		if (day && self.units == 'W') text += ': '+ (self.getSum(data) / 1000).toFixed(1) +' kWh';		        		
		        		break;
		        	case 'sum_abs':
		        		if (day && self.units == 'W') text += ': '+ (self.getSumAbs(data) / 1000).toFixed(1) +' kWh';		        				        		
		        		break;		        		
		        	case 'average_p':		        		
		        	case 'average_c':		        		
		        		text += ' → '+ self.getAverage(data, 0) + self.units +' / ↓ '+ self.getMin(data).toFixed(0) + self.units +' / ↑ '+ self.getMax(data, 0) + self.units;
		        		break;
		        	default:
		    	}    	
		    	
		    	self.series[dataset] = { name: text, type: 'line', sampling: 'lttb', symbol: 'none', label: { fontSize: 10 }, areaStyle: { opacity: 0.2 }, itemStyle: { color: color }, data: data };
		    	
		    	self.chart.hideLoading();
		    	self.chart.setOption({ xAxis: [{ data: labels }], series: self.series });
		    	
		    	self.el.classList.remove('shadow');
			}, function(json) {
				self.el.classList.remove('shadow');
				//mettere altra tipologia di avviso per gli errori
				//System.notify_alert(json.message, LANG.notify.title.alert, LANG.buttons.ok);													
			});	
		},
		refresh: function() {				
		    this.domRefresh();		
		},
		getTime: function(t, invalidReturn) {							
			let d = new Date(t);	    						
			if (t === 0 || isNaN(d.getTime())) return invalidReturn;		
			const timeOfDay = d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
			const sampleRate = 3600;
			let d2 = new Date(d.getTime() - (timeOfDay % sampleRate) * 1000);			
			return ('0'+ (parseInt(d2.format('H')) + parseInt(d.format('o', true)))).slice(-2) +':00';
		},
		allEqual: function(array) {			
  			return new Set(array.filter(item => item)).size == 1;
		},
		getSum: function(array) {
  			let sum = 0;
  			for (let i = 0; i < array.length; i++) sum += array[i];  
  			return sum;
		},
		getSumAbs: function(array) {
  			let sum = 0;
  			for (let i = 0; i < array.length; i++) sum += Math.abs(array[i]);  
  			return sum;
		},
		getMin: function(array, decimal) {
			return Math.round(Math.min(...array), decimal);  			
		},
		getMax: function(array, decimal) {
			return Math.round(Math.max(...array), decimal);  			
		},
		getAverage: function(array, decimal) {
  			const sum = this.getSum(array);  			
  			return Math.round(sum / array.length, decimal);
		}
	}),
	edit: function(data, widget, panel) {								
		let items = [];		
		
		let colors = [], colors2 = [];
		for (const c in LANG.forms.options.colors) {
			colors.push({ icon: LANG.forms.options.colors[c], value: LANG.forms.options.colors[c] });										
			colors2.push({ icon: LANG.forms.options.colors[c], value: LANG.forms.options.colors[c] });										
		}
				
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.config +'</h2>' }));		
		items.push(new Models.ListItem({ id: 'dashboard_name', name: '<h4 class="title">'+ LANG.fields.name +'</h4>', type: 'TextBox', value: data.name }));		
		
		let devices = { values: [""], labels: [LANG.forms.options.device] };						
		for (const device_id in HOMEY.data.devices) {			
			const device = HOMEY.data.devices[device_id];    									
			if (device.insights == 1) {					
				devices.values.push(device_id);
				devices.labels.push(device.name +' ('+ HOMEY.data.zones[device.zone].name +')');
			}
		}
		
		let insight_units = '';
				
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.devices +'</h2>' }));															
		
		let data_devices = [];		
		for (let i = 0; i < 5; i++) data_devices.push({ 'device': '', insight: { value: '', type: '', color: 'blue' }, insights: { values: [""], labels: [LANG.forms.options.insight.choose] } });
		
		if (widget != '-1') {
			let insight_devices = data.device.split('|');
			let insight_values = data.insight.value.split('|');
			let insight_types = data.insight.type.split('|');
			let insight_colors = data.insight.color.split('|');
			insight_units = HOMEY.data.insights[insight_devices[0]][insight_values[0]].units;
			for (const i in insight_devices) {			
				data_devices[i].device = insight_devices[i];
				data_devices[i].insight.value = insight_values[i];
				data_devices[i].insight.type = insight_types[i];
				data_devices[i].insight.color = insight_colors[i];			
				if (data_devices[i].device != '') {
					for (const ins_id in HOMEY.data.insights[data_devices[i].device]) {
						data_devices[i].insights.values.push(ins_id);
						data_devices[i].insights.labels.push(HOMEY.data.insights[data_devices[i].device][ins_id].name +' ('+ HOMEY.data.insights[data_devices[i].device][ins_id].units +')');					
					}
				}
			}
		}
		
		const callback_device = function(rel, value) { 				
			let name = document.getElementById('dashboard_name');
			if (name.value == '') name.value = HOMEY.data.devices[value].name;								
			let insights = document.getElementById('dashboard_insight'+ rel);
			insights.innerHTML = '<option value="">'+ LANG.forms.options.insight.choose +'</option>';						
			for (const ins_id in HOMEY.data.insights[value]) {				
				if (insight_units == '' || HOMEY.data.insights[value][ins_id].units == insight_units) insights.innerHTML += '<option value="'+ ins_id +'">'+ HOMEY.data.insights[value][ins_id].name +' ('+ HOMEY.data.insights[value][ins_id].units +')' +'</option>';															
			}
		};
		
		const callback_insight = function(rel, value) { 				
			if (insight_units == '') {
				let device = document.getElementById('dashboard_device'+ rel);
				insight_units = HOMEY.data.insights[device.value][value].units;			
			}
		};

		for (const i in data_devices) {			
			items.push(new Models.ListItem({ id: 'dashboard_device'+ i, name: '<h4 class="title">'+ LANG.fields.insight +' #'+ (parseInt(i) + 1) +'</h4>', type: 'SelectList', value: data_devices[i].device, options: { values: devices.values, labels: devices.labels }, rel: i, callback: callback_device }));			
			items.push(new Models.ListItem({ id: 'dashboard_insight'+ i, name: '', type: 'SelectList', value: data_devices[i].insight.value, options: data_devices[i].insights, css: ['fl'], rel: i, callback: callback_insight }));
			items.push(new Models.ListItem({ id: 'dashboard_insight_type'+ i, type: 'SelectList', name: '', value: data_devices[i].insight.type, options: LANG.forms.options.insight.aggregations, css: ['fl', 'm'] }));
			items.push(new Models.ListItem({ id: 'dashboard_insight_color'+ i, type: 'ColorPicker', name: '', value: data_devices[i].insight.color, options: colors, css: ['fr', 'xs'] }));									
		}
		
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.params +'</h2>' }));													
		items.push(new Models.ListItem({ id: 'dashboard_insight_resolution', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.insight_resolution +'</h4>', value: data.insight.resolution, options: LANG.forms.options.insight.resolutions }));				
				
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.aspect +'</h2>' }));									
		items.push(new Models.ListItem({ id: 'dashboard_hidename', type: 'CheckBox', value: data.hidename, name: '<h4 class="title">'+ LANG.fields.hidename +'</h4>', css: ['x3'] }));								
		items.push(new Models.ListItem({ id: 'dashboard_locked', type: 'CheckBox', value: data.locked, name: '<h4 class="title">'+ LANG.fields.locked +'</h4>', css: ['x3'] }));																	
		items.push(new Models.ListItem({ id: 'dashboard_opacity', type: 'CheckBox', value: data.opacity, name: '<h4 class="title">'+ LANG.fields.opacity +'</h4>', css: ['x3'] }));												
		
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.display +'</h2>' }));							
		items.push(new Models.ListItem({ id: 'dashboard_font_size', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.font_size +'</h4>', value: data.font.size, options: LANG.forms.options.font_sizes, css: ['x3'] }));					
		items.push(new Models.ListItem({ id: 'dashboard_dimension_portrait', type: 'Size', name: '<h4 class="title">'+ LANG.fields.dimension_portrait +'</h4>', values: data.dimension.p.split('x'), options: { values: LANG.forms.options.formats.p.x, labels: LANG.forms.options.formats.p.x }, options_y: { values: LANG.forms.options.formats.p.y, labels: LANG.forms.options.formats.p.y }, css: ['fl', 'x3'] }));				
		items.push(new Models.ListItem({ id: 'dashboard_dimension_landscape', type: 'Size', name: '<h4 class="title">'+ LANG.fields.dimension_landscape +'</h4>', values: data.dimension.l.split('x'), options: { values: LANG.forms.options.formats.l.x, labels: LANG.forms.options.formats.l.x }, options_y: { values: LANG.forms.options.formats.l.y, labels: LANG.forms.options.formats.l.y }, css: ['fl', 'x3'] }));				

		colors2.push({ icon: 'transparent', value: 'transparent' });												
		items.push(new Models.ListItem({ id: 'dashboard_textcolor', type: 'ColorPicker', name: '<h4 class="title">'+ LANG.fields.textcolor + '</h4>', value: data.textcolor, options: colors2 }));						
		items.push(new Models.ListItem({ id: 'dashboard_color', type: 'ColorPicker', name: '<h4 class="title">'+ LANG.fields.color + '</h4>', value: data.color, options: colors2 }));								
		
		return items;
	},
	save: function(data, widget, panel) {							
		let insight_devices = [];
		let insight_values = [];
		let insight_types = [];
		let insight_colors = [];
		for (let i =0 ; i<5; i++) {
			const device = document.getElementById('dashboard_device'+ i);	
			if (i == 0 && device.value == '') return false;				
			const insight = document.getElementById('dashboard_insight'+ i);							 
			if (device.value != '' && insight.value == '') return false;				
			insight_devices.push(device.value);
			insight_values.push(insight.value);
			insight_types.push(document.getElementById('dashboard_insight_type'+ i).value);
			insight_colors.push(document.getElementById('dashboard_insight_color'+ i).value);
		}	
		
		const insight_resolution = document.getElementById('dashboard_insight_resolution');							 
		if (insight_resolution.value == '') return false;								
		
		data['device'] = insight_devices.join('|');
		data['insight']['resolution'] = insight_resolution.value;				
		data['insight']['value'] = insight_values.join('|');
		data['insight']['type'] = insight_types.join('|');
		data['insight']['color'] = insight_colors.join('|');
		
		return data;				
	}
}
