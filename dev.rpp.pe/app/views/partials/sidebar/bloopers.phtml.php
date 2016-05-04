  <section class="flow-news module module-green">          
    <h3>BLOOPERS</h3>
    <div class="box">
      <ul>
      <?php foreach (\Rpp\Services\Get\Flow::tag('bloopers',5) as $position => $item) : ?>
        <li>
          <article>
            <figure class="media"><a href="<?php echo \Rpp\Services\Get\Content::nurl($item->_id); ?><?php echo \Rpp\Services\Get\UrlTrack::add_params($position + 1); ?>"><img src="<?php echo \Rpp\Services\Get\Content::node($item->_id)->imagen_portada['url']; ?>" alt="<?php echo \Rpp\Services\Get\Content::node($item->_id)->imagen_portada['alt']; ?>" width="86" height="70"></a></figure>
            <h2><a href="<?php echo \Rpp\Services\Get\Content::nurl($item->_id); ?><?php echo \Rpp\Services\Get\UrlTrack::add_params($position + 1); ?>"><?php echo \Rpp\Services\Get\Content::node($item->_id)->titulo; ?></a></h2>
          </article>
        </li>
      <?php endforeach;?>
      </ul>
    </div>
  </section>



          

          