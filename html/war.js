'use strict';

//main.js
function Main(){}
Main.prototype = {
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
Main.prototype.toASCII = function(str){
    var code = "";
    var usernameMi = "";
   for(var i=str.length-1;i>=0;i--){
        code = str.charCodeAt(i);
        usernameMi+=code;
   }
   return usernameMi;
}
Main.prototype.init = function(){
    var main = this;
    //战斗数据
    this.ResetToFirstBattle()
    this.init_player_info();
}
Main.prototype.rundata = {};
Main.prototype.Fight = function(){
    //准备界面
    this.init_player_info();
    //初始化数据
    this.resetRunData(); //TODO 正式版的调用时间应该在初始化完成后
    //统计战斗次数
    this.battle_times ++;
    //战斗开始

    this.fight_loop(this.p1,this.p2);
    if(!this.display_looping){
        this.display_looping = true;
        this.display_loop();
    }

}

Main.prototype.fight_loop = function(p1,p2){
    var res,action_type,success_rate;
    var acitve,passive;
    var battle = new Battle(this.bk_rand);
    while(true){
        res = battle.generateActionList(p1,p2,this.rundata);
        if(res){
            this.rundata.p1_now_action_index++;
            acitve = p1;
            passive = p2;
        }
        else {
            this.rundata.p2_now_action_index++;
            acitve = p2;
            passive = p1;
        }
        battle.generateAction(acitve, passive);
        if(p1.hp==0){
            //console.log("p2获胜")
            break;
        }else if(p2.hp==0){
            //console.log("p1获胜")
            break;
        }
    }
}

//换人的时候也要增加
Main.prototype.ResetToFirstBattle = function(){
    //随机数种子
    this.bk_rand = new BkRand(this.p1_wallet.hash, this.p2_wallet.hash);
}

Main.prototype.init_player_info = function (){
    this.p1 = new Hero(this.p1_wallet.hash, "hero-me", this.p1_wallet.name, this.bk_rand);
    this.p2 = new Hero(this.p2_wallet.hash, "hero-target", this.p2_wallet.name, this.bk_rand);
}
Main.prototype.resetRunData = function(){
    this.rundata.p1_action_list = this.p1_action_list.concat();
    this.rundata.p1_now_action_index = this.p1_now_action_index;
    this.rundata.p2_action_list = this.p2_action_list.concat();
    this.rundata.p2_now_action_index = this.p2_now_action_index;
    this.rundata.display_index = this.display_index;
    this.rundata.display_list = this.display_list.concat();
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
    var dam = player.atk * (0.5 + this.bk_rand.GetIntensity());
    this.NormalAttack(player, opponent, dam, false);
}
//组合拳 少说打3下，后续最多再3下
Battle.prototype.ActionPunchCombo = function(player, opponent){
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
        }
        dam = Math.floor(dam);
    }
    dam = Math.floor(dam);
    opponent.OnDamage(dam);
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
    }else if(ram < 95){
        ram = eReactionType.Dodge;
    }else{
        //反击
        ram = eReactionType.Counter;
        var dam = player.atk * (0.5 + this.bk_rand.GetIntensity());
        dam = Math.floor(dam);
        opponent.OnDamage(dam);
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
}
//静态成员变量
Hero.prototype.id = 0;
Hero.prototype.OnDamage = function(dam){
    this.hp -= dam;
    if(this.hp < 0){
        this.hp = 0;
    }
    //console.log(this.name + "收到伤害" + dam + "点");
}
Hero.prototype.getName = function(){
    return Display.ToSpan("【"+this.name+"】", this.data.tag+" name");
}


//获取n次战斗中是否有战胜的情况
Main.prototype.getResult = function(fight_times,hash_p1,hash_p2){
    this.ResetToFirstBattle();
    this.battle_times = 0;
    this.p1_wallet.hash = hash_p1;
    this.p2_wallet.hash = hash_p2;
    for (var i = 0; i < fight_times; i++) {
        this.init_player_info();
        this.resetRunData();
        //统计战斗次数
        this.battle_times ++;
        var res = this.web_fight_loop();
        if(res)
            return true;
    }
    return false;
}
Main.prototype.web_fight_loop = function(){
    var res,action_type,success_rate;
    var acitve,passive;
    var battle = new Battle(this.bk_rand);
    while(true){
        res = battle.generateActionList(this.p1,this.p2,this.rundata);
        if(res){
            this.rundata.p1_now_action_index++;
            acitve = this.p1;
            passive = this.p2;
        }
        else {
            this.rundata.p2_now_action_index++;
            acitve = this.p2;
            passive = this.p1;
        }
        battle.generateAction(acitve, passive);
        if(this.p1.hp==0){
            //console.log("p1-lose")
            break;
        }else if(this.p2.hp==0){
            //console.log("p2-lose")
            return true;
        }
    }

}

var war = function () {

    //address => id name created
    LocalContractStorage.defineMapProperty(this, "users");
    //int
    LocalContractStorage.defineProperty(this, "userCount");
    //address
    LocalContractStorage.defineProperty(this, "winner");
}
war.prototype = {
    init: function () {
        this.userCount = 1;
        this.winner = "n1F4T7MazfSXHgdE9APLvnjeaZRLHFugopE";
        this.users.set("n1F4T7MazfSXHgdE9APLvnjeaZRLHFugopE", {
            id: 0,
            name: "刘怪斯14",
            created: 0
        })
    },

    setUser: function (info) {
        var fromUser = Blockchain.transaction.from,
            ts = Blockchain.transaction.timestamp;

        info.name = info.name.trim();

        var user = this.users.get(fromUser);

        if (!user) {
            user = {
                id: this.userCount,
                name: info.name,
                created: ts
            };
            this.userCount += 1;
        }

        this.users.set(fromUser, user);
    },

    getUser: function (addr) {
        return this.users.get(addr);
    },

    getWinner: function () {
        var user = this.users.get(this.winner);
        var info = {
            address: this.winner,
        };
        if (user) {
            info["name"] = user.name;
        }
        return info;
    },

    setWinner: function (info) {
        var fromUser = Blockchain.transaction.from;
        var count = info.times;
        //todo:dfsafdasfdasfsad
        var p1 = parseInt(Main.prototype.toASCII(fromUser));
        var p2 = parseInt(Main.prototype.toASCII(this.winner));

        var result = new Main().getResult(count, p1, p2);
        if (result) {
            this.winner = fromUser;
        }
    },

    


}



module.exports = war;