<?php
namespace Rpp\Services\Publish\Dominio;
use \Rpp\Repositorio\Builder\SearchPatternBuilder;
use \Rpp\Services\Publish\Dominio\Flow;
use \Shared\Cache;
class Home extends Flow {
    
    private $patternBuilder;

    public function __construct()
    {
      $this->patternBuilder = new SearchPatternBuilder( new \Rpp\Repositorio\Builder\Search\Pattern\Home() );
    }

    public function make()
    {
      $Pattern = $this->patternBuilder->addFields(array("_id"))->build();

      Cache::request()->save(
      	                   Cache::get_conf()->cache_prefix->home,
    	                   $Pattern->load(),
    	                   Cache::get_conf()->cache_time->home
      	                    );

    }
}

?>