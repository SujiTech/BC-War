/*
	
	delay 可选，一般情况下由表现函数直接填写
 */
function ToDisplay(source, opponent, display_type, number, hpafter, isCombo, delay){
	this.source = source;
	this.opponent = opponent;
	this.number = number;
	this.hpafter = hpafter;
	this.isCombo = isCombo||false;
	this.type = display_type;
	this.delay = delay||1000;
	this.id = this.count++;
	this.pre = main.rundata.display_list[main.rundata.display_list.length-1];
	this.next_need_newline = false;

	//是否需要新行
	switch(this.type){
	case eDisplayType.Defend:
	case eDisplayType.Counter:
	case eDisplayType.CriticalHit:
	case eDisplayType.Punch:
		break;
	case eDisplayType.Dodge:
	case eDisplayType.PunchCombo:
	case eDisplayType.Dead:
	case eDisplayType.Damage:
	case eDisplayType.Win:
		this.next_need_newline = true;
	default:
		break;
	}
	//是否需要缩进
	this.need_intend = false;
	switch(this.type){
	case eDisplayType.Damage:
	case eDisplayType.Dead:
	case eDisplayType.Defend:
	case eDisplayType.Dodge:
	case eDisplayType.Counter:
	case eDisplayType.CriticalHit:
		if(this.pre!=null && this.isCombo && this.pre.isCombo)
			this.need_intend = true;
		break;
	case eDisplayType.Punch:
	case eDisplayType.PunchCombo:
	case eDisplayType.Win:
	default:
		break;
	}
	main.rundata.display_list[main.rundata.display_list.length] = this;
}
//静态成员变量
ToDisplay.prototype.count = 0;
ToDisplay.prototype.display = function(){
	this.NeedNewLine(false);
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
	setTimeout(function(){main.display_loop()},this.delay);
}
ToDisplay.prototype.Punch = function() {
	var str = this.source.getName();
	str +=  Display.RS(["挥出一拳","挥出摆拳","踢出一脚侧踹","使用正蹬"])+"，";

	Display.LastP().append(Display.ToSpan(str));
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
	Display.LastP().append(Display.ToSpan(str));
}
ToDisplay.prototype.Dead = function() {
	var str = this.source.getName();
	str +=  Display.RS(["倒下了","再起不能","举手投降","被打下了擂台","已经不能继续战斗了"]);

	Display.LastP().append(Display.ToSpan(str));
}
ToDisplay.prototype.Win = function() {
	var str = this.source.getName();
	str +=  "获得胜利";

	Display.LastP().append(Display.ToSpan(str));
}
ToDisplay.prototype.Defend = function(){
	var str = this.source.getName();
	str +=  Display.RS(["迅速捂住了脸","抱头蹲下","进行防御"],"defend")+"，";
	Display.LastP().append(Display.ToSpan(str));
}
ToDisplay.prototype.Dodge = function(){
	var str = this.source.getName();
	str +=  Display.RS(["躲开了攻击","没有被打中","发动闪避"]);
	Display.LastP().append(Display.ToSpan(str));
}
ToDisplay.prototype.Counter = function(){
	var str = this.source.getName();
	str +=  Display.RS(["抓住机会进行了反击","找到了破绽反手一拳"])+"，";
	Display.LastP().append(Display.ToSpan(str));
}
ToDisplay.prototype.CriticalHit = function(){
	var name = this.source.getName();
	var str =  Display.RS(["命中要害","致命一击","这一下看起来很痛","会心一击"]);
	Display.LastP().append(Display.ToSpan(str,"critical-hit") + Display.ToSpan("！"));
}
ToDisplay.prototype.PunchCombo = function(){
	var name = this.source.getName();
	var str =  Display.RS([name + "打了一套组合拳",name +"把"+this.opponent.getName()+"按在地上一顿乱打"]);
	Display.LastP().append(Display.ToSpan(str));
}
/*目前行动类型
	Punch
	PunchCombo。连续拳时判断是否需要新行一直递归向上查找，找到Punch才算不要。
	暴击，防御，闪避，反击也不用
*/
ToDisplay.prototype.NeedNewLine = function(isREC){
	//直接新建<p>
	//其他函数统统往LstP()加
	if(this.pre == null || this.pre.next_need_newline){
		Display.Div.append(Display.ToP("",this.need_intend?"combo":""));
	}
}
//战斗报告全局信息
Display = {};
Display.Div = null;
Display.LastP = function(){
	return $(".battle-log .content p").last();
};
Display.ToElem = function(elemType, str, cls){
	return "<" + elemType + " class=\""+ (cls||"") + "\">" + str + "</" + elemType + ">";
}
Display.ToSpan = function(str, cls){
	return "<span class=\""+ (cls||"") + "\">" + str + "</span>";
}
Display.ToP = function(str, cls){
	return "<p class=\"log-item "+ (cls||"") + "\">" + str + "</p>";
}
//RandomString
Display.RS = function(arr, cls)
{
    return this.ToSpan(arr[Math.floor(Math.random()*arr.length)],cls);
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