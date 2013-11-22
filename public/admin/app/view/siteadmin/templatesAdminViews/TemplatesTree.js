Ext
		.define(
				'TextoCMS.view.siteadmin.templatesAdminViews.TemplatesTree',
				{
					extend : 'Ext.tree.Panel',
					alias : 'widget.templatestree',
					title : 'Organisation des gabarits',
					iconCls : 'templatesTree',
					layout : 'fit',
					tbar : [ {
						xtype : 'button',
						iconCls : 'addMainFolder',
						'text' : 'Ajouter un menu'
					}, {
						xtype : 'button',
						iconCls : 'addFolder',
						text : 'Ajouter',
						disabled : true
					}, '-', {
						xtype : 'button',
						iconCls : 'refreshBtn',
						text : 'Rafra&icirc;chir'
					} ],
					id : 'treeTpl',
					border : false,
					loadMask : true,
					useArrows : true,
					rootVisible : false,

					multiSelect : false,
					viewConfig : {
						allowCopy : true,
						plugins : {
							ptype : 'treeviewdragdrop',
							dragText : '{0} &eacute;l&eacute;ment s&eacute;lectionn&eacute;{1}',
							dropZone : {
								invalidHandleIds : {
									root : true
								}

							}
						}
					},

					columns : [ {
						xtype : 'treecolumn',
						text : '<div style="text-align:center">Nom</div>',
						sortable : false,
						draggable : false,
						menuDisabled : true,
						dataIndex : 'template_name',
						width : 250,
						fixed : true
					}, {
						text : 'Template associ&eacute;',
						dataIndex : 'templateRef',
						sortable : false,
						align : 'center',
						draggable : false,
						menuDisabled : true,
						fixed : true
					}, {
						xtype : 'actioncolumn',
						width : 40,
						// align:'center',
						sortable : false,
						draggable : false,
						menuDisabled : true,
						items : [ {
							iconCls : 'editBtn',
							icon : '/admin/img/icons/pencil.png', // Use a URL
																	// in the
																	// icon
																	// config
							tooltip : 'Editer',
							scope : this
						}, {
							iconCls : 'removeBtn',
							icon : '/admin/img/icons/delete.png',
							tooltip : 'Supprimer',
							scope : this
						/*
						 * getClass:function(v, meta, record){
						 * 
						 * if(record.childNodes.length>0)
						 * meta.attr="style='display:none'"; else return
						 * 'removeBtn'; }
						 */
						} ]
					}

					],
					initComponent : function() {
						var store = Ext
								.create('TextoCMS.store.siteadmin.TemplatesTreeStore');// rubrique_id

						store.model.getProxy().setExtraParam('API',
								'Admin_Model_TemplateMapper');
						store.model.getProxy().setExtraParam('APICall',
								'getTemplates');
						store.model.getProxy().setExtraParam('id_site',
								TextoCMS.siteId);
						// store.loda();
						
						this.store = store;
												
						this.on('afterrender', function(view){
							
						
							store.load();
							
							
						}, this);
						this.callParent(arguments);
					}

				});