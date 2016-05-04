<?php
namespace Rpp\Services\Analytics\Visits\Regenerate;
use \Shared\Cache;
class MasVisitadas extends \Phalcon\Mvc\User\Component
{
    private $slug;
	private $visitas_builder;
	private $ranking;
	public function __construct($slug)
    {
   	 $this->slug = $slug;
     $this->visitas_builder  = new \Rpp\Analytics\MasVisitadas();
    }


    public function builder()
    {
       var_dump(SITESLUG.DIRS.$this->slug);
        $ranking[$this->slug]=  $this->visitas_builder->addFilter(array('_id' => SITESLUG.DIRS.$this->slug))->load()->lista ;
        if(!is_array($ranking[$this->slug]))$ranking[$this->slug] = array();
         print_r($ranking[$this->slug]);
  	    Cache::request()->save(
                           Cache::get_conf()->cache_prefix->visitas.$this->slug,
                           $ranking[$this->slug],
                           Cache::get_conf()->cache_time->visitas
                          );


    }
}