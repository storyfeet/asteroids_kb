import * as ac from "./a_components.js";
import * as gc from "./general.js";

//console.log("cp = ",cp);
    
// initialize kaboom context
const k = kaboom({global:true,debug:true});

//util

//consts

const wayPoints=[{x:600,y:50},{x:50,y:350},{x:10,y:10},{x:1,y:1}];
const way2 = [ { x:100,y:500}, {x:500,y:100}];


loadRoot("assets/");
loadSprite("coin","coin.png");
loadSprite("bullet","bullet.png");
loadSprite("ship","ship.png");
loadSprite("asteroid","asteroid.png");
loadSprite("alien","alien.png",{
    sliceX:3,
    anims:{
        move:{from:0,to:1},
    },

});



// define a scene
const s1 = k.scene("main", (level) => {
    level = level ?? 0;
    /*let al = add(["alien",sprite("alien"),pos(60,10),origin("center"),rotate(0),spinner(3)]);
    al.animSpeed = 0.2;
    al.play("move");*/

    add(["ship",scale(0.5), sprite("ship") , pos(300,400),area (vec2(-5),vec2(5)),origin("center"),rotate(0),gc.velocity({x:0,y:0},0.3),gc.spinner(0,3),ac.spaceControls(5,10),gc.boundsHopper(ac.border),ac.shooter(200)]);

    for (let n = 0 ; n < 5 ; n++) {
        let r = gc.randInt(640+420);
        let x = r> 640 ? 0 :r;
        let y = r > 640 ? r -640 : 0;

        add(ac.asteroid({pos:{x:x,y:y},splits:n+level}));
    }
    keyPress("escape",()=>{go("main",level+1)})
});

const s2 = k.scene("two",() => {
    k.add([
        k.text("This two",32),
        k.pos(100,200),
    ]);
    keyPress("space",()=>{go("main")})
});


// start the game
k.start("main");

