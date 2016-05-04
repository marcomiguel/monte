
angular.element(document).ready(function() {
    require.config({
        urlArgs: 'v='+(new Date()).getTime(),
        waitSeconds: 0
    });
    require(
        [
            'app',
            'service/routeResolver',
            'service/utils',
            'factory/utils',
            'directive/utils',
            'directive/sc-date-time',
            'directive/highcharts-ng',
            'filter/utils'
        ],
        function(){
            var initInjector = angular.injector(["ng"]),
                $http = initInjector.get("$http"),
                URL = CMSDATA.GLOBAL.URLBASE,
                URLPERMISSIONS = '/session/index';
            permissionList = {};

            $http.get(URL + URLPERMISSIONS, { withCredentials: true, headers: { 'Content-Type': 'application/x-www-form-urlencoded;'}}).then(function(rsp) {
                var data = rsp.data;
                if(data.status){
                  var response = data.response;
                  if('rol_acciones' in response){
                    permissionList = response['rol_acciones'];
                  }
                }
                angular.bootstrap(document, ['RPPApp']);
            });
        }
    );
});
