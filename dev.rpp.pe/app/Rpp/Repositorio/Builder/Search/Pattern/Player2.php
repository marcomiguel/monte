<?php

namespace Rpp\Repositorio\Builder\Search\Pattern;

use Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Dominio\Player;

class Player2 extends Pattern {

    public function __construct($tipo) {
        parent::__construct();
        $this->filter = array('sitio' => SITESLUG, 'tipo' => $tipo);
        $this->fields = array("media", "estado");
        $this->limit = 1;
        $this->fields = array();
    }

    public function load() {
        return Player::findFirst(parent::get_vars());
    }

}
