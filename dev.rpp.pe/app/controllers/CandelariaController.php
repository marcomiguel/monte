<?php
class CandelariaController extends ControllerBase
{
    public function redesAction($slug='la-candelaria')
    {
      $di = new Phalcon\DI();
      $di->set('model',new \Rpp\Pages\Tag($slug,$this->dispatcher) );
      $di->set('viewCache',$this->viewCache);
      $this->view->setDI($di);
    }

}