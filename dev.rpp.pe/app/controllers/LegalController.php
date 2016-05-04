<?php
class LegalController extends ControllerBase
{
    public function indexAction()
    {
      $di = new Phalcon\DI();
    $di->set('viewCache', $this->viewCache);
    $di->set('model',new \Rpp\Pages\Legal());
    $this->view->setDI($di);
    }
    
}