<?php echo $this->partial('partials/breadcrum/index', array('elements' => array(\Rpp\Services\Get\Content::node($this->model->nid)->categoria['nombre']))); ?>
