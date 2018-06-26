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
Battle.generateActionTime = function(player, arr, index){
	return (arr[index-1]||0) + player.spd + BkRand.GetOrder();
}

Battle.generateAction = function(player, opponent){
	this.analyzeAction(player,opponent, Math.floor(BkRand.GetOperation() * eActionType.Max));
}
Battle.analyzeAction = function(player, opponent, action_type){
	var action;
	switch(action_type){
		case eActionType.Punch:
			action = this.ActionPunch;
		break;
		default:
			action = this.ActionPunch;
		break;
	}
	action(player,opponent);
}
var eActionType = {
	Punch : 0,
	Max : 1,
};
var eReactionType = {
	None : 0,
	Defend : 1,
	Dodge : 2,
	Counter : 3,
	Max : 4,
};
Battle.ActionPunch = function(player,opponent){
	new ToDisplay(player, opponent, eDisplayType.Punch);
	var dam = player.atk * (0.5 + BkRand.GetIntensity());
	dam = Math.floor(dam);
	//反击判断
	var react = Battle.PunchReact(opponent,player);
	switch(react){
		case eReactionType.None:
			dam -= 0.1 * opponent.def;
			break;
		case eReactionType.Defend:
			dam -= 0.5 * opponent.def;
			break;
		case eReactionType.Dodge:
			dam = 0;
			break;
		case eReactionType.Counter:
			dam = 0;
			break;
		default:
			break;
	}
	if(dam>0){
		dam = Math.floor(dam);
		opponent.OnDamage(dam);
	    new ToDisplay(player, opponent, eDisplayType.Damage, dam, opponent.hp);
	}
}

Battle.PunchReact = function(player,opponent){
	//正中，防御，闪避，反击
	var ram = BkRand.GetOperation()*100 * (player.skl/opponent.skl);
	//技巧使后几种操作概率提升
	if (ram<50) {
		ram = eReactionType.None;
	}else if(ram < 75){
		ram = eReactionType.Defend;
		new ToDisplay(player, opponent, eDisplayType.Defend, dam);
	}else if(ram < 95){
		ram = eReactionType.Dodge;
		new ToDisplay(player, opponent, eDisplayType.Dodge, dam);
	}else{
		//反击
		ram = eReactionType.Counter;
		var dam = player.atk * (0.5 + BkRand.GetIntensity());
		dam = Math.floor(dam);
		opponent.OnDamage(dam);
		new ToDisplay(player, opponent, eDisplayType.Counter, dam);
		new ToDisplay(player, opponent, eDisplayType.Damage, dam, opponent.hp);
	}

	return ram;
}