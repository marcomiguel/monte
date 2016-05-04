<!--Head-->
<?php echo $this->partial('partials/head/index'); ?>
<body>
    <!--Header-->
    <?php echo $this->partial('partials/header/search', array(), $trackurl); ?>
    <?php echo $this->partial('partials/header/nav', array(), $trackurl); ?>
    <?php echo $this->partial('partials/header/smartphone', array(), $trackurl); ?>
    <?php echo $this->partial('partials/header/tendencias', array(), $trackurl); ?>
    <?php echo $this->partial('partials/header/navmovil', array(), $trackurl); ?>

    <main class="wrapper">
      <?php echo $this->partial('partials/nota/ads/ads-top'); ?>
      <section class="body detail">
        <section class="content news-flow">
          <!--News cards-->
          <div class="grid">
            <div class="col-2-2">
              <section class="box">
                <div class="box-inner">
                  <?php echo $this->partial('partials/nota/box/bread-social'); ?> 
                  <article class="box-detail">
                    <?php echo $this->partial('partials/nota/header/index' . $this->model->package); ?>
                    <section class="inner-detail">
                      
                      <?php echo $this->partial('partials/nota/detalle/open/' . $this->model->package); ?> 
                       
                      <?php echo $this->partial('partials/nota/detalle/social'); ?> 

                      <section class="content-news">

                        <?php echo $this->partial('partials/nota/detalle/content/' . $this->model->package); ?>

                        <?php echo $this->partial('partials/nota/tags/index' . $this->model->package, array(), $trackurl); ?>

                        <?php echo $this->partial('partials/nota/box/social', array('position' => 'wfoot')); ?>
  
                        <?php echo $this->partial('partials/nota/comentario/index'); ?>
  
                        <?php echo $this->partial('partials/nota/ads/ads-full'); ?>

                        <?php echo $this->partial('partials/nota/sugeridas/index', array(), $trackurl); ?>

                      </section>
                      <div class="clear"></div>
                    </section>
                  </article>
                </div>
              </section>
            </div>
          </div>
        </section>
        <!--ADS-->
        <?php echo $this->partial('partials/nota/sidebar/index', array()); ?>
        <!--ADS-->
      </section>
    </main>
    <!--Footer-->

    <?php echo $this->partial('partials/footer/index'); ?>
    <div id="pad-swipe-nav"></div>
    <?php echo $this->partial('partials/footer/scripts'); ?>
    <?php echo $this->partial('partials/footer/tracking'); ?>
  </body>