
var HttpRequest = require("nebulas").HttpRequest;
var Neb = require("nebulas").Neb;
var NebPay = require("nebpay");
var neb = new Neb();
neb.setRequest(new HttpRequest("https://mainnet.nebulas.io"));
var nebApi = neb.api;
var nebPay = new NebPay();
var nebState = undefined;
var account = undefined;
var contractAddress = "n1hxAD8etdF4Bp2T4cSnmuyLVpT8KQEmhcW";

function Main(){}
Main.prototype = {
    p1 : null,
    p2 : null,
    has_init : false,
    // p1_wallet : {hash:parseInt("0x3025e28ba5769d139e1395387a488394"),name:"袭金亮"},
    // p2_wallet : {hash:parseInt("0xbed46142792616f09a9120a724fcb64e"),name:"刘怪斯14"},
    target_is_last_winner : false,
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
Main.prototype.p1_wallet = {hash:parseInt(Main.prototype.toASCII("n1Yv4HpXN7Jckfnik2r7nbDqKoCpZNjTpCx")),name:"鱼香肉丝"},
Main.prototype.p2_wallet = {hash:parseInt(Main.prototype.toASCII("n1UaMNYDDV8D6oE77KMHu6uhgKBfAf9i2Z1")),name:"宫保鸡丁"},
Main.prototype.init = function(){
    if(this.has_init)
        return;
    this.has_init = true;
    $("#btn-upload").click(function(event){main.upload_winner(main.battle_times)});
    //玩家信息来自钱包
    this.p1_wallet.hash = parseInt(this.toASCII(account));
    //初始化完成自动获得一次敌人列表
    this.btn_get_opponents();
    //战斗数据
    this.ResetToFirstBattle()
}
Main.prototype.rundata = {};
Main.prototype.Fight = function(){
    //准备界面
    this.resetBattleLog(true);
    $(".opponent-list").html("");
    this.init_player_info();
    //初始化数据
    this.resetRunData(); //TODO 正式版的调用时间应该在初始化完成后
    //统计战斗次数
    this.battle_times ++;
    $(".player-info.battle .content").html(this.battle_times);
    //战斗开始

    if(this.fight_loop(this.p1,this.p2) && this.target_is_last_winner)
        new ToDisplay(null, null, eDisplayType.WinChallenge, null, null, null, 500)
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
            new ToDisplay(p1 , null, eDisplayType.Dead);
            new ToDisplay(p2, null, eDisplayType.Win);
            break;
        }else if(p2.hp==0){
            console.log("p1获胜")
            new ToDisplay(p2 , null, eDisplayType.Dead);
            new ToDisplay(p1, null, eDisplayType.Win);

            return true;
        }
    }
}
Main.prototype.display_loop = function(){
    var now_display = this.rundata.display_list[this.rundata.display_index];
    if(now_display){
        now_display.display();
        this.rundata.display_index++;
    }
    else{
        setTimeout(function(){main.display_loop()},500);
    }
}

