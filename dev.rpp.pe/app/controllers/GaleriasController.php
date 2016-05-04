<?php
use Rpp\Pages\Galerias;

class GaleriasController extends ControllerBase
{
    public function indexAction()
    {
        $di = new Phalcon\DI();
        $di->set('viewCache', $this->viewCache);
        $Galerias = new Galerias();
        $di->set('model', $Galerias);
        $this->view->setDI($di);
    }
}
