<?php

namespace Rpp\Services\Get;

use \Rpp\Repositorio\Builder\SearchPatternBuilder;
use \Shared\Cache;

class Socialtv {

    private static $socialtv;
    private static $pattern_builder;
    private static $slug;

    public static function active($slug) {
        static::$slug = $slug;
        Cache::request()->delete('widget_socialtv_' . static::$slug);

        if (empty(static::$socialtv)) {
            static::$socialtv = Cache::request()->get('widget_socialtv_' . static::$slug);
        } else
            return static::format(static::$socialtv);

        if (Cache::request()->exists('widget_socialtv_' . static::$slug) && ('null' !== Cache::request()->get('widget_socialtv_' . static::$slug)))
            return static::format(static::$socialtv);
        else {
            static::$socialtv = static::get_socialtv($slug)->load();
            if (empty(static::$socialtv))
                static::$socialtv = null;
            static::setting_cache();
        }

        return static::$socialtv;
    }

    public static function get_socialtv($slug) {
        static::$slug = $slug;
        static::$socialtv = static::get_repositorio()->addFilter(array('programaslug' => $slug))->build();
        return static::$socialtv;
    }

    public static function get_repositorio() {
        if (empty(static::$pattern_builder))
            return static::$pattern_builder = new SearchPatternBuilder(new \Rpp\Repositorio\Builder\Search\Pattern\Socialtv2());
        return static::$pattern_builder;
    }

    public static function procesar($data) {
        static::$socialtv = $data;
        static::setting_cache();
    }

    public static function setting_cache() {
        $res = Cache::request()->save(
                'widget_socialtv_' . static::$slug, static::$socialtv, Cache::get_conf()->cache_time->destacados
        );
    }

    private static function format() {
//        static::$socialtv = json_decode(static::$socialtv);
        return static::$socialtv;
    }

}
