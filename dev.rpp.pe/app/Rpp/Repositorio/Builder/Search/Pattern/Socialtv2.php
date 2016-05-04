<?php

namespace Rpp\Repositorio\Builder\Search\Pattern;

use Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Dominio\Socialtv;

class Socialtv2 extends Pattern {

    public function __construct() {
        parent::__construct();
        $this->filter = array('sitio' => SITESLUG, 'status' => (int) 1, 'publish' => (int) 1);
        $this->fields = array("titulo", "contenido");
        $this->limit = 1;
        $this->fields = array();
    }

    public function load() {
        return Socialtv::findFirst(parent::get_vars());
    }

}
