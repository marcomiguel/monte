<?php  if( count(\Rpp\Services\Get\Recomendados::load($_COOKIE[SITESLUG.'_cnu']))>0 ) :?>
<?php $position = 0;?>
<section class="flow-news module module-red">
   <h3>+ RECOMENDADOS</h3>
    <div class="box">
      <ul>        
        <?php foreach (\Rpp\Services\Get\Recomendados::load($_COOKIE[SITESLUG.'_cnu']) as $nid) : ?>
        <?php $position++;?>
         <li>
            <article>
              <figure class="media"><a href="<?php echo \Rpp\Services\Get\Content::nurl($nid); ?><?php echo \Rpp\Services\Get\UrlTrack::add_params($position + 1); ?>"><img src="<?php echo \Rpp\Services\Get\Content::node($nid)->imagen_portada['url']; ?>" height="86" width="70"  alt="<?php echo \Rpp\Services\Get\Content::node($nid)->imagen_portada['alt']; ?>"></a></figure>
              <h2><a href="<?php echo \Rpp\Services\Get\Content::nurl($nid); ?><?php echo \Rpp\Services\Get\UrlTrack::add_params($position + 1); ?>"><?php echo \Rpp\Services\Get\Content::node($nid)->titulo; ?></a></h2>
            </article>
          </li>
        <?php endforeach;?>
      </ul>
    </div>
</section>
<?php endif ;?>