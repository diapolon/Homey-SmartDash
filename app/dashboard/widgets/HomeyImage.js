/*28/12/2024*/
'use strict';
const WidgetHomeyImage = {
	dashboard: WidgetVirtualCamera.dashboard.extend({
		className: 'widget virtualcamera homeyimage',		
		updateId: '0',
		___render: function() {			
			this.hideupdate = (this.model.get('widget').hideupdatetime == 1);		
			this.model.get('widget').url = '';				
		},
		_refreshImage: function() {						
			if (this.model.get('widget')['image'].id != '') this._showImage(this.model.get('widget')['image'].id);	
			else this._refreshImageOwner();
		},
		_showImage: function(url) {
			const now = Date.now();									
			this.img.src = Homey.imgBaseUrl() + url +'?sdash='+ now;      										
			if (!this.hideupdate) this.update.innerHTML = getTime(now, '?');
      		//this.render().trigger('domRefresh');		
			/*let self = this;
			fetch(url).then(response => response.blob()).then(blob => {    
				const reader = new FileReader() ;
		      	reader.onload = function() { 
		      		self.model.set('lastUpdated', now);
					self.model.set('update', getTime(now, '?'));
		      		self.model.get('widget').url	= this.result;
		      		self.render().trigger('domRefresh');		
		      	} ;
		      	reader.readAsDataURL(blob) ;
  			});*/
		},		
		_refreshImageOwner: function() {														
			let self = this;			
			const callback = function(json) { 					
				let img = _.chain(json).where({ ownerUri: self.model.get('widget')['image'].owner });
				switch (self.model.get('widget')['image'].mode) {
					case 'latest':
						img = img.sortBy('lastUpdated').last().value();
						self._showImage(img.url);										
						 break;
					case 'random':
						img = img.reject({ id: self.updateId }).sample().value();
						if (img) {							
							self.updateId = img.id;
							self._showImage(img.url);				
						}						
						break;
				}									
			};		
			Homey.get('images/image', callback);				
		}		
	}),
	edit: function(data, widget, panel) {		
		let images = {};		
		const callback_ids = function(rel, value) { 								
			let img_owners = document.getElementById('dashboard_image_owner');
			let options = document.getElementsByClassName('options2');									
			if (value != '')	 {
				for (let i = 0; i < options.length; i++) options[i].classList.add('hide');   			
				img_owners.selectedIndex = 0;	
				callback_preview(value);				
			}
		};		
		const callback_owners = function(rel, value) { 					
			let img_ids = document.getElementById('dashboard_image_id');
			let options = document.getElementsByClassName('options2');									
			if (value != '')	 {
				for (let i = 0; i < options.length; i++) options[i].classList.remove('hide');   			
				img_ids.selectedIndex = 0;			
				const img = _.chain(images).where({ ownerUri: value }).sortBy('lastUpdated').last().value();
				callback_preview(img.url);
			}
		};		
		
		const callback_preview = function(image) { 					
			let preview = document.getElementById('preview');
			let preview_url = document.getElementById('preview_url');
			let options = document.getElementsByClassName('options');						
			for (let i = 0; i < options.length; i++) options[i].classList.remove('hide');   			
			const img = Homey.imgBaseUrl() + image;
			preview.src = img;			
			preview.onerror = function() {				
				fetch(img).then(res => res.json()).then(json => System.notify_alert(json.error, LANG.notify.title.alert, LANG.buttons.ok));
				ImgError(this);
			}
			preview_url.value = img;			
		};		
		
		const callback = function(json) { 					
			images = json;
			System.spinner_hide();			
			let img_ids = document.getElementById('dashboard_image_id');
			let img_owners = document.getElementById('dashboard_image_owner');
			let img_owners_mode = document.getElementById('dashboard_image_mode');
			let options = document.getElementsByClassName('options2');									
			let owners = [];
			if (img_ids != null && img_owners != null) {
				for (const img_id in json) {
					if (!owners.includes(json[img_id].ownerUri)) {
						owners.push(json[img_id].ownerUri);
						img_owners.innerHTML += '<option value="'+ json[img_id].ownerUri +'"'+ (data.image.owner != '' && data.image.owner == json[img_id].ownerUri ? ' selected="selected"' : '') +'>'+ json[img_id].ownerUri +'</option>';																
						if (data.image.owner != '' && data.image.owner == json[img_id].ownerUri) {
							for (let i = 0; i < options.length; i++) options[i].classList.remove('hide');   			
							let img;
							switch (img_owners_mode.value) {
								case 'latest':
									 img = _.chain(images).where({ ownerUri: data.image.owner }).sortBy('lastUpdated').last().value();
									 break;
								case 'random':
									img = _.chain(images).where({ ownerUri: data.image.owner }).sample().value();
									break;
							}	
							if (img) callback_preview(img.url);											
						}
					}
					img_ids.innerHTML += '<option value="'+ json[img_id].url +'"'+ (data.image.id != '' && data.image.id == json[img_id].url ? ' selected="selected"' : '') +'>'+ json[img_id].id +' | '+ json[img_id].ownerUri +'</option>';				
					if (data.image.id != '' && data.image.id == json[img_id].url) {
						callback_preview(data.image.id);										
					}
				}
			}			
		};				
		System.spinner_show();		
		
		window.setTimeout(function() {	
			Homey.get('images/image', callback);				
		}, 2000);																									
		
		let items = [];		
		
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.config +'</h2>' }));			
		items.push(new Models.ListItem({ id: 'dashboard_name', name: '<h4 class="title">'+ LANG.fields.name +'</h4>', type: 'TextBox', value: data.name }));		
								
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.params +'</h2>' }));							
		items.push(new Models.ListItem({ id: 'dashboard_image_id', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.image_id +'</h4>', value: data.image.id, options: { values: [""], labels: [LANG.forms.options.choose] }, rel: '', callback: callback_ids }));										
		items.push(new Models.ListItem({ id: 'dashboard_image_owner', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.image_owner +'</h4>', value: data.image.owner, options: { values: [""], labels: [LANG.forms.options.choose] }, rel: '', callback: callback_owners, css: ['x2'] }));						
		items.push(new Models.ListItem({ id: 'dashboard_image_mode', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.image_mode +'</h4>', value: data.image.mode, options: LANG.forms.options.image.mode, css: ['options2', 'x2', 'hide'] }));		
		items.push(new Models.ListItem({ id: 'preview_url', name: '<h4 class="title">'+ LANG.fields.image_preview +'</h4>', type: 'TextBox', value: '' }));		
		items.push(new Models.ListItem({ type: 'Html', html: '<div class="p10t"><img class="responsive" id="preview" src="" /></div>', css: ['options', 'hide'] }));		
		items.push(new Models.ListItem({ id: 'dashboard_image_fit', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.image_fit +'</h4>', value: data.image.fit, options: LANG.forms.options.image.fit, css: ['x2'] }));										
		items.push(new Models.ListItem({ id: 'dashboard_refresh', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.refresh +'</h4>', value: data.refresh, options: LANG.forms.options.refresh, css: ['x2'] }));					
		
		let icons = [];
		for (const icon in json_data.icons) {			
			if (json_data.icons[icon].includes(data.type)) icons.push(icon);
		}
		if (icons.length > 1) items.push(new Models.ListItem({ id: 'dashboard_icon', type: 'IconPicker', name: '<h4 class="title">'+ LANG.fields.placeholder +'</h4>', placeholder: LANG.fields.icon_default, name_custom: LANG.fields.icon_custom, value: data.icon, options: icons }));											
			
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.aspect +'</h2>' }));							
		items.push(new Models.ListItem({ id: 'dashboard_hidename', type: 'CheckBox', value: data.hidename, name: '<h4 class="title">'+ LANG.fields.hidename +'</h4>', css: ['x3'] }));								
		items.push(new Models.ListItem({ id: 'dashboard_hideupdatetime', type: 'CheckBox', value: data.hideupdatetime, name: '<h4 class="title">'+ LANG.fields.hideupdatetime +'</h4>', css: ['x3'] }));								
		items.push(new Models.ListItem({ id: 'dashboard_locked', type: 'CheckBox', value: data.locked, name: '<h4 class="title">'+ LANG.fields.locked +'</h4>', css: ['x3'] }));									
		items.push(new Models.ListItem({ id: 'dashboard_opacity', type: 'CheckBox', value: data.opacity, name: '<h4 class="title">'+ LANG.fields.opacity +'</h4>', css: ['x3'] }));												
		
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.display +'</h2>' }));				
		items.push(new Models.ListItem({ id: 'dashboard_font_size', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.font_size +'</h4>', value: data.font.size, options: LANG.forms.options.font_sizes, css: ['x3'] }));					
		items.push(new Models.ListItem({ id: 'dashboard_dimension_portrait', type: 'Size', name: '<h4 class="title">'+ LANG.fields.dimension_portrait +'</h4>', values: data.dimension.p.split('x'), options: { values: LANG.forms.options.formats.p.x, labels: LANG.forms.options.formats.p.x }, options_y: { values: LANG.forms.options.formats.p.y, labels: LANG.forms.options.formats.p.y }, css: ['fl', 'x3'] }));				
		items.push(new Models.ListItem({ id: 'dashboard_dimension_landscape', type: 'Size', name: '<h4 class="title">'+ LANG.fields.dimension_landscape +'</h4>', values: data.dimension.l.split('x'), options: { values: LANG.forms.options.formats.l.x, labels: LANG.forms.options.formats.l.x }, options_y: { values: LANG.forms.options.formats.l.y, labels: LANG.forms.options.formats.l.y }, css: ['fl', 'x3'] }));				

		let colors = [];
		for (let c in LANG.forms.options.colors) colors.push({ icon: LANG.forms.options.colors[c], value: LANG.forms.options.colors[c] });										
		colors.push({ icon: 'transparent', value: 'transparent' });												
		items.push(new Models.ListItem({ id: 'dashboard_textcolor', type: 'ColorPicker', name: '<h4 class="title">'+ LANG.fields.textcolor + '</h4>', value: data.textcolor, options: colors }));						
		items.push(new Models.ListItem({ id: 'dashboard_color', type: 'ColorPicker', name: '<h4 class="title">'+ LANG.fields.color + '</h4>', value: data.color, options: colors }));						
		
		return items;
	},
	save: AbstractWidget.save			
}