/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights
 *          reserved. For licensing, see LICENSE.html or
 *          http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	config.language = 'fr';
	config.language = 'fr';
	config.width='100%';
	config.height=330;
	config.baseFloatZIndex = 200000;
	//config.baseHref="/sencha/ckeditor/";
	config.extraPlugins = 'addmedias,cmslink';
	config.toolbarCanCollapse = false;
	config.resize_enabled = false;
	config.allowedContent = true;
	config.toolbar_Custom=
		[
		    ['Source','-','Cut','Copy','Paste','PasteText','PasteFromWord','-','SpellChecker','Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat','-','addmedias','youtube','cmslink','Unlink'],'/',
		    ['Bold','Subscript','Superscript','NumberedList','BulletedList','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','SpecialChar','PageBreak','Styles','ShowBlocks','-','About']
		];

	
	config.contentsCss='/_css/siteStyle.css';
	config.stylesSet = 'siteStyle:/admin/js/siteStyle.js';
	
};
