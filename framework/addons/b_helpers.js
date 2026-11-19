'use strict';
Backbone.View.prototype.close=function(){if(this.onClose)this.onClose();this.unbind();this.remove();};