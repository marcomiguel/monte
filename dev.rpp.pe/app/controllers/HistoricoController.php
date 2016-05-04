<?php
use Rpp\Pages\Archivo;
class HistoricoController extends ControllerBase
{
	
  public function generalAction($fecha)
  {

    $di = new Phalcon\DI();
    $di->set('viewCache',$this->viewCache);
    $Archivo = new Archivo();
    $Archivo->home($fecha);
    $di->set('model',$Archivo);
    $this->view->setDI($di);

    echo $response_render = $this->view->getRender('archivo','seccion');
  }

}
