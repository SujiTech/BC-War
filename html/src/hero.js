function Hero(hashcode1,hashcode2){
    this.hp  = 0;   //生命值（初版为耗尽死亡
    this.ap  = 0;   //怒气值 决定特殊攻击使用（初版为纯娱乐效果
    this.atk = 0;   //伤害值
    this.def = 0;   //伤害抵扣（容错率）
    this.luk = 0;
    this.spd = 0;   //行动次序
    this.skl = 0;
    //存储数据，避免运算时修改
    this.data = {};
    data.hp = this.hp;
    data.ap = this.ap;
    data.atk = this.atk;
    data.def = this.def;
    data.luk = this.luk;
    data.spd = this.spd;
    data.skl = this.skl;
}
Hero.prototype.init   = function(){
    
}
//静态成员变量
Hero.prototype.id = 0;