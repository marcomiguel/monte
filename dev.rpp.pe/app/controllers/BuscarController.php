<?php
use Rpp\Pages\Buscador;

class BuscarController extends ControllerBase
{
    public function indexAction()
    {
        $di = new Phalcon\DI();
        $di->set('viewCache', $this->viewCache);
        $di->set('model', new Buscador());
        $this->view->setDI($di);
    }
}