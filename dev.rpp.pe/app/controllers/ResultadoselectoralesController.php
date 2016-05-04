<?php
class ResultadoselectoralesController extends ControllerBase
{
	public function presidencialesAction()
    {
    $di = new Phalcon\DI();
    $di->set('viewCache',$this->viewCache);
    $model = new \Rpp\Pages\Relectorales();
    $model->comscore = 'elecciones-peru-2016.resultados.electorales.presidenciales';
    $model->titulo='Resultados Elecciones 2016: revisa aquí el flash electoral de Presidentes';
    $model->description = "Los resultados de las Elecciones Presidenciales 2016 serán anticipados con los flash electorales a 'boca de urna'";
    $model->keywords = 'Elecciones 2016, Resultados Elecciones 2016, Resultados Presidenciales 2016, Boca de urna, Boca de urna Presidentes, Flash Electoral Presidentes, Flash Electoral';
    $model->titulo_social = 'Resultados Elecciones 2016: revisa aquí el flash electoral de Presidentes';
    $model->urlcanonical = '/elecciones-peru-2016/resultados-presidenciales';
    $di->set('model',$model);
    $this->view->setDI($di);
    }

    public function congresoAction()
    {
    $di = new Phalcon\DI();
    $di->set('viewCache',$this->viewCache);
    $model = new \Rpp\Pages\Relectorales();
    $model->comscore = 'elecciones-peru-2016.resultados.electorales.congreso';
    $model->titulo='Resultados Elecciones 2016: revisa aquí el flash electoral al Congreso';
    $model->description = "Los resultados de las Elecciones Congresales 2016 serán anticipados con los flash electorales a 'boca de urna'";
    $model->keywords = 'Elecciones 2016, Resultados Elecciones 2016, Resultados Presidenciales 2016, Boca de urna, Boca de urna Presidentes, Flash Electoral Presidentes, Flash Electora';
    $model->titulo_social = 'Resultados Elecciones 2016: revisa aquí el flash electoral al Congreso';
    $model->urlcanonical = '/elecciones-peru-2016/resultados-congreso';
    $di->set('model',$model);
    $this->view->setDI($di);
    }

    public function parlamentoandinoAction()
    {
    $di = new Phalcon\DI();
    $di->set('viewCache',$this->viewCache);
    $model = new \Rpp\Pages\Relectorales();
    $model->comscore = 'elecciones-peru-2016.resultados.electorales.parlamento-andino';
    $model->titulo='Resultados Elecciones 2016: revisa aquí el flash electoral al Parlamento Andino';
    $model->description = "Los resultados de las Elecciones al Parlamento Andino 2016 serán anticipados con los flash electorales a 'boca de urna'";
    $model->keywords = 'Elecciones 2016, Resultados Elecciones 2016, Resultados Presidenciales 2016, Boca de urna, Boca de urna Presidentes, Flash Electoral Presidentes, Flash Electoral ';
    $model->titulo_social = 'Resultados Elecciones 2016: revisa aquí el flash electoral al Parlamento Andino';
    $model->urlcanonical = '/elecciones-peru-2016/resultados-parlamento-andino';
    $di->set('model',$model);
    $this->view->setDI($di);
    }
}


