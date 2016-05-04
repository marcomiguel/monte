<?php
namespace Rpp\Destacados;
use Rpp\Dominio\Noticias_destacadas;

class Portada{
  	protected $filter;
    protected $sort;
    protected $limit;
    protected $fields;


    public function __construct()
    {
      $this->filter = array();
      $this->sort = array();
      $this->limit=10;
      $this->fields= array(
                           "destacadas",
                           "tag" , 
                           "tag2" ,  
                           "tag3" , 
                           "lateral_1" , 
                           "lateral_2" , 
                           "lateral_3" , 
                           "lateral_4" , 
                           "lateral_5" , 
                           "lateral_6" , 
                           "lateral_7" , 
                           "lateral_8" , 
                           "lateral_9" , 
                           "lateral_10" , 
                           "lateral_11" , 
                           "lateral_12" , 
                           "lateral_13" , 
                           "lateral_14" , 
                           "lateral_15" , 
                           "cronologico_1",
                           "cronologico_2",
                           "cabecera.slug" , 
                           "cabecera.nombre" ,
                           "cabecera.cantidad" ,
                           "cabecera.publicidad",
                           "cabecera.destacadas",
                           "cabecera.envivo",
                           "cabecera.encuesta",
                           "medio.cantidad" , 
                           "medio.nombre" ,
                           "medio.slug" ,
                           "medio.destacadas" ,
                           "medio.envivo",
                           "medio.encuesta",
                           "campana_cabecera.slug", 
                           "campana_cabecera.nombre",
                           "campana_cabecera.cantidad",
                           "campana_cuerpo.slug",
                           "campana_cuerpo.nombre",
                           "campana_cuerpo.slug",
                           "campana_cuerpo.pcid",
                           "tipo"  ,
                           "portadas",
        ) ;
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
      return Noticias_destacadas::findFirst($this->get_vars());
    }

    private function get_vars()
    {
      $pattern=get_object_vars($this);
      array_unshift($pattern,$pattern['filter']);
      unset($pattern['filter']);
      return $pattern;
    }
}