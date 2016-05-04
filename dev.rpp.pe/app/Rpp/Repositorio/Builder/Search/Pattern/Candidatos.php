<?php
namespace Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Dominio\Candidato;
class Candidatos extends Pattern
{
    public function __construct()
    {
      parent::__construct();
      $this->fields=array("id","nombre","foto","nombrecorto","url","partido");
      $this->filter=array();
      $this->sort = array();
      $this->limit=false;
    }

    public function  set_filter($filter){
      $this->filter= array_merge($this->filter, $filter);
      return $this;
    }

    public function set_fields($fields = array())
    {
      $this->fields = $fields;
      return $this;
    }
    
    public function load()
    {
      return Candidato::find(parent::get_vars());
    }

}