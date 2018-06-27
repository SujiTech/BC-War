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
		case eActionType.PunchCombo:
			action = this.ActionPunchCombo;
		break;
		default:
			action = this.ActionPunch;
		break;
	}
	var rate = BkRand.GetTechnique(100);
	if(rate<70)
		action = this.ActionPunch;
	action.call(this,player,opponent);
}
var eActionType = {
	Punch : 0,
	PunchCombo : 1,
	Max : 2,
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
	this.NormalAttack(player, opponent, dam, false);
}
//组合拳 少说打3下，后续最多再3下
Battle.ActionPunchCombo = function(player, opponent){
	new ToDisplay(player, opponent, eDisplayType.PunchCombo, null, null, true);
	var remain_qi = 600;
	var is_continue = true;
	while(remain_qi>0){
		is_continue = this.NormalAttack(
			player
			,opponent
			,0.5 * player.atk * (0.5 + BkRand.GetIntensity())
			,true
			);
		if(!is_continue)break;
		remain_qi -= 100 + BkRand.GetTechnique(100)*(opponent.skl/player.skl);
	}
}
Battle.NormalAttack = function(player, opponent, dam, isCombo){
	//反击判断
	var react = Battle.PunchReact(opponent,player,isCombo);
	switch(react){
		case eReactionType.None:
			dam -= 0.1 * opponent.def;
			break;
		case eReactionType.Defend:
			dam -= 0.5 * opponent.def;
			break;
		case eReactionType.Dodge:
			dam = 0;
			return false;
		case eReactionType.Counter:
			dam = 0;
			return false;
		default:
			break;
	}
	if(dam<=0)
		dam = 0;
	else{
		//暴击判断
		var cri = BkRand.GetTechnique(100);
		if(cri > this.CriticalHitRate - 20 * (player.luk / opponent.luk - 1)){
			dam *= 2;
			new ToDisplay(player, opponent, eDisplayType.CriticalHit, dam, opponent.hp, isCombo);
		}
		dam = Math.floor(dam);
	}
	dam = Math.floor(dam);
	opponent.OnDamage(dam);
    new ToDisplay(player, opponent, eDisplayType.Damage, dam, opponent.hp, isCombo);
    return true;
}
Battle.PunchReact = function(player,opponent,isCombo){
	//正中，防御，闪避，反击
	var ram = BkRand.GetOperation()*100 + 20 * (player.skl/opponent.skl - 1);
	//技巧使后几种操作概率提升
	if (ram<50) {
		ram = eReactionType.None;
	}else if(ram < 75){
		ram = eReactionType.Defend;
		new ToDisplay(player, opponent, eDisplayType.Defend, dam, null, isCombo);
	}else if(ram < 95){
		ram = eReactionType.Dodge;
		new ToDisplay(player, opponent, eDisplayType.Dodge, dam, null, isCombo);
	}else{
		//反击
		ram = eReactionType.Counter;
		var dam = player.atk * (0.5 + BkRand.GetIntensity());
		dam = Math.floor(dam);
		opponent.OnDamage(dam);
		new ToDisplay(player, opponent, eDisplayType.Counter, dam , null, isCombo);
		new ToDisplay(player, opponent, eDisplayType.Damage, dam, opponent.hp, isCombo);
	}

	return ram;
}

Battle.CriticalHitRate = 70;//基础暴击率 30%