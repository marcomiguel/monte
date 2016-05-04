<?php
use Rpp\Pages\Preview\Home;
use Rpp\Pages\Preview\Seccion;
use Rpp\Pages\Preview\Tag;
class PortadapreviewController extends ControllerBase{

  public function homeAction()
  {
      $di = new Phalcon\DI();
      $home = new Home();
      $node = $this->request->getPost("node");
      $tipo = $this->request->getPost("tipo");  
      $tag_destacada  = $this->request->getPost("tag_destacada"); 
      $tag2 = $this->request->getPost("tag2");
      $tag3 = $this->request->getPost("tag3");
      $lateral_1  = $this->request->getPost("lateral_1");
      $lateral_2  = $this->request->getPost("lateral_2");
      $lateral_3  = $this->request->getPost("lateral_3");
      $lateral_4  = $this->request->getPost("lateral_4");
      $lateral_5  = $this->request->getPost("lateral_5");
      $lateral_6  = $this->request->getPost("lateral_6");
      $lateral_7  = $this->request->getPost("lateral_7");
      $lateral_8  = $this->request->getPost("lateral_8");
      $lateral_9  = $this->request->getPost("lateral_9");
      $lateral_10  = $this->request->getPost("lateral_10");
      $lateral_11  = $this->request->getPost("lateral_11");
      $lateral_12  = $this->request->getPost("lateral_12");
      $lateral_13  = $this->request->getPost("lateral_13");
      $lateral_14  = $this->request->getPost("lateral_14");
      $lateral_15  = $this->request->getPost("lateral_15");
      $cronologico_1 = $this->request->getPost("cronologico_1");
      $cronologico_2 = $this->request->getPost("cronologico_2");
      $medio = $this->request->getPost("medio");
      $cabecera = $this->request->getPost("cabecera");
      $seccion = $this->request->getPost("seccion");  
      $campana_cabecera  = $this->request->getPost("campana_cabecera"); 
      $campana_cuerpo  = $this->request->getPost("campana_cuerpo"); 
      $portadas = $this->request->getPost("portadas");

      $node = json_decode($node,true);
      $tipo = json_decode($tipo,true);
      $tag_destacada = json_decode($tag_destacada,true);
      $tag2 = json_decode($tag2,true);
      $tag3 = json_decode($tag3,true);
      $lateral_1 = json_decode($lateral_1,true);
      $lateral_2 = json_decode($lateral_2,true);
      $lateral_3 = json_decode($lateral_3,true);
      $lateral_4 = json_decode($lateral_4,true);
      $lateral_5 = json_decode($lateral_5,true);
      $lateral_6 = json_decode($lateral_6,true);
      $lateral_7 = json_decode($lateral_7,true);
      $lateral_8 = json_decode($lateral_8,true);
      $lateral_9 = json_decode($lateral_9,true);
      $lateral_10 = json_decode($lateral_10,true);
      $lateral_11 = json_decode($lateral_11,true);
      $lateral_12 = json_decode($lateral_12,true);
      $lateral_13 = json_decode($lateral_13,true);
      $lateral_14 = json_decode($lateral_14,true);
      $lateral_15 = json_decode($lateral_15,true);
      $cabecera = json_decode($cabecera,true);
      $medio = json_decode($medio,true);
      $cronologico_1 = json_decode($cronologico_1,true);
      $cronologico_2 = json_decode($cronologico_2,true);
      $campana_cabecera = json_decode($campana_cabecera,true);
      $campana_cuerpo = json_decode($campana_cuerpo,true);
      $portadas = json_decode($portadas,true);
      $seccion = json_decode($seccion,true);

      $grid = new \stdClass();
      $grid->destacadas = $node;
      $grid->tag = $tag_destacada;
      $grid->tag2 = $tag2;
      $grid->tag3 = $tag3;
      $grid->tipo = $tipo;
      $grid->cronologico_1 = $cronologico_1;
      $grid->cronologico_2 = $cronologico_2;
      $grid->cabecera = $cabecera;
      $grid->medio = $medio;
      $grid->lateral_1 = $lateral_1;
      $grid->lateral_2 = $lateral_2;
      $grid->lateral_3 = $lateral_3;
      $grid->lateral_4 = $lateral_4;
      $grid->lateral_5 = $lateral_5;
      $grid->lateral_6 = $lateral_6;
      $grid->lateral_7 = $lateral_7;
      $grid->lateral_8 = $lateral_8;
      $grid->lateral_9 = $lateral_9;
      $grid->lateral_10 = $lateral_10;
      $grid->lateral_11 = $lateral_11;
      $grid->lateral_12 = $lateral_12;
      $grid->lateral_13 = $lateral_13;
      $grid->lateral_14 = $lateral_14;
      $grid->lateral_15 = $lateral_15;
      $grid->campana_cabecera = $campana_cabecera;
      $grid->campana_cuerpo = $campana_cuerpo;
      $grid->portadas = $portadas;
      $seccion_slug = explode("/", $seccion['slug']);
      unset($seccion_slug[0]);
      $seccion_slug = implode("/", $seccion_slug); 
     
      $home->load_destacado($seccion_slug,$grid);
      
      $home->no_view_cache_open = '_no_cache';
      $home->no_view_cache_central = '_no_cache';
      $home->no_view_cache_close = '_no_cache';
      $di->set('model',$home);
      $di->setShared('viewCache',$this->viewCache);
      $this->view->setDI($di);
      echo $response_render = $this->view->getRender('index','index');
  }


