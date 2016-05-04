      <section class="widget widget-resutl">
        <!--iframe(src="http://estadisticas.conmebol.com/lastResults_new.html")-->
        <div id="outFixture">
          <div class="topFixture">
            <h4>Resultados</h4>
            <nav>
              <ul>
                <li data-value="0" data-id="#cntFixture2" data-events="copainca" onclick="rppWR.tabsResult(this, 'tab')">Torneo del Inca</li>
                <li data-value="1" data-id="#cntFixture" data-events="champions" onclick="rppWR.tabsResult(this, 'tab')" >Champions League</li>
                <li data-value="2" data-id="#cntFixture3" data-events="uefa" onclick="rppWR.tabsResult(this, 'tab')">Europa League</li>
                <li data-value="3" data-id="#cntFixture4" data-events="peru" onclick="rppWR.tabsResult(this, 'tab')" class="active">Descentralizado</li>
                <li data-value="4" data-id="#cntFixture5" data-events="copaamerica" onclick="rppWR.tabsResult(this, 'tab')">Copa America</li>
              </ul>
              <select onchange="rppWR.tabsResult(this, 'select')">
                <option value="0" data-id="#cntFixture2" data-events="copainca">Torneo del Inca</option>
                <option value="1" data-id="#cntFixture" data-events="champions">Champions League</option>
                <option value="2" data-id="#cntFixture3" data-events="uefa">Europa League</option>
                <option value="3" data-id="#cntFixture4" data-events="peru" selected="selected">Descentralizado</option>
                <option value="4" data-id="#cntFixture5" data-events="copaamerica">Copa America</option>
              </select>
            </nav>
          </div>
          <div id="cntFixture2" style="display:none"></div>
          <div id="cntFixture">
            <script charset="utf-8">
              rppWR.read({events: 'peru', type: 'agendaMaM', matchId: ''}).render({id:'#cntFixture', url: 'http://dbg-ladiez.webrpp.com/url.html'});
            </script>
          </div>
          <div id="cntFixture3" style="display:none"></div>
          <div id="cntFixture4" style="display:none"></div>
          <div id="cntFixture5" style="display:none"></div>
        </div>
      </section>