//times: 次数
Main.prototype.upload_winner = function(times) {

    var to = contractAddress;
    var value = "0";
    var callFunction = "setWinner";
    var callArgs =  JSON.stringify([{
        times: times
    }]);
    var options = {
        //gasLimit: 5000000,
        qrcode: {
            showQRCode: false,      //是否显示二维码信息
            container: undefined,    //指定显示二维码的canvas容器，不指定则生成一个默认canvas
            completeTip: undefined, // 完成支付提示
            cancelTip: undefined // 取消支付提示
        },
        callback: NebPay.config.testnetUrl, //在测试网查询
        listener: function (value) {

            if (typeof value === 'string') {
                //用户取消了支付
                return
            }
            //支付已经提交，状态未知
        }
    };
    nebPay.call(to, value, callFunction, callArgs, options);
}
//times: 次数
Main.prototype.upload_nickname = function(nickname) {

    var to = contractAddress;
    var value = "0";
    var callFunction = "setUser";
    var callArgs =  JSON.stringify([{
        name: nickname
    }]);
    var options = {
        //gasLimit: 5000000,
        qrcode: {
            showQRCode: false,      //是否显示二维码信息
            container: undefined,    //指定显示二维码的canvas容器，不指定则生成一个默认canvas
            completeTip: undefined, // 完成支付提示
            cancelTip: undefined // 取消支付提示
        },
        callback: NebPay.config.testnetUrl, //在测试网查询
        listener: function (value) {

            if (typeof value === 'string') {
                //用户取消了支付
                return
            }
            //支付已经提交，状态未知
        }
    };
    nebPay.call(to, value, callFunction, callArgs, options);
}
Main.prototype.btn_get_opponents = function(){
    var opponents;
    //请求数据
    var pattern = {
        name:"刘怪斯",
        hash: 1
    };
    $(".opponent-list").html("<div class=\"title\">正在获取对手列表……</div>");
    nebApi.call({
        chainID: nebState.chain_id,
        from: account,
        to: contractAddress,
        value: 0,
        // nonce: nonce,
        gasPrice: 1000000,
        gasLimit: 2000000,
        contract: {
            function: "getWinner",
            args: JSON.stringify([])
        },
    }).then(function (resp) {
        if (resp && resp.result) {
            var result = JSON.parse(resp.result);
            if (result) {
                opponents = [{name:result.name,hash: parseInt(main.toASCII(result.address))}];
                main.list_opponents(opponents);
            }
        }
    });


    // opponents = [{name:"刘怪斯1",hash:1}
    //     ,{name:"刘怪斯2",hash:2}
    //     ,{name:"刘怪斯3",hash:3}
    //     ,{name:"刘怪斯4",hash:4}
    //     ,{name:"刘怪斯5",hash:5}
    //     ,{name:"刘怪斯6",hash:6}
    //     ,{name:"刘怪斯7",hash:7}
    //     ,{name:"刘怪斯8",hash:8}
    //     ,{name:"刘怪斯9",hash:9}
    //     ,{name:"刘怪斯10",hash:10}
    //     ,{name:"刘怪斯11",hash:11}
    //     ,{name:"刘怪斯12",hash:12}
    //     ,{name:"刘怪斯1",hash:1}
    //     ,{name:"刘怪斯2",hash:2}
    //     ,{name:"刘怪斯3",hash:3}
    //     ,{name:"刘怪斯4",hash:4}
    //     ,{name:"刘怪斯5",hash:5}
    //     ,{name:"刘怪斯6",hash:6}
    //     ,{name:"刘怪斯7",hash:7}
    //     ,{name:"刘怪斯8",hash:8}
    //     ,{name:"刘怪斯9",hash:9}
    //     ,{name:"刘怪斯10",hash:10}
    //     ,{name:"刘怪斯11",hash:11}
    //     ,{name:"刘怪斯12",hash:12}];
    // this.list_opponents(opponents);

}
Main.prototype.list_opponents = function(opponents){
    $(".opponent-list").html("<div class=\"title\">擂主：</div>");
    for (var i = 0; i < opponents.length; i++) {
        $(".opponent-list").append(Display.ToElem("div",Display.ToElem("button",(opponents[i].name||"无名氏")),"item"));
        var fn = function(){
            var obj = i;
            if(i==opponents.length-1)
                opponents[obj].target_is_last_winner = true;
            $(".opponent-list .item").last().click(function(){
                main.select_opponents(opponents[obj]);
            })
        };
        fn();
    }
}
Main.prototype.select_opponents = function(obj){
    $(".info-grid.name .content.hero-target").val(obj.name);
    $("#name-player2").val(obj.name);
    this.p2_wallet = obj;
    this.ResetToFirstBattle();
    //标记对方是不是最新冠军
    this.target_is_last_winner = obj.target_is_last_winner;
    //$("#name-player2").obj = ;
}

//换人的时候也要增加
Main.prototype.ResetToFirstBattle = function(){
    $("#btn-upload").css({visibility: "hidden"})
    //界面记录
    this.resetBattleLog();
    //随机数种子
    this.bk_rand = new BkRand(this.p1_wallet.hash, this.p2_wallet.hash);
    //显示信息
    this.init_player_info();

    this.resetRunData();
}
//重置战斗统计
Main.prototype.resetBattleLog = function(keep_times){
    //对战次数
    if(!keep_times)
        this.battle_times = 0;
    $(".player-info.battle .content").html(this.battle_times);
    Display.Div.html("");
}
//仅连续战斗课直接调用，否则会引起随机种子问题
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