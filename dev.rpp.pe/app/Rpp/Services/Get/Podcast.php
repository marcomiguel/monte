<?php

namespace Rpp\Services\Get;

use \Rpp\Repositorio\Builder\SearchPatternBuilder;
use \Shared\Cache;

class Podcast {

    private static $podcast;
    private static $pcid;
    private static $pattern_builder;

    public static function get($pcid) {
//        if (Cache::request()->exists(SITESLUG . '_podcast_' . $pcid)) {
            static::$podcast = Cache::request()->get(SITESLUG . '_podcast_' . $pcid);
           
            if (empty(static ::$podcast)) {
                static::$podcast = static::get_podcast($pcid)->load();              
                static::setting_cache($pcid);
            }
//        } else {
//            static::$podcast = static::get_podcast($pcid)->load();
//            static::setting_cache($pcid);
//            
//        }

        return static::$podcast;
    }

    public static function get_podcast($pcid) {
        static::$pcid = $pcid;
        static::$podcast = static::get_repositorio()->addFilter(array('pcid' => $pcid))->build();
        return static::$podcast;
    }

    public static function get_repositorio() {
        if (empty(static::$pattern_builder))
            return static::$pattern_builder = new SearchPatternBuilder(new \Rpp\Repositorio\Builder\Search\Pattern\Podcast2());
        return static::$pattern_builder;
    }

    public static function procesar($data) {
        static::$podcast = $data;
        static::setting_cache(static::$podcast->pcid);
    }

    public static function setting_cache($pcid) {
        //Cache::request()->delete(SITESLUG . '_podcast_' . $pcid);
        Cache::request()->save(SITESLUG . '_podcast_' . $pcid, static::$podcast, Cache::get_conf()->cache_time->destacados
        );
    }
//
//    private static function format() {
//        return static::$podcast;
//    }
}
