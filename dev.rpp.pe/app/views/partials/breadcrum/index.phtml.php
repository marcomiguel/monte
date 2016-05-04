              <nav class="breadcrumb">
                <ul>
                  <li>
                    <figure class="logo"><a href="/"><img src="<?php echo $host; ?>/img/logo_breadcrumb.png" alt="Logo La10"></a></figure>
                  </li>
                  <?php foreach ($elements as $element) { ?> 
                  <li><?php echo $element; ?></li>
                  <?php } ?>
                </ul>
              </nav>