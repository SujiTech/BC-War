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
    $("#name-player1").bind('keypress',function(event){
        if(event.keyCode == "13"){
            //改名API
            custom_name(this);
        }
    });
    $("#name-player2").bind('keypress',function(event){
        if(event.keyCode == "13"){
            //自定义对手
            custom_opponent(this);
            main.p2_wallet.name = $(this).val();
            main.p2_wallet.hash = parseInt("0x"+hex_md5($(this).val()));
            main.ResetToFirstBattle();
        }
    });
    $("#btn-custom-name").click(function(){
    	custom_name($("#name-player1"));
    	}
    )
    $("#btn-custom-opponent").click(function(){
		custom_opponent($("#name-player2"));
    	}
    )

    //$("#btn-get-opponents").dblclick(dbclk_opponents);
    Display.Div = $(".battle-log .content");
    //调试
    $("#btn-speedup").click(function(){
        main.display_loop();
    });

    $(".interface button,#btn-custom-name,#btn-custom-opponent").addClass("button button-large button-plain button-border button-box");
}

function custom_name(obj){
    main.p1_wallet.name = $(obj).val();
    main.ResetToFirstBattle();
}
function custom_opponent(obj){
    main.p2_wallet.name = $(obj).val();
    main.p2_wallet.hash = parseInt("0x"+hex_md5($(obj).val()));
    main.ResetToFirstBattle();
}