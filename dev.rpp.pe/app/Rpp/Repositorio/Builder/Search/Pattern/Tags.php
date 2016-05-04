<?php
namespace Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Dominio\Tag;
class Tags extends Pattern
{
    public function __construct()
    {
      parent::__construct();
      $this->limit=50;
      $this->fields=array();
      $this->filter=array();
      $this->sort = array();
      $this->limit=false;
    }

    public  function set_slug($slug){
      $this->filter['_id']= $slug;
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
      return Tag::findFirst(parent::get_vars());
    }

}