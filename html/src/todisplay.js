/*
	
	delay 可选，一般情况下由表现函数直接填写
 */
function ToDisplay(source, opponent, display_type, number, hpafter, isCombo, delay){
	this.source = source;
	this.opponent = opponent;
	this.number = number;
	this.hpafter = hpafter;
	this.isCombo = isCombo;
	this.type = display_type;
	this.delay = delay||1000;
	this.id = this.count++;

	rundata.display_list[rundata.display_list.length] = this;
}
//静态成员变量
ToDisplay.prototype.count = 0;
ToDisplay.prototype.display = function(){
	switch(this.type){
		case eDisplayType.Punch:
			this.Punch();
			break;
		case eDisplayType.Damage:
			this.Damage();
			break;
		case eDisplayType.Dead:
			this.Dead();
			break;
		case eDisplayType.Win:
			this.Win();
			break;
		case eDisplayType.Defend:
			this.Defend();
			break;
		case eDisplayType.Dodge:
			this.Dodge();
			break;
		case eDisplayType.Counter:
			this.Counter();
			break;
		case eDisplayType.CriticalHit:
			this.CriticalHit();
			break;
		case eDisplayType.PunchCombo:
			this.PunchCombo();
			break;
		default:
			console.log("DisplayType丢失")
			break;
	}
	Display.Div.animate({scrollTop: Display.Div.height()}, 10);
	setTimeout(display_loop,this.delay);
}
ToDisplay.prototype.Punch = function() {
	var str = this.source.getName();
	str +=  Display.RS("挥出一拳","挥出摆拳","踢出一脚侧踹","使用正蹬")+"，";

	Display.Div.append(Display.ToP(str));
}
ToDisplay.prototype.Damage = function() {
	var str = this.opponent.getName() + "受到";
	str +=  Display.ToSpan(this.number,"damage number");
	str += "点伤害";
	$(".hp .content."+this.opponent.data.tag).html("<p>"+this.hpafter+'</p>');
	//血条变化
	// Display.HPBar(this.opponent.data.tag+" .back", this.hpafter, this.opponent.data.hp, 2000)
	// Display.HPBar(this.opponent.data.tag+" .front", this.hpafter, this.opponent.data.hp, 250)
	Display.HPBarQ(this.opponent.data.tag, this.hpafter, this.opponent.data.hp);
	if(this.isCombo)
		Display.Div.append(Display.ToP(str));
	else
		Display.LastP().append(Display.ToSpan(str));
}
ToDisplay.prototype.Dead = function() {
	var str = this.source.getName();
	str +=  Display.RS("倒下了","再起不能","举手投降","被打下了擂台","已经不能继续战斗了")+"，";

	Display.Div.append(Display.ToP(str));
}
ToDisplay.prototype.Win = function() {
	var str = this.source.getName();
	str +=  "获得胜利";

	Display.LastP().append(Display.ToSpan(str));
}
ToDisplay.prototype.Defend = function(){
	var str = this.source.getName();
	str +=  Display.RS("发动了防御","格挡攻击")+"，";
	if(this.isCombo)
		Display.Div.append(Display.ToP(str));
	else
		Display.LastP().append(Display.ToSpan(str));
}
ToDisplay.prototype.Dodge = function(){
	var str = this.source.getName();
	str +=  Display.RS("躲开了攻击","没有被打中","发动闪避");
	if(this.isCombo)
		Display.Div.append(Display.ToP(str));
	else
		Display.LastP().append(Display.ToSpan(str));
}
ToDisplay.prototype.Counter = function(){
	var str = this.source.getName();
	str +=  Display.RS("抓住机会进行了反击","找到了破绽反手一拳")+"，";
	if(this.isCombo)
		Display.Div.append(Display.ToP(str));
	else
		Display.LastP().append(Display.ToSpan(str));
}
ToDisplay.prototype.CriticalHit = function(){
	var name = this.source.getName();
	var str =  Display.RS("命中要害","致命一击","效果拔群","会心一击");
	if(this.isCombo)
		Display.Div.append(Display.ToP(Display.ToSpan(str,"critical-hit") + Display.ToSpan("！")));
	else
		Display.LastP().append(Display.ToSpan(str,"critical-hit") + Display.ToSpan("！"));
}
ToDisplay.prototype.PunchCombo = function(){
	var name = this.source.getName();
	var str =  Display.RS(name + "打了一套组合拳",name +"把"+this.opponent.getName()+"按在地上一顿乱打");
	Display.LastP().append(Display.ToP(str));
}
//战斗报告全局信息
Display = {};
Display.Div = null;
Display.LastP = function(){
	return $(".battle-log .content p").last();
};
Display.ToElem = function(elemType, str, cls){
	return "<" + elemType + "class=\""+ (cls||"") + "\">" + str + "</" + elemType + ">";
}
Display.ToSpan = function(str, cls){
	return "<span class=\""+ (cls||"") + "\">" + str + "</span>";
}
Display.ToP = function(str, cls){
	return "<p class=\"log-item"+ (cls||"") + "\">" + str + "</p>";
}
//RandomString
Display.RS = function()
{
    return arguments[Math.floor(Math.random()*arguments.length)];
}
Display.HPBar = function(tag, number, maxhp, duration){
	var hpwidth = number/maxhp * 100;
	$(".hpbar."+tag).animate({
		width:hpwidth
	},duration);
}
Display.HPBarQ = function(tag, hp, maxhp){
	var hpwidth = hp/maxhp * 100;
	$(".hpbar."+tag+" .back").animate({
		width:hpwidth
	},1000);
	$(".hpbar."+tag+" .front").animate({
		width:hpwidth
	},250);
}
eDisplayType = {
	Punch : 0,
	Damage : 1,
	Dead : 2,
	Win : 3,
	Defend : 4,
	Dodge : 5,
	Counter : 6,
	CriticalHit : 7,
	PunchCombo: 8,
	Max : 9,
}