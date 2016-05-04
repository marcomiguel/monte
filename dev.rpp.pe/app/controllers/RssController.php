<?php
class RssController extends ControllerBase
{
	public function indexAction()
    {
    $di = new Phalcon\DI();
    $di->set('viewCache',$this->viewCache);
    $di->set('model',new \Rpp\Pages\Rss());
    $this->view->setDI($di);
    }
}


