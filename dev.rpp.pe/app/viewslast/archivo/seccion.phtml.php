<!--Head-->
<?php echo $this->partial('partials/head/index'); ?>
<body >
    <!--Header-->
    <?php echo $this->partial('partials/header/search', array(), $trackurl); ?>
    <?php echo $this->partial('partials/header/nav', array(), $trackurl); ?>
    <?php echo $this->partial('partials/header/smartphone', array(), $trackurl); ?>
    <?php echo $this->partial('partials/header/tendencias', array(), $trackurl); ?>
    <?php echo $this->partial('partials/header/navmovil', array(), $trackurl); ?>
    <main class="wrapper">
      <?php echo $this->partial('partials/nota/ads/ads-top'); ?>
      <?php echo $this->partial('partials/widget/resultados'); ?>
      <section class="body archive body-full">
       <div class="box"> 
          <div class="box-inner">
            <h3 class="title-flow">Archivo</h3>
            <?php echo $this->partial('partials/sidebar/archivo'); ?>
            <section class="content news-flow">
             <div class="grid">
                <div class="col-2-2">
                  <section>
                     <?php echo $this->partial('partials/portada/flujo/archivo', array(), $trackurl); ?>
                  </section>
                </div>
             </div>
            </section>
          </div>
       </div>
      </section>
    </main>  
    <!--Footer-->
    <?php echo $this->partial('partials/footer/index', array(), $trackurl); ?>
    <div id="pad-swipe-nav"></div>
    <?php echo $this->partial('partials/footer/scripts'); ?>
    <?php echo $this->partial('partials/footer/tracking'); ?>
  </body>