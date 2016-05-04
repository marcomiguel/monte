<?php
namespace Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Dominio\Noticia;
class Seccion extends Pattern
{
    public function __construct()
    {
      parent::__construct();
      $this->filter = array('categoria_slug' =>   new \MongoRegex("/^".SITESLUG."/") , 'estado' => 'publicado' );
      $this->fields=array("fecha_publicacion","bajada","titulo","imagen_portada","_id");
    }

    public function load()
    {
      return Noticia::find(parent::get_vars());
    }

    public  function set_slug($slug){
      $this->filter['categoria_slug']= new \MongoRegex("/^".SITESLUG."\/$slug"."/");
      return $this;
    }

    
}