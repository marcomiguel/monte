<?php
use Rpp\Pages\Resultados;
class ResultadosController extends ControllerBase
{
 public function fechaAction($torneo='peru',$fase=false)
 {
      $di = new Phalcon\DI();
      $di->set('viewCache',$this->viewCache);
      $resultado = new Resultados();
      $resultado->torneo = $torneo;
      $resultado->package = 'resultados'; 
      $resultado->load_custom();
      if($fase) $resultado->fase = $fase;
      $resultado->comscore = 'resultados.'.$torneo;
      $resultado->recalculate();
      $di->set('model',$resultado);
      $this->view->setDI($di);
 }

 public function fixtureAction($torneo,$fase=false,$fecha=false)
 {
      $di = new Phalcon\DI();
      $di->set('viewCache',$this->viewCache);
      $resultado = new Resultados();
      $resultado->torneo = $torneo;
      $resultado->package = 'fixture'; 
      $resultado->load_custom();
      if($fase) $resultado->fase = $fase;
     
      if($fecha) $resultado->fecha = $fecha;
      else {
            $resultado->fecha = 1;
            $fechas_flags=@Rpp\Services\Get\Resultados::get_fechas_flags($torneo)[$resultado->fase];
            if(is_array($fechas_flags))
            {
             if(isset($fechas_flags['actual'])) $resultado->fecha = $fechas_flags['actual'];
             elseif(isset($fechas_flags['ultima'])) $resultado->fecha = $fechas_flags['ultima'];
            }
      }
      $resultado->comscore = 'fixture.'.$torneo;
      $resultado->recalculate();
      $di->set('model',$resultado);
      $this->view->setDI($di);
 }

 public function posicionesAction($torneo,$fase=false)
 {
      $di = new Phalcon\DI();
      $di->set('viewCache',$this->viewCache);
      $resultado = new Resultados();
      $resultado->torneo = $torneo;
      $resultado->package = 'posiciones';
      $resultado->load_custom();
      if($fase) $resultado->fase = $fase;
      $resultado->comscore = 'posiciones.'.$torneo;
      $resultado->recalculate();
      $di->set('model',$resultado);
      $this->view->setDI($di);
 }

 public function goleadoresAction($torneo,$fase=false)
 {
      $di = new Phalcon\DI();
      $di->set('viewCache',$this->viewCache);
      $resultado = new Resultados();
      $resultado->torneo = $torneo;
      $resultado->package = 'goleadores'; 
      $resultado->load_custom();
      if($fase) $resultado->fase = $fase;
      $resultado->recalculate();
      $resultado->comscore = 'goleadores.'.$torneo;
      $di->set('model',$resultado);
      $this->view->setDI($di);
 }
  
 public function testAction()
 {

 }
}
