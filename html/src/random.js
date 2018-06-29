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
