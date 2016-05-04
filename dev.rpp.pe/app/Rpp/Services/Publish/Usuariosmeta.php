<?php
namespace Rpp\Services\Publish;
class Usuariosmeta extends \Phalcon\Mvc\User\Component
{
  private $slug;
  public function __construct($slug)
  {
     $this->slug = $slug;
  }

  public function load()
  {
     $user=\Rpp\Services\Get\User::get($this->slug);
     if(@$user->autor['categoria']['slug'])
     {
      $categoria= str_replace( SITESLUG .'/' ,'', $user->autor['categoria']['slug']);
      $categoria = \Rpp\Services\Get\Categorias::get_categoria($categoria);
     }
     
     var_dump($categoria,$user);
  }

}