  public function seccionAction()
  {
      $di = new Phalcon\DI();
      $node = $this->request->getPost("node");
      $tipo = $this->request->getPost("tipo");  
      $tag_destacada  = $this->request->getPost("tag_destacada"); 
      $tag2 = $this->request->getPost("tag2");
      $tag3 = $this->request->getPost("tag3");
      $cronologico_1 = $this->request->getPost("cronologico_1");
      $cronologico_2 = $this->request->getPost("cronologico_2");
      $lateral_1  = $this->request->getPost("lateral_1");
      $lateral_2  = $this->request->getPost("lateral_2");
      $lateral_3  = $this->request->getPost("lateral_3");
      $lateral_4  = $this->request->getPost("lateral_4");
      $lateral_5  = $this->request->getPost("lateral_5");
      $lateral_6  = $this->request->getPost("lateral_6");
      $lateral_7  = $this->request->getPost("lateral_7");
      $lateral_8  = $this->request->getPost("lateral_8");
      $lateral_9  = $this->request->getPost("lateral_9");
      $lateral_10  = $this->request->getPost("lateral_10");
      $lateral_11  = $this->request->getPost("lateral_11");
      $lateral_12  = $this->request->getPost("lateral_12");
      $lateral_13  = $this->request->getPost("lateral_13");
      $lateral_14  = $this->request->getPost("lateral_14");
      $lateral_15  = $this->request->getPost("lateral_15");
      $medio = $this->request->getPost("medio");
      $cabecera = $this->request->getPost("cabecera");
      $seccion = $this->request->getPost("seccion");  
      $campana_cabecera  = $this->request->getPost("campana_cabecera"); 
      $campana_cuerpo  = $this->request->getPost("campana_cuerpo"); 


      $node = json_decode($node,true);
      $tipo = json_decode($tipo,true);
      $tag_destacada = json_decode($tag_destacada,true);
      $tag2 = json_decode($tag2,true);
      $tag3 = json_decode($tag3,true);
      $seccion = json_decode($seccion,true);
      $cronologico_1 = json_decode($cronologico_1,true);
      $cronologico_2 = json_decode($cronologico_2,true);
      $lateral_1 = json_decode($lateral_1,true);
      $lateral_2 = json_decode($lateral_2,true);
      $lateral_3 = json_decode($lateral_3,true);
      $lateral_4 = json_decode($lateral_4,true);
      $lateral_5 = json_decode($lateral_5,true);
      $lateral_6 = json_decode($lateral_6,true);
      $lateral_7 = json_decode($lateral_7,true);
      $lateral_8 = json_decode($lateral_8,true);
      $lateral_9 = json_decode($lateral_9,true);
      $lateral_10 = json_decode($lateral_10,true);
      $lateral_11 = json_decode($lateral_11,true);
      $lateral_12 = json_decode($lateral_12,true);
      $lateral_13 = json_decode($lateral_13,true);
      $lateral_14 = json_decode($lateral_14,true);
      $lateral_15 = json_decode($lateral_15,true);
      $cabecera = json_decode($cabecera,true);
      $medio = json_decode($medio,true);
      $campana_cabecera = json_decode($campana_cabecera,true);
      $campana_cuerpo = json_decode($campana_cuerpo,true);


      $grid = new \stdClass();
      $grid->destacadas = $node;
      $grid->tag = $tag_destacada;
      $grid->tag2 = $tag2;
      $grid->tag3 = $tag3;
      $grid->tipo = $tipo;
      $grid->cronologico_1 = $cronologico_1;
      $grid->cronologico_2 = $cronologico_2;
      $grid->cabecera = $cabecera;
      $grid->lateral_1 = $lateral_1;
      $grid->lateral_2 = $lateral_2;
      $grid->lateral_3 = $lateral_3;
      $grid->lateral_4 = $lateral_4;
      $grid->lateral_5 = $lateral_5;
      $grid->lateral_6 = $lateral_6;
      $grid->lateral_7 = $lateral_7;
      $grid->lateral_8 = $lateral_8;
      $grid->lateral_9 = $lateral_9;
      $grid->lateral_10 = $lateral_10;
      $grid->lateral_11 = $lateral_11;
      $grid->lateral_12 = $lateral_12;
      $grid->lateral_13 = $lateral_13;
      $grid->lateral_14 = $lateral_14;
      $grid->lateral_15 = $lateral_15;
      $grid->medio = $medio;
      $grid->campana_cabecera = $campana_cabecera;
      $grid->campana_cuerpo = $campana_cuerpo;

      $seccion_slug = explode("/", $seccion['slug']);
      unset($seccion_slug[0]);

      $home = new Seccion($seccion_slug[1],false,$this->dispatcher);


      $seccion_slug = implode("/", $seccion_slug); 
     
      $home->load_destacado($seccion_slug,$grid);
      
      $di->set('model',$home);

      $di->setShared('viewCache',$this->viewCache);

      $this->view->setDI($di);
      echo $response_render = $this->view->getRender('portada','seccion');
  }



