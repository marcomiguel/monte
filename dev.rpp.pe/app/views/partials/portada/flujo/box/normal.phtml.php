          <article class="flow-normal">
              <div class="prominent-media">
                <figure class="media"><a href="<?php echo \Rpp\Services\Get\Content::nurl($nid); ?><?php echo \Rpp\Services\Get\UrlTrack::add_params($position); ?>"><img src="<?php echo \Rpp\Services\Get\Content::node($nid)->imagen_portada['url']; ?>" alt="<?php echo \Rpp\Services\Get\Content::node($nid)->imagen_portada['alt']; ?>" width="224" height="129" ></a></figure>
                <div class="prominent-txt"> 
                  <h2> <a href="<?php echo \Rpp\Services\Get\Content::nurl($nid); ?><?php echo \Rpp\Services\Get\UrlTrack::add_params($position); ?>"><?php echo \Rpp\Services\Get\Content::node($nid)->titulo_corto; ?></a></h2>
                  <p><?php echo \Rpp\Services\Get\Content::node($nid)->bajada; ?></p>
                  <div class="time-related">Publicado el 
                    <time datetime="<?php echo date('Y-m-d H:i', \Rpp\Services\Get\Content::node($nid)->fecha_publicacion); ?>"> <?php echo date('d/m/y', \Rpp\Services\Get\Content::node($nid)->fecha_publicacion); ?>  </time>
                  </div>
                </div>
              </div>
            </article>                