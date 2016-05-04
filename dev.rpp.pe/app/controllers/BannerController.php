<?php
class BannerController extends ControllerBase
{
  public function swiffyAction()
  {
	  $this->view->disableLevel(Phalcon\Mvc\View::LEVEL_MAIN_LAYOUT);
  }

  public function eplAction($nid,$numero)
  {
  	$add = new \Rpp\Pages\Add($nid,$numero);
    $di = new Phalcon\DI();
    $di->set('model',$add);
    $this->view->setDI($di);
  }
}