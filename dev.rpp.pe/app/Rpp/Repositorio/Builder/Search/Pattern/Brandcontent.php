<?php
namespace Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Dominio\Noticia;
class Brandcontent extends Pattern
{
    public function __construct()
    {
      parent::__construct();
      $this->filter = array('sitio' =>   SITESLUG , 'estado' => 'publicado', 'tipo' => 'brandcontent' );
      $this->fields=array("fecha_publicacion","bajada","contenido","titulo","imagen_portada","_id","categoria");
      $this->limit = 5;
    }

    public function load()
    {
      return Noticia::find(parent::get_vars());
    }

}