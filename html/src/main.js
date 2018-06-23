//设计

/*
 * 蓄力跑动减慢（飞行物速度减慢）
 * 
 */

var c_world_width = 800;
var c_world_height = 300;
var transparent = false;
var antialias = false;
var game = new Phaser.Game(c_world_width, c_world_height, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create ,update: update},transparent,antialias);
//参数们
var c_gravity = 1200;//800;
var c_pop_interval = 2000;
var c_pop_random_range = 500;

var now_level_arg;
var c_args = {
    support_spd_x : -150, //支持方式的移动速度
    running_speed_mult: 2,
    crash_speed_mult:0.25,
    level_duration:30,
    table_height:10,    //桌面高度，猫距离下边框的距离
    lv1:{
        clos_shot_spd : -150,       //-300/2,
        clos_shot_interval: 3000,
        clos_shot_interval_rnd: 200,
        clos_shot_height: 300,
        mid_shot_spd : -100/2,
        mid_shot_interval: 4000,
        mid_shot_interval_rnd: 200,
        mid_shot_height: 250,
        long_shot_spd : -50/2,
        long_shot_interval: 9000,
        long_shot_interval_rnd: 500,
        long_shot_height: 200,
    },
    lv2:{
        clos_shot_spd : -150,       
        clos_shot_interval: 3000,
        clos_shot_interval_rnd: 200,
        clos_shot_height: 300,
        mid_shot_spd : -100/2,
        mid_shot_interval: 4000,
        mid_shot_interval_rnd: 200,
        mid_shot_height: 250,
        long_shot_spd : -50/2,
        long_shot_interval: 9000,
        long_shot_interval_rnd: 500,
        long_shot_height: 200,
    },
    lv3:{
        clos_shot_spd : -150,       
        clos_shot_interval: 3000,
        clos_shot_interval_rnd: 200,
        clos_shot_height: 300,
        mid_shot_spd : -100/2,
        mid_shot_interval: 4000,
        mid_shot_interval_rnd: 200,
        mid_shot_height: 250,
        long_shot_spd : -50/2,
        long_shot_interval: 9000,
        long_shot_interval_rnd: 500,
        long_shot_height: 200,
    },

}

var facing = 'left';
// var jumpTimer = 0;
//objects
var p_cat;
var end_board;
var Opr = {
    Key_Space : null,
    cursors : null,
}
// var yAxis = p2.vec2.fromValues(0, 1);
var text_score;
var suport_ways;   //支持方式
var suport_ways_f;   //支持方式_失败图标
var road_block;     //障碍物
var clos_shot;       //近景
var mid_shot;       //中景
var long_shot;      //远景
var g_cat;
var c_cat_01;
var c_cat_03;
var level_timer;    //进度条
var score_count = 0;
//flag
var jumping_protect_timer = 0;//计时器，该时间之前不会被拉回地面
var c_jumping_protect_duration = 100;
const GAME_STATE = {
    NORMAL:0,
    END:1,
}
var c_state;
var c_state_default = {
    now_level:1,
    game_state:GAME_STATE.NORMAL,
    pop_timer:0,
    running_speed:true,    //当前是否触发了速度变化，新生成的景物需要读取这个值
    pop_clos_shot:0, //原则上跟发生间隔相同
    pop_mid_shot:0,  //原则上跟发生间隔相同
    pop_long_shot:0, //原则上跟发生间隔相同
    score_total:0,
    score_get:0,
    level_remain:0,
}

