<?php
require_once ROOTFULLPATH . '/awsdk/aws-autoloader.php';
use PhpAmqpLib\Connection\AMQPConnection;
use PhpAmqpLib\Message\AMQPMessage;
use Aws\S3\S3Client;
class DatafactoryTask extends \Phalcon\CLI\Task
{


    public function buildAction()
    {

	   $this->mqconf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/mq.ini");
     $connection = new AMQPConnection($this->mqconf->host, $this->mqconf->port,$this->mqconf->user, $this->mqconf->pasw);
     $channel = $connection->channel();
     $channel->queue_declare(SITESLUG.'_df_resultados', false, true, false, false);
     echo ' [*] Servicio listener para el calculo de notas sugeridas ,  CTRL+C para cancelar', "\n";
     try{
         $callback = function($msg) {
         	 $node=json_decode($msg->body);
         	 $this->make($node->torneo);
         };
     }catch (\Exception $e) {
                                            var_dump($e);
     }

     $channel->basic_consume(SITESLUG.'_df_resultados', '', false, true, false, false, $callback);
     while(count($channel->callbacks)) {
         $channel->wait();
     }

    }

	function make($torneo)
	{
     var_dump($torneo);
     $conf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/aws.ini");
     $s3Client = S3Client::factory(array(
        'credentials' => array(
          'key'    => $conf->key,
          'secret' => $conf->secret,
        ),
        'region' => $conf->s3->region,
      ));

     $torneos_nombres = array('peru' => 'Copa Movistar' , 'italia' => 'Serie A' , 'premierleague' => 'Premier League' , 'espana' => 'Liga BBVA' , 'champions' => 'Champions League' ) ;

     $xml = simplexml_load_file("http://eventos.rpp.com.pe/services/datafactory/xml/$torneo/deportes.futbol.$torneo.fixture.xml");
     $fechas=array();
     $partidos = array();
     $fechas_flags = array();
     $cname = (array)$xml->campeonato;
     $cname_alt = (array)$xml->campeonatoNombreAlternativo;

     if(array_key_exists($torneo, $torneos_nombres)) $campeonato['nombre'] = $torneos_nombres[$torneo];
     else $campeonato['nombre']=@$cname[0];

     $campeonato['alternativo']=@$cname_alt[0];


     foreach ($xml->fecha as $item) {
       $attributes = (array)$item->attributes();
       $attributes = $attributes['@attributes'];
       if(!empty($attributes["estado"])) $fechas_flags[str_replace(' ','-',strtolower($attributes["nombrenivel"]))][$attributes["estado"]] = $attributes["fn"];
       foreach ($item->partido as $partido) {

          $pattributes = (array)$partido->attributes();
          $pattributes = $pattributes['@attributes'];

          $fase=str_replace(' ','-',strtolower($attributes["nombrenivel"]));
          $fechas[$fase][$attributes["fn"]][$pattributes["id"]]=$pattributes["id"];

          if($fase=='torneo-apertura-copa-movistar')$campeonato['fase'][$fase]='Apertura';
          elseif ($fase=='torneo-clausura-copa-movistar')$campeonato['fase'][$fase]='Clausura';
          else $campeonato['fase'][$fase] = $attributes["nombrenivel"];

          $partidos[$pattributes["id"]] = array( 'fecha' =>  $pattributes["fecha"] , 'hora' => $pattributes["hora"] , 'time' => strtotime($pattributes["fecha"]." ".$pattributes["hora"]) , 'nombre_fecha' => $attributes["nombre"] ,'lugar' => $pattributes["lugarCiudad"] , 'estadio' => $pattributes["nombreEstadio"] );
          $estado = (array)$partido->estado->attributes();
          $partidos[$pattributes["id"]]["estado"] = $estado['@attributes']['id'];

          $local =  (array)$partido->local;
          $goles =  (array)$partido->goleslocal;
          $partidos[$pattributes["id"]]['local'] = array('id' => $local['@attributes']['id'] , 'nombre' => $local[0] , 'goles' => @$goles[0]);

          $visita = (array)$partido->visitante;
          $goles =  (array)$partido->golesvisitante;
          $partidos[$pattributes["id"]]['visita'] = array('id' => $visita['@attributes']['id'] , 'nombre' => $visita[0] , 'goles' => @$goles[0]);

       }
     }
     /*-------tabla de posiciones ------*/
    $equipos = array();
     $posiciones = array();
     $xml = @simplexml_load_file("http://eventos.rpp.com.pe/services/datafactory/xml/$torneo/deportes.futbol.$torneo.posiciones.xml");
     if(!empty($xml)){
       foreach ($xml->equipo as $equipo) {
        $equipo=(array)$equipo;
        $equipos[$equipo['@attributes']['id']]=array('nombre' => $equipo['nombre'] , 'nombrecorto' => $equipo['@attributes']['nombreCorto'] , 'key' => $equipo['@attributes']['key']);
        $posiciones[] = array('id'=> $equipo['@attributes']['id'], 'nombre' => $equipo['nombre'] , 'nombrecorto' => $equipo['@attributes']['nombreCorto'] , 'puntos' => $equipo['puntos'], 'ganados' => $equipo['ganados'] , 'empatados'=> $equipo['empatados'], 'perdidos' => $equipo['perdidos'], 'golesfavor' => $equipo['golesfavor'] , 'golescontra' => $equipo['golescontra'] ,
                              'difgol' => $equipo['difgol'] , 'posicion' => @$equipo['orden'] );
       }
     }

     /*-------tabla de goleadores ------*/
     $xml = simplexml_load_file("http://eventos.rpp.com.pe/services/datafactory/xml/$torneo/deportes.futbol.$torneo.goleadores.xml");
     $goleadores = array();
     foreach ($xml->persona as $persona) {
       $equipo = (array)$persona->equipo;
       $persona = (array)$persona;
       $goleadores[] = array('equipo' => $equipo['@attributes']['id'], 'equipo_nombre' => $equipo[0] , 'nombre' => $persona['nombre'] , 'nombreCompleto' => $persona['nombreCompleto']  , 'goles' => $persona['goles']);
     }

     $result = $s3Client->putObject(array(
       'Bucket'      => $conf->s3->datafactory,
       'Key'         => $torneo.'/campeonato.json',
       'ACL'         => 'public-read',
       'Body'        => json_encode( $campeonato ),
       'ContentType' => 'application/json',
     ));

     $result = $s3Client->putObject(array(
       'Bucket'      => $conf->s3->datafactory,
       'Key'         => $torneo.'/fechas.json',
       'ACL'         => 'public-read',
       'Body'        => json_encode( $fechas ),
       'ContentType' => 'application/json',
     ));

     $result = $s3Client->putObject(array(
       'Bucket'      => $conf->s3->datafactory,
       'Key'         => $torneo.'/fechas_flags.json',
       'ACL'         => 'public-read',
       'Body'        => json_encode( $fechas_flags ),
       'ContentType' => 'application/json',
     ));

     $result = $s3Client->putObject(array(
       'Bucket'      => $conf->s3->datafactory,
       'Key'         => $torneo.'/equipos.json',
       'ACL'         => 'public-read',
       'Body'        => json_encode( $equipos ),
       'ContentType' => 'application/json',
     ));

     $result = $s3Client->putObject(array(
       'Bucket'      => $conf->s3->datafactory,
       'Key'         => $torneo.'/posiciones.json',
       'ACL'         => 'public-read',
       'Body'        => json_encode( $posiciones ),
       'ContentType' => 'application/json',
     ));

     $result = $s3Client->putObject(array(
       'Bucket'      => $conf->s3->datafactory,
       'Key'         => $torneo.'/goleadores.json',
       'ACL'         => 'public-read',
       'Body'        => json_encode( $goleadores ),
       'ContentType' => 'application/json',
     ));

     foreach ($partidos as $id => $partido) {
        $result = $s3Client->putObject(array(
          'Bucket'      => $conf->s3->datafactory,
          'Key'         => $torneo.'/partidos/'.$id.'.json',
          'ACL'         => 'public-read',
          'Body'        => json_encode( $partido ),
          'ContentType' => 'application/json',
        ));
        var_dump($torneo.'/partidos/'.$id.'.json');
     }

  }

}
