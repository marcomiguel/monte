/*
    @nombre : ADS ENTRYs RPP
    @autor : JPC
    @version : 0.0.1
    @date : 10-2015
    @dependency : e-planning
*/
var rppAds = window.rppAds || {};
rppAds.render = function(obj){
    if(!document.querySelectorAll) return false;
    var positions = obj.positions;
    var query = obj.query;
    var _class = obj.class;
    var pArticle = document.querySelectorAll(query);
	if(pArticle){
		var minCharByParagraph = obj.minCharByParagraph;
	    var countUnit = 0;
	    var reviewParagraph = function(pArticleUnit){
			//TEXT WITHOUT HTML
	        var pLength = ((pArticleUnit.innerHTML).replace(/<\/?[a-z][a-z0-9]*[^<>]*>/ig, '')).length;
			pArticleUnit.setAttribute('data-chars', pLength);
	        //REVIEWs
			var isReady = (pLength>1)?true:false;
			if(isReady){
				countUnit += pLength;
				if(countUnit >= minCharByParagraph){
					countUnit = 0;
					isReady = true;
				}else{

					isReady = false;
				}
	        }else{
				countUnit += pLength;
				isReady = false;
			}
			return isReady;
	    };
	    /*
	    _contruc : CONTRUCTOR ADS
	    @positions POSICONTS,
	    @_pos ITEM POSITON,
	    @_pPos PARAGRAPH POSITION,
	    @_class CLASS ASIDE,
	    @pArticle PARAGRAPH ARTICLE
	    */
	    var _contruc = function(positions, _pos, _pPos, _class, pArticle, type){
	        var adsAside = document.createElement('aside');
	        adsAside.className = _class;
	        adsAside.id = 'aside' + positions[_pos];
	        if(type === 'primero'){
	            adsAside.style.float = 'none';
	            adsAside.style.textAlign = 'center';
	        }
	        var adsDiv = document.createElement('div');
	        //adsDiv.id = 'eplAdDiv' + positions[_pos];
			adsDiv.id = 'eplAdDiv' + positions[_pos];
			var _script = document.createElement('script');
	        _script.type = 'text/javascript';
	        _script.charset = 'utf-8';
	        _script.defer = true;
	        //_script.text = 'eplAD4M("' + positions[_pos] + '");';
			_script.text = 'eplAD4Sync("eplAdDiv' + positions[_pos] + '","'+ positions[_pos] +'");';
	        adsAside.appendChild(adsDiv);
	        adsAside.appendChild(_script);
	        //INSERT DOM AFTER
	        var refElem = pArticle[_pPos];
	        var parent = refElem.parentNode;
	        var elmNext = (type === 'primero')?refElem:refElem.nextSibling;
	        parent.insertBefore(adsAside, elmNext);
	    };
	    //DOM TRAVEL
		if(pArticle.length>0){
			var count = 1, countNoValid = 0;
		    _contruc(positions, 0, 0, _class, pArticle, 'primero');
		    for (var i = 0; i < pArticle.length; i++) {
		        if(reviewParagraph(pArticle[i])){
		            pArticle[i].setAttribute('data-valid', 'true');
		    		_contruc(positions, count, i, _class, pArticle);
		    		count++;
		        }else{
		            pArticle[i].setAttribute('data-valid', 'false');
		            countNoValid++;
		        }
		    };
		}
	}else{
		console.log('No hay coincidencias');
	}
}({
	positions : ['Interna1' , 'Interna2' ,'Interna3' , 'Interna4' , 'Interna5' , 'Interna6' , 'Interna7' , 'Interna8'],
	query : '.single-cont article.hnews .cont > p',
	class : 'asideAds',
	minCharByParagraph : 900
});

