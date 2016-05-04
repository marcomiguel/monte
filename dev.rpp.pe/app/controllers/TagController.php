<?php
class TagController extends ControllerBase
{
    public function nAction($slug)
    {
      $di = new Phalcon\DI();
      $di->set('model',new \Rpp\Pages\Tag($slug,$this->dispatcher) );
      $di->set('viewCache',$this->viewCache);
      $this->view->setDI($di);
    }
}