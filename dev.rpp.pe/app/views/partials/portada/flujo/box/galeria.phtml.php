<div class="col-1-2">
  <article class="box box-gallery">
    <div class="box-inner">
      <header>
        <div class="tag-time">
          <h3 class="tag"><span><i class="icon icon-photo"></i><a href=""> <?php echo \Rpp\Services\Get\Content::node($nid)->categoria['nombre']; ?> </a></span></h3>
          <time datetime="<?php echo date('Y-m-d H:i', \Rpp\Services\Get\Content::node($nid)->fecha_publicacion); ?>"><?php echo date('d/m/y H:i', \Rpp\Services\Get\Content::node($nid)->fecha_publicacion); ?></time>
        </div>
        <h1><a href="<?php echo \Rpp\Services\Get\Content::nurl($nid); ?><?php echo \Rpp\Services\Get\UrlTrack::add_params($position); ?>"><?php echo \Rpp\Services\Get\Content::node($nid)->titulo_corto; ?></a></h1>
        <p><?php echo \Rpp\Services\Get\Content::node($nid)->bajada; ?></p>
      </header>
    </div>
    <figure class="media"><a href="<?php echo \Rpp\Services\Get\Content::nurl($nid); ?><?php echo \Rpp\Services\Get\UrlTrack::add_params($position); ?>"><img src="<?php echo \Rpp\Services\Get\Content::node($nid)->imagen_portada['url']; ?>" alt="<?php echo \Rpp\Services\Get\Content::node($nid)->imagen_portada['alt']; ?>"></a></figure>
    <section class="thumbs-gallery">
 <?php if (isset(\Rpp\Services\Get\Content::node($nid)->imagen_portada['galeria'][0])) : ?>
      <figure class="media left-img"><a href="<?php echo \Rpp\Services\Get\Content::nurl($nid); ?><?php echo \Rpp\Services\Get\UrlTrack::add_params($position); ?>"><img src="<?php echo \Rpp\Services\Get\Content::node($nid)->imagen_portada['galeria'][0]['url']; ?>" alt="<?php echo \Rpp\Services\Get\Content::node($nid)->imagen_portada['galeria'][0]['alt']; ?>"></a></figure> 
<?php endif;?>
 <?php if (isset(\Rpp\Services\Get\Content::node($nid)->imagen_portada['galeria'][1])) : ?>
      <figure class="media right-img"><a href="<?php echo \Rpp\Services\Get\Content::nurl($nid); ?><?php echo \Rpp\Services\Get\UrlTrack::add_params($position); ?>"><img src="<?php echo \Rpp\Services\Get\Content::node($nid)->imagen_portada['galeria'][1]['url']; ?>" alt="<?php echo \Rpp\Services\Get\Content::node($nid)->imagen_portada['galeria'][1]['alt']; ?>"></a></figure> 
<?php endif;?>
    </section>
  </article>
</div> 