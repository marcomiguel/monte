<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <?php foreach ($secciones as $seccion) : ?>
   <sitemap>
      <loc><?php echo $host; ?>/sitemap/seccion/<?php echo $seccion; ?></loc>
      <lastmod><?php echo date('Y-m-d\TH:i:sP'); ?></lastmod>
   </sitemap>
  <?php endforeach; ?>
</sitemapindex>