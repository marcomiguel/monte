<?php

use Rpp\Pages\Preview\Home;
use Rpp\Repositorio\Builder\SearchPatternBuilder;
use Rpp\Repositorio\Builder\Search\Pattern\Nota;
use Rpp\Repositorio\Builder\Search\Pattern\Categoria;

class WidgetpreviewController extends ControllerBase {

    //$lid, $site = SITESLUG
    public function loadAction($service = null) {
        $node = $this->request->getPost("node");
        $node = json_decode($node, true);
        $node = (object) $node;

        $method = $service === null ? 'widget' : "widget_{$service}";

        if (method_exists($this, $method)) {
            $result = $this->$method($node);
            return $result;
        }
        return new CMS\Api\Error(500, 'No se devuelven resultados');
    }

    function widget_socialtv($node) {
        try {
            $di = new Phalcon\DI();
            $di->set('socialtvpreview', $node);
            $di->set('socialtv', $node);
            $di->set('viewCache', $this->viewCache);
            $this->view->setDI($di);

            echo $response_render = $this->view->getRender('widget', 'socialtv');
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    function widget_alert($alerta) {
        try {

            $di = new Phalcon\DI();
            $home = new Home();
            $home = new \Rpp\Pages\Preview\Home();
            $grid = new \stdClass();
            $di->set('model', $home);
            $di->set('alerta', $alerta);
            $di->setShared('viewCache', $this->viewCache);
            $this->view->setDI($di);
            echo $response_render = $this->view->getRender('index', 'index');
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

}
