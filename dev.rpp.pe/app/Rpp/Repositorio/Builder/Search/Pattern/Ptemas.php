<?php
namespace Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Dominio\Portada_temas;
class Ptemas extends Pattern
{
    public function __construct()
    {
      parent::__construct();
      $this->filter = array( '_id' => SITESLUG );
      $this->fields=array();
      $this->sort = array();
      $this->limit=100;
      $this->fields=array();
    }

    public  function set_slug($slug){
      return $this;
    }

    public function set_limit($limit)
    {
      $this->limit = $limit;
      return $this;
    }

    public function set_fields($fields = array())
    {
      $this->fields = $fields;
      return $this;
    }


    public function load()
    {
      return Portada_temas::findFirst(parent::get_vars());
    }

}