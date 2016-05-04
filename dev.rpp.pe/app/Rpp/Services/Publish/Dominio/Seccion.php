<?php
namespace Rpp\Services\Publish\Dominio;
use \Rpp\Repositorio\Builder\SearchPatternBuilder;
use Rpp\Services\Publish\Dominio\Flow;
use \Shared\Cache;
class Seccion extends Flow {
    private  $slug;
    private $patternBuilder;
    public function __construct()
    {
      $this->patternBuilder = new SearchPatternBuilder( new \Rpp\Repositorio\Builder\Search\Pattern\Seccion() );
    }

    public function make()
    {
      $Pattern = $this->patternBuilder->addFields(array("_id"))->addSlug($this->slug)->build();
      
      Cache::request()->save(
                               Cache::get_conf()->cache_prefix->seccion.$this->slug,
                               $Pattern->load(),
                               Cache::get_conf()->cache_time->seccion
                            );
    }

    public function set_slug($slug)
    {
      $this->slug=$slug;
    }

}

?>