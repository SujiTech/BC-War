function init(){
    
    // var arr = [];
    // arr[1] = 1;

    // console.log(arr[0]);
    // console.log(arr[1]);
    // console.log(arr[10]);
    // console.log(arr.length);
    $("#btn-challenge").click(Fight);
    $("#btn-get-opponents").click(btn_get_opponents);
    $(".temp-input input").bind('keypress',function(event){
            if(event.keyCode == "13")Fight();
        });
    //$("#btn-get-opponents").dblclick(dbclk_opponents);
    Display.Div = $(".battle-log .content");
    resetBattleLog();
    init_player_info();
    //调试
    $("#btn-speedup").click(display_loop);
}
var gl = {
    p1 : null,
    p2 : null,
    p1_action_list : [],
    p1_now_action_index : 0,
    p2_action_list : [],
    p2_now_action_index : 0,
    display_index : 0,
    display_list : [],
    display_looping : false,
}
var rundata = {};
var resetRunData = function(){
    rundata.p1_action_list = gl.p1_action_list.concat();
    rundata.p1_now_action_index = gl.p1_now_action_index;
    rundata.p2_action_list = gl.p2_action_list.concat();
    rundata.p2_now_action_index = gl.p2_now_action_index;
    rundata.display_index = gl.display_index;
    rundata.display_list = gl.display_list.concat();
}
//选择敌人后调用
var resetRandomSeed = function(){
    BkRand.OrderCode = {
        seed:39
    };
    BkRand.OperationCode = {
        seed:55
    };
    BkRand.TechniqueCode = {
        seed:77
    };
    BkRand.IntensityCode = {
        seed:66
    };
}
//重置战斗统计
var resetBattleLog = function(){
    //对战次数
    $(".player-info.battle .content").html(0);
}
function init_player_info (){
    gl.p1 = new Hero($("#name-player1").val(),"hero-me");
    gl.p2 = new Hero($("#name-player2").val(),"hero-target");
}
var Fight = function(){
    $(".opponent-list").html("");
    Display.Div.html("");
    resetRunData(); //TODO 正式版的调用时间应该在初始化完成后
    init_player_info();
    fight_loop();
    if(!gl.display_looping){
        gl.display_looping = true;
        display_loop();
    }

}

function fight_loop(){
    var res,action_type,success_rate;
    var acitve,passive;
    while(true){
        res = Battle.generateActionList();
        if(res){
            rundata.p1_now_action_index++;
            acitve = gl.p1;
            passive = gl.p2;
        }
        else {
            rundata.p2_now_action_index++;
            acitve = gl.p2;
            passive = gl.p1;
        }
        Battle.generateAction(acitve, passive);
        if(gl.p1.hp==0){
            console.log("p2获胜")
            new ToDisplay(gl.p1 , null, eDisplayType.Dead);
            new ToDisplay(gl.p2, null, eDisplayType.Win);
            break;
        }else if(gl.p2.hp==0){
            console.log("p1获胜")
            new ToDisplay(gl.p2 , null, eDisplayType.Dead);
            new ToDisplay(gl.p1, null, eDisplayType.Win);
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
    init_player_info();
    //$("#name-player2").obj = ;
}