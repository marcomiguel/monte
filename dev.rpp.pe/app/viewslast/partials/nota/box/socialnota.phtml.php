    <section class="social-detail">
      <ul>
        <li><a href="<?php echo $host; ?><?php echo \Rpp\Services\Get\Content::nurl($this->model->nid); ?><?php echo \Rpp\Services\Get\UrlTrack::add_params_social('facebook', $position); ?>" class="facebook"><i class="icon icon-facebook"></i></a></li>
        <li><a href="<?php echo $host; ?><?php echo \Rpp\Services\Get\Content::nurl($this->model->nid); ?><?php echo \Rpp\Services\Get\UrlTrack::add_params_social('twitter', $position); ?>" class="twitter"><i class="icon icon-twitter"></i></a></li>
        <li><a href="<?php echo $host; ?><?php echo \Rpp\Services\Get\Content::nurl($this->model->nid); ?><?php echo \Rpp\Services\Get\UrlTrack::add_params_social('googleplus', $position); ?>" class="gplus"><i class="icon icon-google-plus"></i></a></li>
        <li class="li-whatsapp"><a href="<?php echo $host; ?><?php echo \Rpp\Services\Get\Content::nurl($this->model->nid); ?><?php echo \Rpp\Services\Get\UrlTrack::add_params_social('whatsapp', $position); ?>" class="whatsapp"><i class="icon icon-whatsapp"></i></a></li>
      </ul>
    </section>

