function ToDisplay(source, opponent, display_type, delay){
	this.source = source;
	this.opponent = target;
	this.delay = delay?1000;
	this.id = this.count++;
}
//静态成员变量
ToDisplay.prototype.count = 0;
ToDisplay.prototype.display = function(){

}
ToDisplay.prototype.Punch = function() {
	var str = source.getName();

	str +=  "挥出一拳，";

	Display.LastP = this.div.append(Display.ToP(str));
}
ToDisplay.prototype.Damage = function() {
	var str = source.getName() + "受到";

	str +=  ;

	Display.LastP = this.div.append(Display.ToSpan(str));
}
ToDisplay.prototype.div;
//战斗报告全局信息
Display = {};
Display.LastP = null;
Display.ToElem = function(elemType, str, class){
	return "<" + elemType + "class=\""+ class + "\">" + str + "</" + elemType + ">";
}
Display.ToSpan = function(str, class){
	return "<span class=\""+ class + "\">" + str + "</span>";
}
Display.ToP = function(str, class){
	return "<p class=\""+ class + "\">" + str + "</p>";
}