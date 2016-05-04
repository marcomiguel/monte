<?php
namespace Local\Models;
class Notaload extends \Phalcon\Mvc\Collection
{
    public  $site_tag ;
    public  $nid;
    public  $tipo;
    public  $date_publish;
    public  $fecha_publicacion;
    public  $categoria;
    public  $volada;
    public  $bajada;
    public  $titulo;
    public  $contenido;
    public  $permalink;
    public  $slug;
    public  $autor;
    public  $fuente;
    public  $stats;
    public  $publicidad;
    public  $config;
    public  $categoria_tag;
    public  $tags;
    public  $portada_thumb;

    public function initialize()
    {
      $this->bajada='&quot;Volvemos a la realidad de T&iacute;a Mar&iacute;a&quot;, recalc&oacute; Jos&eacute; Chema Salcedo, luego de superar el inpasse con Chile en el caso de espionaje.';
      $this->titulo='Panorama del día';
      $this->fecha_publicacion=1430334960;
      $contenido=array();
      $contenido['tipo']='text';
      $contenido['texto']='<p style="text-align: justify;">"Superado el incidente diplom&aacute;tico con Chile, volvemos a la realidad de T&iacute;a Mar&iacute;a", dijo Chema Salcedo, periodista de RPP Noticias en la secuencia "Panorama del d&iacute;a".</p> <p style="text-align: justify;">"Una cosa es aplaudirlo por sus buenos modales, y otra cosa es entregarle al presidente Humala un pu&ntilde;ado de facultades extraordinarias para manejar la econom&iacute;a, la seguridad y otras cosas m&aacute;s que apremian a la poblaci&oacute;n peruana", enfatiz&oacute; Salcedo.</p>';
      $contenido['foto']['attr']['align']='center';
      $contenido['foto']['alt']='la10';
      $contenido['foto']['url']='http://img.rpp.com.pe/pict.php?g=-1&c=n&p=/images/picnewsa/1485120.jpg';
      $contenido['foto']['descripcion']='';
      $object = json_decode(json_encode($contenido), FALSE);
      $this->contenido= array( $object  );
      $this->portada_thumb = (object) array('url' => 'http://img.rpp.com.pe/pict.php?g=1&c=n&p=/images/picnewsa/1485120.jpg' , 'alt' => 'Panorama del d&iacute;a');
      $tags=array();
      $tags[]=(object)array(  'slug' => 'panoramadeldia',
                      'nombre' => 'panorama del dia');

      $tags[]=(object)array(  'slug' => 'rotativa2',
                      'nombre' => 'rotativa 2');

      $tags[]=(object)array(  'slug' => 'josechemasalcedo',
                      'nombre' => 'jose chema salcedo');

      $this->tags = $tags;
      $this->categoria= (object)array('slug'=> 'rpp/actualidad/lima' ,'nombre'=> 'RPP/Actualidad/Lima' );
    }

}