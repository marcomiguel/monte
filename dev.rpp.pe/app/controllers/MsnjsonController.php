<?php
header('Content-type: application/json');
class MsnjsonController extends ControllerBase {
	public function seccionAction($seccion_slug) {
		$this->view->disable();
		$result = array();
		foreach (\Rpp\Services\Get\Flow::seccion($seccion_slug,50,0) as $item) : 
		 $article['abstractText'] = \Rpp\Services\Get\Content::node($item->_id)->bajada;	
		 $article['date'] = array('published' => date('Y-m-d\TH:i:sP' , \Rpp\Services\Get\Content::node($item->_id)->fecha_publicacion ) , 'updated' => date('Y-m-d\TH:i:sP' , \Rpp\Services\Get\Content::node($item->_id)->fecha_publicacion ) );	
		 $article['id']  = $item->_id;
		 $image = $audio=$video=array();
		 $texto_nota = $relacionado = array(); 

		 if(\Rpp\Services\Get\Content::part($item->_id,'tipo')=='galeria'):
          $galeria=$gitem=array();
          foreach (\Rpp\Services\Get\Content::part($item->_id,'galeria') as $v => $key) :
             $gitem[] = array(
             	'title' => @\Rpp\Services\Get\Content::part($item->_id,'contenido')[$key]['alt'] , 
             	'author' => @\Rpp\Services\Get\Content::part($item->_id,'contenido')[$key]['credito'] , 
             	'description' => @\Rpp\Services\Get\Content::part($item->_id,'contenido')[$key]['alt'] , 
             	'id' => 0  , 
             	'url' => \Rpp\Services\Get\UrlMedia::image(\Rpp\Services\Get\Content::part($item->_id,'contenido')[$key]['foto']['hash'], 'medium') ,
             	'thumbnail' => \Rpp\Services\Get\UrlMedia::image(\Rpp\Services\Get\Content::part($item->_id,'contenido')[$key]['foto']['hash'], 'small') ,
             	 ); 
             \Rpp\Services\Get\Content::unset_part($item->_id,'contenido',$key);
          endforeach;
             $galeria[0]['images'] = $gitem;
             $article['slideshows'] = $galeria;
		 endif;


         foreach (\Rpp\Services\Get\Content::part($item->_id,'contenido') as $contenido):
                if ($contenido['tipo'] == 'photo') :
                	$image[]= array('title' => @$contenido['foto']['alt'] , 'autor' => @$contenido['credito'] , 'description' => @$contenido['foto']['alt'] , 'id' => 0 , 'url' => \Rpp\Services\Get\UrlMedia::image($contenido['foto']['hash'], 'medium') , 'thumbnail' => \Rpp\Services\Get\UrlMedia::image($contenido['foto']['hash'], 'samll'));
                elseif($contenido['tipo'] == 'video'):
                	$video[] = array('title' => @$contenido['video']['alt'] , 'autor' => @$contenido['via'] , 'description' => @$contenido['foto']['alt'] , 'id' => 0 , 'size' => 17791133 , 'duration' => 10 , 'url' => @$contenido['video']['url'] , 'thumbnail' => @$contenido['video']['url_cover']);
                elseif($contenido['tipo'] == 'audio'):
                	$audio[] = array('title' => @$contenido['audio']['alt'] , 'autor' => @$contenido['via'] , 'description' => @$contenido['audio']['alt'] , 'id' => 0 , 'size' => 1547822 , 'duration' => 10 , 'url' => @$contenido['audio']['url'] , 'thumbnail' => @$contenido['audio']['url_cover']);
                elseif($contenido['tipo'] == 'text'):
                	 $texto_nota[] = strip_tags($contenido['texto']);
                	 if(count(@$contenido['relacionado']['items'])>0):
                	 	foreach($contenido['relacionado']['items'] as $value):
                          $relacionado[]=array('rel' => 'related' , 'href' => \Rpp\Services\Get\Content::nurl($value['nid']) , 'mediaType' => 'text/html', 'thumbnail' => \Rpp\Services\Get\UrlMedia::image(\Rpp\Services\Get\Content::node($value['nid'])->imagen_portada['hash'], 'samll') , 'title' =>\Rpp\Services\Get\Content::node($value['nid'])->imagen_portada['alt'] , 'author'=>'RPP' , 'description' =>\Rpp\Services\Get\Content::node($value['nid'])->bajada );
                	 	endforeach;
                	 endif;
                endif;
         endforeach;
         $keywords = array();
         foreach (\Rpp\Services\Get\Content::part($item->_id,'keywords') as $value):
           $keywords[] = $value['nombre'];
         endforeach;
         $article['images'] = $image;
         $article['videos'] = $video;
         $article['audio'] = $audio;
         $article['title'] = \Rpp\Services\Get\Content::node($item->_id)->titulo;
         $article['subtitle'] = \Rpp\Services\Get\Content::node($item->_id)->titulo_corto;
         $article['body'] = implode(' ', $texto_nota);
         $article['keywords'] = $keywords;
         $article['relatedLinks'] = $relacionado;
         $result[]=$article;
		endforeach;
         
		echo json_encode(array('items' => $result));
	}

}