<?php
use Rpp\Pages\Seccion;
class   BlogController extends ControllerBase{

  public function categoriaAction($slug_categoria)
  {
      $di = new Phalcon\DI();
      $Seccion = new Seccion('blog',$slug_categoria,$this->dispatcher);
      $di->set('model',$Seccion);
      $di->set('viewCache',$this->viewCache);
      $this->view->setDI($di);
      $Analytics = new \Rpp\Services\Analytics\Visits\Load\MasVisitadas('blog');
      $Analytics->calculate();
  }
  
}