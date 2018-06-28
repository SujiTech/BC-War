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
            console.log("p2获胜")
            break;
        }else if(p2.hp==0){
            console.log("p1获胜")
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
    console.log(this.name + "收到伤害" + dam + "点");
}
Hero.prototype.getName = function(){
    return Display.ToSpan("【"+this.name+"】", this.data.tag+" name");
}


//获取n次战斗中是否有战胜的情况
Main.prototype.getResult = function(fight_times,hash_p1,hash_p2){
    this.ResetToFirstBattle();
    this.battle_times = 0;
    for (var i = 0; i < fight_times; i++) {
        this.init_player_info(hash_p1,hash_p2);
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
            console.log("p1-lose")
            break;
        }else if(this.p2.hp==0){
            console.log("p2-lose")
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
        var p1 = parseInt("0x" + this._md5(fromUser));
        var p2 = parseInt("0x" + this._md5(this.winner));

        var result = new Main().getResult(count, fromUser, this.winner);
        if (result) {
            this.winner = fromUser;
        }
    },

    _md5: function (s) { function L(k, d) { return (k << d) | (k >>> (32 - d)) } function K(G, k) { var I, d, F, H, x; F = (G & 2147483648); H = (k & 2147483648); I = (G & 1073741824); d = (k & 1073741824); x = (G & 1073741823) + (k & 1073741823); if (I & d) { return (x ^ 2147483648 ^ F ^ H) } if (I | d) { if (x & 1073741824) { return (x ^ 3221225472 ^ F ^ H) } else { return (x ^ 1073741824 ^ F ^ H) } } else { return (x ^ F ^ H) } } function r(d, F, k) { return (d & F) | ((~d) & k) } function q(d, F, k) { return (d & k) | (F & (~k)) } function p(d, F, k) { return (d ^ F ^ k) } function n(d, F, k) { return (F ^ (d | (~k))) } function u(G, F, aa, Z, k, H, I) { G = K(G, K(K(r(F, aa, Z), k), I)); return K(L(G, H), F) } function f(G, F, aa, Z, k, H, I) { G = K(G, K(K(q(F, aa, Z), k), I)); return K(L(G, H), F) } function D(G, F, aa, Z, k, H, I) { G = K(G, K(K(p(F, aa, Z), k), I)); return K(L(G, H), F) } function t(G, F, aa, Z, k, H, I) { G = K(G, K(K(n(F, aa, Z), k), I)); return K(L(G, H), F) } function e(G) { var Z; var F = G.length; var x = F + 8; var k = (x - (x % 64)) / 64; var I = (k + 1) * 16; var aa = Array(I - 1); var d = 0; var H = 0; while (H < F) { Z = (H - (H % 4)) / 4; d = (H % 4) * 8; aa[Z] = (aa[Z] | (G.charCodeAt(H) << d)); H++ } Z = (H - (H % 4)) / 4; d = (H % 4) * 8; aa[Z] = aa[Z] | (128 << d); aa[I - 2] = F << 3; aa[I - 1] = F >>> 29; return aa } function B(x) { var k = "", F = "", G, d; for (d = 0; d <= 3; d++) { G = (x >>> (d * 8)) & 255; F = "0" + G.toString(16); k = k + F.substr(F.length - 2, 2) } return k } function J(k) { k = k.replace(/rn/g, "n"); var d = ""; for (var F = 0; F < k.length; F++) { var x = k.charCodeAt(F); if (x < 128) { d += String.fromCharCode(x) } else { if ((x > 127) && (x < 2048)) { d += String.fromCharCode((x >> 6) | 192); d += String.fromCharCode((x & 63) | 128) } else { d += String.fromCharCode((x >> 12) | 224); d += String.fromCharCode(((x >> 6) & 63) | 128); d += String.fromCharCode((x & 63) | 128) } } } return d } var C = Array(); var P, h, E, v, g, Y, X, W, V; var S = 7, Q = 12, N = 17, M = 22; var A = 5, z = 9, y = 14, w = 20; var o = 4, m = 11, l = 16, j = 23; var U = 6, T = 10, R = 15, O = 21; s = J(s); C = e(s); Y = 1732584193; X = 4023233417; W = 2562383102; V = 271733878; for (P = 0; P < C.length; P += 16) { h = Y; E = X; v = W; g = V; Y = u(Y, X, W, V, C[P + 0], S, 3614090360); V = u(V, Y, X, W, C[P + 1], Q, 3905402710); W = u(W, V, Y, X, C[P + 2], N, 606105819); X = u(X, W, V, Y, C[P + 3], M, 3250441966); Y = u(Y, X, W, V, C[P + 4], S, 4118548399); V = u(V, Y, X, W, C[P + 5], Q, 1200080426); W = u(W, V, Y, X, C[P + 6], N, 2821735955); X = u(X, W, V, Y, C[P + 7], M, 4249261313); Y = u(Y, X, W, V, C[P + 8], S, 1770035416); V = u(V, Y, X, W, C[P + 9], Q, 2336552879); W = u(W, V, Y, X, C[P + 10], N, 4294925233); X = u(X, W, V, Y, C[P + 11], M, 2304563134); Y = u(Y, X, W, V, C[P + 12], S, 1804603682); V = u(V, Y, X, W, C[P + 13], Q, 4254626195); W = u(W, V, Y, X, C[P + 14], N, 2792965006); X = u(X, W, V, Y, C[P + 15], M, 1236535329); Y = f(Y, X, W, V, C[P + 1], A, 4129170786); V = f(V, Y, X, W, C[P + 6], z, 3225465664); W = f(W, V, Y, X, C[P + 11], y, 643717713); X = f(X, W, V, Y, C[P + 0], w, 3921069994); Y = f(Y, X, W, V, C[P + 5], A, 3593408605); V = f(V, Y, X, W, C[P + 10], z, 38016083); W = f(W, V, Y, X, C[P + 15], y, 3634488961); X = f(X, W, V, Y, C[P + 4], w, 3889429448); Y = f(Y, X, W, V, C[P + 9], A, 568446438); V = f(V, Y, X, W, C[P + 14], z, 3275163606); W = f(W, V, Y, X, C[P + 3], y, 4107603335); X = f(X, W, V, Y, C[P + 8], w, 1163531501); Y = f(Y, X, W, V, C[P + 13], A, 2850285829); V = f(V, Y, X, W, C[P + 2], z, 4243563512); W = f(W, V, Y, X, C[P + 7], y, 1735328473); X = f(X, W, V, Y, C[P + 12], w, 2368359562); Y = D(Y, X, W, V, C[P + 5], o, 4294588738); V = D(V, Y, X, W, C[P + 8], m, 2272392833); W = D(W, V, Y, X, C[P + 11], l, 1839030562); X = D(X, W, V, Y, C[P + 14], j, 4259657740); Y = D(Y, X, W, V, C[P + 1], o, 2763975236); V = D(V, Y, X, W, C[P + 4], m, 1272893353); W = D(W, V, Y, X, C[P + 7], l, 4139469664); X = D(X, W, V, Y, C[P + 10], j, 3200236656); Y = D(Y, X, W, V, C[P + 13], o, 681279174); V = D(V, Y, X, W, C[P + 0], m, 3936430074); W = D(W, V, Y, X, C[P + 3], l, 3572445317); X = D(X, W, V, Y, C[P + 6], j, 76029189); Y = D(Y, X, W, V, C[P + 9], o, 3654602809); V = D(V, Y, X, W, C[P + 12], m, 3873151461); W = D(W, V, Y, X, C[P + 15], l, 530742520); X = D(X, W, V, Y, C[P + 2], j, 3299628645); Y = t(Y, X, W, V, C[P + 0], U, 4096336452); V = t(V, Y, X, W, C[P + 7], T, 1126891415); W = t(W, V, Y, X, C[P + 14], R, 2878612391); X = t(X, W, V, Y, C[P + 5], O, 4237533241); Y = t(Y, X, W, V, C[P + 12], U, 1700485571); V = t(V, Y, X, W, C[P + 3], T, 2399980690); W = t(W, V, Y, X, C[P + 10], R, 4293915773); X = t(X, W, V, Y, C[P + 1], O, 2240044497); Y = t(Y, X, W, V, C[P + 8], U, 1873313359); V = t(V, Y, X, W, C[P + 15], T, 4264355552); W = t(W, V, Y, X, C[P + 6], R, 2734768916); X = t(X, W, V, Y, C[P + 13], O, 1309151649); Y = t(Y, X, W, V, C[P + 4], U, 4149444226); V = t(V, Y, X, W, C[P + 11], T, 3174756917); W = t(W, V, Y, X, C[P + 2], R, 718787259); X = t(X, W, V, Y, C[P + 9], O, 3951481745); Y = K(Y, h); X = K(X, E); W = K(W, v); V = K(V, g) } var i = B(Y) + B(X) + B(W) + B(V); return i.toLowerCase() },

}



module.exports = war;