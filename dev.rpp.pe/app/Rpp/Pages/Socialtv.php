<?php

namespace Rpp\Pages;

use Rpp\Repositorio\Builder\SearchPatternBuilder;
use Rpp\Services\Get\Sugeridos;
use Shared\Cache;

class Socialtv extends \Rpp\Pages\Page {

    public $lid;
    public $sitio;
    public $programa;
    public $programaslug;
    public $titulo;
    public $hashtags;
    public $date_create;
    public $date_publish;
    public $date_update;
    public $version;
    public $status;
    public $contenido = array();
    public $tag = array();
    public $publish;
    public $auth_id;
    public $auth_name;
    public $auth_username;
    public $auth_rol;

    public function __construct($slug) {
        $object = \Rpp\Services\Get\Socialtv::active($slug);

        $this->titulo = $object->titulo;
        $this->hashtags = $object->hashtags;        
        $this->contenido = $object->contenido;
    }

}
