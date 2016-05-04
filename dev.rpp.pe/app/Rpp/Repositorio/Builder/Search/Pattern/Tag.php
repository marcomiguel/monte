<?php
namespace Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Dominio\Noticia;
class Tag extends Pattern
{
    public function __construct()
    {
      parent::__construct();
      $this->filter = array('sitio' =>  SITESLUG , 'estado' => 'publicado');
      $this->fields=array("fecha_publicacion","bajada","titulo","imagen_portada","_id");
      $this->limit=100;
    }

    public function load()
    {
      return Noticia::find(parent::get_vars());
    }

}