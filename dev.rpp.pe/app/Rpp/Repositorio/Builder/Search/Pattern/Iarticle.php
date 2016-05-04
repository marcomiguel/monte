<?php
namespace Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Dominio\Noticia;
class Iarticle extends Pattern
{
    public function __construct()
    {
      parent::__construct();
      $this->limit=100;
      $this->filter = array( 'sitio' => SITESLUG , 'instant_article' => true   , 'estado' => 'publicado' );
      $this->fields=array("_id");
    }

    public function load()
    {
      return Noticia::find(parent::get_vars());
    }

}