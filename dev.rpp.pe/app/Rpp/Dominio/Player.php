<?php

namespace Rpp\Dominio;

class Player extends \Phalcon\Mvc\Collection {

    public $pid;
    public $sitio;
    public $tipo;
    public $media = array();
    public $tiempo = array();
    public $estado;
    public $noplay;
    public $date_create;
    public $date_publish;
    public $date_update;

}
