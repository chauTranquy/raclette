Ext.define('TextoCMS.model.cms.ArboTreeModel', {
	extend : 'Ext.data.Model',

	idProperty : 'id_rubrique',
	fields : [
			'type',
			'title',
			'templateRef',
			{
				name : 'callback',
				convert : function(v, record) {

				}.bind(this)
			},
			{
				name : 'id_template',
				type : 'int'
			},
			{
				name : 'statut',
				type : 'int'
			},
			{
				name : 'id_rubrique',
				type : 'int'
			},
			{
				name : 'text',
				mapping : 'title'
			},
			{
				name : 'id_template',
				type : 'int'
			},
			{
				name : 'iconCls',
				mapping : 'type',
				convert : function(v, record) {
					var v = record.data.type;
					if (record.data.statut == 0)
						v += 'Offline';
					return v;
				}
			},
			{
				name : 'qtip',
				mapping : 'title',
				convert : function(v, record) {
					v = record.data.title
							+ ' - '
							+ (record.data.statut == 0 ? 'Hors ligne'
									: 'En ligne');
					return v;

				}
			} ],
			proxy:{type:'texto'}
});