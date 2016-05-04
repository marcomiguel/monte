<?php
namespace Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Dominio\Categoria;
class Categorias extends Pattern
{
    public function __construct()
    {
      parent::__construct();
      $this->limit=50;
      $this->fields=array();
      $this->filter=array(/*'peso' => array( '$gt' => 0 )*/ );
      $this->sort = array('peso' => 1);
      $this->limit=false;
    }

    public  function set_slug($slug){
      //$this->filter['_id']= SITESLUG.'/'.$slug;
      $this->filter['_id'] = new \MongoRegex("/^".SITESLUG."\/$slug"."/");
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
      return Categoria::find(parent::get_vars());
    }

}