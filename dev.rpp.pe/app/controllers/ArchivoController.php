<?php
use Rpp\Pages\Archivo;
class ArchivoController extends ControllerBase
{

  public function seccionAction($slug ,$fecha = false )
  {  
    if(!$fecha) $fecha = date("Y-m-d");
    $di = new Phalcon\DI();
    $di->set('viewCache',$this->viewCache);
    $Archivo = new Archivo();
    $Archivo->seccion($slug,$fecha);
//    $Archivo->alert = \Rpp\Services\Get\Alert::active();
    $di->set('model',$Archivo);
    $this->view->setDI($di);
  }



  public function generalAction($fecha = false)
  {
    if(!$fecha) $fecha = date("Y-m-d");
    $di = new Phalcon\DI();
    $di->set('viewCache',$this->viewCache);
    $Archivo = new Archivo();
    $Archivo->home($fecha);
//    $Archivo->alert = \Rpp\Services\Get\Alert::active();
    $di->set('model',$Archivo);
    $this->view->setDI($di);
  }


	public function ultimasAction($intervalo=12)
	{
    $di = new Phalcon\DI();
    $di->set('viewCache',$this->viewCache);
    $Archivo = new Archivo();
    $Archivo->ultimas($intervalo);
//    $Archivo->alert = \Rpp\Services\Get\Alert::active();
    $di->set('model',$Archivo);
    $this->view->setDI($di);
	}
}
