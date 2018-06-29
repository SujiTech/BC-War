function UI_init(){
	//关闭介绍
    $(".introduction").click(function(){
        if(account==null){
            //alert("本应用需要安装星云钱包");
        }
        $(this).fadeOut();
    })
    $("#btn-continue-challenge,#btn-refresh,#btn-levelup,#btn-upload,.bottomline .comment,.init-unfinish,.more-info").css({
        visibility:"hidden"
    })
    $(".more-info").click(function(){
        $(this).css({visibility:"hidden"})
    });
    $("#btn-about").click(function(){
    	$(".more-info").css({visibility:"visible"})
    })
    $("#btn-challenge").click(function(){
        main.Fight();
    });
    $("#btn-get-opponents").click(function(){
        main.btn_get_opponents();
    });
    $(".temp-input input").bind('keypress',function(event){
        if(event.keyCode == "13"){
            console.log("功能重做中");
            //ResetToFirstBattle();Fight();
        }
    });
    //$("#btn-get-opponents").dblclick(dbclk_opponents);
    Display.Div = $(".battle-log .content");
    //调试
    $("#btn-speedup").click(function(){
        main.display_loop();
    });

    $(".interface button").addClass("button button-large button-plain button-border button-box");
}