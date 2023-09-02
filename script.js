const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const canvas2 = document.getElementById("canvas2")
const ctx2 = canvas2.getContext("2d")

const data = {
    Origin: { x: 400, y: 300 },
    width: canvas.width,
    height: canvas.height,
    GravityConstant: 0.1,   //1
    ElasticModulus: 0.5,    //20
    objectMass: 1,
    NodeSize: 0,
    NodeCount: 10
}

const delta = {
    x: 20,
    y: 20
}

const v_limit = 5

const PI2 = Math.PI * 2
const print = (t) => { console.log(t) }

function lineTo(x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    ctx.closePath()
}

function drawCircle(x, y, radius) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, PI2)
    ctx.fill()
    ctx.closePath()
}

function distance(pos1, pos2) {
    return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2)
}

function getAngle(x1, y1, x2, y2) {
    var rad = Math.atan2(y2 - y1, x2 - x1);
    return (rad * 180) / Math.PI;
}

function getRadian(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

class Ball {
    constructor(x, y, mass, radius, hangObj, hangPos) {
        this.hangObj = hangObj
        this.hangPos = hangPos
        this.length = Math.sqrt((this.hangPos.x - x) ** 2 + (this.hangPos.y - y) ** 2)
        this.pos = { x: x, y: y }
        this.vel = { x: 0, y: 0 }
        this.radius = radius   //물체의 반지름
        this.mass = mass
    }
    get x() { return this.pos.x }
    get y() { return this.pos.y }
    draw() {
        lineTo(this.x, this.y, this.hangPos.x, this.hangPos.y)
        drawCircle(this.x, this.y, this.radius)
    }
    applyGravity() {
        this.vel.y += data.GravityConstant
    }
    applyForce(F) {
        this.vel.x += F.x / this.mass
        this.vel.y += F.y / this.mass
    }
    move() {
        if (this.vel.x > v_limit) {
            this.vel.x = v_limit
        } else if (this.vel.x < -v_limit) {
            this.vel.x = -v_limit
        }
        if (this.vel.y > v_limit) {
            this.vel.y = v_limit
        } else if (this.vel.y < -v_limit) {
            this.vel.y = -v_limit
        }
        this.pos.x += this.vel.x
        this.pos.y += this.vel.y
        //중력
        this.applyGravity()

        //탄성력
        if (this.length < distance(this.pos, this.hangPos)) {
            const _seta = getRadian(this.pos.x, this.pos.y, this.hangPos.x, this.hangPos.y)
            const _origin = {
                x: -this.length * Math.cos(_seta) + this.hangPos.x,
                y: -this.length * Math.sin(_seta) + this.hangPos.y
            }
            const ElasticForce = {
                x: (_origin.x - this.x) * data.ElasticModulus,
                y: (_origin.y - this.y) * data.ElasticModulus
            }
            if (this.hangObj) {
                this.hangObj.applyForce({ x: -ElasticForce.x, y: -ElasticForce.y })
            }

            this.applyForce(ElasticForce)
        }
        /*if (this.vel.x > 0) {
            this.vel.x -= 0.001
        } else if (this.vel.x < 0) {
            this.vel.x += 0.001
        }
        if (this.vel.y > 0) {
            this.vel.y -= 0.001
        } else if (this.vel.y < 0) {
            this.vel.y += 0.001
        }*/
    }
}


const renderObj = []
renderObj.push(new Ball(data.Origin.x + delta.x, data.Origin.y + delta.y, data.objectMass, data.NodeSize, undefined, data.Origin))
for (var i = 0; i < data.NodeCount; i++) {
    renderObj.push(new Ball(renderObj[i].x + delta.x, renderObj[i].y + delta.y, data.objectMass, data.NodeSize, renderObj[i], renderObj[i].pos))
}
renderObj.push(new Ball(renderObj[renderObj.length - 1].x + delta.x, renderObj[renderObj.length - 1].y + delta.y, 2, 10, renderObj[renderObj.length - 1], renderObj[renderObj.length - 1].pos))

ctx2.fillStyle = 'rgba(255,60,25,0.5)'
function render() {

    ctx.clearRect(0, 0, data.width, data.height)

    drawCircle(data.Origin.x, data.Origin.y, 2)
    for (var i in renderObj) {
        renderObj[i].move()
        renderObj[i].draw()
    }
    console.log(renderObj[3].vel)

    requestAnimationFrame(render)
}

render()