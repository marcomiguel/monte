<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-archivo/1.1">
<?php for($fecha=$end ; $fecha>=$start ; $fecha = date("Y-m-d", strtotime($fecha ."- 1 days"))) : ?>
	<url>
		<loc><?php echo $host; ?>/archivo/<?php echo $slug; ?>/<?php echo $fecha; ?></loc>
		<lastmod><?php echo $fecha; ?></lastmod>
	</url>
<?php endfor;?>
</urlset>
