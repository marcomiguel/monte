<?php

namespace Rpp\Repositorio\Builder\Search\Pattern;

use Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Dominio\Alert;

class Alert2 extends Pattern {

    public function __construct() {
        parent::__construct();
        $this->filter = array('sitio' => SITESLUG, 'status' => 1, 'publish' => 1);
        $this->fields = array("imagen", "titulo", "cuerpo", "url", "tipo", "data_factory_id");
        $this->limit = 1;
        $this->fields = array();
    }

    public function load() {
        return Alert::findFirst(parent::get_vars());
    }

}
