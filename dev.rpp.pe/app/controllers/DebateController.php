<?php
class DebateController extends ControllerBase
{
    public function likeAction()
    {
     return false;
     $this->view->disable();
     $id = $this->request->getPost("id");
     $user = $this->request->getPost("user");
     var_dump("elecciones:debate:user:$id:$user",$this->redis->get("elecciones:debate:user:$id:$user"));
     if(!empty($user) && !empty($id) ){
     	     if($this->redis->get("elecciones:debate:user:$id:$user")) return false;
             $this->redis->incr("elecciones:debate:votaciones:$id:like");
             $this->redis->incr("elecciones:debate:user:$id:$user");
     }     
    }
   
    public function dislikeAction()
    {
      return false;
     $this->view->disable();
     $id = $this->request->getPost("id");
     $user = $this->request->getPost("user");
     var_dump("elecciones:debate:user:$id:$user",$this->redis->get("elecciones:debate:user:$id:$user"));
     if(!empty($user) && !empty($id)){
     	     if($this->redis->get("elecciones:debate:user:$id:$user")) return false;
             $this->redis->incr("elecciones:debate:votaciones:$id:dislike");
             $this->redis->incr("elecciones:debate:user:$id:$user");
     }
    }

    public function  perfilAction($slug)
    {
      if(empty(\Rpp\Services\Get\Candidatos::candidato($slug))) $this->dispatcher->forward(array('controller' => 'error', 'action' =>   'show404'));
      $di = new Phalcon\DI();
      $di->set('model',new \Rpp\Pages\Debate($slug) );
      $di->set('viewCache',$this->viewCache);
      $this->view->setDI($di);
    }

    public function resultadosAction()
    {
      $di = new Phalcon\DI();
      $di->set('model',new \Rpp\Pages\Debate('resultados') );
      $di->set('viewCache',$this->viewCache);
      $di->set('redis',$this->redis);
      $this->view->setDI($di);
    }

}