//获取n次战斗中是否有战胜的情况
function getResult(fight_times){
    gl.battle_times = 0;
    for (var i = 0; i < fight_times; i++) {
        init_player_info();
        resetRunData();
        //统计战斗次数
        gl.battle_times ++;
        var res = web_fight_loop();
        if(res)
            return true;
    }
    return false;
}
function web_fight_loop(){
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
            break;
        }else if(gl.p2.hp==0){
            return true;
        }
    }
}