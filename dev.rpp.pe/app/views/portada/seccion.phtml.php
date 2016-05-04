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
      <section class="body flow">
      <section class="content news-flow">
          <!--News cards-->
          <div class="grid">
            <div class="col-2-2">
              <section class="box">
                <div class="box-inner">
                <section class="breadcrumb-full">
                 <?php echo $this->partial('partials/breadcrum/index', array('elements' => array($this->model->seccion_info->nombre))); ?>
                </section>
                  <h3 class="title-flow"><?php echo $this->model->seccion_info->nombre; ?></h3>
                  <?php echo $this->partial('partials/portada/seccion/destacada', array(), $trackurl); ?>

                  <?php echo $this->partial('partials/portada/flujo/seccion', array('slug' => $this->model->slug), $trackurl); ?>

                  <div class="title-full">
                    <h3><a href="#">Ver archivo</a></h3>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>


       <aside class="sidebar">
          <!--Sidebar-->
          <!--ADS-->
          <section class="ads ads-sidebar"> </section>
          <!--HOT-->
         <?php echo $this->partial('partials/sidebar/calientes', array('slug' => $this->model->slug), $trackurl); ?>
          <!--ADS-->
          <section class="ads ads-sidebar"> </section>
          <!--BLOOPERS-->
          <?php echo $this->partial('partials/sidebar/bloopers', array(), $trackurl); ?>
          <!--GIRL10-->
          <?php echo $this->partial('partials/sidebar/lachica'); ?>
        </aside>

      </section>
    </main>  
    <!--Footer-->
    <?php echo $this->partial('partials/footer/index', array(), $trackurl); ?>
    <div id="pad-swipe-nav"></div>
    <?php echo $this->partial('partials/footer/scripts'); ?>
    <?php echo $this->partial('partials/footer/tracking'); ?>
  </body>
