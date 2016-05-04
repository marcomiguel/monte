<?php
namespace Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Dominio\Podcast;
class Resumeh extends Pattern
{
    public function __construct()
    {
      parent::__construct();
      $this->limit=50;
      $this->fields=array("nombre","bajada","lista");
      $this->filter=array('sitio' => SITESLUG , 'estado' => 1);
      $this->sort = array();
      $this->limit=false;
    }

    public function  set_filter($filter){
      $this->filter= array_merge($this->filter, $filter) ;
      return $this;
    }

    public function set_fields($fields = array())
    {
      $this->fields = $fields;
      return $this;
    }
    
    public function load()
    {
      return Podcast::findFirst(parent::get_vars());
    }

}