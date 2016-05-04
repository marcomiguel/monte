<?php
use Rpp\Repositorio\Builder\SearchPatternBuilder;
class NotapreviewController extends ControllerBase
{

    public function indexAction()
    {
       /*$this->view->disable();
       $notaload=new Local\Models\Notaload();
       $notaload=json_encode($notaload);
       $notaload = json_decode($notaload,true);
       $notaload = (object)$notaload;

       $di = new Phalcon\DI();
       $di->setShared('notapreview',$notaload );
       $di->set('viewCache',$this->viewCache);
       $this->view->setDI($di);
       $this->view->setVar("nid", 801073);

         $nota = new \Rpp\Pages\Preview\Nota();
          $nota->titulo = ' La 10.pe';
          $nota->package = 'notapreview';
          $di->set('model',$nota);

       echo $this->view->getRender('nota','detalle');*/

    }
     
    public function loadAction()
    {
         $node = $this->request->getPost("node");
         try{
          $node = json_decode($node,true);
          $node = (object)$node;    
          $node->fecha_publicacion = time();
          
          $nota = new \Rpp\Pages\Preview\Nota();
          $nota->titulo = $node->titulo.' | La 10.pe';
          $nota->package = 'notapreview';
          $nota->tipo = $node->tipo;
          $nota->keywords = array();
          $nota->keywords_slug = array();
          if(is_array($node->tags)){
            foreach($node->tags as $key => $value)
            {
             $nota->keywords[] = $value['nombre'];
             $nota->keywords_slug[] = $value['slug'];
            }
          }
          $nota->tags=$node->tags;
          $nota->keywords = implode(",", $nota->keywords );
          $nota->nid = 0;
          $di = new Phalcon\DI();
          $di->set('notapreview', $node);
          $di->set('model',$nota);
          $di->set('viewCache',$this->viewCache);
          $this->view->setDI($di);
          $this->view->setVar("nid", 801073);
          echo $response_render = $this->view->getRender('nota','detalle');
          //echo json_encode(array('status'=>'ok','data'=>$response_render));
         }catch(Exception $e)
         {
            echo $e->getMessage();
         }
      
    }
    
    public function urlAction()
    {
        $nid = $this->request->getPost("nid");
        try{
          $this->view->disable();
          $url = false;
          $SearchPatternBuilder = new SearchPatternBuilder(new \Rpp\Repositorio\Builder\Search\Pattern\Nota());
          $Pattern              = $SearchPatternBuilder->addFields(array('categoria','slug'))->addFilter(array('_id'=> (int)$nid , 'estado' => array('$in' => array('publicado','despublicado','eliminado','borrador','editado') )) )->build(); 
          $nota            =    @$Pattern->load();
          $categoria       =        $nota->categoria;
          if(is_array($categoria))
          {
             $categoria = explode("/",$categoria['slug']);
             $url=$this->view->host."/".@$categoria[1]."/".@$categoria[2]."/".$nota->slug . "-noticia-" . $nid;
          }
        }catch(Exception $e)
         {
            echo $e->getMessage();
         }
        echo json_encode(array('url'=>$url));
    }
}

