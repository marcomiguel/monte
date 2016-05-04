<?php
namespace Rpp\Services\Analytics\Visits\Load;
use Rpp\Services\Analytics\Visits\Load\Synchronize;
use \Shared\Cache;
use \Shared\MQ;

class MasVisitadas extends \Rpp\Services\Analytics\Visits\Load\Synchronize {

  private $_slug;
  public function __construct($slug)
  {
      $this->_slug=$slug;
  }

	public function calculate()
	{
      if(empty(Cache::request()->get(MQ::get_conf()->cache_prefix->generar_masvistadas_portada.$this->_slug)))
      {

         if(Cache::request()->status_connect()) {
          Cache::request()->save(MQ::get_conf()->cache_prefix->generar_masvistadas_portada.$this->_slug,true,MQ::get_conf()->cache_time->generar_masvistadas_portada);
          MQ::send_message(MQ::get_conf()->colas->masvistadas_portada,array("slug" => $this->_slug ,"site"=> SITESLUG));
         }else return false;
        
      }
      return true;
	}

}