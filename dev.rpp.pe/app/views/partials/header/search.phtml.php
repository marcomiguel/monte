<?php $_cache['header.search'] = $this->di->get('viewCache'); $_cacheKey['header.search'] = $_cache['header.search']->start('header.search', 3600); if ($_cacheKey['header.search'] === null) { ?>
    <section class="header-shields-search">
      <div class="wrapper">
        <h6>TODO SOBRE:</h6>
        <nav class="nav-shields">
          <ul>
            <li>
              <figure><a href="#"><img src="<?php echo $host; ?>/img/escudo-thumb.png<?php echo \Rpp\Services\Get\UrlTrack::add_params(); ?>" alt="Escudo de Equipo N"></a></figure>
            </li>
            <li>
              <figure><a href="#"><img src="<?php echo $host; ?>/img/escudo-thumb.png<?php echo \Rpp\Services\Get\UrlTrack::add_params(); ?>" alt="Escudo de Equipo N"></a></figure>
            </li>
            <li>
              <figure><a href="#"><img src="<?php echo $host; ?>/img/escudo-thumb.png<?php echo \Rpp\Services\Get\UrlTrack::add_params(); ?>" alt="Escudo de Equipo N"></a></figure>
            </li>
            <li>
              <figure><a href="#"><img src="<?php echo $host; ?>/img/escudo-thumb.png<?php echo \Rpp\Services\Get\UrlTrack::add_params(); ?>" alt="Escudo de Equipo N"></a></figure>
            </li>
            <li>
              <figure><a href="#"><img src="<?php echo $host; ?>/img/escudo-thumb.png<?php echo \Rpp\Services\Get\UrlTrack::add_params(); ?>" alt="Escudo de Equipo N"></a></figure>
            </li>
          </ul>
        </nav>
        <section class="search-header">
          <form method="post" action="/buscar">
            <input type="text" value="" name="texto">
            <button type="submit"><i class="icon icon-search"></i></button>
          </form>
        </section>
      </div>
    </section>
<?php $_cache['header.search']->save('header.search', null, 3600); } else { echo $_cacheKey['header.search']; } ?>