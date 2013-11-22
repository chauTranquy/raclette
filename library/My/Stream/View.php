<?php

/**

 * @copyright  Copyright (c) 2007 Rob Allen (http://akrabat.com)

 * @license    http://framework.zend.com/license/new-bsd     New BSD License

 */



require_once 'Zend/View/Abstract.php';

require_once 'StreamView.php';



class My_Stream_View extends Zend_View_Abstract

{

    public function __construct($config = array()) {

        // register our view stream to do automatic escaping of the <?= construct 

        	
        if (!in_array('view', stream_get_wrappers())) {

            stream_wrapper_register('view', 'My_Stream_StreamView');

        }

        parent::__construct($config);

    }    



    /**

     * Includes the view script in a scope with only public $this variables.

     *

     * @param string The view script to execute.

     */

    protected function _run()

    {



        include 'view://' . func_get_arg(0);

    }

}