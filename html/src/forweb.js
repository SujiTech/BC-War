//获取n次战斗中是否有战胜的情况
function getResult(fight_times,hash_p1,hash_p2){
    gl.battle_times = 0;
    for (var i = 0; i < fight_times; i++) {
        init_player_info(hash_p1,hash_p2);
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
            console.log("p1-lose")
            break;
        }else if(gl.p2.hp==0){
            console.log("p2-lose")
            return true;
        }
    }
}
//main.js
var gl = {
    p1 : null,
    p2 : null,
    battle_times : 0,
    p1_action_list : [],
    p1_now_action_index : 0,
    p2_action_list : [],
    p2_now_action_index : 0,
    display_index : 0,
    display_list : [],
    display_looping : false,
}
var rundata = {};

function ResetToFirstBattle(){
    //界面记录
    resetBattleLog();
}
function init_player_info (hash_p1,hash_p2){
    gl.p1 = new Hero(hash_p1,"hero-me");
    gl.p2 = new Hero(hash_p2,"hero-target");
    
}
var resetRunData = function(){
    rundata.p1_action_list = gl.p1_action_list.concat();
    rundata.p1_now_action_index = gl.p1_now_action_index;
    rundata.p2_action_list = gl.p2_action_list.concat();
    rundata.p2_now_action_index = gl.p2_now_action_index;
    rundata.display_index = gl.display_index;
    rundata.display_list = gl.display_list.concat();
}

// random.js
function BkRand (hash1, hash2){
    this.OrderCode =     {seed:hash1 + hash2};
    this.OperationCode = {seed:hash1 - hash2};
    this.TechniqueCode = {seed:hash1 * hash2};
    this.IntensityCode = {seed:hash1 / hash2};
}
//行动顺序乱数
BkRand.prototype.OrderCodeIndex = 0;
BkRand.prototype.GetOrder = function(max){
    return this.seededRandom(this.OrderCode,max);
}


//行动类型乱数
BkRand.prototype.OperationCodeIndex = 0;
BkRand.prototype.GetOperation = function(max){
    return this.seededRandom(this.OperationCode,max);
}


//成败判定乱数
BkRand.prototype.TechniqueCodeIndex = 0;
BkRand.prototype.GetTechnique = function(max){
    return this.seededRandom(this.TechniqueCode,max);
}


//行动力度 乱数
BkRand.prototype.IntensityCodeIndex = 0;
BkRand.prototype.GetIntensity = function(max){
return this.seededRandom(this.IntensityCode,max);
}



BkRand.prototype.seededRandom = function(code, max, min) {
    max = max || 1; min = min || 0;
    code.seed = (code.seed * 9301 + 49297) % 233280;
    var rnd = code.seed / 233280.0;
    return min + rnd * (max - min); 
}
// for (var i= 0; i<10; i++) { document.writeln(Math.seededRandom() +"<br />"); }




//battle.js
function Battle (_bk_rand){
    this.bk_rand = _bk_rand;
}
Battle.prototype.generateActionList = function(p1, p2, rundata){
    //双方生成的最后一个行动时间相近
    //当某一方的下一个行动时间大于另一方的最后一项
    var p1time = rundata.p1_action_list[rundata.p1_now_action_index];
    var p2time = rundata.p2_action_list[rundata.p2_now_action_index];

    if(p1time==null){
        p1time = this.generateActionTime(p1, rundata.p1_action_list, rundata.p1_now_action_index);
        rundata.p1_action_list[rundata.p1_now_action_index] = p1time;
    }
    if(p2time==null){
        p2time = this.generateActionTime(p2, rundata.p2_action_list, rundata.p2_now_action_index);
        rundata.p2_action_list[rundata.p2_now_action_index] = p2time;
    }

    return p1time<=p2time;
}
Battle.prototype.generateActionTime = function(player, arr, index){
    return (arr[index-1]||0) + player.spd + this.bk_rand.GetOrder();
}

