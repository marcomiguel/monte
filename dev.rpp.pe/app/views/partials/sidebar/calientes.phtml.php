<section class="flow-news module module-red">
   <h3>+ CALIENTES</h3>
    <div class="box">
      <ul>        
        <?php foreach (\Rpp\Services\Get\Visitas::ranking($slug,5) as $position => $item) : ?>
         <li>
            <article>
              <figure class="media"><a href="<?php echo \Rpp\Services\Get\Content::nurl($item['nid']); ?><?php echo \Rpp\Services\Get\UrlTrack::add_params($position + 1); ?>"><img src="<?php echo \Rpp\Services\Get\Content::node($item['nid'])->imagen_portada['url']; ?>" height="86" width="70"  alt="<?php echo \Rpp\Services\Get\Content::node($item['nid'])->imagen_portada['alt']; ?>"></a></figure>
              <h2><a href="<?php echo \Rpp\Services\Get\Content::nurl($item['nid']); ?><?php echo \Rpp\Services\Get\UrlTrack::add_params($position + 1); ?>"><?php echo \Rpp\Services\Get\Content::node($item['nid'])->titulo; ?></a></h2>
            </article>
          </li>
        <?php endforeach;?>
      </ul>
    </div>
</section>