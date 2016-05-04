<?php
class ResumenhoraController extends ControllerBase
{
	public function indexAction()
    {
    $di = new Phalcon\DI();
    $di->set('viewCache',$this->viewCache);
    $di->set('model',new \Rpp\Pages\Resumenh());
    $this->view->setDI($di);
    }
}


