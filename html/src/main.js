function init(){
    $("#btn-challenge").click(Fight);
    $("#btn-get-opponents").click(btn_get_opponents);
    $(".temp-input input").bind('keypress',function(event){
            if(event.keyCode == "13"){
                console.log("功能重做中");
                //ResetToFirstBattle();Fight();
            }
        });
    //$("#btn-get-opponents").dblclick(dbclk_opponents);
    Display.Div = $(".battle-log .content");
    //战斗数据
    ResetToFirstBattle()
    init_player_info(gl,rundata);
    //调试
    $("#btn-speedup").click(display_loop);
}
var gl = {
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
var rundata = {};
var Fight = function(){
    //准备界面
    $(".opponent-list").html("");
    Display.Div.html("");
    init_player_info(gl,rundata);
    //初始化数据
    resetRunData(gl,rundata); //TODO 正式版的调用时间应该在初始化完成后
    //统计战斗次数
    gl.battle_times ++;
    $(".player-info.battle .content").html(gl.battle_times);
    //战斗开始

    fight_loop(gl.p1,gl.p2,rundata);
    if(!gl.display_looping){
        gl.display_looping = true;
        display_loop();
    }

}

function fight_loop(p1,p2,rundata){
    var res,action_type,success_rate;
    var acitve,passive;
    var battle = new Battle(gl.bk_rand);
    while(true){
        res = battle.generateActionList(p1,p2,rundata);
        if(res){
            rundata.p1_now_action_index++;
            acitve = p1;
            passive = p2;
        }
        else {
            rundata.p2_now_action_index++;
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
function display_loop(){
    var now_display = rundata.display_list[rundata.display_index];
    if(now_display){
        now_display.display();
        rundata.display_index++;
    }
    else
        setTimeout(display_loop,500);
}
function btn_get_opponents(){
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
function list_opponents(opponents){
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
function select_opponents(obj){
    $(".info-grid.name .content.hero-target").data("data",$(obj).data("data"))
        .val($(obj).data("data").name);
    $("#name-player2").data("data",$(obj).data("data"))
        .val($(obj).data("data").name);
    init_player_info(gl,rundata);
    //$("#name-player2").obj = ;
}

//换人的时候也要增加
function ResetToFirstBattle(){
    //界面记录
    resetBattleLog();
    //随机数种子
    gl.bk_rand = new BkRand(gl.p1_wallet.hash, gl.p2_wallet.hash);
}
//重置战斗统计
function resetBattleLog(){
    //对战次数
    gl.battle_times = 0;
    $(".player-info.battle .content").html(gl.battle_times);
}
function init_player_info (gl,rundata){
    gl.p1 = new Hero(gl.p1_wallet.hash, "hero-me", gl.p1_wallet.name, gl.bk_rand);
    gl.p2 = new Hero(gl.p2_wallet.hash, "hero-target", gl.p2_wallet.name, gl.bk_rand);
}
var resetRunData = function(gl,rundata){
    rundata.p1_action_list = gl.p1_action_list.concat();
    rundata.p1_now_action_index = gl.p1_now_action_index;
    rundata.p2_action_list = gl.p2_action_list.concat();
    rundata.p2_now_action_index = gl.p2_now_action_index;
    rundata.display_index = gl.display_index;
    rundata.display_list = gl.display_list.concat();
}