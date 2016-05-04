<?php echo $this->partial('partials/head/index'); ?>
  <body>
    <!--Header-->
    <?php echo $this->partial('partials/header/search', array(), $trackurl); ?>
    <?php echo $this->partial('partials/header/nav', array(), $trackurl); ?>
    <?php echo $this->partial('partials/header/smartphone', array(), $trackurl); ?>
    <?php echo $this->partial('partials/header/tendencias', array(), $trackurl); ?>
    <?php echo $this->partial('partials/header/navmovil', array(), $trackurl); ?>
    <main class="wrapper">
      <!--ADS Top-->
      <?php echo $this->partial('partials/nota/ads/ads-top'); ?>
      <section class="body archive body-full">
        <section class="box-404">
          <h6> <span class="txt1">Error </span><span class="txt2">404</span></h6>
          <p>  Ooops! Página no encontrada</p>
          <section class="search-total">
            <!--Search-->
            <section class="search-flow">
              <div class="search-flow-inner">
                <form action="#">
                  <input type="text" value="Buscar tema...">
                  <button type="button"><i class="icon icon-search"></i></button>
                </form>
              </div>
            </section>
          </section>
        </section>
      </section>
    </main>

    <!--Footer-->
    <?php echo $this->partial('partials/footer/index', array(), $trackurl); ?>
    <div id="pad-swipe-nav">                   </div>
    <?php echo $this->partial('partials/footer/scripts'); ?>
    <?php echo $this->partial('partials/footer/tracking'); ?>
  </body>
</html>