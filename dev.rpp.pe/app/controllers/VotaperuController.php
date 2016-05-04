<?php
class VotaperuController extends ControllerBase
{
    public function redesAction($slug='elecciones-peru-2016')
    {
      $di = new Phalcon\DI();
      $di->set('model',new \Rpp\Pages\Tag($slug,$this->dispatcher) );
      $di->set('viewCache',$this->viewCache);
      $this->view->setDI($di);
    }

    public function encuestaAction($slug='elecciones-peru-2016')
    {
      $di = new Phalcon\DI();
      $tag = new \Rpp\Pages\Tag($slug,$this->dispatcher);
      $tag->img_social = 'http://rpp.pe/elecciones-peru-2016/img/sondeo_interactivo.jpg';
      $tag->urlcanonical = '/elecciones-peru-2016/encuesta';
      $this->url_social = '/elecciones-peru-2016/encuesta';
      $di->set('model', $tag);
      $di->set('viewCache',$this->viewCache);
      $this->view->setDI($di);
    }

    public function notaserviceAction($slug=false,$init=1)
    {
      $this->view->disable();
      $init = ($init-1)*3;
      $response =  array();
      $tag_info = \Rpp\Services\Get\Tags::get_tag($slug);
      if(empty(@$tag_info->_id)){
      	echo json_encode($response);
      	die();
      } 
      foreach (\Rpp\Services\Get\LFlow::tag($slug,3,$init) as $item){
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
}