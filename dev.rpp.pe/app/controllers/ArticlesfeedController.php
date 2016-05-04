<?php
header('Content-type: text/xml');
class ArticlesfeedController extends ControllerBase {
	public function indexAction() {
		$this->view->disableLevel(Phalcon\Mvc\View::LEVEL_MAIN_LAYOUT);
	}

}