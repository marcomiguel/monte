<?php

class RelacionadaController extends ControllerBase
{
     
  public function permalinkAction($nid)
  {
    if(empty(\Rpp\Services\Get\Content::part($nid,'_id')))
    {
       $this->dispatcher->forward(array('controller' => 'error', 'action' =>   'show404'));
    }
    $query_url = explode("?", $_SERVER["REQUEST_URI"]);
    if(isset($query_url[1])) $query_url = "?".$query_url[1];
    else $query_url = null;
    header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
    header('Expires: Sat, 26 Jul 1997 05:00:00 GMT');
    header("Location: ".$this->view->host.\Rpp\Services\Get\Content::nurl($nid).$query_url,TRUE,301);
    //return $this->response->redirect($this->view->host.\Rpp\Services\Get\Content::nurl($nid).$query_url , false , 301);
  }
    
}

