<?php
use Rpp\Pages\Seccion;
class PortadaController extends ControllerBase{

  public function seccionAction($slug_seccion,$slug_categoria = null)
  {
      $di = new Phalcon\DI();
      $Seccion = new Seccion($slug_seccion,$slug_categoria,$this->dispatcher);
//      $Seccion->alert = \Rpp\Services\Get\Alert::active();
      $di->set('model',$Seccion);
      $di->set('viewCache',$this->viewCache);
      $this->view->setDI($di);
      $Analytics = new \Rpp\Services\Analytics\Visits\Load\MasVisitadas($Seccion->slug);
      $Analytics->calculate();
  }
  
  public function autoresAction()
  {
     $di = new Phalcon\DI();
      $Seccion = new Seccion('autores',false,$this->dispatcher);
//      $Seccion->alert = \Rpp\Services\Get\Alert::active();
      $di->set('model',$Seccion);
      $di->set('viewCache',$this->viewCache);
      $this->view->setDI($di);
  }
}