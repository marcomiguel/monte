<?php

class EnvivoController extends ControllerBase {

    public function radioAction() {
        $di = new Phalcon\DI();
        $di->set('viewCache', $this->viewCache);
        $di->set('model', new \Rpp\Pages\Radioenvivo());
        $this->view->setDI($di);
    }

    public function cabinaAction() {

        $di = new Phalcon\DI();
        $di->set('viewCache', $this->viewCache);
        $di->set('model', new \Rpp\Pages\Cabinaenvivo());
        $this->view->setDI($di);
    }

    public function jsonAction() {
        ///$this->view->disable();

        $di = new Phalcon\DI();
        $di->set('viewCache', $this->viewCache);
        $this->view->setDI($di);
    }

    public function programacionradioAction() {
        $di = new Phalcon\DI();
        $di->set('viewCache', $this->viewCache);
        $di->set('model', new \Rpp\Pages\Programacionradio());
        $this->view->setDI($di);
    }

    public function programacioncabinaAction() { //es la rogramacion de tv en vivo
        $di = new Phalcon\DI();
        $di->set('viewCache', $this->viewCache);
        $di->set('model', new \Rpp\Pages\Programacioncabina());
        $this->view->setDI($di);
    }

    public function embedAction($tipo) {
        $this->view->disableLevel(Phalcon\Mvc\View::LEVEL_MAIN_LAYOUT);
        $di = new Phalcon\DI();
        $di->set('viewCache', $this->viewCache);

        switch ($tipo) {
            case "radio":
                $di->set('model', new \Rpp\Pages\Radioenvivo());
                break;
            case "cabina":
                $di->set('model', new \Rpp\Pages\Cabinaenvivo());
                break;
            case "tv":
                $di->set('model', new \Rpp\Pages\Tvenvivo());
                break;
            default:
                $di->set('model', new \Rpp\Pages\Radioenvivo());
        }


        $this->view->setDI($di);
        print $response_render = $this->view->getRender('envivo', 'embed');
    }

}