//display
//Level_Config&Property
//CAT_Config&Property
var C_CAT = {
    jump_charge_speed : 0.757575,// percent/second 0.66s
    jump_power_base: 0.5,
    jump_power : 700,//600,
    landed : false,
    crash: false,
    crash_duration: 0.5,    //秒
    crash_remain:0,
    //蓄力跳跃
    jump_power_percent : 0,
    jump_charging : false,
    jump_land:function(){
        C_CAT.jump_charging = false;
        C_CAT.jump_power_percent = 0;
        c_state.running_speed = false;

        ShotSpdReset(clos_shot);
        ShotSpdReset(mid_shot);
        ShotSpdReset(long_shot);
        ShotSpdReset(suport_ways);
    },
}
function preload() {
    game.load.image('pic', 'res/cat.png');
    game.load.image('cat_cod01', 'res/cat_01.gif');
    game.load.image('cat_cod03', 'res/cat_03.gif');
    game.load.spritesheet('suport_ways','res/suport_ways.png',32,32);
    game.load.image('suport_stick','res/suport_stick.png');
    game.load.image('suport_stick_f','res/suport_stick_f.png');
    game.load.spritesheet('car_run','res/cat_run.gif',64,64,8);
    game.load.image('time_bar','res/test/vu.png');
    game.load.spritesheet('end_board','res/ui/end_board.png',192,96);



    //level
    game.load.image('lv1_clos_shot_1', 'res/item/lv1_clos_shot_1.gif');
    game.load.image('lv1_clos_shot_2', 'res/item/lv1_clos_shot_2.gif');
    game.load.image('lv1_clos_shot_3', 'res/item/lv1_clos_shot_3.gif');
    game.load.image('lv1_mid_shot_1', 'res/item/lv1_mid_shot_1.gif');
    game.load.image('lv1_mid_shot_2', 'res/item/lv1_mid_shot_2.gif');
    game.load.image('lv1_mid_shot_3', 'res/item/lv1_mid_shot_3.gif');
    game.load.image('lv1_long_shot_1', 'res/item/lv1_long_shot_1.gif');
    game.load.image('lv1_long_shot_2', 'res/item/lv1_long_shot_2.gif');
    game.load.image('lv1_long_shot_3', 'res/item/lv1_long_shot_3.gif');
}