/*
    @nombre : ADS ENTRYs RPP
    @autor : JOAN PERAMAS
    @version : 0.0.1
    @date : 10-2015
    @dependency : e-planning
*/
var rppAds = window.rppAds || {};
rppAds.render = function(obj){
    if(!document.querySelectorAll) return false;
    var positions = obj.positions;
    var query = obj.query;
    var _class = obj.class;
    var pattern = obj.pattern;
    var pArticle = document.querySelectorAll(query);
    var minCharByParagraph = obj.minCharByParagraph;
    var countUnit = 0;
    var reviewParagraph = function(pArticleUnit, minCharByParagraph){
        var pLength = ((pArticleUnit.innerHTML).replace(/<\/?[a-z][a-z0-9]*[^<>]*>/ig, '')).length;
        //TEXT WITHOUT HTML
        var isReady = (pLength>minCharByParagraph)?true:false;
        if(isReady){
            countUnit = 0;
            pArticleUnit.setAttribute('data-sum-valid', 'false');
        }else{
            pArticleUnit.setAttribute('data-sum-valid', 'true');
            countUnit += pLength;
        }
        if(countUnit >= minCharByParagraph){
            isReady = true;
            countUnit = 0;
        }
        return isReady;
    };
    /*
    _contruc : CONTRUCTOR ADS
    @positions POSICONTS,
    @_pos ITEM POSITON,
    @_pPos PARAGRAPH POSITION,
    @_class CLASS ASIDE,
    @pArticle PARAGRAPH ARTICLE
    */
    var _contruc = function(positions, _pos, _pPos, _class, pArticle){
        var adsAside = document.createElement('aside');
        adsAside.className = _class;
        var adsDiv = document.createElement('div');
        adsDiv.id = 'eplAdDiv' + positions[_pos]
        var _script = document.createElement('script');
        _script.type = 'text/javascript';
        _script.charset = 'utf-8';
        _script.defer = true;
        _script.text = 'eplAD4M("' + positions[_pos] + '");';
        adsAside.appendChild(adsDiv);
        adsAside.appendChild(_script);
        //INSERT DOM AFTER
        var refElem = pArticle[_pPos];
        var parent = refElem.parentNode;
        refElem.parentNode.insertBefore(adsAside, refElem.nextSibling);
    };
    //DOM TRAVEL
    if(pArticle.length>=pattern[0]){
        var count = 0, countNoValid = 0;
        for (var i = 0; i < pArticle.length; i++) {
            if(reviewParagraph(pArticle[i], minCharByParagraph)){
                pArticle[i].setAttribute('data-valid', 'true');
                for (var j = 0; j < pattern.length; j++) {
                    if(pattern[j] + countNoValid === i + 1){
                        _contruc(positions, count, (pattern[j]-1 + countNoValid), _class, pArticle);
                        count ++;
                    }
                }
            }else{
                pArticle[i].setAttribute('data-valid', 'false');
                countNoValid++;
            }
        };
    }
};








/*
    @nombre : ADS ENTRYs RPP
    @autor : JOAN PERAMAS
    @version : 0.0.1
    @date : 10-2015
    @dependency : e-planning
*/
var rppAds = window.rppAds || {};
rppAds.render = function(obj){
    if(!document.querySelectorAll) return false;
    var positions = obj.positions;
    var query = obj.query;
    var _class = obj.class;
    var pattern = obj.pattern;
    var pArticle = document.querySelectorAll(query);
    var minCharByParagraph = obj.minCharByParagraph;
    var countUnit = 0;
    var reviewParagraph = function(pArticleUnit, minCharByParagraph){
        var pLength = ((pArticleUnit.innerHTML).replace(/<\/?[a-z][a-z0-9]*[^<>]*>/ig, '')).length;
        //TEXT WITHOUT HTML
        //var isReady = (pLength>minCharByParagraph)?true:false;
		var isReady = (pLength>1)?true:false;
		/*if(isReady){
            countUnit = 0;
            pArticleUnit.setAttribute('data-sum-valid', 'false');
        }else{
            pArticleUnit.setAttribute('data-sum-valid', 'true');
            countUnit += pLength;
        }
        if(countUnit >= minCharByParagraph){
            isReady = true;
            countUnit = 0;
        }*/
		if(isReady){
			console.log(countUnit, 'countUnit P');
			if(countUnit >= 600){
				isReady = true;
				countUnit = 0;
			}else{
				isReady = false;
				countUnit += pLength;
			}
	        return isReady;
        }else{
			isReady = false;
			return isReady;
		}
    };
    /*
    _contruc : CONTRUCTOR ADS
    @positions POSICONTS,
    @_pos ITEM POSITON,
    @_pPos PARAGRAPH POSITION,
    @_class CLASS ASIDE,
    @pArticle PARAGRAPH ARTICLE
    */
    var _contruc = function(positions, _pos, _pPos, _class, pArticle){
        var adsAside = document.createElement('aside');
        adsAside.className = _class;
        var adsDiv = document.createElement('div');
        adsDiv.id = 'eplAdDiv' + positions[_pos]
        var _script = document.createElement('script');
        _script.type = 'text/javascript';
        _script.charset = 'utf-8';
        _script.defer = true;
        _script.text = 'eplAD4M("' + positions[_pos] + '");';
        adsAside.appendChild(adsDiv);
        adsAside.appendChild(_script);
        //INSERT DOM AFTER
        var refElem = pArticle[_pPos];
        var parent = refElem.parentNode;
        refElem.parentNode.insertBefore(adsAside, refElem.nextSibling);
    };
    //DOM TRAVEL
    if(pArticle.length>=pattern[0]){
        var count = 0, countNoValid = 0;
        for (var i = 0; i < pArticle.length; i++) {
            if(reviewParagraph(pArticle[i], minCharByParagraph)){
                pArticle[i].setAttribute('data-valid', 'true');
                for (var j = 0; j < pattern.length; j++) {
                    if(pattern[j] + countNoValid === i + 1){
                        _contruc(positions, count, (pattern[j]-1 + countNoValid), _class, pArticle);
                        count ++;
                    }
                }
            }else{
                pArticle[i].setAttribute('data-valid', 'false');
                countNoValid++;
            }
        };
    }
};

rppAds.render({
	positions : ["Interna1" , "Interna2" , "Interna3" , "Interna4" , "Interna5" , "Interna6" , "Interna7" , "Interna8" , "Interna9"],
	query : 'article.hnews .cont > p',
	pattern : [1,4,7,10,13,16,19,22,25],
	class : 'asideAds',
	minCharByParagraph : 300
});
