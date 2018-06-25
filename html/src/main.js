function init(){
    // $("div").html("夜风");
    // $(".hero-target").html("对手");
    // $( "p:last" ).html("你妹");
    $("#btn-challenge").click(Fight);

}

var Fight = function(){
    console.log("开打");
    var str = "<p>郭敬明跳起来一下打在姚明膝盖上</p>";
    for (var i = 0; i < 6; i++) {
        str += str;
    }
    $(".battle-log .content").html(str);
}