function create() {
    initData();
    // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.stage.smoothed = false;
    game.stage.backgroundColor = '#bfcad6';

    long_shot = game.add.group();
    long_shot.enableBody = true;
    long_shot.physicsBodyType = Phaser.Physics.ARCADE;
    mid_shot = game.add.group();
    mid_shot.enableBody = true;
    mid_shot.physicsBodyType = Phaser.Physics.ARCADE;
    clos_shot = game.add.group();
    clos_shot.enableBody = true;
    clos_shot.physicsBodyType = Phaser.Physics.ARCADE;



    //结束UI
    end_board = game.add.sprite(100, 6, 'end_board');
    end_board.animations.add('static',[0]);
    end_board.animations.add('actived',[0,1],5,true);
    end_board.scale.set(3);
    end_board.visible = false;


    suport_ways = game.add.group();
    suport_ways.enableBody = true;
    suport_ways.physicsBodyType = Phaser.Physics.ARCADE;
    suport_ways_f = game.add.group();
    suport_ways_f.enableBody = true;
    suport_ways_f.physicsBodyType = Phaser.Physics.ARCADE;


    //关卡内容
    switch(c_state.now_level){
        case 1:
        now_level_arg = c_args.lv1;
        lv1_create();
        break;
        case 2:
        now_level_arg = c_args.lv2;
        lv2_create();
        break;
        case 3:
        now_level_arg = c_args.lv3;
        lv3_create();
        break;
    }

    //input
    game.cursors = game.input.keyboard.createCursorKeys();
    Opr.cursors = game.cursors;
    Opr.Key_Space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    Opr.Key_Space.onUp.add(onJumpKeyUp,this);
    game.input.onDown.add(onJumpKeyDown, this);
    game.input.onUp.add(onTapUp, this);

    //hero
    // p_cat.body.fixedRotation = true;
    g_cat = game.add.group();
    g_cat.enableBody = true;
    g_cat.physicsBodyType = Phaser.Physics.ARCADE;
    p_cat = g_cat.create(120, game.height - 64 - c_args.table_height, 'car_run');
    p_cat.scale.set(2);
    // p_cat.body.clearShapes();
    // p_cat.body.loadPolygon('physicsData', 'cat');
    p_cat.animations.add('ani_run',[0,1,2,3]);
    p_cat.animations.add('ani_charging',[4],5,true);
    p_cat.animations.add('ani_jumping',[5],5,true);
    p_cat.animations.add('ani_fall',[6,7],5,true);
    p_cat.play('ani_run',5,true);
    // 猫碰撞区
    // c_cat_01 = g_cat.create(0, 0, 'cat_cod01');
    // p_cat.addChild(c_cat_01);
    c_cat_03 = g_cat.create(0, 32, 'cat_cod03');
    c_cat_03.scale.set(2);
    p_cat.addChild(c_cat_03);
    // c_cat_01.x = 0;
    // c_cat_01.y = 0;
    // end_board.play('actived');


    initBackground();

    //进度条
    level_timer = game.add.sprite(10,10,'time_bar');
    level_timer.crop(new Phaser.Rectangle(0, 0, 300, 30));
}
function hitSupport(body1, body2) {

    //  body1 is the space ship (as it's the body that owns the callback)
    //  body2 is the body it impacted with, in this case our panda
    //  As body2 is a Phaser.Physics.P2.Body object, you access its own (the sprite) via the sprite property:
    body2.sprite.alpha -= 0.1;

}
function onJumpKeyDown(pointer, dourbleTap) {
    CatJumpStart();
}
function onTapUp(pointer){
    if (!pointer.withinGame) { return; }
    onJumpKeyUp(pointer);
}
function onJumpKeyUp(pointer){
    if(c_state.game_state == GAME_STATE.END){
        GoNextLevel();
        return;
    }
    if((!C_CAT.jump_charging) || C_CAT.crash)
        return;
    p_cat.body.velocity.y = -C_CAT.jump_power * (C_CAT.jump_power_percent>1?1:C_CAT.jump_power_percent);
    jumping_protect_timer = game.time.now + c_jumping_protect_duration;
    C_CAT.landed = false;
    C_CAT.jump_charging = false;
    p_cat.play('ani_jumping');

}
function jumpCharging(){
    if(C_CAT.jump_charging){
        C_CAT.jump_power_percent += C_CAT.jump_charge_speed * game.time.physicsElapsed;
        // console.log(C_CAT.jump_power_percent);
    }
}
function update() {

    if(c_state.game_state == GAME_STATE.END)return;

    checkObjectsOut();
    my_gravity();
    jumpCharging();
    CatCrashTimer();
    UpdateLevelTimer();
    //支持方式
    c_state.pop_timer -= game.time.elapsedMS * getNowSpeedMulti();
    if(c_state.pop_timer<0){
        c_state.pop_timer = c_pop_interval + game.rnd.realInRange(-c_pop_random_range,c_pop_random_range);
        popSuportWays();
    }
    //远景生成
    c_state.pop_clos_shot -= game.time.elapsedMS * getNowSpeedMulti();
    if(c_state.pop_clos_shot<0){
        c_state.pop_clos_shot = now_level_arg.clos_shot_interval + game.rnd.realInRange(-now_level_arg.clos_shot_interval_rnd,now_level_arg.clos_shot_interval_rnd);
        var clos = popBackground(clos_shot,now_level_arg.clos_shot_spd);
        if(clos != undefined)
            clos.y = now_level_arg.clos_shot_height - clos.height - c_args.table_height;
    }
    //中景生成
    c_state.pop_mid_shot -= game.time.elapsedMS * getNowSpeedMulti();
    if(c_state.pop_mid_shot<0){
        c_state.pop_mid_shot = now_level_arg.mid_shot_interval + game.rnd.realInRange(-now_level_arg.mid_shot_interval_rnd,now_level_arg.mid_shot_interval_rnd);
        var mid = popBackground(mid_shot,now_level_arg.mid_shot_spd);
        if(mid != undefined)
            mid.y = now_level_arg.mid_shot_height - mid.height;
    }
    //障碍生成
    c_state.pop_long_shot -= game.time.elapsedMS * getNowSpeedMulti();
    if(c_state.pop_long_shot<0){
        c_state.pop_long_shot = now_level_arg.long_shot_interval + game.rnd.realInRange(-now_level_arg.long_shot_interval_rnd,now_level_arg.long_shot_interval_rnd);
        var long = popBackground(long_shot,now_level_arg.long_shot_spd);
        if(long != undefined)
            long.y = now_level_arg.long_shot_height - long.height;
    }


    game.physics.arcade.overlap([c_cat_03], suport_ways, collisionHandler, null, this);
    game.physics.arcade.overlap([c_cat_03], clos_shot, collisionHandler_ClosShot, null, this);

    switch(c_state.now_level){
        case 1:
        lv1_update();
        break;
        case 2:
        lv2_update();
        break;
        case 3:
        lv3_update();
        break;
    }

    // if(!C_CAT.landed){
    //     if(p_cat.body.velocity.y<0){
    //         p_cat.play('ani_fall');
    //     }
    // }
    //空中按下跳跃的补充
    if(!C_CAT.crash && (game.input.activePointer.isDown || Opr.Key_Space.isDown)){
        if(C_CAT.landed && !C_CAT.jump_charging){
            CatJumpStart();
        }
    }
}
function collisionHandler (cat, suport) {
    // if(cat == p_cat)return;
    // cat.kill();
    suport.kill();
    // TODO 增加分数
    ScoresUp(suport.score);
}
function collisionHandler_ClosShot (cat, _clos_shot) {
    _clos_shot.kill();
    C_CAT.crash = true;
    C_CAT.crash_remain = C_CAT.crash_duration;

    //清空跳跃信息
    C_CAT.jump_land();
    p_cat.body.velocity.y /= 2;
    ShotSpeed(suport_ways,c_args.crash_speed_mult);
    ShotSpeed(clos_shot,c_args.crash_speed_mult);
    ShotSpeed(mid_shot,c_args.crash_speed_mult);
    ShotSpeed(long_shot,c_args.crash_speed_mult);
}
function ScoresUp(num){
    score_count += num;
    c_state.score_get ++;
    // text_score.text = 'Sc : ' + score_count;
}


