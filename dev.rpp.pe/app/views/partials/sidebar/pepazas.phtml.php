<section class="goals module module-blue">
<h3>PEPAZAS</h3>
<div class="box">
<ul class="title-top">
  <?php foreach (\Rpp\Services\Get\Flow::tag('pepazas',5) as $position => $item) : ?>
   <li>
    <article>
     <figure class="media"><a href="<?php echo \Rpp\Services\Get\Content::nurl($item->_id); ?><?php echo \Rpp\Services\Get\UrlTrack::add_params($position + 1); ?>"><img src="<?php echo \Rpp\Services\Get\Content::node($item->_id)->imagen_portada['url']; ?>" alt="<?php echo \Rpp\Services\Get\Content::node($item->_id)->imagen_portada['alt']; ?>"></a></figure>
     <h2><span><a href="<?php echo \Rpp\Services\Get\Content::nurl($item->_id); ?><?php echo \Rpp\Services\Get\UrlTrack::add_params($position + 1); ?>"><?php echo \Rpp\Services\Get\Content::node($item->_id)->titulo; ?></a></span></h2>
    </article>
   </li>
<?php endforeach;?>
</ul>
</div>
</section>