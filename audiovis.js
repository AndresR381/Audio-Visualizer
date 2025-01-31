let button

let song
let img

let fft
let particles = []

function preload() {
    img = loadImage('image/cat-guitar.gif')
}

function setup() {
    let cnv = createCanvas(windowWidth, windowHeight)
    
    song = loadSound('media/dooo.mp3', loaded)

    angleMode(DEGREES)
    imageMode(CENTER)
    rectMode(CENTER)

    cnv.mouseClicked(togglePlaying)

    fft = new p5.FFT(0.3)
    // img.filter(BLUR, 12)

    noLoop()
}

const loaded=()=> {
    button = createButton("play")
    button.mousePressed(togglePlaying)
}

function draw() {
    background(0)

    // let r = Math.floor(Math.random() * 255)
    // let g = Math.floor(Math.random() * 255)
    // let b = Math.floor(Math.random() * 255)
    // stroke(r, g, b)

    // // stroke(255)
    // strokeWeight(3)
    // noFill()

    translate(width / 2, height / 2)

    fft.analyze()
    amp = fft.getEnergy(20, 200)

    push()

    if (amp > 230) {
        rotate(random(-0.5, 0.5))
    }

    image(img, 0, 0, 800, 800)

    pop()

    const alpha = map(amp, 0, 255, 180, 150)
    fill(0, alpha)

    noStroke()
    rect(0, 0, width, height)

    let r = Math.floor(Math.random() * 255)
    let g = Math.floor(Math.random() * 255)
    let b = Math.floor(Math.random() * 255)
    stroke(r, g, b)

    // stroke(255)
    strokeWeight(3)
    noFill()

    let wave = fft.waveform()

    for (var t = -1; t <= 1; t += 2) {
        beginShape()
    
        for (var i = 0; i <= 180; i+= 0.5) {
            var index = floor(map(i, 0, 180, 0, wave.length - 1))
    
            var radius = map(wave[index], -1, 1, 150, 350)
    
            var x = radius * sin(i) * t
            var y = radius * cos(i)
    
            vertex(x, y)
        }
    
        endShape()
    }

    beginShape()

    for (var i = 0; i <= 360; i++) {
        var index = floor(map(i, 0, 360, 0, wave.length - 1))

        var radius = map(wave[index], -1, -1, 150, 350)

        var x = r * sin(i)
        var y = r * cos(i)

        vertex(x, y)
    }

    endShape()


let p = new Particle()

particles.push(p)

for (var i = particles.length - 1; i >= 0; i--) {
    if (!particles[i].edges()) {
        particles[i].update()
        particles[i].show()
        particles[i].update(amp > 230)
    } else {
        particles.splice(i, 1)
    }
    
}

}

function mouseClicked() {
    if(song.isPlaying()) {
        song.pause()
        noLoop()
    } else {
        song.play()
        loop()
    }
}

class Particle {
    constructor() {
        this.pos = p5.Vector.random2D().mult(250)
        this.vel = createVector(0, 0)
        this.acc = this.pos.copy().mult(random(0.001, 0.00001))
        this.w = random(3, 6)
        this.color = [random(200, 255), 
                        random(200, 255), 
                        random(200, 255)
                    ]
    }

    update(cond) {
        this.vel.add(this.acc)
        this.pos.add(this.vel)
        if (cond) {
            this.pos.add(this.vel)
            this.pos.add(this.vel)
            this.pos.add(this.vel)
        }
    }

    edges() {
        if (this.pos.x < -width / 2
            || this.pos.x > width / 2
            || this.pos.y < -height / 2
            || this.pos.y > height / 2
        ) {
            return true;
        }   else {
            return false;
        }
    }
    
    show() {
        noStroke()
        let r = Math.floor(Math.random() * 255)
        let g = Math.floor(Math.random() * 255)
        let b = Math.floor(Math.random() * 255)
        fill(r, g, b)
        ellipse(this.pos.x, this.pos.y, this.w)
    }
}

const togglePlaying =()=> {
    // if(!song.isPlaying()) {
    //     song.play()
    //     loop()
    //     song.setVolume(0.3)
    //     button.html("pause")
    // } else {
    //     song.pause()
    //     noLoop()
    //     button.html("play")
    // }
}
