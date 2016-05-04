<?php
use Rpp\Pages\Archivo;
class TestController extends ControllerBase
{

  public function indexAction()
  {
  	$start_memory = memory_get_usage();
    $di = new Phalcon\DI();
    var_dump( memory_get_usage() - $start_memory );
    
  }

  public function detalleAction($nid,$position = 1)
  {
    $start_memory = memory_get_usage();

    /*$nota = new \Rpp\Pages\Nota($nid,$this->dispatcher);                                 
    $di = new Phalcon\DI();
    $nota->package ='nota';
    $nota->set_position($position);
    $di->setShared('model',$nota);
    $di->setShared('viewCache',$this->viewCache);
    $this->view->setDI($di);
    
    $Analytics = new \Rpp\Services\Analytics\Visits\Load\Nota($nid);
    $Analytics->calculate();*/


    if(!Rpp\Pages\Nota::validate($nid)) $this->dispatcher->forward(array('controller' => 'error', 'action' =>   'show404'));

    $nota = function() use ($nid)
            {
               return new \Rpp\Pages\Nota($nid);   
            };
                                 
    $di = new Phalcon\DI();
    $di->set('model',$nota);
    $di->set('viewCache',$this->viewCache);
    $this->view->setDI($di);
    
    $Analytics = new \Rpp\Services\Analytics\Visits\Load\Nota($nid);
    $Analytics->calculate();

    //var_dump( memory_get_usage() - $start_memory );die();
  }


}
