<?php
header('Content-type: text/xml');
class FeedController extends ControllerBase
{

  public function indexAction( )
  {
    $this->view->disableLevel(Phalcon\Mvc\View::LEVEL_MAIN_LAYOUT);
  }

  public function seccionAction($slug_seccion,$slug_categoria = false )
  {
  	if($slug_categoria) $slug_seccion = $slug_seccion.'/'.$slug_categoria;
    $this->view->disableLevel(Phalcon\Mvc\View::LEVEL_MAIN_LAYOUT);
    $this->view->setVar("slug", $slug_seccion);
  }

   public function tagAction( $slug)
  {
    $this->view->disableLevel(Phalcon\Mvc\View::LEVEL_MAIN_LAYOUT);
    $this->view->setVar("slug", $slug);
  }
}