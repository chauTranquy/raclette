Ext.define('TextoCMS.Modules.glutabye.view.AjoutezVotreRecetteWest', {
    extend: 'Ext.grid.Panel',
    title: '',
    alias: 'widget.ajoutezvotrerecettewest',
    requires: ['TextoCMS.Modules.glutabye.store.AjoutezVotreRecetteStore'],
    border: false,
    height: '100%',
    multiSelect: true,
    selModel: Ext.create('Ext.selection.CheckboxModel'),
    columns: [
        {text: 'Titre de la recette', dataIndex: 'recetteTitle', flex:1},
        {text: 'Type de recette', dataIndex: 'typeRecetteListe', flex:1, renderer:function(v){
                return Ext.getStore('TypeRecetteListeStoreID').findRecord('id_rubrique',v).get('titre')
                
        }},
        {
            flex:1,
            header: 'Statut',
            dataIndex: 'statut',
            align: 'center',
            renderer: function(v) {
                if (v == 1)
                    return '<img src="img/icons/accept.png" data-qtip="Actif" />';
                if (v == 0)
                    return '<img src="img/icons/stop.png" data-qtip="Inactif" />';
                return '<img src="img/icons/delete.png" data-qtip="Refus&eacute;e" />';
            }
        }
    ],
    tbar: [
        {xtype: 'button', icon: '/admin/img/icons/refresh-icon2.png', id: 'reinitialiserFiltre', text: 'R&eacute;initialiser'},
        {xtype: 'splitbutton', text: 'Trier par...', id: 'menuTrierPar', menu:
                    [
                        {icon: '/admin/img/icons/accept.png', text: 'Accepter', action: 1},
                        {icon: '/admin/img/icons/stop.png', text: 'En attente de validation', action: 0},
                        {icon: '/admin/img/icons/delete.png', text: 'Refus&eacute;e', action: 2}
                    ]
        },{xtype: 'splitbutton', text: 'Afficher les recettes du site...', id: 'menuTrierParSite', menu:
                    [
                        { text: 'Glutabye', action: 1},
                        {text: 'Biorevola', action: 2}
                    ]
        }, {xtype: 'tbfill'},
        {xtype: 'splitbutton', icon: '/admin/img/icons/go-down-5.png', text: 'Action...', id: 'actionMenu', menu:
                    [
                        {icon: '/admin/img/icons/accept.png', text: 'Accepter', action: 1},
                        {icon: '/admin/img/icons/stop.png', text: 'En attente de validation', action: 0},
                        {icon: '/admin/img/icons/delete.png', text: 'Refuser', action: 2},
                        {icon: '/admin/img/icons/edit-delete-6.png', text: 'Supprimer', action: null}
                    ]
        }

    ],
    initComponent: function() {
        this.store = Ext.create('TextoCMS.Modules.glutabye.store.AjoutezVotreRecetteStore');
        this.store.on('load', this.setLoaded, this);
        this.store.load();
        this.callParent(arguments);
    },
    setLoaded: function() {
        this.isLoaded = true;
        this.store.un('load', this.setLoaded, this);
    }

});