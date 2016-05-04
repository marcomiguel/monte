<?php
namespace Rpp\Services\Analytics\Visits\Load;
use Rpp\Services\Analytics\Visits\Load\Synchronize;


class StaticMasVisitadas extends \Phalcon\Mvc\User\Component {

  private static $_slug;
  public function __construct($slug)
  {
      $this->_slug=$slug;
  }

	public function calculate()
	{
      $key="analytics.masvisitadas.$this->_slug";
      if(empty($this->cache->get($key)))
      {
        $this->cache->save($key,true,60*1);
        $this->send_message();
      }
      return true;
	}



}