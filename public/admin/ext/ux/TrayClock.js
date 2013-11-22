Ext.define("Ext.ux.TrayClock", {
	extend : "Ext.toolbar.TextItem",
	alias : "widget.trayclock",
	cls : "ux-desktop-trayclock defaultFont",
	html : "&#160;",
	timeFormat : "l d F Y - G:i",
	tpl : "{time}",
	initComponent : function() {
		var a = this;
		a.callParent();
		if (typeof (a.tpl) == "string") {
			a.tpl = new Ext.XTemplate(a.tpl)
		}
	},
	afterRender : function() {
		var a = this;
		Ext.Function.defer(a.updateTime, 100, a);
		a.callParent()
	},
	onDestroy : function() {
		var a = this;
		if (a.timer) {
			window.clearTimeout(a.timer);
			a.timer = null
		}
		a.callParent()
	},
	updateTime : function() {
		var a = this, b = Ext.Date.format(new Date(), a.timeFormat), c = a.tpl
				.apply({
					time : b
				});
		if (a.lastText != c) {
			a.setText(c);
			a.lastText = c
		}
		a.timer = Ext.Function.defer(a.updateTime, 10000, a)
	}
});