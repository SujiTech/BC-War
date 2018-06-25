function Hero(hashcode1,position,hashcode2){
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
    this.data.position = position;

    this.seed = parseInt("0x"+hex_md5(this.name));
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
    var target_tag;
    if(this.data.position==1)
        target_tag = "hero-me"
    else
        target_tag = "hero-target"

    $(".hp ."+target_tag).html("<p>"+this.hp+'</p>');
    $(".atk ."+target_tag).html("<p>"+this.atk+'</p>');
    $(".def ."+target_tag).html("<p>"+this.def+'</p>');
    $(".luk ."+target_tag).html("<p>"+this.luk+'</p>');
    $(".spd ."+target_tag).html("<p>"+this.spd+'</p>');
    $(".skl ."+target_tag).html("<p>"+this.skl+'</p>');
};
//静态成员变量
Hero.prototype.id = 0;