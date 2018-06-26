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
