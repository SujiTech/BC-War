/*
	
	delay 可选，一般情况下由表现函数直接填写
 */
function ToDisplay(source, opponent, display_type, number, delay){
	this.source = source;
	this.opponent = opponent;
	this.number = number;
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
	return "<p class=\""+ (cls||"") + "\">" + str + "</p>";
}
//RandomString
Display.RS = function()
{
    return arguments[Math.round(Math.random()*arguments.length)];
}
eDisplayType = {
	Punch : 0,
	Damage : 1,
	Dead : 2,
	Win : 3,
	Max : 4,
}