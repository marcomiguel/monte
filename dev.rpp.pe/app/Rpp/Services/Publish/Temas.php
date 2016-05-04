<?php
namespace Rpp\Services\Publish;
class Temas extends \Phalcon\Mvc\User\Component
{
  private $slug;
  public function __construct()
  {

  }

  public function load()
  {
     var_dump(\Rpp\Services\Get\Temas::get_temas());
  }

}
