<?php

use Phalcon\Mvc\Controller;
use Rpp\Repositorio\Builder\SearchPatternBuilder;

class PodcastController extends ControllerBase {

    public function idAction($pcid) {
        $this->view->disableLevel(Phalcon\Mvc\View::LEVEL_MAIN_LAYOUT);
        $this->view->disable();
        $podcast = new \Rpp\Pages\Podcast($pcid);
        $this->response->setContentType('application/json;charset=utf-8');
        $this->response->setJsonContent($podcast);
        $this->response->send();
    }

}
