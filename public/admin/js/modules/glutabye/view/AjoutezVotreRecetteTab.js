Ext.define('TextoCMS.Modules.glutabye.view.AjoutezVotreRecetteTab', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.ajoutezvotrerecettetab',
    requires: ['TextoCMS.Modules.glutabye.view.AjoutezVotreRecetteWest', 'TextoCMS.Modules.glutabye.view.AjoutezVotreRecetteCenter'],
    title: 'Validation des recettes',
    icon: '/admin/img/icons/address-book-new-4.png',
    layout: 'border',
    defaults: {
        collapsible: true,
        split: true
    },
    items: [{
            title: 'Liste des recettes',
            region: 'west',
            flex: 1,
            height: '100%',
            autoScroll: true,
            items: [{
                    xtype: 'ajoutezvotrerecettewest'
                }]


        }, {
            layout: 'fit',
            collapsible: false,
            region: 'center',
            header: false,
            tbar: [
                {xtype: 'splitbutton', text: 'Modifier le statut', disabled: true, id: 'statusChangeBtn', menu:
                            [
                                {icon: '/admin/img/icons/accept.png', text: 'Accepter', action: 1},
                                {icon: '/admin/img/icons/stop.png', text: 'En attente de validation', action: 0},
                                {icon: '/admin/img/icons/delete.png', text: 'Refuser', action: 2}
                            ]
                },
                {xtype: 'button', iconCls: 'editBtn', id: 'editBtn', text: '&Eacute;diter', disabled: true}
            ],
            height: '100%',
            width: '100%',
            flex: 2,
            items: [{
                    xtype: 'ajoutezvotrerecettecenter',
                    html: 'Aucune recette selectionn&eacute;e'
                }]
        }]

});