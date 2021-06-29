
    
// initialize kaboom context
const k = kaboom({global:true,debug:true});


function close_to(a,b) {
    return ((Math.abs(a.x - b.x) < 5 )  && (Math.abs(a.y - b.y) <5))
}


const wayPoints=[{x:600,y:50},{x:50,y:350},{x:10,y:10},{x:1,y:1}];
const way2 = [ { x:100,y:500}, {x:500,y:100}];
const border = {x: -20,y:-20,w : 680,h:520};


loadRoot("assets/");
loadSprite("coin","coin.png");
loadSprite("bullet","bullet.png");
loadSprite("ship","ship.png");
loadSprite("alien","alien.png",{
    sliceX:3,
    anims:{
        move:{from:0,to:1},
    },

});


function waypoints(wps,speed) {
    let index = 0;
    let next_wp = wps[index];
    return {
        add (){
            this.action(()=> {
                if (this.pos.x < next_wp.x) {
                    this.move(speed,0)
                }
                if (this.pos.x > next_wp.x ){
                    this.move(-speed,0)
                } 
                if (this.pos.y < next_wp.y) {
                    this.move(0,speed)
                }
                if (this.pos.y > next_wp.y ){
                    this.move(0,-speed)
                } 
                if (close_to(this.pos,next_wp)) {
                    index = (index +1) % wps.length;
                    next_wp = wps[index];
                }
            })
        }
    };
}

function spinner(speed,friction) {
    friction = friction || 0;
    return {
        add() {
            this.action(()=>{
                speed *= 1 -(dt()*friction);
                this.angle += speed * dt();
            })
        },
        pushLeft(f){
            speed += f;
        }
   }
}

function velocity(vx,vy,friction){
    friction = friction || 0;
    return {
        add(){
            this.action(()=> {
                let d = dt();
                vx *= 1-(d*friction);
                vy *= 1-(d*friction);
                this.pos.x += vx * d;
                this.pos.y += vy * d;
            })
        },
        push(nx,ny){
            vx += nx;
            vy += ny;
        },
        vel(){
            return {vx:vx,vy:vy};
        }
    }
}


function keyMove(dist){
    return {
        add(){
            keyPress("up" ,()=>{
                this.pos.y -=dist;
            });  
            keyPress("down",()=>{
                this.pos.y +=dist;
            });
            keyPress("right",()=>{
                this.pos.x += dist;
            });
            keyPress("left",()=>{
                this.pos.x -= dist;
            });
        }
    }
}

function spaceControls(force,a_force) {
    a_force = a_force || force;
    return {
        add() {
            keyDown("up" ,()=>{
                this.push(-force * Math.sin(this.angle), -force* Math.cos(this.angle));
            });  
            keyDown("down",()=>{
                this.push(force * Math.sin(this.angle), force* Math.cos(this.angle));
            });
            keyDown("right",()=>{
                this.pushLeft(-a_force *dt())
            });
            keyDown("left",()=>{
                this.pushLeft(a_force*dt());
            });
        }
    }
}

function shooter(speed,offset) {
    offset ||= 10;
    return {
        add(){
            keyPress("space",()=> {
                let vel = this.vel();
                let a = this.angle;
                let cosa = Math.cos(a);
                let sina = Math.sin(a);
                
                add(["bullet",sprite("bullet"),pos(this.pos.x - offset*sina,this.pos.y-offset *cosa),origin("center"),rotate(this.angle),killer("coin"),velocity(vel.vx -speed*sina,vel.vy-speed*cosa,0),ttl(2)]);
            });
        }
    }
}

function boundsHopper(bound){
    return {
        add(){
            this.action(()=>{
                if (this.pos.x > bound.x + bound.w){
                    this.pos.x -=  bound.w;
                }
                if (this.pos.x < bound.x) {
                    this.pos.x += bound.w;
                }
                if (this.pos.y > bound.y + bound.h){
                    this.pos.y -= bound.h;
                }
                if (this.pos.y < bound.y){
                    this.pos.y += bound.h;
                }
            })
        }
    }
}

function boundsKiller(bound){
    return {
        add(){
            this.action(()=>{
                if (this.pos.x > bound.x + bound.w){
                    destroy(this)
                }
                if (this.pos.x < bound.x) {
                    destroy(this)
                }
                if (this.pos.y > bound.y + bound.h){
                    destroy(this)
                }
                if (this.pos.y < bound.y){
                    destroy(this)
                }
            })
        }
    }
}

function ttl(time){
    return {
        add(){
            this.action(()=>{
                time -= dt();
                if( time <= 0) {
                    destroy(this);
                }
            })
        }
    }
}

function killer(target){
    return {
        add(){
            this.overlaps(target,(item)=>{
                destroy(item);
                destroy(this);
            });
        }
    }
}

// define a scene
const s1 = k.scene("main", () => {

    let al = add(["alien",sprite("alien"),pos(60,10),origin("center"),rotate(0),spinner(3)]);
    al.animSpeed = 0.2;
    al.play("move");

    add(["ship",scale(0.5), sprite("ship") , pos(300,400),origin("center"),rotate(0),velocity(0,0,0.3),spinner(0,3),spaceControls(5,10),boundsHopper(border),shooter(100)]);

    loop(10 ,()=>{
        add(["coin",sprite("coin"),area(vec2(-9),vec2(9)),pos(10,10),waypoints(wayPoints,100),rotate(0),spinner(2),origin("center"),ttl(100)]);
    });
    keyPress("escape",()=>{go("two")})
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

