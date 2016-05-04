<?php

use Phalcon\Mvc\Controller;
use Rpp\Repositorio\Builder\SearchPatternBuilder;

class SocialtvController extends ControllerBase {

//    public function indexAction() {
//        $di = new Phalcon\DI();
//        $di->set('viewCache', $this->viewCache);
//        $di->set('model', new Buscador());
//        $this->view->setDI($di);
//    }

    public function widgetAction($slug) {
        $socialtv = new \Rpp\Pages\Socialtv($slug);
        $di = new Phalcon\DI();
        $di->set('viewCache', $this->viewCache);
        $di->set('socialtv', $socialtv);
        $this->view->setDI($di);
        print $response_render = $this->view->getRender('widget', 'socialtv');
    }

    public function xmlAction($slug) {
        $this->view->disableLevel(Phalcon\Mvc\View::LEVEL_MAIN_LAYOUT);
        $this->view->disable();
        $this->_isXmlResponse = true;
        $this->response->setContentType('application/xml');
        if (strpos($slug, ".xml") === FALSE) {
            
        } else {
            $slug = explode(".", $slug);
            $socialtv = new \Rpp\Pages\Socialtv($slug[0]);

            $di = new Phalcon\DI();
            $di->set('viewCache', $this->viewCache);
            $di->set('socialtv', $socialtv);
            $this->view->setDI($di);
            $this->view->reset();

            echo $response_render = $this->view->getRender('widget', 'socialtv_xml');
        }
    }

}
