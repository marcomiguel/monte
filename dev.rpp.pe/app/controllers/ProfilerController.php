<?php
error_reporting(-1);
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
require_once ROOTFULLPATH . '/awsdk/aws-autoloader.php';
use Local\Models\Notaload;
use Rpp\Repositorio\Builder\SearchPatternBuilder;
use Rpp\Repositorio\Builder\Search\Pattern\Nota;
use Rpp\Repositorio\Builder\Search\Pattern\Home;
use Rpp\Repositorio\Builder\Search\Pattern\Seccion;
use Rpp\Repositorio\Builder\Search\Pattern\Tag;
use Rpp\Services\Publish\LoadCustom;
use Rpp\Analytics\MasVisitadas;
use Rpp\Services\Get\Content;
use \Shared\Cache;
use \Shared\Cache2;
use Rpp\Destacados\Portada;
use Aws\S3\S3Client;
class ProfilerController extends ControllerBase
{

  public function loadAction($nid)
  {
     /*$Pattern = new SearchPatternBuilder(new \Rpp\Repositorio\Builder\Search\Pattern\Nota());
     $repo = $Pattern->addFilter( array('_id'=> (int)$nid) )->build();
     var_dump($repo->load());*/
    $noticia = $this->mongo->noticia;
    $nota =  $noticia->findOne(array('_id' => (int)$nid , 'sitio' => SITESLUG ));
    var_dump($nota);

  }

  public function sizeAction($nid)
  {
    var_dump(strlen(\Rpp\Services\Get\Content::part($nid,'imagen_tag')));
  }

  public function tryAction($slug='home')
  {
    var_dump(@\Rpp\Services\Get\Destacados::portada('politica')->destacadas);
  }
  public function taginfoAction($slug)
  {
    var_dump(Rpp\Services\Get\Tags::get_tag($slug));
  }

  public function autorAction()
  {
    var_dump(\Rpp\Services\Get\Flow::home(10));
  }


  public function tagAction()
  {
    var_dump(\Rpp\Services\Get\Flow::tag('caso-oropeza'));
  }

    public function homeAction()
  {
    //var_dump(\Rpp\Services\Get\Flow::home(50));
    foreach (\Rpp\Services\Get\Flow::home(50) as $key => $value) {
      var_dump($value,\Rpp\Services\Get\Content::node($value->_id));
    }
  }

  public function infoAction()
  {
    echo phpinfo();
  }

  public function brandcontentAction()
  {
    var_dump(\Rpp\Services\Get\Flow::brandcontent());
  }

  public function mongoAction()
  {
    //$mongo = new MongoClient('mongodb://prod_rpp_admin:seinie$jahPoh1@ip-50-0-1-19:27017/gruporpp?w=0');
    //var_dump($mongo);
    var_dump($this->mongo);
  }

  public function deletecviewAction()
  {
    //var_dump($this->viewCache);
    //$this->viewCache->save("test-portada","205895");
    var_dump( $this->viewCache->get("nota.article.body.900361") );

     /*$memcache = new \Memcached();
     $memcache->setOption(\Memcached::OPT_CLIENT_MODE, \Memcached::DYNAMIC_CLIENT_MODE);
     $memcache->setOption(\Memcached::OPT_COMPRESSION, true);
     $memcache->addServers(array(
                                array('host' => 'devrppclustermc.qvwpxl.cfg.usw2.cache.amazonaws.com',
                                      'port' => 11211,
                                      'weight' => 1)
                                     )
                         );
     var_dump($memcache);*/
   
  }


    public function resumeAction()
  {
    $home=\Rpp\Services\Get\Flow::home(2);
    var_dump('home',$home);
  }

  public function cacheAction()
  {
    $data = Cache2::request()->get(Cache2::get_conf()->cache_prefix->home.'---------');
    var_dump(Cache2::request()->exists(Cache2::get_conf()->cache_prefix->home.'---------'));
  }


  public function reloadAction()
  {
    $tag_info = \Rpp\Services\Get\Tags::get_tag('star-wars');
     var_dump($tag_info);
  }

  public function userAction()
  {
  var_dump("hshshssh");
    //var_dump( \Rpp\Services\Get\User::get('cosorio'));
  }

  public function contenidoAction($nid)
  {
    $home=\Rpp\Services\Get\Flow::home();

    var_dump(json_decode(json_encode($home)));
    var_dump(\Rpp\Services\Get\Content::part($nid,'contenido'));
  }

