<?php
namespace Rpp\Repositorio\Builder;
use Rpp\Repositorio\Builder\Search\Pattern;

class SearchPatternBuilder{
    private $pattern;

    public function __construct( Pattern $pattern)
    {
      $this->pattern = $pattern;
    }

    public function addFilter($filter)
    {
      $this->pattern->set_filter($filter);
      return $this;
    }

    public function addSort($sort)
    {
      $this->pattern->set_sort($sort);
      return $this;
    }

    public function addLimit($limit)
    {
      $this->pattern->set_limit($limit);
      return $this;
    }

    public function addFields($fields)
    {
       $this->pattern->set_fields($fields);
       return $this;
    }

    public function addSlug($slug)
    {
       $this->pattern->set_slug($slug);
       return $this;
    }

    public function build()
    {
       return $this->pattern;
    }

    public function reset(Pattern $pattern)
    {
       $this->pattern = $pattern;
    }
}