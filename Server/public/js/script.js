var firstMessage = true;

var socket = io();

socket.on('connection', function() {
    console.log('Connected to synfocycle');
});

socket.on('settings', function(settings){
    console.log('init settings');
    var el = document.getElementById('settings');
    var str = '<ul class="collection with-header">';
          str+='<li class="collection-header"><h4>SETTINGS</h4></li>';

    for (var param in settings.params) {
        if (settings.params.hasOwnProperty(param)) {
            settings[param] = settings.params[param];
        }
    }

    delete settings.params;

    for (var variable in settings) {
        if (settings.hasOwnProperty(variable)) {
            str+='<li class="collection-item">';
            str+='<b>'+variable+'</b> '+settings[variable];
            str+='</li>';
        }
    }
    str+="</ul>";
    el.innerHTML = str;
});

socket.on('state', function(state) {
    var el = document.getElementById('state');
    var str = '<ul class="collection with-header">';
            str+='<li class="collection-header"><h4>STATE</h4></li>';

    for (var variable in state) {
        if (state.hasOwnProperty(variable)) {
            str+='<li class="collection-item">';
            str+='<b>'+variable+'</b> '+state[variable];
            str+='<input type="range" id="test5" value="'+state[variable]*1000+'" min="0" max="1000" />';
            str+='<b>'+Date()+'</b>';
            str+='</li>';
        }
    }
    str+="</ul>";
    el.innerHTML = str;
});


            
        