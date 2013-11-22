Ext
		.define(
				'TextoCMS.controller.cms.ContentController',
				{
					description : 'Gestion de contenu',
					extend : 'TextoCMS.controller.BaseController',
					roots : [],
					selectedRub : null,
					views : [ 'TextoCMS.view.cms.CmsTab',
							'TextoCMS.view.cms.ArboTree',
							'TextoCMS.view.cms.ContentPanel',
							'TextoCMS.view.cms.ContentTab',
							'TextoCMS.view.cms.VersionTab' ],
					refs : [ {
						ref : "contentform",
						selector : 'contentform'
					}, {
						ref : 'contenttab',
						selector : 'cmstab'
					}, {
						ref : 'centerpanel',
						selector : 'cmstab panel[region=center]'
					} ],

					/**
					 * Initialisation du controller
					 */
					init : function() {
						
						this.defaultView = 'cmstab';
						this.control({
							/*
							 * 'viewport cmstab': {
							 * beforerender:this.initCmsPanel },
							 */
							'contentpanel':{
								afterrender:this.afterRenderContentPanel
								
							},
							
							'cmstab treepanel' : {
								itemclick : this.itemClick,
								itemmove : this.updateTree,
								beforeitemmove : function(node, oldParent,
										newParent) {
									return newParent.parentNode != null;
								}

							},
							'cmstab treepanel tool[type=refresh]' : {
								click : this.refreshTree

							},
							'cmstab':{
							//	activate:this.activateTab
							}
						});


						this.callParent(arguments);
						TextoCMS.app.addController('TextoCMS.controller.cms.FormController');
						TextoCMS.app.addController('TextoCMS.controller.cms.VersionController');						
						
						
						this.onLaunch(this);
						
						
					},
					initController:function(){
						
						this.viewport.down('[region=center]').add(Ext.widget(this.defaultView));
						this.centerPanel = this.getCenterpanel();
						
						this.selectedRub=null;
						//this.getContenttab().on('activate', this.activateTab,this);
						// on recupere la liste des roots
						this.ajax(DEFAULT_ADMIN_URL, {
							API : 'Admin_Model_ArboMapper',
							APICall : 'getRoots',
							id_site:TextoCMS.siteId
						}, Ext.bind(this.getRoots, this), false);

					},
					activateTab:function(){
						
						var me = this;
						tree=me.selectedTree;
						tree.selectPath(
								tree.getRootNode().firstChild.getPath());
						
						this.getContenttab().un('activate', this.activateTab,this);
						
					},
					/**
					 * Callback de la requête Ajax getRoots, affecte les id des
					 * racines des menus principaux
					 * 
					 * @see init
					 * @param result
					 */
					getRoots : function(result) {
						this.roots = result.roots;
						this.initCmsPanel();

					},
					/**
					 * Crée les tree des menus principaux après première
					 * activation du tabpanel
					 * 
					 * @param tab
					 */
					initCmsPanel : function() {

						var tab = this.getContenttab();
						var accordion = tab.down('panel');
						accordion.removeAll(true);
						var me = this;
						this.roots.each(function(root, index) {
							
							var tree = Ext.create('TextoCMS.view.cms.ArboTree',
									{
										title : root.title,
										collapsed : false,
										rubrique_id : root.id_rubrique
									});
							if (index == 0) {
								var handler = function(store) {
									me.selectedTree = tree;
									me.selectedRecord=tree.getRootNode().firstChild;
									tree.selectPath(
											tree.getRootNode().firstChild.getPath());
									me.itemClick(tree.getView(), tree
											.getRootNode().firstChild, null,
											null, null);
									
									tree.un('load', handler);
								};

								tree.on('load', handler);
							}
							accordion.add(tree);
							if(index==0) tree.expand();
							
						}.bind(this), this);
						accordion.doLayout();

					},

					/**
					 * handler du clique sur un noeud d'un tree
					 * 
					 * @param view
					 * @param record
					 * @param htmlElement
					 * @param index
					 * @param e
					 * @returns {Boolean}
					 */
					itemClick : function(view, record, htmlElement, index, e) {
											
						if (this.selectedRub == record)
							return;
						if (this.selectedRub
								&& !this.checkCMSFormDirty(this.loadFormData
										.bind(this, record), record, view,
										this.selectedRub))
							return;
						
						if(!Ext.isEmpty(record.get('callback'))){
							var controller=this.getController('TextoCMS.Modules.'+record.get('callback')[0]);
						};
						this.loadFormData(record);
					},
					/**
					 * lance la requête ajax de récupération des données de
					 * l'élément sélectionné
					 * 
					 * @see itemClick
					 * @param record
					 */
					loadFormData : function(record, version_id) {
										
						var root = record.getOwnerTree().getRootNode();
						if (this.selectedRub !== null
								&& this.selectedRub.getOwnerTree()
										.getRootNode() != root) {
							Ext.ComponentQuery.query('cmstab treepanel').each(
									function(tree) {
										if (tree.store.getRootNode() != root) {
											tree.selModel.deselectAll();
										} else
											this.selectedTree = tree;
									}, this);
						};

						this.selectedRub = record;
					
						
						this.ajax(DEFAULT_ADMIN_URL, {
							API : 'Admin_Model_ContentMapper',
							APICall : 'getContentData',
							version_id : version_id,
							templateRef : record.get('templateRef'),
							id_element : record.get('id_rubrique'),
							id_site:TextoCMS.siteId
						}, Ext.bind(this.buildContentForm, this));

					},
					/**
					 * call back de la requête ajax lorsqu'un noeud a été cliqué
					 * 
					 * @see loadFormData
					 * @param response
					 */
					buildContentForm : function(response) {
						this.centerPanel.removeAll(true);
						var contentForm = Ext.widget('contentpanel',{
							data : response,
							layout:'fit',
							selectedRub : this.selectedRub
						});
						
					//	console.log('selecteRub',this.selectedRub);
						
						this.centerPanel.add(contentForm);
						contentForm.initContentInfo();
						
						//this.centerPanel.doLayout();

					},

					/**
					 * handler des boutons de refresh des trees
					 * 
					 * @param btn
					 */
					refreshTree : function(btn) {

						btn.up('treepanel').getStore().on('load',
								this.getCurrentRecord, this);
						btn.up('treepanel').getStore().reload();

					},
					/**
					 * Call back de refreshTree Si un node était sélectionné,
					 * reselectionne celui-ci et ouvre ses parents
					 * 
					 * @see refreshTree
					 * @param store
					 * @param node
					 * @param model
					 */
					getCurrentRecord : function(store, node, model) {
						if (this.selectedRub !== null
								&& store.getNodeById(this.selectedRub
										.get('id_rubrique'))) {
							var test = store.getNodeById(this.selectedRub
									.get('id_rubrique'));
							this.selectedRub = test;
							this.selectedTree.getSelectionModel().select(
									this.selectedRub);
							var path = test.getPath().split('/').slice(1, -1);
							path.each(function(id) {
								store.getNodeById(id).expand();

							}, this);

						}

						this.selectedTree.getStore().un('load',
								this.getCurrentRecord, this);
						// this.selectedTree = null;
					},

					/**
					 * * Mise à jour après modification du tree
					 * 
					 * @param curNode
					 * @param oldParent
					 * @param newParent
					 * @param index
					 * @param node
					 * @returns null
					 */
					updateTree : function(curNode, oldParent, newParent, index,
							node) {
						var items = newParent.childNodes;

						var queryString = "";
						items.each(function(it, index) {
							queryString += 'items[' + index + ']='
									+ it.data.id_rubrique + '&';

						}, this);

						queryString += '&parentID='
								+ newParent.data.id_rubrique;
						this
								.ajax(
										DEFAULT_ADMIN_URL,
										queryString
												+ '&API=Admin_Model_ArboMapper&APICall=moveRub');

					},
					/**
					 * vérifie que la page en cours n'a pas été modifiée
					 * 
					 * @param callBack
					 * @param currRub
					 * @param view
					 * @param selectedRub
					 * @returns {Boolean}
					 */
					checkCMSFormDirty : function(callBack, currRub, view,
							selectedRub) {

						var cb = (callBack != undefined
								&& typeof callBack == "function" ? callBack
								: Ext.emptyFn);

						if (this.getContentform()
								&& !this.getContentform().form.isDirty()) {
							
							return true;
						}

						Ext.Msg
								.show({
									title : 'Attention !',
									msg : 'Vous n\'avez pas sauvegard&eacute; vos modifications !<br />Souhaitez-vous continuer ?',
									buttons : Ext.Msg.YESNO,
									icon : Ext.Msg.WARNING,
									fn : function(btn, text) {
										if (btn != 'yes') {

											if (currRub && view)
												view.deselect(currRub);
											var tree = this.selectedTree;
											tree.getSelectionModel().select(
													selectedRub);
											tree.expand();
											return;
										}
										cb();
									},
									scope : this
								});

						return false;
					},
										
					getRightsItems:function(){
						var moduleRights=[];
						
						
						
						this.ajax(DEFAULT_ADMIN_URL, {
							API : 'Admin_Model_ArboMapper',
							APICall : 'getSitesArbo'
							
						}, Ext.bind(this.setModulesRights, this), false);
						
						return moduleRights;
						
						return;
						
						var arbotrees = this.getContenttab().query('arbotree');
						
						arbotrees.each(function(tree){
						//	var store =tree.getView().getStore();
							
							children=this.getCmsTreeNodes(tree.getRootNode().firstChild);
							moduleRights.push({text:tree.title,moduleName:'TextoCMS.controller.cms.ContentController', type:'tree',plugin:'', rubId:tree.getRootNode().get('id_rubrique'), read:0, write:0, edit:0, children:children});
							
							
							//moduleRights.push(store);
							
						}, this);
						
						return moduleRights;
					},
					
					setModulesRights:function(response){
						
						var moduleRights=[];
						
						var treeNode =Ext.getStore('rightsStore').getRootNode().findChild('moduleName','TextoCMS.controller.cms.ContentController');
						treeNode.data.leaf=false;
						Ext.Object.each(response.result, function(key,val){
							var treeChild=[];
							var nodeSite={text:val.name, moduleName:'TextoCMS.controller.cms.ContentController', type:'site', rubId:null, read:0, write:0, edit:0, children:[], id_site:val.id_site}
							val.children.each(function(child){
								var nodeMenu={text:child.title, moduleName:'TextoCMS.controller.cms.ContentController', type:'folder', rubId:child.id_rubrique,read:0, write:0, edit:0, children:[], id_site:val.id_site};

								var nodeChildren=this.getCmsTreeNodes(child.children,val.id_site);
								nodeMenu.children=nodeChildren;	
								nodeSite.children.push(nodeMenu);
							}, this);
							
							
							
							
							
							var node=Ext.create('TextoCMS.model.siteadmin.RightsModel', nodeSite);
							
							
							
							if(treeNode) treeNode.appendChild(node);
							
							
						}, this)

						
						Ext.getStore('rightsStore').sync();
						
						this.getController('TextoCMS.controller.siteadmin.SiteAdminController').getUsersRights();
						
					},
					
					getCmsTreeNodes:function(node, id_site) {
						
						var children=[];
						if(node.children){
							node.children.each(function(child){
						
								children.push(this.getCmsTreeNodes(child, id_site));
								
							},this);
							
							
							
							
						}
						
						var obj ={text:node.title, children:children,moduleName:'cms.ContentController', rubId:node.id_rubrique, type:node.type, read:0, write:0, edit:0, children:children, id_site:id_site};
						
						return obj;
						
					},
					afterRenderContentPanel:function(panel){

						
					}

				});