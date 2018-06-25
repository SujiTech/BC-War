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


    var res = Battle.generateActionList();
    console.log(res);
    console.log(rundata.p1_action_list[rundata.p1_now_action_index]);
    console.log(rundata.p2_action_list[rundata.p2_now_action_index]);
    if(res)
        rundata.p1_now_action_index++;
    else 
        rundata.p2_now_action_index++;
    res = Battle.generateActionList();
    console.log(res);
    console.log(rundata.p1_action_list[rundata.p1_now_action_index]);
    console.log(rundata.p2_action_list[rundata.p2_now_action_index]);
    if(res)
        rundata.p1_now_action_index++;
    else 
        rundata.p2_now_action_index++;
    res = Battle.generateActionList();
    console.log(res);
    console.log(rundata.p1_action_list[rundata.p1_now_action_index]);
    console.log(rundata.p2_action_list[rundata.p2_now_action_index]);
    if(res)
        rundata.p1_now_action_index++;
    else 
        rundata.p2_now_action_index++;
    res = Battle.generateActionList();
    console.log(res);
    console.log(rundata.p1_action_list[rundata.p1_now_action_index]);
    console.log(rundata.p2_action_list[rundata.p2_now_action_index]);
    if(res)
        rundata.p1_now_action_index++;
    else 
        rundata.p2_now_action_index++;

    console.log(res);
    console.log(rundata.p1_action_list[rundata.p1_now_action_index]);
    console.log(rundata.p2_action_list[rundata.p2_now_action_index]);
}

