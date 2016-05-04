'use strict';
define(['app', 'js/lib/highcharts/highcharts'], function (app, highcharts) {
	app.register.controller('estadisticasCtrl', 
	['$scope',
    '$rootScope',
    '$http',
    '$document',
    '$location',
    '$preload',
    '$mdDialog',
    '$mdToast',
    '$timeout',
    '$create',
    '$msj',
    '$scrollGo',
    '$localStorage',
    '$login',
    '$logout',
    '$routeParams',
    '$cacheService',
    '$route',
    '$filter',
    '$log',
    function(
        $scope,
        $rootScope,
        $http,
        $document,
        $location,
        $preload,
        $mdDialog,
        $mdToast,
        $timeout,
        $create,
        $msj,
        $scrollGo,
        $localStorage,
        $login,
        $logout,
        $routeParams,
        $cacheService,
        $route,
        $filter,
        $log
    ) {
        
        // $scope.chartTypes = [
        //     {"id": "line", "title": "Line"},
        //     {"id": "spline", "title": "Smooth line"},
        //     {"id": "area", "title": "Area"},
        //     {"id": "areaspline", "title": "Smooth area"},
        //     {"id": "column", "title": "Column"},
        //     {"id": "bar", "title": "Bar"},
        //     {"id": "pie", "title": "Pie"},
        //     {"id": "scatter", "title": "Scatter"}
        // ];

        // $scope.dashStyles = [
        //   {"id": "Solid", "title": "Solid"},
        //   {"id": "ShortDash", "title": "ShortDash"},
        //   {"id": "ShortDot", "title": "ShortDot"},
        //   {"id": "ShortDashDot", "title": "ShortDashDot"},
        //   {"id": "ShortDashDotDot", "title": "ShortDashDotDot"},
        //   {"id": "Dot", "title": "Dot"},
        //   {"id": "Dash", "title": "Dash"},
        //   {"id": "LongDash", "title": "LongDash"},
        //   {"id": "DashDot", "title": "DashDot"},
        //   {"id": "LongDashDot", "title": "LongDashDot"},
        //   {"id": "LongDashDotDot", "title": "LongDashDotDot"}
        // ];

        // $scope.chartSeries = [
        //   {"name": "Some data", "data": [1, 2, 4, 7, 3]},
        //   {"name": "Some data 3", "data": [3, 1, null, 5, 2], connectNulls: true},
        //   {"name": "Some data 2", "data": [5, 2, 2, 3, 5], type: "column"},
        //   {"name": "My Super Column", "data": [1, 1, 2, 3, 2], type: "column"}
        // ];

        // $scope.chartStack = [
        //   {"id": '', "title": "No"},
        //   {"id": "normal", "title": "Normal"},
        //   {"id": "percent", "title": "Percent"}
        // ];

        // $scope.addPoints = function () {
        //   var seriesArray = $scope.chartConfig.series;
        //   var rndIdx = Math.floor(Math.random() * seriesArray.length);
        //   seriesArray[rndIdx].data = seriesArray[rndIdx].data.concat([1, 10, 20])
        // };

        // $scope.addSeries = function () {
        //   var rnd = []
        //   for (var i = 0; i < 10; i++) {
        //     rnd.push(Math.floor(Math.random() * 20) + 1)
        //   }
        //   $scope.chartConfig.series.push({
        //     data: rnd
        //   })
        // }

        // $scope.removeRandomSeries = function () {
        //   var seriesArray = $scope.chartConfig.series;
        //   var rndIdx = Math.floor(Math.random() * seriesArray.length);
        //   seriesArray.splice(rndIdx, 1)
        // }

        // $scope.removeSeries = function (id) {
        //   var seriesArray = $scope.chartConfig.series;
        //   seriesArray.splice(id, 1)
        // }

        // $scope.toggleHighCharts = function () {
        //   this.chartConfig.useHighStocks = !this.chartConfig.useHighStocks
        // }

        // $scope.replaceAllSeries = function () {
        //   var data = [
        //     { name: "first", data: [10] },
        //     { name: "second", data: [3] },
        //     { name: "third", data: [13] }
        //   ];
        //   $scope.chartConfig.series = data;
        // };

        // $scope.chartConfig = {
        //   options: {
        //     chart: {
        //       type: 'areaspline'
        //     },
        //     plotOptions: {
        //       series: {
        //         stacking: ''
        //       }
        //     }
        //   },
        //   series: $scope.chartSeries,
        //   title: {
        //     text: 'Hello'
        //   },
        //   credits: {
        //     enabled: true
        //   },
        //   loading: false,
        //   size: {}
        // }

        // $scope.reflow = function () {
        //   $scope.$broadcast('highchartsng.reflow');
        // };
        
        var URL = CMSDATA.GLOBAL.URLBASE,
        URLVIEW = CMSDATA.GLOBAL.URLVIEW,
        URLLIST = 'listado.html',
        URLLOGIN = 'login.html',
        URLCREATENEW = 'createnew.html',
        URLSESSION = 'session',
        URLCLOSESESSION = 'session/logout',
        URLLISTNEWS = 'noticias',
        URLEDITNEWS = 'noticias/leer/',
        URLHIGHLIGHT = 'destacadas/',
        URLCOVERS = 'destacadas/list/',
        URLLISTSITE = 'sitio/list',
        URLACTIVIDADBORRADORES = 'noticias?estado=borradores',
        URLDELETE = 'noticias/eliminar/',
        URLLISTSITE = 'sitio/list',
        URLLISTAUTHOR = 'user',
        URLLISTCATEGORY = 'categoria/index/',
        URLSEARCHITEMS = 'noticias/?suggest=',
        DATA = {},
        TIMERESULT = 1000/2;

        var ng = $scope;


        //LIST SITES
        ng.filterSite = undefined;
        ng.filterSites = [];
        ng.loadSite = function() {
            //Sites
            $cacheService.get(URL + URLLISTSITE)
            .then(
                function (data) {
                    var data = data;
                    if(data.status){
                        //SITE
                        ng.filterSites = data.response;
                        ng.filterSites.unshift({
                            nombre: 'Grupo RPP',
                            slug : 'grupo-rpp'
                        });
                    }else{
                        $msj.show(CMSDATA.MSJ.MSJ17,positionMSj);
                    }
                },
                function(msgError) {
                    $msj.show(CMSDATA.MSJ.MSJ17,positionMSj);
                }
            );
        };
        ng.loadSite();

        //SECTION
        //LIST SITES
        ng.filterSection = undefined;
        ng.filterSections = [];
        ng.loadSection = function(sitio) {
            var _sitio = (sitio)?sitio:'rpp';
            //Section
            $cacheService.get(URL + URLLISTCATEGORY + _sitio + '?type=search_box')
            .then(
                function (data) {
                    var data = data;
                    if(data.status){
                        //SITES
                        ng.filterSections = data.response;
                    }else{
                        $msj.show(CMSDATA.MSJ.MSJ13,positionMSj);
                    }
                },
                function(msgError) {
                    $msj.show(CMSDATA.MSJ.MSJ13,positionMSj);
                }
            );
        };
        ng.loadSection(undefined);
        ng.changeLoadSectionHeader = function(){
            var _sitio = (ng.filterSite)?ng.filterSite.slug:undefined;
            ng.loadSection(_sitio);
        };

        ng.lista = [
          {
            titulo: 'Notas',
            items: [
              {
                titulo: "Publicadas",
                cantidad: 10,
                sub_items: [
                  {
                    titulo: "Hijo 1",
                    cantidad: 11
                  },
                  {
                    titulo: "Hijo 2",
                    cantidad: 6
                  }
                ]
              },
              {
                titulo: "Republicadas",
                cantidad: 5,
                sub_items: [
                  {
                    titulo: "Hijo 1",
                    cantidad: 11
                  },
                  {
                    titulo: "Hijo 2",
                    cantidad: 6
                  },
                  {
                    titulo: "Hijo 3",
                    cantidad: 6
                  }
                ]
              },
              {
                titulo: "Otras",
                cantidad: 25
              }
            ]
          }
        ];

        var agregarIcono = function(lista, icono){
          for (var i = lista.length - 1; i >= 0; i--) {
            lista[i].expand_icon = icono;
          };
        };

        agregarIcono(ng.lista[0].items, 'expand_more');

        var expandirHijos = function(lista, idx, items){
          if (lista[idx].expand_icon == 'expand_more'){
            lista[idx].expand_icon = 'expand_less';
            for (var i = items.length - 1; i >= 0; i--) {
              lista.splice(idx + 1, 0, items[i]);
            };
          }else if (lista[idx].expand_icon == 'expand_less'){
            lista[idx].expand_icon = 'expand_more';
            lista.splice(idx + 1, items.length);
          }
        };

        ng.clicExpandir = function(idx, items){
          expandirHijos(ng.lista[0].items, idx, items);
        };

    }
	]);
});