  public function eleccionesAction()
  {
    var_dump(\Rpp\Services\Get\Elecciones::get(date('Ym')));
  }


  public function candidatoAction()
  {
    var_dump(Rpp\Services\Get\Candidatos::candidato(10));
  }

  public function vivoAction()
  {
    $pro1="RPP Informando %8% con Carlos Montalvo";
$pro2="DESPIERTA PERÚ %8% con Yamil Abusabal";
$pro3="ROTATIVA DEL AIRE PRIMERA EDICIÓN %8% con Fernando Carvallo y Ricardo Gómez";
$pro4="AMPLIACIÓN DE NOTICIAS %8% con Raúl Vargas, Patricia Del Río y Ricardo Gómez";
$pro5="SIEMPRE EN CASA %8% con Sara Abu-Sabbah";
$pro6="ROTATIVA DEL AIRE %8% con José María Salcedo";
$pro7="LOS CHISTOSOS %8% con Guillermo Rossini, Hernán Vidaurre, Giovanna Castro y Manolo Rojas";
$pro8="ERA TABÚ %8% con Fernando Maestre & especialistas";
$pro9="ROTATIVA DEL AIRE %8% con Mariella Balbi";
$pro10="EL SHOW DEL DEPORTE %8% con Óscar Moral, Dante Mateo y Juan Carlos Hurtado";
$pro11="DE FRENTE Y SIN MÁSCARAS %8% con Carmen Gonzáles";
$pro12="ROTATIVA DEL AIRE %8% con José María Salcedo";
$pro13="SIEMPRE EN CASA [Repetición] %8% con Sara Abu-Sabbah";
$pro14="ERA TABÚ [Repetición] %8% con Fernando Maestre & especialistas";
$pro15="LOS CHISTOSOS [Repetición] %8% con Guillermo Rossini, Hernán Vidaurre, Giovanna Castro y Manolo Rojas";
$pro16="DESPIERTA PERÚ %8% con Carlos Montalvo";
$pro17="ROTATIVA DEL AIRE PRIMERA EDICIÓN %8% con Armando Canchanya";
$pro18="AMPLIACIÓN DE NOTICIAS %8% con Raúl Vargas y Armando Canchanya";
$pro19="ENFOQUE DE LOS SÁBADOS %8% con Raúl Vargas";
$pro20="DIÁLOGO DE FE %8% con Cardenal Juan Luis Cipriani y Armando Canchanya";
$pro21="LA DIVINA COMIDA %8% con Cucho La Rosa";
$pro22="CUIDANDO TU SALUD %8% con Elmer Huerta";
$pro23="VENTANA ECÓNOMICA %8% con Guido Sánchez Yabar";
$pro24="EN ESCENA %8% con Johnny Padilla";
$pro25="DEPORTE AL MÁXIMO %8% con invitados especiales";
$pro26="LA ROTATIVA DEL AIRE %8% con Eduardo Lindo";
$pro27="MÁS ALLÁ DE LAS CANAS %8% con Miguel Humberto Aguirre";
$pro28="PERUANOS EN EL EXTERIOR %8% con Eduardo Lindo";
$pro29="ENFOQUE DE LOS SÁBADOS [Repetición] %8% con Raúl Vargas";
$pro30="EN ESCENA [Repetición] %8% con Johnny Padilla";
$pro31="AMPLIACIÓN DEL DOMINGO %8% con José María Salcedo, Fernando Carvallo y Ricardo Gómez";
$pro32="DOMINGO ES FIESTA %8% con Padre Clemente Sobrado  y Miguel H. Aguirre";
$pro33="TODO DEPORTE %8% con Margarita Rivera";
$pro34="EN ESCENA %8% con Johnny Padilla";
$pro35="LETRAS EN EL TIEMPO %8% con Renato Cisneros";
$pro36="LO MEJOR DE LA SEMANA DE LOS CHISTOSOS %8% ";
$pro37="DEPORTE AL MÁXIMO %8% con Dante Mateo";
$pro38="LA ROTATIVA DEL AIRE %8% con Jesús Verde";
$pro39="LOS ESPECIALES DEL DOMINGO %8% con Fernando Carvallo";
$pro40="LETRAS EN EL TIEMPO [Repetición] %8% con Renato Cisneros";
$pro41="BUSCAPERSONAS %8% con Miguel Humberto Aguirre";
$pro42="DEPORTE AL MÁXIMO %8% con Óscar Moral";
$pro43="LO MEJOR DE EN ESCENA %8% con Johnny Padilla";



######dia 1 ##########
/*$dia[0][1] = $pro1;
$dia[0][2] = $pro1;
$dia[1][1] = $pro1;
$dia[1][2] = $pro1;
$dia[2][1] = $pro1;
$dia[2][2] = $pro1;
$dia[3][1] = $pro1;
$dia[3][2] = $pro1;
$dia[4][1] = $pro2;
$dia[4][2] = $pro2;
$dia[5][1] = $pro3;
$dia[5][2] = $pro3;
$dia[6][1] = $pro3;
$dia[6][2] = $pro3;
$dia[7][1] = $pro3;
$dia[7][2] = $pro3;
$dia[8][1] = $pro4;
$dia[8][2] = $pro4;
$dia[9][1] = $pro4;
$dia[9][2] = $pro4;
$dia[10][1] = $pro5;
$dia[10][2] = $pro5;
$dia[11][1] = $pro5;
$dia[11][2] = $pro5;
$dia[12][1] = $pro5;
$dia[12][2] = $pro5;
$dia[13][1] = $pro6;
$dia[13][2] = $pro6;
$dia[14][1] = $pro6;
$dia[14][2] = $pro7;
$dia[15][1] = $pro7;
$dia[15][2] = $pro7;
$dia[16][1] = $pro7;
$dia[16][2] = $pro8;
$dia[17][1] = $pro8;
$dia[17][2] = $pro8;
$dia[18][1] = $pro9;
$dia[18][2] = $pro9;
$dia[19][1] = $pro9;
$dia[19][2] = $pro9;
$dia[20][1] = $pro10;
$dia[20][2] = $pro10;
$dia[21][1] = $pro11;
$dia[21][2] = $pro11;
$dia[22][1] = $pro12;
$dia[22][2] = $pro12;
$dia[23][1] = $pro12;
$dia[23][2] = $pro12;*/

#####dia 2 #######
/*$dia[0][1] = $pro13;
$dia[0][2] = $pro13;
$dia[1][1] = $pro13;
$dia[1][2] = $pro13;
$dia[2][1] = $pro14;
$dia[2][2] = $pro14;
$dia[3][1] = $pro15;
$dia[3][2] = $pro15;
$dia[4][1] = $pro2;
$dia[4][2] = $pro2;
$dia[5][1] = $pro3;
$dia[5][2] = $pro3;
$dia[6][1] = $pro3;
$dia[6][2] = $pro3;
$dia[7][1] = $pro3;
$dia[7][2] = $pro3;
$dia[8][1] = $pro4;
$dia[8][2] = $pro4;
$dia[9][1] = $pro4;
$dia[9][2] = $pro4;
$dia[10][1] = $pro5;
$dia[10][2] = $pro5;
$dia[11][1] = $pro5;
$dia[11][2] = $pro5;
$dia[12][1] = $pro5;
$dia[12][2] = $pro5;
$dia[13][1] = $pro6;
$dia[13][2] = $pro6;
$dia[14][1] = $pro6;
$dia[14][2] = $pro7;
$dia[15][1] = $pro7;
$dia[15][2] = $pro7;
$dia[16][1] = $pro7;
$dia[16][2] = $pro8;
$dia[17][1] = $pro8;
$dia[17][2] = $pro8;
$dia[18][1] = $pro9;
$dia[18][2] = $pro9;
$dia[19][1] = $pro9;
$dia[19][2] = $pro9;
$dia[20][1] = $pro10;
$dia[20][2] = $pro10;
$dia[21][1] = $pro11;
$dia[21][2] = $pro11;
$dia[22][1] = $pro12;
$dia[22][2] = $pro12;
$dia[23][1] = $pro12;
$dia[23][2] = $pro12;*/

######dia 3 #############
/*$dia[0][1] = $pro13;
$dia[0][2] = $pro13;
$dia[1][1] = $pro13;
$dia[1][2] = $pro13;
$dia[2][1] = $pro14;
$dia[2][2] = $pro14;
$dia[3][1] = $pro15;
$dia[3][2] = $pro15;
$dia[4][1] = $pro2;
$dia[4][2] = $pro2;
$dia[5][1] = $pro3;
$dia[5][2] = $pro3;
$dia[6][1] = $pro3;
$dia[6][2] = $pro3;
$dia[7][1] = $pro3;
$dia[7][2] = $pro3;
$dia[8][1] = $pro4;
$dia[8][2] = $pro4;
$dia[9][1] = $pro4;
$dia[9][2] = $pro4;
$dia[10][1] = $pro5;
$dia[10][2] = $pro5;
$dia[11][1] = $pro5;
$dia[11][2] = $pro5;
$dia[12][1] = $pro5;
$dia[12][2] = $pro5;
$dia[13][1] = $pro6;
$dia[13][2] = $pro6;
$dia[14][1] = $pro6;
$dia[14][2] = $pro7;
$dia[15][1] = $pro7;
$dia[15][2] = $pro7;
$dia[16][1] = $pro7;
$dia[16][2] = $pro8;
$dia[17][1] = $pro8;
$dia[17][2] = $pro8;
$dia[18][1] = $pro9;
$dia[18][2] = $pro9;
$dia[19][1] = $pro9;
$dia[19][2] = $pro9;
$dia[20][1] = $pro10;
$dia[20][2] = $pro10;
$dia[21][1] = $pro11;
$dia[21][2] = $pro11;
$dia[22][1] = $pro12;
$dia[22][2] = $pro12;
$dia[23][1] = $pro12;
$dia[23][2] = $pro12;*/
########dia 4#########
/*$dia[0][1] = $pro13;
$dia[0][2] = $pro13;
$dia[1][1] = $pro13;
$dia[1][2] = $pro13;
$dia[2][1] = $pro14;
$dia[2][2] = $pro14;
$dia[3][1] = $pro15;
$dia[3][2] = $pro15;
$dia[4][1] = $pro2;
$dia[4][2] = $pro2;
$dia[5][1] = $pro3;
$dia[5][2] = $pro3;
$dia[6][1] = $pro3;
$dia[6][2] = $pro3;
$dia[7][1] = $pro3;
$dia[7][2] = $pro3;
$dia[8][1] = $pro4;
$dia[8][2] = $pro4;
$dia[9][1] = $pro4;
$dia[9][2] = $pro4;
$dia[10][1] = $pro5;
$dia[10][2] = $pro5;
$dia[11][1] = $pro5;
$dia[11][2] = $pro5;
$dia[12][1] = $pro5;
$dia[12][2] = $pro5;
$dia[13][1] = $pro6;
$dia[13][2] = $pro6;
$dia[14][1] = $pro6;
$dia[14][2] = $pro7;
$dia[15][1] = $pro7;
$dia[15][2] = $pro7;
$dia[16][1] = $pro7;
$dia[16][2] = $pro8;
$dia[17][1] = $pro8;
$dia[17][2] = $pro8;
$dia[18][1] = $pro9;
$dia[18][2] = $pro9;
$dia[19][1] = $pro9;
$dia[19][2] = $pro9;
$dia[20][1] = $pro10;
$dia[20][2] = $pro10;
$dia[21][1] = $pro11;
$dia[21][2] = $pro11;
$dia[22][1] = $pro12;
$dia[22][2] = $pro12;
$dia[23][1] = $pro12;
$dia[23][2] = $pro12;*/

########dia 5######
/*$dia[0][1] = $pro13;
$dia[0][2] = $pro13;
$dia[1][1] = $pro13;
$dia[1][2] = $pro13;
$dia[2][1] = $pro14;
$dia[2][2] = $pro14;
$dia[3][1] = $pro15;
$dia[3][2] = $pro15;
$dia[4][1] = $pro2;
$dia[4][2] = $pro2;
$dia[5][1] = $pro3;
$dia[5][2] = $pro3;
$dia[6][1] = $pro3;
$dia[6][2] = $pro3;
$dia[7][1] = $pro3;
$dia[7][2] = $pro3;
$dia[8][1] = $pro4;
$dia[8][2] = $pro4;
$dia[9][1] = $pro4;
$dia[9][2] = $pro4;
$dia[10][1] = $pro5;
$dia[10][2] = $pro5;
$dia[11][1] = $pro5;
$dia[11][2] = $pro5;
$dia[12][1] = $pro5;
$dia[12][2] = $pro5;
$dia[13][1] = $pro6;
$dia[13][2] = $pro6;
$dia[14][1] = $pro6;
$dia[14][2] = $pro7;
$dia[15][1] = $pro7;
$dia[15][2] = $pro7;
$dia[16][1] = $pro7;
$dia[16][2] = $pro8;
$dia[17][1] = $pro8;
$dia[17][2] = $pro8;
$dia[18][1] = $pro9;
$dia[18][2] = $pro9;
$dia[19][1] = $pro9;
$dia[19][2] = $pro9;
$dia[20][1] = $pro10;
$dia[20][2] = $pro10;
$dia[21][1] = $pro11;
$dia[21][2] = $pro11;
$dia[22][1] = $pro12;
$dia[22][2] = $pro12;
$dia[23][1] = $pro12;
$dia[23][2] = $pro12;*/

#####dia 6 #######
/*$dia[0][1] = $pro13;
$dia[0][2] = $pro13;
$dia[1][1] = $pro13;
$dia[1][2] = $pro13;
$dia[2][1] = $pro14;
$dia[2][2] = $pro14;
$dia[3][1] = $pro15;
$dia[3][2] = $pro15;
$dia[4][1] = $pro16;
$dia[4][2] = $pro16;
$dia[5][1] = $pro17;
$dia[5][2] = $pro17;
$dia[6][1] = $pro17;
$dia[6][2] = $pro17;
$dia[7][1] = $pro17;
$dia[7][2] = $pro17;
$dia[8][1] = $pro18;
$dia[8][2] = $pro18;
$dia[9][1] = $pro19;
$dia[9][2] = $pro19;
$dia[10][1] = $pro20;
$dia[10][2] = $pro21;
$dia[11][1] = $pro21;
$dia[11][2] = $pro22;
$dia[12][1] = $pro22;
$dia[12][2] = $pro22;
$dia[13][1] = $pro23;
$dia[13][2] = $pro23;
$dia[14][1] = $pro24;
$dia[14][2] = $pro24;
$dia[15][1] = $pro24;
$dia[15][2] = $pro24;
$dia[16][1] = $pro25;
$dia[16][2] = $pro25;
$dia[17][1] = $pro25;
$dia[17][2] = $pro25;
$dia[18][1] = $pro26;
$dia[18][2] = $pro26;
$dia[19][1] = $pro27;
$dia[19][2] = $pro27;
$dia[20][1] = $pro28;
$dia[20][2] = $pro28;
$dia[21][1] = $pro29;
$dia[21][2] = $pro29;
$dia[22][1] = $pro30;
$dia[22][2] = $pro30;
$dia[23][1] = $pro30;
$dia[23][2] = $pro30;*/




$dia[0][1] = $pro1;
$dia[0][2] = $pro1;
$dia[1][1] = $pro1;
$dia[1][2] = $pro1;
$dia[2][1] = $pro1;
$dia[2][2] = $pro1;
$dia[3][1] = $pro1;
$dia[3][2] = $pro1;
$dia[4][1] = $pro1;
$dia[4][2] = $pro1;
$dia[5][1] = $pro3;
$dia[5][2] = $pro3;
$dia[6][1] = $pro3;
$dia[6][2] = $pro3;
$dia[7][1] = $pro3;
$dia[7][2] = $pro3;
$dia[8][1] = $pro31;
$dia[8][2] = $pro31;
$dia[9][1] = $pro31;
$dia[9][2] = $pro31;
$dia[10][1] = $pro32;
$dia[10][2] = $pro33;
$dia[11][1] = $pro33;
$dia[11][2] = $pro33;
$dia[12][1] = $pro33;
$dia[12][2] = $pro34;
$dia[13][1] = $pro34;
$dia[13][2] = $pro34;
$dia[14][1] = $pro34;
$dia[14][2] = $pro35;
$dia[15][1] = $pro35;
$dia[15][2] = $pro36;
$dia[16][1] = $pro36;
$dia[16][2] = $pro36;
$dia[17][1] = $pro37;
$dia[17][2] = $pro37;
$dia[18][1] = $pro38;
$dia[18][2] = $pro38;
$dia[19][1] = $pro38;
$dia[19][2] = $pro38;
$dia[20][1] = $pro40;
$dia[20][2] = $pro40;
$dia[21][1] = $pro41;
$dia[21][2] = $pro41;
$dia[22][1] = $pro42;
$dia[22][2] = $pro42;
$dia[23][1] = $pro43;
$dia[23][2] = $pro43;

echo json_encode($dia);die();
  }

}
