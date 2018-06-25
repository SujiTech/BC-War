function init(){
    
    // var arr = [];
    // arr[1] = 1;

    // console.log(arr[0]);
    // console.log(arr[1]);
    // console.log(arr[10]);
    // console.log(arr.length);
    $("#btn-challenge").click(Fight);
}
var gl = {
    p1 : null,
    p2 : null,
    p1_action_list : [],
    p1_now_action_index : 0,
    p2_action_list : [],
    p2_now_action_index : 0,
}
var rundata = {};
var resetRunData = function(){
    rundata.p1_action_list = gl.p1_action_list.concat();
    rundata.p1_now_action_index = gl.p1_now_action_index;
    rundata.p2_action_list = gl.p2_action_list.concat();
    rundata.p2_now_action_index = gl.p2_now_action_index;
}
var Fight = function(){
    // var str = "<p>郭敬明跳起来一下打在姚明膝盖上</p>";
    // for (var i = 0; i < 6; i++) {
    //     str += str;
    // }
    // $(".battle-log .content").html(str);
    // console.log($("#name-player1").val());
    // console.log($("#name-player2").val());
    gl.p1 = new Hero($("#name-player1").val(),1);
    gl.p2 = new Hero($("#name-player2").val(),2);
    resetRunData(); //TODO 正式版的调用时间应该在初始化完成后

    fight_loop();
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
            break;
        }else if(gl.p2.hp==0){
            console.log("p1获胜")
            break;
        }
    }
}