<?php
namespace Rpp\Services\Get;
class Candidatos
{

  public static $listado;

  public static function listado()
  {
    static::$listado['alejandro-toledo']=array('nombre'=>'Alejandro Toledo','nombre_corto'=>'Toledo' ,'slug'=>'alejandro-toledo','partido'=>'PERÚ POSIBLE' ,'url'=>'/elecciones-peru-2016/alejandro-toledo.html','lema'=>'Toledo 2016, para volver a crecer','tag'=>'alejandro-toledo');
    static::$listado['pedro-pablo-kuczynski']=array('nombre'=>'Pedro Pablo Kuczynski','nombre_corto'=>'Kuczynski' , 'slug'=> 'pedro-pablo-kuczynski' , 'partido'=>'PERUANOS POR EL KAMBIO' ,'url'=>'/elecciones-peru-2016/pedro-pablo-kuczynski.html', 'lema'=>'Los peruanos primero','tag'=>'ppk');
    static::$listado['antero-florez-araoz']=array('nombre'=>'Ántero Florez Araoz','nombre_corto'=>'F.Araoz' , 'slug'=> 'antero-florez-araoz' , 'partido'=>'PARTIDO POLÍTICO ÓRDEN' ,'url'=>'/elecciones-peru-2016/antero-florez-araoz.html', 'lema'=>'Tiene la fuerza para hacerlo','tag'=>'antero-florez-araoz');
    static::$listado['alan-garcia']=array('nombre'=>'Alan García','nombre_corto'=>'García' , 'slug'=> 'alan-garcia' , 'partido'=> 'ALIANZA POPULAR','url'=>'/elecciones-peru-2016/alan-garcia.html', 'lema'=>'Los peruanos primero', 'tag'=>'alan-garcia');
    static::$listado['fernando-olivera']=array('nombre'=>'Fernando Olivera','nombre_corto'=>'Olivera' , 'slug'=> 'alfredo-barnechea' , 'partido'=> 'PROGRESO Y OBRAS','url'=>'/elecciones-peru-2016/fernando-olivera.html', 'lema'=>'Tu indignación es nuestra esperanza','tag'=>'fernando-olivera');
    static::$listado['veronika-mendoza']=array('nombre'=>'Verónica Mendoza','nombre_corto'=>'Mendoza' ,'slug'=>'veronika-mendoza','partido'=>'FRENTE AMPLIO' ,'url'=>'/elecciones-peru-2016/veronika-mendoza.htm','lema'=>'Hagamos florecer juntos un nuevo Perú','tag'=>'veronika-mendoza');
    static::$listado['alfredo-barnechea']=array('nombre'=>'Alfredo Barnechea','nombre_corto'=>'A.Barnechea' , 'slug'=> 'alfredo-barnechea' , 'partido'=>'ACCIÓN POPULAR' ,'url'=>'/elecciones-peru-2016/alfredo-barnechea.html', 'lema'=>'¡Adelante y ahora!
', 'tag'=>'alfredo-barnechea');
    static::$listado['gregorio-santos']=array('nombre'=>'Gregorio Santos','nombre_corto'=>'G. Santos' ,'slug'=>'gregorio-santos','partido'=>'DEMOCRACIA DIRECTA' ,'url'=>'/elecciones-peru-2016/gregorio-santos.html','lema'=>'#VotoRebelde
','tag'=>'gregorio-santos');
    static::$listado['keiko-fujimori']=array('nombre'=>'Keiko Fujimori','nombre_corto'=>'Fujimori' ,'slug'=>'keiko-fujimori','partido'=>'FUERZA POPULAR' ,'url'=>'/elecciones-peru-2016/keiko-fujimori.html','lema'=>'¡Nuestra campaña la hacemos juntos! En costa, sierra y selva','tag'=>'keiko-fujimori');
    static::$listado['miguel-hilario']=array('nombre'=>'Miguel Hilario','nombre_corto'=>'M.Hilario' ,'slug'=>'miguel-hilario','partido'=>'PROGRESANDO PERÚ' ,'url'=>'/elecciones-peru-2016/miguel-hilario.html','lema'=>'¡Juntos por un sueño, Juntos podemos lograrlo!','tag'=>'miguel-hilario');
  
    //static::$listado['francisco-diez-canseco']=array('nombre'=>'Francisco Diez Canseco','nombre_corto'=>'F. Diez Canseco' ,'slug'=>'francisco-diez-canseco','partido'=>'PERÚ NACIÓN' ,'url'=>'/elecciones-peru-2016/francisco-diez-canseco.html','lema'=>'Defendemos principios, no intereses','tag'=>'francisco-diez-canseco');
    return static::$listado;
  }

  public static function candidato($slug)
  {
    static::listado();
    return @static::$listado[$slug];
  }
}