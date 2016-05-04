    <aside class="sidebar">
      <section class="search-flow">
        <div class="search-flow-inner">
          <form action="#">
            <input type="text" value="buscar">
            <button type="button"><i class="icon icon-search"></i></button>
          </form>
        </div>
      </section>
      <!--CALENDAR-->
      <section class="calendar">
        <div class="box"></div>
      </section>
      <!--FILTER-->
      <section class="filter-date">
        <div class="box">
          <h3> Filtro cronológico</h3>
          <nav>
            <ul>
              <li <?php if( $this->model->intervalo == 12 ):?>class="active" <?php endif;?> ><a href="/archivo-12h">Últimas 12 horas</a></li>
              <li <?php if( $this->model->intervalo == 24 ):?>class="active" <?php endif;?> ><a href="/archivo-24h">Últimas 24 horas</a></li>
              <li <?php if( $this->model->intervalo == 168 ):?>class="active" <?php endif;?> ><a href="/archivo-1w">Última semana</a></li>
              <li <?php if( $this->model->intervalo == 672 ):?>class="active" <?php endif;?> ><a href="/archivo-1m">Último mes</a></li>
            </ul>
          </nav>
        </div>
      </section>
    </aside>