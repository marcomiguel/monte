<?php
namespace Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Dominio\Noticia;
class Nota extends Pattern
{
    public function __construct()
    {
      parent::__construct();
      $this->limit=1;
      $this->fields=array();
    }

    public function load()
    {
      return Noticia::findFirst(parent::get_vars());
    }


}