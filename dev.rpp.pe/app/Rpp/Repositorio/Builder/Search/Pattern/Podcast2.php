<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Rpp\Repositorio\Builder\Search\Pattern;

use Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Dominio\Podcast;

/**
 * Description of Podcast
 *
 * @author csuazo
 */
class Podcast2 extends Pattern {

    public function __construct() {
        parent::__construct();
        $this->filter = array('estado' => 1);
//        $this->fields = array();
//        $this->limit = 1;
        $this->fields = array('nombre', 'bajada', 'nombre', 'branded', 'branded_url', 'lista');
    }

    public function load() {
        $ret = Podcast::findFirst(parent::get_vars());
        return $ret;
    }

}
