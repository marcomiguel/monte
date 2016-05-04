<?php if(count($this->model->sugeridas)>0):?>
    <section class="related-news-full module module-blue">          
    <h3>Noticias sugeridas</h3>
    <ul class="title-top">
    <?php $i=0; foreach ($this->model->sugeridas as $nid) : ?>
                 <?php $i++ ;?>
                      <li>
                        <div class="box">
                          <figure class="media"><a href="<?php echo \Rpp\Services\Get\Content::nurl($nid); ?><?php echo \Rpp\Services\Get\UrlTrack::add_params($i); ?>"><img src="<?php echo \Rpp\Services\Get\Content::node($nid)->imagen_portada['url']; ?>" alt="<?php echo \Rpp\Services\Get\Content::node($nid)->imagen_portada['alt']; ?>" width="259" height="146"></a></figure>
                          <h3 class="tag-title"><?php echo \Rpp\Services\Get\Content::node($nid)->categoria['nombre']; ?></h3>
                          <h2><span><a href="<?php echo \Rpp\Services\Get\Content::nurl($nid); ?><?php echo \Rpp\Services\Get\UrlTrack::add_params($i); ?>"><?php echo \Rpp\Services\Get\Content::node($nid)->titulo_corto; ?></a></span></h2>
                        </div>
                      </li>
                      <?php if( $i >= 2 ) break;?>
    <?php endforeach;?>
    </ul>
    </section>
<?php endif;?>