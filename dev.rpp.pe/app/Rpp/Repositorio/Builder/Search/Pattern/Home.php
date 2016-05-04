<?php
namespace Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Dominio\Noticia;
class Home extends Pattern
{
    public function __construct()
    {
      parent::__construct();
      $this->limit=100;
      $this->filter = array( 'sitio' => SITESLUG /*, 'categoria_slug' => array( '$ne' => SITESLUG.'/virales' )*/ , 'titulares' => TRUE , 'estado' => 'publicado' );
      $this->fields=array("fecha_publicacion","bajada","contenido","titulo","imagen_portada","_id","categoria");
    }

    public function load()
    {
      return Noticia::find(parent::get_vars());
    }

}