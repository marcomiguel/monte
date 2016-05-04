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
      <section class="body archive body-full">


      <section class="box">
        <div class="box-inner">
           <section class="breadcrumb-full">             
            <?php echo $this->partial('partials/breadcrum/index', array('elements' => array('<a href="/buscar">Buscador</a>'))); ?>
           </section>

            <h3 class="title-flow">Buscador</h3>

            <aside class="sidebar">
              <section class="filter-date">
                <div class="box">
                  <h3> Filtro por secciones</h3>
                  <nav>
                    <ul>
                      <li class="active"><a href="#">Fútbol Internacional</a></li>
                      <li><a href="#">Fútbol Peruano</a></li>
                      <li><a href="#">La Selección</a></li>
                      <li><a href="#">Full Contacto</a></li>
                      <li><a href="#">Más Deportes</a></li>
                    </ul>
                  </nav>
                </div>
              </section>
            </aside>

            <section class="content news-flow">
              <section class="search-total">
                <!--Search-->
                <section class="search-flow">
                  <div class="search-flow-inner">
                    <form method="post" action="/buscar">
                      <input type="text" value="<?php echo urldecode($this->model->search_text); ?>" name="texto">
                      <button type="submit"><i class="icon icon-search"></i></button>
                    </form>
                  </div>
                </section>
                <?php if (empty($this->model->response)) { ?>
                  <?php $result = 'empty'; ?>
                <?php } else { ?>
                   <?php $result = ''; ?>
                <div class="total-txt"><strong><?php echo $this->model->response->numFound; ?></strong><span>noticias encontradas</span></div>
                <?php } ?>
              </section>
           

      
                   <div class="grid">
                <div class="col-2-2">
                  <section>

                <div class="timeline">
      
                  <?php echo $this->partial('buscar/result' . $result, array('response' => $this->model->response), $trackurl); ?>
                
                </div>
                </section></div></div> </section>


  

      </section>
    </main>
    <!--Footer-->
    <?php echo $this->partial('partials/footer/index', array(), $trackurl); ?>
    <div id="pad-swipe-nav"></div>
    <?php echo $this->partial('partials/footer/scripts'); ?>
    <?php echo $this->partial('partials/footer/tracking'); ?>
  </body>