<?php

namespace Rpp\Dominio;

class Socialtv extends \Phalcon\Mvc\Collection {

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

}
