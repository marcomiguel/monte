<?php
namespace Rpp\Services\Buscador;
class SolrApi
{

	public static function find($url)
	{
      return file_get_contents($url);
	}
}
