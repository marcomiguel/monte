<?php
namespace Rpp\Pages\Component;
class Calientes extends \Phalcon\Mvc\User\Component {
  private $seccion_slug;

  public function set_seccion_slug($slug)
  {
    $this->seccion_slug=$slug;
  }

  public function load()
  {
    $masvisitadas = new \Rpp\Analytics\MasVisitadas();
    return $masvisitadas->addFilter(array('_id' => SITESLUG.DIRS.$this->seccion_slug))->load();
  }
}