  public function autoresAction()
  {

      $di = new Phalcon\DI();
      $node = $this->request->getPost("node");
      $tipo = $this->request->getPost("tipo");  
      $tag_destacada  = $this->request->getPost("tag_destacada");
      $tag2 = $this->request->getPost("tag2");
      $tag3 = $this->request->getPost("tag3");
      $cronologico_1 = $this->request->getPost("cronologico_1");
      $cronologico_2 = $this->request->getPost("cronologico_2");
      $lateral_1  = $this->request->getPost("lateral_1");
      $lateral_2  = $this->request->getPost("lateral_2");
      $lateral_3  = $this->request->getPost("lateral_3");
      $lateral_4  = $this->request->getPost("lateral_4");
      $lateral_5  = $this->request->getPost("lateral_5");
      $lateral_6  = $this->request->getPost("lateral_6");
      $lateral_7  = $this->request->getPost("lateral_7");
      $lateral_8  = $this->request->getPost("lateral_8");
      $lateral_9  = $this->request->getPost("lateral_9");
      $cabecera = $this->request->getPost("cabecera");
      $medio = $this->request->getPost("medio");
      $campana_cabecera  = $this->request->getPost("campana_cabecera"); 
      $campana_cuerpo  = $this->request->getPost("campana_cuerpo"); 
      $seccion = $this->request->getPost("seccion");  
       
      $node = json_decode($node,true);
      $tipo = json_decode($tipo,true);
      $tag_destacada = json_decode($tag_destacada,true);
      $tag2 = json_decode($tag2,true);
      $tag3 = json_decode($tag3,true);
      $seccion = json_decode($seccion,true);
      $cronologico_1 = json_decode($cronologico_1,true);
      $cronologico_2 = json_decode($cronologico_2,true);
      $lateral_1 = json_decode($lateral_1,true);
      $lateral_2 = json_decode($lateral_2,true);
      $lateral_3 = json_decode($lateral_3,true);
      $lateral_4 = json_decode($lateral_4,true);
      $lateral_5 = json_decode($lateral_5,true);
      $lateral_6 = json_decode($lateral_6,true);
      $lateral_7 = json_decode($lateral_7,true);
      $lateral_8 = json_decode($lateral_8,true);
      $lateral_9 = json_decode($lateral_9,true);
      $cabecera = json_decode($cabecera,true);
      $medio = json_decode($medio,true);
      $campana_cabecera = json_decode($campana_cabecera,true);
      $campana_cuerpo = json_decode($campana_cuerpo,true);

      $grid = new \stdClass();
      $grid->destacadas = $node;
      $grid->tag = $tag_destacada;
      $grid->tag2 = $tag2;
      $grid->tag3 = $tag3;
      $grid->tipo = $tipo;
      $grid->cronologico_1 = $cronologico_1;
      $grid->cronologico_2 = $cronologico_2;
      $grid->cabecera = $cabecera;
      $grid->lateral_1 = $lateral_1;
      $grid->lateral_2 = $lateral_2;
      $grid->lateral_3 = $lateral_3;
      $grid->lateral_4 = $lateral_4;
      $grid->lateral_5 = $lateral_5;
      $grid->lateral_6 = $lateral_6;
      $grid->lateral_7 = $lateral_7;
      $grid->lateral_8 = $lateral_8;
      $grid->lateral_9 = $lateral_9;
      $grid->medio = $medio;
      $grid->campana_cabecera = $campana_cabecera;
      $grid->campana_cuerpo = $campana_cuerpo;

      $seccion_slug = explode("/", $seccion['slug']);
      unset($seccion_slug[0]);
      $home = new Seccion($seccion_slug[1],$this->dispatcher);
      $seccion_slug = implode("/", $seccion_slug); 
     
      $home->load_destacado($seccion_slug,$grid);
      
      $di->set('model',$home);
      $di->setShared('viewCache',$this->viewCache);
      $this->view->setDI($di);
      echo $response_render = $this->view->getRender('portada','autores');
  }


