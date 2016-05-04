<?php
namespace Rpp\Services\Publish\Dominio;
use \Rpp\Repositorio\Builder\SearchPatternBuilder;
use Rpp\Services\Publish\Dominio\Flow;
use \Shared\Cache;
class Tag extends Flow {
    private $slug;
    private $patternBuilder;
    public function __construct()
    {
      $this->patternBuilder = new SearchPatternBuilder( new \Rpp\Repositorio\Builder\Search\Pattern\Tag() );
    }


    public function make()
    {

      $Pattern = $this->patternBuilder->addFields(array("_id"))->addFilter(array("tags.slug" => $this->slug))->build();
      Cache::request()->save(
                         Cache::get_conf()->cache_prefix->tag.$this->slug,
                         $Pattern->load(),
                         Cache::get_conf()->cache_time->tag
                        );
    }


    public function get_info($slug)
    {
        $Builder = new SearchPatternBuilder( new \Rpp\Repositorio\Builder\Search\Pattern\Tags());
        $Pattern = $Builder->build();
        return $Pattern->set_slug($slug)->load();
    }

    public function set_slug($slug)
    {
      $this->slug=$slug;
    }
}

?>