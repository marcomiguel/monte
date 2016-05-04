if(document.getElementById('hora-planeta-d')) document.getElementById('hora-planeta-d').style.display = 'none';
if(document.getElementById('hora-planeta-m')) document.getElementById('hora-planeta-m').style.display = 'none';

var duration_hp = 1000*60*60;
setTimeout(
	function(){
		location.reload();
	},
	duration_hp
);