  public function tagAction()
  {
      $di = new Phalcon\DI();
      //var_dump($_POST);die();
      $node = $this->request->getPost("node");
      $tipo = $this->request->getPost("tipo");  
      $tag_destacada  = $this->request->getPost("tag_destacada");
      $tag2 = $this->request->getPost("tag2");
      $tag3 = $this->request->getPost("tag3");
      $cronologico_1 = $this->request->getPost("cronologico_1");
      $cronologico_2 = $this->request->getPost("cronologico_2");
      $lateral_1  = $this->request->getPost("lateral_1");
      $lateral_2  = $this->request->getPost("lateral_2");
      $lateral_3  = $this->request->getPost("lateral_3");
      $lateral_4  = $this->request->getPost("lateral_4");
      $lateral_5  = $this->request->getPost("lateral_5");
      $lateral_6  = $this->request->getPost("lateral_6");
      $lateral_7  = $this->request->getPost("lateral_7");
      $lateral_8  = $this->request->getPost("lateral_8");
      $lateral_9  = $this->request->getPost("lateral_9");
      $cabecera = $this->request->getPost("cabecera");
      $medio = $this->request->getPost("medio");
      $campana_cabecera  = $this->request->getPost("campana_cabecera"); 
      $campana_cuerpo  = $this->request->getPost("campana_cuerpo"); 
      $seccion = $this->request->getPost("seccion");  
       
      $node = json_decode($node,true);
      $tipo = json_decode($tipo,true);
      $tag_destacada = json_decode($tag_destacada,true);
      $tag2 = json_decode($tag2,true);
      $tag3 = json_decode($tag3,true);
      $seccion = json_decode($seccion,true);
      $cronologico_1 = json_decode($cronologico_1,true);
      $cronologico_2 = json_decode($cronologico_2,true);
      $lateral_1 = json_decode($lateral_1,true);
      $lateral_2 = json_decode($lateral_2,true);
      $lateral_3 = json_decode($lateral_3,true);
      $lateral_4 = json_decode($lateral_4,true);
      $lateral_5 = json_decode($lateral_5,true);
      $lateral_6 = json_decode($lateral_6,true);
      $lateral_7 = json_decode($lateral_7,true);
      $lateral_8 = json_decode($lateral_8,true);
      $lateral_9 = json_decode($lateral_9,true);
      $cabecera = json_decode($cabecera,true);
      $medio = json_decode($medio,true);
      $campana_cabecera = json_decode($campana_cabecera,true);
      $campana_cuerpo = json_decode($campana_cuerpo,true);

      $grid = new \stdClass();
      $grid->destacadas = $node;
      $grid->tag = $tag_destacada;
      $grid->tag2 = $tag2;
      $grid->tag3 = $tag3;
      $grid->tipo = $tipo;
      $grid->cronologico_1 = $cronologico_1;
      $grid->cronologico_2 = $cronologico_2;
      $grid->cabecera = $cabecera;
      $grid->lateral_1 = $lateral_1;
      $grid->lateral_2 = $lateral_2;
      $grid->lateral_3 = $lateral_3;
      $grid->lateral_4 = $lateral_4;
      $grid->lateral_5 = $lateral_5;
      $grid->lateral_6 = $lateral_6;
      $grid->lateral_7 = $lateral_7;
      $grid->lateral_8 = $lateral_8;
      $grid->lateral_9 = $lateral_9;
      $grid->medio = $medio;
      $grid->campana_cabecera = $campana_cabecera;
      $grid->campana_cuerpo = $campana_cuerpo;
      $tag_slug = explode("/", $seccion['slug']);
      $tag = new Tag($tag_slug[2],$this->dispatcher);
      $tag->load_destacado($tag_slug[2],$grid);
      $di->set('model',$tag);
      $di->setShared('viewCache',$this->viewCache);
      $this->view->setDI($di);
      echo $response_render = $this->view->getRender('tag','n');
  }


}