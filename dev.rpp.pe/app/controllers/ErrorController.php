<?php
class ErrorController extends ControllerBase
{
	public function show404Action()
    {
    $di = new Phalcon\DI();
    $di->set('viewCache',$this->viewCache);
    $di->set('model',new \Rpp\Pages\Notfound());
    $this->view->setDI($di);
    }
}


