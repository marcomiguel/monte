<?php
header('Content-type: text/xml');
class MsnfeedController extends ControllerBase {
	public function indexAction() {
		$this->view->disableLevel(Phalcon\Mvc\View::LEVEL_MAIN_LAYOUT);
	}

}