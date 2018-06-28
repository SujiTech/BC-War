function Main(){}
Main.prototype = {
    p1 : null,
    p2 : null,
    // p1_wallet : {hash:parseInt("0x3025e28ba5769d139e1395387a488394"),name:"袭金亮"},
    // p2_wallet : {hash:parseInt("0xbed46142792616f09a9120a724fcb64e"),name:"刘怪斯14"},
    p1_wallet : {hash:parseInt("0x3025e28ba5769d139e1395387a4883941"),name:"袭金亮"},
    p2_wallet : {hash:parseInt("0xbed46142792616f09a9120a724fcb64e"),name:"刘怪斯14"},
    battle_times : 0,
    p1_action_list : [],
    p1_now_action_index : 0,
    p2_action_list : [],
    p2_now_action_index : 0,
    display_index : 0,
    display_list : [],
    display_looping : false,
    bk_rand :null,
}
Main.prototype.init = function(){
    var main = this;
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
    //战斗数据
    this.ResetToFirstBattle()
    this.init_player_info();
    //调试
    $("#btn-speedup").click(function(){
        main.display_loop();
    });
}
Main.prototype.rundata = {};
Main.prototype.Fight = function(){
    //准备界面
    $(".opponent-list").html("");
    Display.Div.html("");
    this.init_player_info();
    //初始化数据
    this.resetRunData(); //TODO 正式版的调用时间应该在初始化完成后
    //统计战斗次数
    this.battle_times ++;
    $(".player-info.battle .content").html(this.battle_times);
    //战斗开始

    this.fight_loop(this.p1,this.p2);
    if(!this.display_looping){
        this.display_looping = true;
        this.display_loop();
    }

}

Main.prototype.fight_loop = function(p1,p2){
    var res,action_type,success_rate;
    var acitve,passive;
    var battle = new Battle(this.bk_rand);
    while(true){
        res = battle.generateActionList(p1,p2,this.rundata);
        if(res){
            this.rundata.p1_now_action_index++;
            acitve = p1;
            passive = p2;
        }
        else {
            this.rundata.p2_now_action_index++;
            acitve = p2;
            passive = p1;
        }
        battle.generateAction(acitve, passive);
        if(p1.hp==0){
            console.log("p2获胜")
            new ToDisplay(p1 , null, eDisplayType.Dead);
            new ToDisplay(p2, null, eDisplayType.Win);
            break;
        }else if(p2.hp==0){
            console.log("p1获胜")
            new ToDisplay(p2 , null, eDisplayType.Dead);
            new ToDisplay(p1, null, eDisplayType.Win);
            break;
        }
    }
}
Main.prototype.display_loop = function(){
    var now_display = this.rundata.display_list[this.rundata.display_index];
    if(now_display){
        now_display.display();
        this.rundata.display_index++;
    }
    else
        setTimeout(this.display_loop,500);
}
Main.prototype.btn_get_opponents = function(){
    var opponents;
    //请求数据
    var pattern = {
        name:"刘怪斯",
        code: 1
    }
    opponents = [{name:"刘怪斯1",code:1}
                ,{name:"刘怪斯2",code:2}
                ,{name:"刘怪斯3",code:3}
                ,{name:"刘怪斯4",code:4}
                ,{name:"刘怪斯5",code:5}
                ,{name:"刘怪斯6",code:6}
                ,{name:"刘怪斯7",code:7}
                ,{name:"刘怪斯8",code:8}
                ,{name:"刘怪斯9",code:9}
                ,{name:"刘怪斯10",code:10}
                ,{name:"刘怪斯11",code:11}
                ,{name:"刘怪斯12",code:12}
                ,{name:"刘怪斯1",code:1}
                ,{name:"刘怪斯2",code:2}
                ,{name:"刘怪斯3",code:3}
                ,{name:"刘怪斯4",code:4}
                ,{name:"刘怪斯5",code:5}
                ,{name:"刘怪斯6",code:6}
                ,{name:"刘怪斯7",code:7}
                ,{name:"刘怪斯8",code:8}
                ,{name:"刘怪斯9",code:9}
                ,{name:"刘怪斯10",code:10}
                ,{name:"刘怪斯11",code:11}
                ,{name:"刘怪斯12",code:12}];
    list_opponents(opponents);
}
Main.prototype.list_opponents = function(opponents){
    $(".opponent-list").html("");
    for (var i = 0; i < opponents.length; i++) {
        $(".opponent-list").append(Display.ToElem("div",Display.ToElem("button",opponents[i].name),"item"));
        var last = $(".opponent-list .item").last();
        last.data("data",opponents[i]);
        last.click(function(){
            select_opponents(this);
        })
    }
}
Main.prototype.select_opponents = function(obj){
    $(".info-grid.name .content.hero-target").data("data",$(obj).data("data"))
        .val($(obj).data("data").name);
    $("#name-player2").data("data",$(obj).data("data"))
        .val($(obj).data("data").name);
    init_player_info();
    //$("#name-player2").obj = ;
}

//换人的时候也要增加
Main.prototype.ResetToFirstBattle = function(){
    //界面记录
    this.resetBattleLog();
    //随机数种子
    this.bk_rand = new BkRand(this.p1_wallet.hash, this.p2_wallet.hash);
}
//重置战斗统计
Main.prototype.resetBattleLog = function(){
    //对战次数
    this.battle_times = 0;
    $(".player-info.battle .content").html(this.battle_times);
}
Main.prototype.init_player_info = function (){
    this.p1 = new Hero(this.p1_wallet.hash, "hero-me", this.p1_wallet.name, this.bk_rand);
    this.p2 = new Hero(this.p2_wallet.hash, "hero-target", this.p2_wallet.name, this.bk_rand);
}
Main.prototype.resetRunData = function(){
    this.rundata.p1_action_list = this.p1_action_list.concat();
    this.rundata.p1_now_action_index = this.p1_now_action_index;
    this.rundata.p2_action_list = this.p2_action_list.concat();
    this.rundata.p2_now_action_index = this.p2_now_action_index;
    this.rundata.display_index = this.display_index;
    this.rundata.display_list = this.display_list.concat();
}