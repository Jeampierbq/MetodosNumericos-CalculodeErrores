$(document).ready(init);
var isActive = false;


function disableScroll(){  
    $("body").css("overflow","hidden");
}

function enableScroll(){  
    $("body").css("overflow","auto");
}


function init()
{
    if(isActive)
    {
        disableScroll();
    }else
    {
        enableScroll();
    }


    $(".modal-area").on("click", function(){
        $(this).parent().fadeToggle();
        
    });
}