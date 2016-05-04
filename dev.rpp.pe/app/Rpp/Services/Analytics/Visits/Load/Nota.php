<?php
namespace Rpp\Services\Analytics\Visits\Load;
use Rpp\Services\Analytics\Visits\Load\Synchronize;
use \Shared\Cache;
use \Shared\MQ;

class Nota extends Synchronize {

  private $_nid;
  public function __construct($nid)
  {
      $this->_nid=$nid;
  }

	public function calculate()
	{
    $key="analytics.visit.nota.$this->_nid";
    if(empty(Cache::request()->get(MQ::get_conf()->cache_prefix->conteo_visitas_nota.$this->_nid)))
    {
      if(Cache::request()->status_connect()) {
         Cache::request()->save(MQ::get_conf()->cache_prefix->conteo_visitas_nota.$this->_nid,true,MQ::get_conf()->cache_time->conteo_visitas_nota);
         MQ::send_message(MQ::get_conf()->colas->visitas_por_nota,array("nid" => $this->_nid ));
      }
    }
    return true;
	}

}