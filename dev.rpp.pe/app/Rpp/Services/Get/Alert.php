<?php

namespace Rpp\Services\Get;

use \Rpp\Repositorio\Builder\SearchPatternBuilder;
use \Shared\Cache;

class Alert {

    private static $alert;
    private static $pattern_builder;

    public static function active() {

        if (empty(static::$alert)) {
            static::$alert = Cache::request()->get(SITESLUG . '_widget_alerta');
        } else
            return static::format();
        if (Cache::request()->exists(SITESLUG . '_widget_alerta'))
            return static::format();
        else {
            static::$alert = static::get_alert()->load();
            static::format();
            if (empty(static::$alert))
                static::$alert = null;
            static::setting_cache();
        }

        return static::$alert;
    }

    public static function get_alert() {
        static::$alert = static::get_repositorio()->build();
        return static::$alert;
    }

    public static function get_repositorio() {
        if (empty(static::$pattern_builder))
            return static::$pattern_builder = new SearchPatternBuilder(new \Rpp\Repositorio\Builder\Search\Pattern\Alert2());
        return static::$pattern_builder;
    }

    public static function procesar($data) {
        static::$alert = $data;
        static::setting_cache();
    }

    public static function setting_cache() {
        Cache::request()->save(
                SITESLUG . '_widget_alerta', static::$alert, Cache::get_conf()->cache_time->destacados
        );
        var_dump(Cache::request()->get(SITESLUG . '_widget_alerta'));
    }

    private static function format() {
        if (!empty(static::$alert->tipo)) {
            if (static::$alert->tipo == 'critico') {
                static::$alert->tipo = 'type_1';
            } elseif (static::$alert->tipo == 'informativo') {
                if (isset(static::$alert->imagen)) {
                    static::$alert->tipo = 'foto';
                } else {
                    static::$alert->tipo = 'type_2';
                }
            } elseif (static::$alert->tipo == 'envivo') {
                if (!empty(static::$alert->imagen)) {
                    static::$alert->tipo = 'deporte_full';
                } else {
                    static::$alert->tipo = 'deporte';
                }
            }
        }
        return static::$alert;
    }

}
