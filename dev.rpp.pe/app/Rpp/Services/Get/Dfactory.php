<?php
namespace Rpp\Services\Get;
class Dfactory
{
    public static $conf;

    public static function torneo($slug)
    {
      $conf = false;
      $torneo['la10/futbol-peruano/descentralizado']='peru';
      $torneo['la10/futbol-internacional/liga-bbva'] = 'espana';
      $torneo['la10/futbol-internacional/premier-league'] = 'premierleague';
      $torneo['la10/futbol-internacional/bundesliga'] = 'alemania';

       if (array_key_exists($slug, $torneo)) {
          $conf = $torneo[$slug];    
      }

      return $conf;
    }


}
