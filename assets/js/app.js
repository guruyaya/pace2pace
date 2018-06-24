(function($){

var action_vars = window.location.hash.split('&');
var action

var welcome = function(){
    console.log('Here');
    $('#a-welcome-firsttime').show();
}

if (action_vars[0] == ''){
    action = 'welcome';
}else{
    action = action_vars[0].substr(1);
}
let main = function (action) {
    console.log(action);
    let reg = new RegExp('^#' + action + '(&.*)?$');
    if (!window.location.hash.match(reg)){
        window.location.hash = action;
    }
    switch(action){
        case 'welcome': welcome(); break;
    }
}

window.onload = function (){
    main(action);
}

})(jQuery);
