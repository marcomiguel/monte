<?php
namespace Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Dominio\Noticia;
class Autor extends Pattern
{
    public function __construct()
    {
      parent::__construct();
      $this->filter = array('sitio' =>   SITESLUG , 'estado' => 'publicado', 'tipo' => 'blog');
      $this->fields=array("fecha_publicacion","bajada","contenido","titulo","imagen_portada","_id","categoria");
    }

    public function load()
    {
      return Noticia::find(parent::get_vars());
    }

    public  function set_slug($slug){
      $this->filter['autor.slug']= $slug;
      return $this;
    }

}