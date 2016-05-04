<?php

use Rpp\Pages\Home;
use \Rpp\Services\Analytics\Visits\Load\MasVisitadas;

class IndexController extends ControllerBase
{
    private $myrouter;

    public function indexAction()
    {
        $di = new Phalcon\DI();
        $home = new Home();
        $di->setShared('model', new Home());
        $di->setShared('viewCache', $this->viewCache);
        $di->set('redis',$this->redis);
        $this->view->setDI($di);
        $MasVisitadas = new MasVisitadas('home');
        $MasVisitadas->calculate();
        if($home->fecha_hp == '201603192030') $this->viewCache->delete("portada.bodyopen.home");
        if($home->fecha_hp == '201603192130') $this->viewCache->delete("portada.bodyopen.home");
    }

    public function moreAction($init=1)
    {    
         $this->view->disable();
         $interval = 3;
         $init = 50 + ($init-1)*$interval;
         $response =  array();

        foreach (\Rpp\Services\Get\Flow::home($interval,$init) as $item){
                if(empty($item->_id)) continue;
                $response[] = array(
                    'img'=>\Rpp\Services\Get\UrlMedia::image(\Rpp\Services\Get\Content::node($item->_id)->imagen_portada['hash'], 'medium') , 
                    'titulo' => \Rpp\Services\Get\Content::node($item->_id)->titulo , 
                    'bajada' => \Rpp\Services\Get\Content::node($item->_id)->bajada , 
                    'fecha' => date('Y-m-d H:i',\Rpp\Services\Get\Content::node($item->_id)->fecha_publicacion), 
                    'categoria' => \Rpp\Services\Get\Content::node($item->_id)->categoria['nombre'],
                    'categoria_url' => str_replace( SITESLUG ,'', \Rpp\Services\Get\Content::node($item->_id)->categoria['slug']),
                    'nota_url' => $this->view->host.\Rpp\Services\Get\Content::nurl($item->_id),
                    'tipo' => \Rpp\Services\Get\Content::node($item->_id)->tipo,
                                );
        }

      echo json_encode($response);
      die();
    }

    public function beforeExecuteRoute($dispatcher)
    {
        $this->myrouter = $this->profiler->start('Myrouter', ['lorem' => 'ipsum'], 'Application');
    }

    public function afterExecuteRoute($dispatcher)
    {
        $this->profiler->stop($this->myrouter);
    }
}