Battle.prototype.generateAction = function(player, opponent){
    this.analyzeAction(player,opponent, Math.floor(this.bk_rand.GetOperation() * eActionType.Max));
}
Battle.prototype.analyzeAction = function(player, opponent, action_type){
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
    var rate = this.bk_rand.GetTechnique(100);
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
Battle.prototype.ActionPunch = function(player,opponent){
    new ToDisplay(player, opponent, eDisplayType.Punch);
    var dam = player.atk * (0.5 + this.bk_rand.GetIntensity());
    this.NormalAttack(player, opponent, dam, false);
}
//组合拳 少说打3下，后续最多再3下
Battle.prototype.ActionPunchCombo = function(player, opponent){
    new ToDisplay(player, opponent, eDisplayType.PunchCombo, null, null, true);
    var remain_qi = 600;
    var is_continue = true;
    while(remain_qi>0){
        is_continue = this.NormalAttack(
            player
            ,opponent
            ,0.5 * player.atk * (0.5 + this.bk_rand.GetIntensity())
            ,true
            );
        if(!is_continue)break;
        remain_qi -= 100 + this.bk_rand.GetTechnique(100)*(opponent.skl/player.skl);
    }
}
Battle.prototype.NormalAttack = function(player, opponent, dam, isCombo){
    //反击判断
    var react = this.PunchReact(opponent,player,isCombo);
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
        var cri = this.bk_rand.GetTechnique(100);
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
Battle.prototype.PunchReact = function(player,opponent,isCombo){
    //正中，防御，闪避，反击
    var ram = this.bk_rand.GetOperation()*100 + 20 * (player.skl/opponent.skl - 1);
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
        var dam = player.atk * (0.5 + this.bk_rand.GetIntensity());
        dam = Math.floor(dam);
        opponent.OnDamage(dam);
        new ToDisplay(player, opponent, eDisplayType.Counter, dam , null, isCombo);
        new ToDisplay(player, opponent, eDisplayType.Damage, dam, opponent.hp, isCombo);
    }

    return ram;
}

Battle.prototype.CriticalHitRate = 70;//基础暴击率 30%


//hero.js
function Hero(hashcode1,tag,name,_bkRand){
    this.hp  = 0;   //生命值（初版为耗尽死亡
    this.ap  = 0;   //怒气值 决定特殊攻击使用（初版为纯娱乐效果
    this.atk = 0;   //伤害值
    this.def = 0;   //伤害抵扣（容错率）
    this.luk = 0;
    this.spd = 0;   //行动次序
    this.skl = 0;


    this.name = name;
    //存储数据，避免运算时修改
    this.data = {};
    this.data.tag = tag;

    this.seed = hashcode1;
    this.init(_bkRand);
}
Hero.prototype.init = function(_bkRand){
    this.data.hp  = Math.round(_bkRand.seededRandom(this,750,1000));
    this.data.ap  = 0;
    this.data.atk = Math.round(_bkRand.seededRandom(this,39,100));
    this.data.def = Math.round(_bkRand.seededRandom(this,39,100));
    this.data.luk = Math.round(_bkRand.seededRandom(this,39,100));
    this.data.spd = Math.round(_bkRand.seededRandom(this,39,100));
    this.data.skl = Math.round(_bkRand.seededRandom(this,39,100));
    this.readAttri();
}
Hero.prototype.readAttri = function() {
    this.hp = this.data.hp;
    this.ap = 0;
    this.atk = this.data.atk;
    this.def = this.data.def;
    this.luk = this.data.luk;
    this.spd = this.data.spd;
    this.skl = this.data.skl;
    var target_tag = ".content."+this.data.tag;
    $(".name "+target_tag).html("<p>"+this.name+'</p>');
    $(".hp "+target_tag).html("<p>"+this.hp+'</p>');
    $(".atk "+target_tag).html("<p>"+this.atk+'</p>');
    $(".def "+target_tag).html("<p>"+this.def+'</p>');
    $(".luk "+target_tag).html("<p>"+this.luk+'</p>');
    $(".spd "+target_tag).html("<p>"+this.spd+'</p>');
    $(".skl "+target_tag).html("<p>"+this.skl+'</p>');
    //初始化血条显示
    Display.HPBarQ(this.data.tag, this.hp, this.data.hp);
}
//静态成员变量
Hero.prototype.id = 0;
Hero.prototype.OnDamage = function(dam){
    this.hp -= dam;
    if(this.hp < 0){
        this.hp = 0;
    }
    console.log(this.name + "收到伤害" + dam + "点");
}
Hero.prototype.getName = function(){
    return Display.ToSpan("【"+this.name+"】", this.data.tag+" name");
}