<?php
namespace Rpp\Services\Publish;
class Destacados extends \Phalcon\Mvc\User\Component
{
  private $slug;
  public function __construct($slug)
  {
  	 
     $this->slug =  str_replace( SITESLUG.DIRS , "" , $slug);
  }

  public function load()
  {
   \Rpp\Services\Get\Destacados::$destacados = null;
   \Rpp\Services\Get\Destacados::$metadata= null;
   \Rpp\Services\Get\Destacados::$pattern_builder = null;
   print_r(\Rpp\Services\Get\Destacados::portada($this->slug) );
   print_r(\Rpp\Services\Get\Destacados::metadata($this->slug));
   var_dump("hola.............");
   $this->viewCache->delete("portada.bodyopen.".$this->slug ); 
   $this->viewCache->delete("portada.bodycentral.".$this->slug ); 
   $this->viewCache->delete("portada.bodyclose.".$this->slug );

   ###remaquetado##########
   $this->viewCache->delete("portada.body.open." .$this->slug); 
   $this->viewCache->delete("portada.body.central." .$this->slug); 
   $this->viewCache->delete("portada.body.close." .$this->slug);
   var_dump("terminate.............");
  }

}
