// make responsive
// implement game mechanics
// implement levels
// implement sounds
// implement global high scores list that displays after you beat a level
// make a black hole in each planet that fills when protagonist reaches the planet
// polish
// port to ios
// release

let canvas;
let context;
let level = 1
let planets = []
let asteroids = []
let xPositionProtagonist;
let yPositionProtagonist;
const MILLISECONDS_PER_FRAME = 100
const PIXELS_ASTEROIDS_TRAVEL_PER_FRAME = 20
const PIXELS_PROTAGONIST_TRAVELS_PER_CLICK = 50
const PLANET_IMAGES = ["mars.png", "moon.png", "rainbow_planet.png", "sunset_planet.png", "golden_planet.png"]
const ASTEROID_IMAGES = ["asteroid_a.png", "asteroid_b.png"]

function start_game() {
    canvas = document.getElementsByTagName("canvas")[0]
    canvas.width = window.innerWidth - 10
    canvas.height = window.innerHeight - 110
    context = canvas.getContext("2d")
    initializeLevel()
    gameLoop()
}

function initializeLevel() {
    initializePlanets()
    xPositionProtagonist = planets[0]["xPosition"]
    yPositionProtagonist = planets[0]["yPosition"]
}

function initializePlanets() {
    let images = PLANET_IMAGES
    for (let i = 1; i <= level + 2; i++) {
        let xPosition;
        let yPosition;
        let try_again = true
        while (try_again) {
            try_again = false
            xPosition = Math.floor(Math.random() * (canvas.width - 200))
            yPosition = Math.floor(Math.random() * (canvas.height - 200))
            // if (planets.length > 0) {
            //     for (let i = 0; i < planets.length; i++) {
            //         let isEnoughWidthBetweenPlanets = Math.abs(xPosition - planets[i]["xPosition"]) > 300
            //         let isEnoughHeightBetweenPlanets = Math.abs(yPosition - planets[i]["yPosition"]) > 150
            //         if (!isEnoughWidthBetweenPlanets || !isEnoughHeightBetweenPlanets) {
            //             try_again = true
            //         }
            //     }
            // }
        }
        let length = Math.floor(Math.random() * 200) + 100
        let imageIndex = Math.floor(Math.random() * images.length)
        let image = images[imageIndex]
        images.splice(imageIndex, 1)
        let imageSrc = `images/${image}`
        planets.push({
            "xPosition": xPosition,
            "yPosition": yPosition,
            "length": length,
            "imageSrc": imageSrc
        })
    }
}

function initializeAsteroid() {
    while (true) {
        let possibleXPositions = [0, canvas.width, Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.width)]
        let xPosition = possibleXPositions[Math.floor(Math.random() * possibleXPositions.length)]
        let possibleYPositions = [0, canvas.height, Math.floor(Math.random() * canvas.height), Math.floor(Math.random() * canvas.height)]
        let yPosition = possibleYPositions[Math.floor(Math.random() * possibleYPositions.length)]
        if (xPosition === 0 || xPosition === canvas.width || yPosition === 0 || yPosition === canvas.height) {
            let possibleDirections = ["northeast", "southeast", "southwest", "northwest"]
            let direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)]
            let length = Math.floor(Math.random() * 60) + 15
            let randomAsteroidImage = ASTEROID_IMAGES[Math.floor(Math.random() * ASTEROID_IMAGES.length)]
            let imageSrc = `images/${randomAsteroidImage}`
            return {
                "xPosition": xPosition,
                "yPosition": yPosition,
                "direction": direction,
                "length": length,
                "imageSrc": imageSrc
            }
        }
    }
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    drawProtagonist()
    drawPlanets()
    drawAsteroids()
    document.addEventListener('keydown', moveProtagonist)
    setTimeout(gameLoop, MILLISECONDS_PER_FRAME)
}

function drawPlanets() {
    for (let i = 0; i < planets.length; i++) {
        let planet = planets[i]
        let element = document.createElement("IMG")
        element.src = planet.imageSrc
        context.drawImage(element, planet.xPosition, planet.yPosition, planet.length, planet.length)
    }
}

function drawProtagonist() {
    element = document.createElement("IMG")
    element.src = "images/spaceship.png"
    context.drawImage(element, xPositionProtagonist, yPositionProtagonist, 60, 45)
}

function drawAsteroids() {
    let newAsteroid = initializeAsteroid()
    asteroids.push(newAsteroid)
    for (let i = 0; i < asteroids.length; i++) {
        let asteroid = asteroids[i]
        positionAsteroid(asteroid)
        let element = document.createElement("IMG")
        element.src = asteroids[i].imageSrc
        context.drawImage(element, asteroid["xPosition"], asteroid["yPosition"], asteroid["length"], asteroid["length"])
    }
}

function positionAsteroid(asteroid) {
    switch(asteroid["direction"]) {
        case "northeast":
            asteroid["xPosition"] += PIXELS_ASTEROIDS_TRAVEL_PER_FRAME
            asteroid["yPosition"] -= PIXELS_ASTEROIDS_TRAVEL_PER_FRAME
            break
        case "southeast":
            asteroid["xPosition"] += PIXELS_ASTEROIDS_TRAVEL_PER_FRAME
            asteroid["yPosition"] += PIXELS_ASTEROIDS_TRAVEL_PER_FRAME
            break
        case "southwest":
            asteroid["xPosition"] -= PIXELS_ASTEROIDS_TRAVEL_PER_FRAME
            asteroid["yPosition"] += PIXELS_ASTEROIDS_TRAVEL_PER_FRAME
            break
        case "northwest":
            asteroid["xPosition"] -= PIXELS_ASTEROIDS_TRAVEL_PER_FRAME
            asteroid["yPosition"] -= PIXELS_ASTEROIDS_TRAVEL_PER_FRAME
    }
}

function moveProtagonist(event) {
    switch(event.key) {
        case "ArrowUp":
            yPositionProtagonist -= PIXELS_PROTAGONIST_TRAVELS_PER_CLICK
            break
        case "ArrowRight":
            xPositionProtagonist += PIXELS_PROTAGONIST_TRAVELS_PER_CLICK
            break
        case "ArrowDown":
            yPositionProtagonist += PIXELS_PROTAGONIST_TRAVELS_PER_CLICK
            break
        case "ArrowLeft":
            xPositionProtagonist -= PIXELS_PROTAGONIST_TRAVELS_PER_CLICK
            break
    }
}

