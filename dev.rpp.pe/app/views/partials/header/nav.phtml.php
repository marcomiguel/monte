<section class="header-logo-nav">
<div class="wrapper">
<figure class="logo"><a href="/"><img src="<?php echo $host; ?>/svg/logo-la10.svg" alt="Logo La10"></a></figure>
<nav class="nav-header">
<ul>
  <li <?php if( @$this->model->slug == 'futbol-peruano' ):?>class="active"<?php endif;?>><a href="/futbol-peruano<?php echo \Rpp\Services\Get\UrlTrack::add_params(); ?>">Fútbol Peruano</a></li>
  <li <?php if( @$this->model->slug == 'futbol-internacional' ):?>class="active"<?php endif;?>><a href="/futbol-internacional<?php echo \Rpp\Services\Get\UrlTrack::add_params(); ?>">Fútbol Internacional</a></li>
  <li <?php if( @$this->model->slug == 'futbol-peruano/seleccion' ):?>class="active"<?php endif;?>><a href="/futbol-peruano/seleccion<?php echo \Rpp\Services\Get\UrlTrack::add_params(); ?>">Selección</a></li>
  <li <?php if( @$this->model->slug == 'full-contacto' ):?>class="active"<?php endif;?>><a href="/full-contacto<?php echo \Rpp\Services\Get\UrlTrack::add_params(); ?>">Full Contacto</a></li>
  <li <?php if( @$this->model->slug == 'mas-deportes' ):?>class="active"<?php endif;?>><a href="/mas-deportes<?php echo \Rpp\Services\Get\UrlTrack::add_params(); ?>">+ Deportes</a></li>
</ul>
<ul class="nav-fix">
  <li id="open-nav-movil"><i class="icon icon-navicon"></i></li>
</ul>
  </nav>
</div>
</section>