function my_gravity() {
    if(!C_CAT.landed && p_cat.y> game.height - p_cat.height && game.time.now > jumping_protect_timer){
        p_cat.body.velocity.y = 0;
        C_CAT.landed = true;
        p_cat.play('ani_fall');
        game.time.events.add(166, ()=>{p_cat.play('ani_run');}, this);
        p_cat.y = game.height - p_cat.height - c_args.table_height;
        c_state.running_speed = false;
        C_CAT.jump_land();
    }
    if(!C_CAT.landed)
        p_cat.body.velocity.y += c_gravity * game.time.physicsElapsed;
}

function popSuportWays(){
    var sup = suport_ways.getFirstExists(false);
    var times = 0;
    // do{
    //     sup  = suport_ways.getAt(game.rnd.integerInRange(0,suport_ways.children.length-1));
    //     times ++;
    //     if(times==5)return;
    // }while(!sup || sup.visible)
    if (sup)
    {
        sup.reset(game.width, game.rnd.realInRange(p_cat.height, game.height - sup.height - c_args.table_height));
        sup.body.velocity.x = c_args.support_spd_x * getNowSpeedMulti();
        c_state.score_total ++;
    }
}
function initData(){
    resetState();
    c_state.level_remain = c_args.level_duration;
}
function initBackground(){
    var clos = popBackground(clos_shot,now_level_arg.clos_shot_spd);

    clos.y = now_level_arg.clos_shot_height - clos.height - c_args.table_height;
    clos.x = game.rnd.realInRange(game.width/2,game.width);
    var mid = popBackground(mid_shot,now_level_arg.mid_shot_spd);
    mid.y = now_level_arg.mid_shot_height - mid.height - c_args.table_height;
    mid.x = game.rnd.realInRange(0, game.width/2);
    var long = popBackground(long_shot,now_level_arg.long_shot_spd);
    long.y = now_level_arg.long_shot_height - long.height - c_args.table_height;
    long.x = game.rnd.realInRange(0, game.width/2);
}
function popBackground(sprite_group,spd){
    var shot;// long/mid shot
    var times = 0;
    do{
        shot  = sprite_group.getAt(game.rnd.integerInRange(0,sprite_group.children.length-1));
        times ++;
        if(times==sprite_group.children.length)return;
    }while(!shot || shot.visible)

    if (shot)
    {
        shot.reset(game.width, game.rnd.realInRange(0, game.height - p_cat.height));
        shot.body.velocity.x = spd * getNowSpeedMulti();
    }
    shot.scale.setTo(2,2);
    return shot;
}
function CatJumpStart(){
    if(c_state.game_state == GAME_STATE.END){
        GoNextLevel();
        return;
    }


    if(C_CAT.landed && !C_CAT.crash){
        C_CAT.jump_charging = true;
        c_state.running_speed = true;
        C_CAT.jump_power_percent = C_CAT.jump_power_base;

        ShotSpeed(clos_shot,c_args.running_speed_mult);
        ShotSpeed(mid_shot,c_args.running_speed_mult);
        ShotSpeed(long_shot,c_args.running_speed_mult);
        ShotSpeed(suport_ways,c_args.running_speed_mult);
    }
}
function checkObjectsOut(){
    suport_ways.children.forEach(function(c){
        if(c.x<0-c.width)
        {
            c.x = game.width;
            c.kill();
        }
    })
    clos_shot.children.forEach(function(c){
        if(c.x<0-c.width)
        {
            c.x = game.width;
            c.kill();
        }
    })
    mid_shot.children.forEach(function(c){
        if(c.x<0-c.width)
        {
            c.x = game.width;
            c.kill();
        }
    })
    long_shot.children.forEach(function(c){
        if(c.x<0-c.width)
        {
            c.x = game.width;
            c.kill();
        }
    })
}
function UpdateLevelTimer(){
    c_state.level_remain -= game.time.physicsElapsed;
    level_timer.cropRect.width =  (c_state.level_remain/ c_args.level_duration) * 300;
    level_timer.updateCrop();
    if(c_state.level_remain<=0){
        //level end
        LevelEnd();
    }
}
function LevelEnd(){
    c_state.game_state = GAME_STATE.END;

    p_cat.y = game.height - p_cat.height - c_args.table_height;
    p_cat.body.velocity.set(0,0);
    //全部停下
    ShotSpeed(suport_ways,0);
    ShotSpeed(clos_shot,0);
    ShotSpeed(mid_shot,0);
    ShotSpeed(long_shot,0);

    EndStart();
}
function CatCrashTimer(){
    if(C_CAT.crash_remain>0){
        C_CAT.crash_remain -= game.time.physicsElapsed;
        if(C_CAT.crash_remain<=0){
            C_CAT.crash = false;
            C_CAT.jump_land();
        }
    }
}
function ShotSpeed(group,speed_multi){
    var spd = c_args.support_spd_x;
    if(group == clos_shot){
        spd = now_level_arg.clos_shot_spd;
    }else if(group == mid_shot){
        spd = now_level_arg.mid_shot_spd;
    }else if(group == long_shot){
        spd = now_level_arg.long_shot_spd;
    }else if (group == suport_ways){
        spd = c_args.support_spd_x;
    }
    
    SetGroupSpeed(group, spd*speed_multi);
}
function ShotSpdReset(group){
    // now_level_arg
    var spd = c_args.support_spd_x;
    if(group == clos_shot){
        spd = now_level_arg.clos_shot_spd;
    }else if(group == mid_shot){
        spd = now_level_arg.mid_shot_spd;
    }else if(group == long_shot){
        spd = now_level_arg.long_shot_spd;
    }else if (group == suport_ways){
        spd = c_args.support_spd_x;
    }
    SetGroupSpeed(group,spd);
}
function SetGroupSpeed(sprite_group,speed){
    // var shot;// long/mid shot
    // var times = 0;
    // do{
    //     shot  = sprite_group.getAt(game.rnd.integerInRange(0,sprite_group.children.length-1));
    //     times ++;
    //     if(times==sprite_group.children.length)return;
    // }while(!shot || shot.visible)

    // if (shot)
    // {
    //     shot.reset(game.width, game.rnd.realInRange(0, game.height - p_cat.height));
    //     shot.body.velocity.x = speed;
    // }
    // shot.scale.setTo(2,2);
    // return shot;
    sprite_group.children.forEach(function(shot){
        shot.body.velocity.x = speed;
    })
}
function getNowSpeedMulti(){
    var multi = c_state.running_speed?c_args.running_speed_mult:1;
    multi = C_CAT.crash?c_args.crash_speed_mult:multi;
    return multi;
}
function GoNextLevel(){
    if(c_state.game_state != GAME_STATE.END)return;
    c_state.now_level ++;
    if(c_state.now_level>3)
        c_state.now_level = 1;



    for (var i = 0; i < suport_ways.total; i++) {
        suport_ways.getFirstExists(true).kill();
    }
    for (var i = 0; i < suport_ways_f.total; i++) {
        suport_ways_f.getFirstExists(true).kill();
    }
    game.state.restart();
    //reset
    resetState();   
}
function resetState(){
    c_state = Object.assign({}, c_state_default);
    C_CAT.landed = false;
}
//结尾动画
var edx = 140;
var edy = 51;
var warp = 50;
function EndStart(){
    var obj;
    for (var i = 0; i < suport_ways.length; i++) {
        obj = suport_ways.getAt(i);
        obj.kill();
        // obj.visible = false;
    }
    for (var i = 0; i < suport_ways_f.length; i++) {
        obj = suport_ways_f.getAt(i);
        obj.kill();
        // obj.visible = false;
    }

    end_board.visible = true;
    for (var i = 0; i < c_state.score_total; i++) {
        console.log(i);
        show_endicon(i*100,edx + (i % 10) * warp, edy + Math.floor(i / 10) * warp, i<c_state.score_get);
    }
}
function show_endicon(delay,x,y,isget) {
    // body...
    var icon;
    game.time.events.add(delay,
        ()=>{ 
            if(isget){
                icon = suport_ways.getFirstExists(false);
            }else{
                icon = suport_ways_f.getFirstExists(false);
            }
            icon.reset(x, y);

            console.log(x+','+y+':'+isget);
        }, this);
}