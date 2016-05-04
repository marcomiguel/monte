<?php
use Rpp\Pages\Seccion;
class ClimaController extends ControllerBase{


   public function portadaAction($slug='lima')
   {
     $di = new Phalcon\DI();
     $di->set('viewCache',$this->viewCache);
     $climas = new \Rpp\Pages\Climas();
     $climas->slug = $slug;
     $climas->load_pronostico();
     $di->set('model',$climas);
     $this->view->setDI($di);
   }
  

}