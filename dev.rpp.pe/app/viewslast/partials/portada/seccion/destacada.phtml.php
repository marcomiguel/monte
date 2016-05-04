      <article class="flow-prominent">
              <?php foreach (\Rpp\Services\Get\Flow::seccion($this->model->slug,1) as $item) : ?>
                    <h1> <a href="<?php echo \Rpp\Services\Get\Content::nurl($item->_id); ?><?php echo \Rpp\Services\Get\UrlTrack::add_params(1); ?>"><?php echo \Rpp\Services\Get\Content::node($item->_id)->titulo_corto; ?></a></h1>
                    <div class="prominent-media">
                   <?php foreach (\Rpp\Services\Get\Content::part($item->_id,'contenido') as $contenido): ?>                 
                      <?php if ($contenido['tipo'] == 'photo') { ?>
                      <figure class="media"><a href="<?php echo \Rpp\Services\Get\Content::nurl($item->_id); ?><?php echo \Rpp\Services\Get\UrlTrack::add_params(1); ?>"><img src="<?php echo $contenido['foto']['url']; ?>" alt="<?php echo $contenido['foto']['alt']; ?>" width="445" height="251"></a></figure>
                       <?php break; ?>
                      <?php } elseif ($contenido['tipo'] == 'video') { ?>
                      <figure class="media media-video"><a href="<?php echo \Rpp\Services\Get\Content::nurl($item->_id); ?><?php echo \Rpp\Services\Get\UrlTrack::add_params(1); ?>"><img src="<?php echo $contenido['video']['url_cover']; ?>" alt="<?php echo $contenido['subtitulo']; ?>" width="445" height="251"></a></figure>
                      <?php } elseif ($contenido['tipo'] == 'youtube') { ?>
                      <figure class="media media-video"><a href="<?php echo \Rpp\Services\Get\Content::nurl($item->_id); ?><?php echo \Rpp\Services\Get\UrlTrack::add_params(1); ?>"><img src="http://img.youtube.com/vi/<?php echo $contenido['youtube']['id']; ?>/0.jpg" alt="<?php echo $contenido['subtitulo']; ?>" width="445" height="251"></a></figure>
                      <?php break; ?>
                      <?php } ?>
                    <?php endforeach;?>
                      <div class="prominent-txt"> 
                        <p>
                          <?php echo \Rpp\Services\Get\Content::node($item->_id)->bajada; ?>
                        </p>
                        <div class="time-related">Publicado el 
                          <time datetime="<?php echo date('Y-m-d H:i', \Rpp\Services\Get\Content::node($item->_id)->fecha_publicacion); ?>"> <?php echo date('d/m/y', \Rpp\Services\Get\Content::node($item->_id)->fecha_publicacion); ?>  </time>
                        </div>
                      </div>
                    </div>
              <?php break; endforeach;?>
        </article>
