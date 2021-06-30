import * as gc from "./general.js";
export const border = {x: -20,y:-20,w : 680,h:520};
export function asteroid(ob){ 
        let sp = ob.splits ?? 0;
        add([
            "asteroid",
            sprite("asteroid"),
            scale(0.2 +sp* 0.1  ),
            //area(vec2(-20),vec2(20)),
            pos(ob.pos?.x ?? ob.x ?? 10,ob.pos.y ?? ob.y ?? 10),
            gc.velocity(
                ob.vel ?? gc.randDir(gc.randr(10,30))),
                rotate(gc.randr(7)
                ),
            gc.spinner(gc.randr(-4,4)),
            origin("center"),
            gc.boundsHopper(border),
            splitDeath(sp),
            gc.ttl(100)
        ]);
}


export function spaceControls(force,a_force) {
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

export function shooter(speed,offset) {
    offset ||= 10;
    return {
        add(){
            keyPress("space",()=> {
                let vel = this.vel();
                let a = this.angle;
                let cosa = Math.cos(a);
                let sina = Math.sin(a);
                
                add(["bullet",sprite("bullet"),pos(this.pos.x - offset*sina,this.pos.y-offset *cosa),area(vec2(-1),vec2(1)),origin("center"),rotate(this.angle),killer("asteroid"),gc.velocity({x:vel.x -speed*sina,y:vel.y-speed*cosa},0),gc.ttl(2),gc.boundsHopper(border)]);
            });
        }
    }
}

export function killer(target){
    return {
        add(){
            this.overlaps(target,(item)=>{
                if (item.die){
                    item.die();
                }else {
                    destroy(item);
                }
                destroy(this);
            });
        }
    }
}


export function splitDeath(splits){
    return {
        die(){
            if (splits > 0) {
                add(asteroid({pos:this.pos,splits:splits -1}));
                add(asteroid({pos:this.pos,splits:splits -1}));
            }
            destroy(this);
        }
    }
}

