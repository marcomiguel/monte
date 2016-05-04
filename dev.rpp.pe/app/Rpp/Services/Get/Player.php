<?php

namespace Rpp\Services\Get;

use \Rpp\Repositorio\Builder\SearchPatternBuilder;
use \Shared\Cache;

class Player {

    private static $player;
    private static $pattern_builder;

    public static function player($tipo) {
        if (empty(static::$player)) {
            static::$player = Cache::request()->get(SITESLUG . '_widget_player_' . $tipo);
        } else
            return static::format();
        if (Cache::request()->exists(SITESLUG . '_widget_player_' . $tipo))
            return static::format();
        else {
            static::$player = static::get_player($tipo)->load();
            static::format();
            if (empty(static::$player))
                static::$player = null;
            static::setting_cache($tipo);
        }
        return static::$player;
    }

    public static function get_player($tipo) {
        static::$player = static::get_repositorio($tipo)->build();
        return static::$player;
    }

    public static function get_repositorio($tipo) {
        if (empty(static::$pattern_builder))
            return static::$pattern_builder = new SearchPatternBuilder(new \Rpp\Repositorio\Builder\Search\Pattern\Player2($tipo));
        return static::$pattern_builder;
    }

    public static function procesar($data) {
        static::$player = $data;
        static::setting_cache(static::$player->tipo);
    }

    public static function setting_cache($tipo) {
        echo "cache: " . SITESLUG . '_widget_player_' . $tipo;
        Cache::request()->delete(SITESLUG . '_widget_player_' . $tipo);

        Cache::request()->save(
                SITESLUG . '_widget_player_' . $tipo, static::$player, Cache::get_conf()->cache_time->destacados
        );
    }

    private static function format() {
        return static::$player;
    }

}
