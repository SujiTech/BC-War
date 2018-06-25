var Battle = {};
Battle.generateActionList = function(){
	//双方生成的最后一个行动时间相近
	//当某一方的下一个行动时间大于另一方的最后一项
	var p1time = rundata.p1_action_list[rundata.p1_now_action_index];
	var p2time = rundata.p2_action_list[rundata.p2_now_action_index];

	if(p1time==null){
		p1time = Battle.generateActionTime(gl.p1, rundata.p1_action_list, rundata.p1_now_action_index);
		rundata.p1_action_list[rundata.p1_now_action_index] = p1time;
	}
	if(p2time==null){
		p2time = Battle.generateActionTime(gl.p2, rundata.p2_action_list, rundata.p2_now_action_index);
		rundata.p2_action_list[rundata.p2_now_action_index] = p2time;
	}

	return p1time<=p2time;
}
Battle.generateActionTime = function(player,arr,index){
	return (arr[index-1]||0) + player.spd + BkRand.GetOrder();
}