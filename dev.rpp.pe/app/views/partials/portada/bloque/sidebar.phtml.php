<aside class="sidebar">
          <!--Sidebar-->
          <!--ADS-->
          <section class="ads ads-sidebar"> </section>
          <!--SOCIAL-->
          <?php echo $this->partial('partials/sidebar/conectate'); ?>
          <!--ADS-->
          <section class="ads ads-sidebar"> </section>
          <!--RECOMENDADOS-->
          <?php echo $this->partial('partials/sidebar/recomendados', array(), $trackurl); ?>
          <!--HOT-->
          <?php echo $this->partial('partials/sidebar/calientes', array('slug' => 'home'), $trackurl); ?>
          <!--BLOOPERS-->
          <?php echo $this->partial('partials/sidebar/bloopers', array(), $trackurl); ?>
          <!--ADS-->
          <section class="ads ads-sidebar"> </section>
          <!--GIRL 10-->
          <?php echo $this->partial('partials/sidebar/lachica'); ?>
          <!--GOALS-->
          <?php echo $this->partial('partials/sidebar/pepazas', array(), $trackurl); ?>
        </aside>