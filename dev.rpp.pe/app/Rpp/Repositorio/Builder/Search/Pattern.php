<?php
namespace Rpp\Repositorio\Builder\Search;

abstract class Pattern
{
    protected $filter;
    protected $sort;
    protected $limit;
    protected $fields;
    
    public function __construct()
    {
      $this->filter = array('categoria_slug' =>   new \MongoRegex("/^".SITESLUG."/") , 'estado' => 'publicado' );
      $this->sort = array("date_publish" => -1);
      $this->limit=100;
      $this->fields=array("_id");
    }
 
    public function  set_filter($filter){
      $this->filter= array_merge($this->filter, $filter) ;
      return $this;
    }

    public function  set_sort($sort){
       $this->sort=$sort;
    }

    public function  set_limit($limit){
       $this->limit=$limit;
    }

    public function  set_fields($fields){
       $this->fields=$fields;
       return $this;
    }

    protected function get_vars()
    {
      $pattern=get_object_vars($this);
      array_unshift($pattern,$pattern['filter']);
      unset($pattern['filter']);
      return $pattern;
    }
 
    public function set_slug($slug)
    {
     return false;
    }

    public abstract function load();
}