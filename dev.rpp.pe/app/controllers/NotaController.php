<?php
use Local\Models\Notaload;
use Rpp\Repositorio\Builder\SearchPatternBuilder;
use Rpp\Repositorio\Builder\Search\Pattern\Nota;
use Rpp\Repositorio\Builder\Search\Pattern\Categoria;
class NotaController extends ControllerBase
{
  private $tiempo_recomendadas = 60*60*12;
  public function detalleAction($nid,$position = 1)
  {
    if(!Rpp\Pages\Nota::validate($nid)) $this->dispatcher->forward(array('controller' => 'error', 'action' =>   'show404'));
    $nota = new \Rpp\Pages\Nota($nid);
    $di = new Phalcon\DI();
    $nota->package ='nota';
    $nota->set_position($position);
//    $nota->alert = \Rpp\Services\Get\Alert::active();
    $di->set('model',$nota);
    $di->set('viewCache',$this->viewCache);
    $this->view->setDI($di);
    
    $Analytics = new \Rpp\Services\Analytics\Visits\Load\Nota($nid);
    $Analytics->calculate();
    $this->loadRecomendados($nota->user);
  }
    
  public function fullscreemAction($nid,$position = 1)
  {
    if(!Rpp\Pages\Nota::validate($nid)) $this->dispatcher->forward(array('controller' => 'error', 'action' =>   'show404'));
    $nota = new \Rpp\Pages\Nota($nid);
    $di = new Phalcon\DI();
    $nota->package ='nota';
    $nota->set_position($position);
    $di->set('model',$nota);
    $di->set('viewCache',$this->viewCache);
    $this->view->setDI($di);
    $Analytics = new \Rpp\Services\Analytics\Visits\Load\Nota($nid);
    $Analytics->calculate();
    $this->loadRecomendados($nota->user);
  }


  public function minAction($nid,$position = 1)
  {
    if(!Rpp\Pages\Nota::validate($nid)) $this->dispatcher->forward(array('controller' => 'error', 'action' =>   'show404'));
    $nota = new \Rpp\Pages\Nota($nid);
    $di = new Phalcon\DI();
    $nota->package ='nota';
    $nota->set_position($position);
    $di->set('model',$nota);
    $di->set('viewCache',$this->viewCache);
    $this->view->setDI($di);
    
  }


   public function permalinkAction($nid,$position=false)
   {
    if(empty(\Rpp\Services\Get\Content::part($nid,'_id')))
    {

       $this->dispatcher->forward(array('controller' => 'error', 'action' =>   'show404'));
    }
    $query_url = explode("?", $_SERVER["REQUEST_URI"]);
    if(isset($query_url[1])) $query_url = "?".$query_url[1];
    else $query_url = null;
    
    if(is_numeric($position)) $query_url = "/".$position.$query_url;

    return $this->response->redirect($this->view->host.\Rpp\Services\Get\Content::nurl($nid).$query_url, true , 301);
   }

   public function fbpluginAction()
   {

   var_dump($this->view->host);
       $query_url = explode("?", $_SERVER["REQUEST_URI"]);
       if(isset($query_url[1])){
        $query_url = $query_url[1];
        $query_url = explode("=", $query_url);
        if(isset($query_url[1])){
          $query_url =  urldecode($query_url[1]);
          $this->response->redirect( $query_url , true , 301);
        }else $this->response->redirect($this->view->host, true , 301);
       }else $this->response->redirect($this->view->host, true , 301);
   }

   public function beforeExecuteRoute($dispatcher)
   {
    $this->myrouter = $this->profiler->start('Myrouter', ['lorem' => 'ipsum'], 'Application');
   }

   public function afterExecuteRoute($dispatcher)
   {
    $this->profiler->stop($this->myrouter);
   }


   public function loadRecomendados($user)
   {
      if(is_null($user)) return false;
      $key = 'analitica.recomendados.rebuild.'.$user;
      if(!\Shared\Cache2::request()->add( $key , 6 , $this->tiempo_recomendadas )) 
      {
          \Shared\Cache2::request()->decrement($key);
          if(\Shared\Cache2::request()->uget($key) == 1)
          {
            Rpp\Services\Get\Recomendados::send_rebuild($user);
          }
      }

   }
}

