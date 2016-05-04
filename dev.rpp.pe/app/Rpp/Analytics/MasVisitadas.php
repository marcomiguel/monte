<?php
namespace Rpp\Analytics;
use Rpp\Dominio\Noticias_ranking;
use Rpp\Dominio\Noticia;
class MasVisitadas 
{
    protected $filter;
    protected $sort;
    protected $limit;
    protected $fields;

    public function __construct()
    {
      $this->filter = array();
      $this->sort = array("lista.visitas_total" => 1);
      $this->limit=50;
      $this->fields=array("lista.nid","lista.visitas_total");
      return $this;
    }

    public function  addFilter($filter){
      $this->filter= $filter ;
      return $this;
    }

    public function  addSort($sort){
       $this->sort=$sort;
       return $this;
    }

    public function  addLimit($limit){
       $this->limit=$limit;
       return $this;
    }

    public function  addFields($fields){
       $this->fields=$fields;
       return $this;
    }

    public function load()
    {
      return Noticias_ranking::findFirst($this->get_vars());
    }

    private function get_vars()
    {
      $pattern=get_object_vars($this);
      array_unshift($pattern,$pattern['filter']);
      unset($pattern['filter']);
      return $pattern;
    }
}