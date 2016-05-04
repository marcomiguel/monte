<?php
namespace Local\Models;
class Notaminimal extends \Phalcon\Mvc\Collection
{
    public  $site_tag ;
    public  $nid;
    public  $tipo;
    public  $date_publish;
    public  $fecha_publicacion;
    public  $categoria;
    public  $volada;
    public  $bajada;
    public  $titulo;
    public  $contenido;
    public  $permalink;
    public  $slug;
    public  $autor;
    public  $fuente;
    public  $stats;
    public  $publicidad;
    public  $config;
    public  $categoria_tag;
    public  $tags;
    public  $portada_thumb;

    public function initialize()
    {
      $this->bajada='';
      $this->site_tag='la10';
      $this->titulo='';
      $this->fecha_publicacion = time();
      $this->contenido= array(  );
      $this->portada_thumb = array();
      $this->tags = array();
      $this->categoria= (object)array('slug'=> 'la10/no-load' ,'nombre'=> 'la10/No load...' );
    }


}