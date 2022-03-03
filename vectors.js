const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

document.getElementById('first').addEventListener('click', function() {
  document.body.removeChild(this)
  canvas.focus()
})

const BALLZ = []

let LEFT, UP, RIGHT, DOWN

let friction = 0.1

class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  add(v) {
    return new Vector(this.x + v.x, this.y + v.y)
  }
  sub(v) {
    return new Vector(this.x - v.x, this.y - v.y)
  }
  mag() {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }
  mult(scalar) {
    return new Vector(this.x * scalar, this.y * scalar)
  }
  unit() {
  	// to avoid division by zero exception
  	if (this.mag()  == 0) 
    	return new Vector(0,0) 
  	else 
    	return new Vector(this.x / this.mag(), this.y / this.mag() ) 
	}
  normal() {
    return new Vector(-this.y, this.x ).unit()
	}
  
  static dot(v1, v2) {
  	return v1.x * v2.x + v1.y * v2.y
	}
  
  drawVec(start_x, start_y, n, color) {
    ctx.beginPath()
    ctx.moveTo(start_x, start_y)
    ctx.lineTo(start_x + this.x * n, start_y + this.y * n)
    ctx.strokeStyle = color
    ctx.stroke()
  }
}

class Ball {
  constructor(x, y, r) {
    this.x = x
    this.y = y
    this.r = r
    this.vel = new Vector(0, 0)
    this.acc = new Vector(0, 0)
    this.acceleration = 1
    this.player = false
    BALLZ.push(this)
  }
  drawBall() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    ctx.strokeStyle = "#000"
    ctx.stroke()
    ctx.fillStyle = "red"
    ctx.fill()
  }
  display() {
    
    this.vel.drawVec(550, 400, 10, "green")
    
    // to make sure that the acc arrow has always length of 1
    this.acc.unit().drawVec(550, 400, 50, "blue")
	
    // normal is perpendicular to acc
  	this.acc.normal().drawVec(550, 400, 50, "purple")
		
    ctx.beginPath() 
    ctx.arc(550, 400, 50, 0, Math.PI * 2)
    ctx.strokeStyle = "#000"
    ctx.stroke()
  }
}

function keyControls(b) {

  canvas.addEventListener('keydown', function(e) {

    if (e.code == "ArrowLeft") {
      LEFT = true
    }
    if (e.code == "ArrowUp") {
      UP = true
    }
    if (e.code == "ArrowRight") {
      RIGHT = true
    }
    if (e.code == "ArrowDown") {
      DOWN = true
    }
  })
  canvas.addEventListener('keyup', function(e) {
    if (e.code == "ArrowLeft") {
      LEFT = false
    }
    if (e.code == "ArrowUp") {
      UP = false
    }
    if (e.code == "ArrowRight") {
      RIGHT = false
    }
    if (e.code == "ArrowDown") {
      DOWN = false
    }
  })

  if (LEFT) {
    b.acc.x = -b.acceleration
  }
  if (UP) {
    b.acc.y = -b.acceleration
  }
  if (RIGHT) {
    b.acc.x = b.acceleration
  }
  if (DOWN) {
    b.acc.y = b.acceleration
  }

  if (!UP && !DOWN) {
    b.acc.y = 0
  }
  if (!LEFT && !RIGHT) {
    b.acc.x = 0
  }
  
	// in the diagonals the values for acc would add up.. 
	// and to make sure that the magnitude is always 1, use its unit vector:
	b.acc = b.acc.unit().mult(b.acceleration)

  b.vel = b.vel.add(b.acc)
  b.vel = b.vel.mult(1 - friction)
  b.x += b.vel.x
  b.y += b.vel.y
}

function mainLoop() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
  BALLZ.forEach(b => {
    b.drawBall()
    if (b.player) {
      keyControls(b)
    }
    b.display()
  })
  requestAnimationFrame(mainLoop)
}

let b1 = new Ball(200, 200, 30)
b1.player = true

requestAnimationFrame(mainLoop)
