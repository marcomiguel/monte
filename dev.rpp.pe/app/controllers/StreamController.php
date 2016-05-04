<?php
class StreamController extends ControllerBase
{
	public function jsonurlsAction()
    {
    	$this->view->disableLevel(Phalcon\Mvc\View::LEVEL_MAIN_LAYOUT);
    }

    public function urlsAction()
    {
    	$this->view->disableLevel(Phalcon\Mvc\View::LEVEL_MAIN_LAYOUT);
    }
}


