
//util
export function close_to(a,b) {
    return ((Math.abs(a.x - b.x) < 5 )  && (Math.abs(a.y - b.y) <5))
}

export function randInt(n) {
    return Math.floor((Math.random() * n) + 1);
}


export function randr(a,b) {
    if (!b) {
        b= a;
        a = 0;
    }
    return ((Math.random() * (b-a)) +a);
}

export function randDir(speed) {
    speed = speed ||1  ;
    let a = randr(6.28);
    return {
        x:speed*Math.sin(a),
        y:speed*Math.cos(a),
    };
}



export function waypoints(wps,speed) {
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

export function spinner(speed,friction) {
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

export function velocity(v,friction){
    friction = friction || 0;
    return {
        add(){
            this.action(()=> {
                let d = dt();
                v.x *= 1-(d*friction);
                v.y *= 1-(d*friction);
                this.pos.x += v.x * d;
                this.pos.y += v.y * d;
            })
        },
        push(nx,ny){
            v.x += nx;
            v.y += ny;
        },
        vel(){
            return {x:v.x,y:v.y};
        }
    }
}

export function boundsHopper(bound){
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

export function boundsKiller(bound){
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

export function ttl(time){
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

