<?php
header('Content-type: text/xml');
class SitemapController extends ControllerBase
{
  public function indexAction()
  {
	  $this->view->disableLevel(Phalcon\Mvc\View::LEVEL_MAIN_LAYOUT);
  }

  public function seccionAction($slug)
  {
    $this->view->disableLevel(Phalcon\Mvc\View::LEVEL_MAIN_LAYOUT);
    $this->view->setVar("slug", $slug);
  }

  public function webAction()
  {
    $this->view->disableLevel(Phalcon\Mvc\View::LEVEL_MAIN_LAYOUT);
  }

  public function weblistadoAction($slug)
  {
    $this->view->disableLevel(Phalcon\Mvc\View::LEVEL_MAIN_LAYOUT);
    $this->view->setVar("slug", $slug);
  }


  public function newsAction()
  {
    $this->view->disableLevel(Phalcon\Mvc\View::LEVEL_MAIN_LAYOUT);
  }

  public function newslistadoAction($slug)
  {
    $this->view->disableLevel(Phalcon\Mvc\View::LEVEL_MAIN_LAYOUT);
    $this->view->setVar("slug", $slug);
  }


  public function archivosAction()
  {
    $this->view->disableLevel(Phalcon\Mvc\View::LEVEL_MAIN_LAYOUT);
  }

  public function archivoslistadoAction($slug)
  {

    $this->view->disableLevel(Phalcon\Mvc\View::LEVEL_MAIN_LAYOUT);
    $this->view->setVar("slug", $slug);

  }


  public function anioAction($slug,$anio)
  {

    $this->view->disableLevel(Phalcon\Mvc\View::LEVEL_MAIN_LAYOUT);
    $this->view->setVar("anio", $anio);
    $this->view->setVar("slug", $slug);
  }


  public function mesAction($slug,$anio,$mes)
  {
    
    $start = date("$anio-$mes-01");

    $end   = strtotime("+1 months" , strtotime ( $start ));

    $end = date("Y-m-d" , $end);
 
    $end = date( "Y-m-d" , strtotime($end ."- 1 days") );

    $this->view->disableLevel(Phalcon\Mvc\View::LEVEL_MAIN_LAYOUT);
    $this->view->setVar("start", $start);
    $this->view->setVar("end", $end);
    $this->view->setVar("slug", $slug);

  }
  
    public function temaAction($tema) {
        $this->view->disableLevel(Phalcon\Mvc\View::LEVEL_MAIN_LAYOUT);
        $this->view->setVar("tema", $tema);
        $this->view->setVar("limit", 50000);        
    }

}