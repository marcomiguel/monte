<?php

namespace Rpp\Dominio;

class Podcast extends \Phalcon\Mvc\Collection {

    public $pcid;
    public $nombre;
    public $bajada;
    public $lista = array();
    public $estado;
    public $branded;
    public $branded_url;
    public $sitio;
    public $date_create;
    public $date_publish;
    public $date_update;
    public $auth_id;
    public $auth_name;
    public $auth_username;
    public $auth_rol;

}
