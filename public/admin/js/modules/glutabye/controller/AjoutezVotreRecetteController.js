Ext.define('TextoCMS.Modules.glutabye.controller.AjoutezVotreRecetteController', {
    description: 'Validation des recettes',
    extend: 'TextoCMS.controller.BaseController',
    refs: [{
            ref: 'gridPanelWest',
            selector: 'ajoutezvotrerecettewest'
        }, {
            ref: 'gridPanelCenter',
            selector: 'ajoutezvotrerecettecenter'
        }, {
            ref: 'ajoutezVotreRecetteTab',
            selector: 'ajoutezvotrerecettetab'
        }, {
            ref: 'ajoutezVotreRecetteTabSplitbutton',
            selector: 'ajoutezvotrerecettetab splitbutton'
        }
    ],
    views: ['TextoCMS.Modules.glutabye.view.AjoutezVotreRecetteTab'],
    requires: ['TextoCMS.Modules.glutabye.store.TypeRecetteListeStore'],
    init: function() {
        this.control({
            'ajoutezvotrerecettewest': {
                itemclick: this.gridRecetteWestItemClick,
                deselect: this.gridRecetteWestDeselect,
                select: this.gridRecetteWestSelect
            },
            'ajoutezvotrerecettetab splitbutton#statusChangeBtn menuitem': {
                click: this.updateStatus
            },
            '#menuTrierPar menuitem': {
                click: this.menuTrierPar
            },
            '#reinitialiserFiltre': {
                click: this.reinitialiserFiltreBtnClickEvent
            },
            '#actionMenu menuitem': {
                click: this.actionMenuItemClick

            },
            '#menuTrierParSite menuitem': {
                click: this.actionMenuTrierParSiteClick
            }

        }
        );

        this.callParent(arguments);
        this.onLaunch(this);
    },
    initController: function() {

        this.TypeRecetteListeStore = Ext.create('TextoCMS.Modules.glutabye.store.TypeRecetteListeStore');
        this.TypeRecetteListeStore.on('load', this.typeRecetteListeStoreSetLoaded, this);
        this.TypeRecetteListeStore.load();

        this.tab = Ext.widget('ajoutezvotrerecettetab', {title: this.description});
        this.viewport.down('tabpanel').add(this.tab);

        Ext.ComponentQuery.query('#reinitialiserFiltre')[0].disable();
        Ext.ComponentQuery.query('#actionMenu')[0].disable();

//        this.getTextoCMSModulesGlutabyeStoreTypeProStoreStore().getProxy().setExtraParam(
//                'where', 'id_site=' + TextoCMS.siteId);
//
//        this.getTextoCMSModulesGlutabyeStoreTypeProStoreStore().load();
//        this.getTextoCMSModulesGlutabyeStoreEspaceProStoreStore().load();

    },
    typeRecetteListeStoreSetLoaded: function() {
        this.TypeRecetteListeStore.un('load', this.typeRecetteListeStoreSetLoaded, this);
    },
    gridRecetteWestItemClick: function(me, record, item, index, e, eOpts) {
        console.log(record);
        this.record = record;

        Ext.getCmp('editBtn').un('click', this.openEditForm, this);
        Ext.getCmp('editBtn').on('click', this.openEditForm, this, {record: record});

        var nomDeLaPersonne = record.get('recetteNomPersone') ? record.get('recetteNomPersone') : "Anonyme";
     
        var html = "<strong class=\"titre\">" + record.get('recetteTitle') + "&nbsp;";
        html += "<img src=\"img/icons/" + (record.get('statut') == 1 ? "accept" : record.get('statut') == 0 ? "stop" : "exclamation") + ".png\" align=\"absmiddle\"  />";
        html += "</strong>";
        html += "<br /><strong class=\"liste\">Type de recette : " + Ext.getStore('TypeRecetteListeStoreID').findRecord('id_rubrique', record.get('typeRecetteListe')).get('titre') + "&nbsp;<br />";
        html += "<br />";
        html += "<span class=\"small\">Soumise le " + Ext.util.Format.date(record.get('creation_date'), 'd/m/Y') + ' par ' + nomDeLaPersonne + ' <br /><a href="mailto:' + record.get('email') + '">' + record.get('email') + '</a></span>';
        html += '<div class="x-clear"></div>';

        html += '<br /><strong class="bold">Ingr&eacute;dients :</strong><br />' + Ext.util.Format.nl2br(record.get('ingredients')) + '<br />';
        html += '<br /><strong class="bold">Pr&eacute;paration :</strong> <br />' + Ext.util.Format.nl2br(record.get('recette')) + '<br />';
        html += '<div class="x-clear"></div>';
        if (record.get("visuelUrl") != null && !record.get("visuelUrl").empty()) {
            html += '<div><br /><strong class="bold">Photo :</strong> <br /><br />';
            html += '<div class="x-clear"></div>';

            
            html += "<img style='max-height:600px; max-width:800px;' src= '" + TextoCMS.site.get('site_url') + "/img/uploads/" + record.get("visuelUrl") + "' data-qtip=\"Cliquer pour agrandir\"  /></div>";
        }
        html += '<div class="x-clear"></div>';
        this.getGridPanelCenter().update(html);
        this.getGridPanelCenter().doLayout();

        this.getAjoutezVotreRecetteTab().down('#statusChangeBtn').enable();

        this.getAjoutezVotreRecetteTab().down('#editBtn').enable();

    },
    gridRecetteWestDeselect: function(me, record, index, eOpts) {
        Ext.ComponentQuery.query('#actionMenu')[0].disable();
    },
    gridRecetteWestSelect: function(me, record, index, eOpts) {
        Ext.ComponentQuery.query('#actionMenu')[0].enable();
    },
    updateStatus: function(btn) {

        var record = this.record;
        record.beginEdit();
        record.set('statut', btn.action);

        record.endEdit();
        record.commit();
        var recordProv = record.copy();

        var params = recordProv.data;
        params.APICall = "addOrModify";
        params.id_ajoutRecette = record.internalId;
        params.API = "Cmsmodules_Model_RecetteMapper";

        for (var i in params) {
            if (params[i].length == 0)
                params[i] = " ";
        }

        this.ajax(DEFAULT_ADMIN_URL, params, function() {
        }.bind(this));
        this.getGridPanelWest().fireEvent('itemclick', this.getGridPanelWest(), this.getGridPanelWest().getSelectionModel().getLastSelected());
    },
    displayRecetteInfo: function(view, record) {
        console.log('displayRecetteInfo');
    },
    openEditForm: function(btn, e, options) {
        var record = options.record;

        var form = Ext.create('Ext.form.Panel', {trackResetOnLoad: true,
            width: 1000,
            height: 650,
            border: false,
            bodyStyle: "background:transparent",
            margin: 5,
            layout: 'fit',
            defaults: {
                bodyStyle: "background:transparent"

            },
            fieldDefaults: {
                xtype: 'textfield',
                labelWidth: 170,
                labelAlign: 'left',
                labelStyle: 'text-align:right',
                width: 500

            },
            items: [{width: 520, border: false, autoScroll: true, items: [
                        {fieldLabel: "Nom de la personne", xtype: 'textfield', name: 'recetteNomPersonne', allowBlank: true},
                        {xtype: 'combo', fieldLabel: 'Type de la recette', name: 'typeRecetteListe',
                            store: Ext.getStore('TypeRecetteListeStoreID'),
                            queryMode: 'local',
                            displayField: 'titre',
                            valueField: 'id_rubrique', },
                        {fieldLabel: "Pr&eacute;nom de la personne", xtype: 'textfield', name: 'recettePrenomPersonne', allowBlank: true},
                        {fieldLabel: "Email", xtype: 'textfield', name: 'email', allowBlank: false, vtype: 'email'},
                        {fieldLabel: "Conditions d'utilisation", xtype: 'checkbox', name: 'condition', inputValue: 1},
                        {fieldLabel: "Informations commerciales", xtype: 'checkbox', name: 'infoCom', inputValue: 1},
                        {xtype: 'hidden', name: 'statut'},
                        {xtype: 'hidden', name: 'id_ajoutRecette'},
                        {fieldLabel: 'Visuel', xtype: 'file', name: 'visuelUrl', allowBlank: false, baseFolder: '/img/uploads/', value: record.get('visuelUrl')},
                        {fieldLabel: 'Titre de la recette', xtype: 'textfield', name: 'recetteTitle', allowBlank: false},
                        {fieldLabel: 'Ingr&eacute;dients', xtype: 'richtext', name: 'ingredients', allowBlank: false, height: 100, value: record.get('ingredients'), labelWidth: 170, width: 500},
                        {fieldLabel: 'Description de la recette', xtype: 'richtext', name: 'recette', allowBlank: false, height: 150, value: record.get('recette'), labelWidth: 170, width: 500}
                    ]}],
            buttonAlign: 'center',
            buttons: [
                {text: 'Valider', disabled: true, action: 'submit', scope: this, handler: function() {
                        form.getForm().submit({
                            url: DEFAULT_ADMIN_URL,
                            waitMsg: 'Mise &agrave; jour de la recette',
                            params: {
                                API: "Cmsmodules_Model_RecetteMapper",
                                APICall: 'addOrModify'
                            },
                            success: function(form, action) {
                                record.beginEdit();
                                for (key in record.data) {
                                    if (form.findField(key)) {
                                        record.set(key, form.findField(key).getValue());
                                    }
                                }

                                record.endEdit();
                                record.commit();

                                this.gridRecetteWestItemClick(null, record);
                                form.owner.up('window').close();

                            }.bind(this),
                            failure: function(form, action) {
                            }
                        });
                    }},
                {text: 'Annuler', scope: this, handler: function(btn) {
                        btn.up('form').getForm().reset();
                    }},
                {text: 'Fermer', handler: function() {
                        this.up('window').close();
                    }}
            ],
            listeners: {
                scope: this,
                validitychange: function(form, valid) {
                    form.owner.down('button[action=submit]').setDisabled(valid && form.isDirty() ? false : true);
                },
                dirtychange: function(form, dirty) {
                    form.owner.down('button[action=submit]').setDisabled(dirty && form.isValid() ? false : true);
                }
            }
        });

        form.loadRecord(record);
        //  form.doLayout();

        var win = Ext.create('Ext.window.Window', {
            modal: true,
            autoScroll: true,
            title: 'Modifier la recette <em>"' + record.get('recetteTitle') + '"</em>',
            items: [form]

        });

        win.show();
    },
    menuTrierPar: function(btn) {
        this.getGridPanelWest().store.addFilter({
            id: 'filtersId',
            property: 'statut',
            value: btn.action
        });
        Ext.ComponentQuery.query('#reinitialiserFiltre')[0].enable();
    },
    actionMenuTrierParSiteClick: function(btn) {

        this.getGridPanelWest().store.addFilter({
            id: 'filtersIdSite',
            property: 'idSite',
            value: btn.action
        });
        Ext.ComponentQuery.query('#reinitialiserFiltre')[0].enable();
    },
    reinitialiserFiltreBtnClickEvent: function(btn) {
        this.getGridPanelWest().store.clearFilter();
        btn.disable();
    },
    actionMenuItemClick: function(btn) {
        if (!this.getGridPanelWest().getSelectionModel().hasSelection())
            return;

//        var action = false;
        var msg = "";
        var rows = this.getGridPanelWest().getSelectionModel().getSelection();
        var ids = [];

        Ext.each(rows, function(row) {
            ids.push(row.get('id_ajoutRecette'));

        });

        var params = {};
        params.ids = ids.join('|');
        params.API = "Cmsmodules_Model_RecetteMapper";
        params.APICall = btn.action !== null ? "addOrModifySelection" : "removeRecette";
        params.statut = btn.action;

        var cb = Ext.bind(this.sendSelectionRequest, this, [params, rows, btn.action]);

        if (btn.action == null) {
            Ext.MessageBox.confirm('Suppression de la s&eacute;lection', 'Voulez-vous vraiment supprimer la s&eacute;lection ?<br />Toute suppression est d&eacute;finitive', function(btn) {
                if (btn == "yes")
                    return cb();

            }, this);


        } else
            cb();

        this.getGridPanelWest().getSelectionModel().deselectAll();

        return;
    },
    sendSelectionRequest: function(params, rows, action) {

        var me = this;


        this.ajax(DEFAULT_ADMIN_URL, params, function() {
            me.getGridPanelCenter().update("Aucune recette selectionn&eacute;e");
            Ext.ComponentQuery.query('#actionMenu')[0].disable();
            var msg = "La s&eacute;lection a &eacute;t&eacute; ";

            switch (action) {

                case null:

                    me.getGridPanelWest().getStore().remove(rows);
                    msg += "supprim&eacute;e";

                    break;

                default:


                    Ext.each(rows, function(row) {
                        row.beginEdit();
                        row.set('statut', action);
                        row.endEdit();
                        row.commit();

                    }, this);

                    if (action == 1)
                        msg += "valid&eacute;e";
                    else if (action == 0)
                        msg += "mise en attente de validation";
                    else
                        msg += " refus&eacute;e"
                    break;
            }

            TextoCMS.Utils.displayNotification('Succ&egrave;', msg);

        });
    }

});