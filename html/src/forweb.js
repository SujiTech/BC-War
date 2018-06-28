//获取n次战斗中是否有战胜的情况
function getResult(fight_times,hash_p1,hash_p2){
    gl.battle_times = 0;
    resetRandomSeed(hash_p1,hash_p2);
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





// random.js
var BkRand = {};
//行动顺序乱数
BkRand.OrderCode = {
    seed:39
};
BkRand.OrderCodeIndex = 0;
BkRand.GetOrder = function(max){
    return this.seededRandom(this.OrderCode,max);
}


//行动类型乱数
BkRand.OperationCode = {
    seed:55
};
BkRand.OperationCodeIndex = 0;
BkRand.GetOperation = function(max){
    return this.seededRandom(this.OperationCode,max);
}


//成败判定乱数
BkRand.TechniqueCode = {
    seed:77
};
BkRand.TechniqueCodeIndex = 0;
BkRand.GetTechnique = function(max){
    return this.seededRandom(this.TechniqueCode,max);
}


//行动力度 乱数
BkRand.IntensityCode = {
    seed:66
};
BkRand.IntensityCodeIndex = 0;
BkRand.GetIntensity = function(max){
return this.seededRandom(this.IntensityCode,max);
}



BkRand.seededRandom = function(code, max, min) {
    max = max || 1; min = min || 0;
    code.seed = (code.seed * 9301 + 49297) % 233280;
    var rnd = code.seed / 233280.0;
    return min + rnd * (max - min); 
}
// for (var i= 0; i<10; i++) { document.writeln(Math.seededRandom() +"<br />"); }



//main.js
function init(){
    //console.log(getResult(3,151251234,62345132412));
}
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
var Fight = function(){
}

function fight_loop(){
}
function display_loop(){
}
function btn_get_opponents(){
}
function list_opponents(opponents){
}
function select_opponents(obj){
}


function ResetToFirstBattle(){
    //界面记录
    resetBattleLog();
    //随机数种子
    resetRandomSeed();
}
//重置战斗统计
function resetBattleLog(){
    //对战次数
    gl.battle_times = 0;
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
//选择敌人后调用
var resetRandomSeed = function(hash_p1,hash_p2){
    BkRand.OrderCode = {
        seed:hash_p1+hash_p2
    };
    BkRand.OperationCode = {
        seed:hash_p1-hash_p2
    };
    BkRand.TechniqueCode = {
        seed:hash_p1*hash_p2
    };
    BkRand.IntensityCode = {
        seed:hash_p1/hash_p2
    };
}

//battle.js
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
    var dam = player.atk * (0.5 + BkRand.GetIntensity());
    this.NormalAttack(player, opponent, dam, false);
}
//组合拳 少说打3下，后续最多再3下
Battle.ActionPunchCombo = function(player, opponent){
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
        }
        dam = Math.floor(dam);
    }
    dam = Math.floor(dam);
    opponent.OnDamage(dam);
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
    }else if(ram < 95){
        ram = eReactionType.Dodge;
    }else{
        //反击
        ram = eReactionType.Counter;
        var dam = player.atk * (0.5 + BkRand.GetIntensity());
        dam = Math.floor(dam);
        opponent.OnDamage(dam);
    }

    return ram;
}

Battle.CriticalHitRate = 70;//基础暴击率 30%


//hero.js
function Hero(hashcode1,tag,hashcode2){
    this.hp  = 0;   //生命值（初版为耗尽死亡
    this.ap  = 0;   //怒气值 决定特殊攻击使用（初版为纯娱乐效果
    this.atk = 0;   //伤害值
    this.def = 0;   //伤害抵扣（容错率）
    this.luk = 0;
    this.spd = 0;   //行动次序
    this.skl = 0;


    this.name = hashcode1;
    //存储数据，避免运算时修改
    this.data = {};
    this.data.tag = tag;

    this.seed = hashcode1;
    this.init();
}
Hero.prototype.init = function(){
    this.data.hp  = Math.round(BkRand.seededRandom(this,750,1000));
    this.data.ap  = 0;
    this.data.atk = Math.round(BkRand.seededRandom(this,39,100));
    this.data.def = Math.round(BkRand.seededRandom(this,39,100));
    this.data.luk = Math.round(BkRand.seededRandom(this,39,100));
    this.data.spd = Math.round(BkRand.seededRandom(this,39,100));
    this.data.skl = Math.round(BkRand.seededRandom(this,39,100));
    
    console.log("hp:"+this.data.hp+"-"+
                "ap:"+this.data.ap+"-"+
                "atk:"+this.data.atk+"-"+
                "def:"+this.data.def+"-"+
                "luk:"+this.data.luk+"-"+
                "spd:"+this.data.spd+"-"+
                "skl:"+this.data.skl)
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
}
//静态成员变量
Hero.prototype.id = 0;
Hero.prototype.OnDamage = function(dam){
    this.hp -= dam;

    if(this.hp < 0){
        this.hp = 0;
    }
    console.log(this.data.tag + "受到伤害" + dam + " hp-remain : " + this.hp);
}