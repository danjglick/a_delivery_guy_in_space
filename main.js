let canvas;
const CANVAS_WIDTH_BUFFER = 10
const CANVAS_HEIGHT_BUFFER = 20
let context;
const MILLISECONDS_PER_FRAME = 100
let level = 1
let planets = []
const PLANET_IMAGES = ["mars.png", "moon.png", "rainbow_planet.png", "sunset_planet.png", "golden_planet.png"]
const MIN_PLANET_LENGTH = 100
const MAX_PLANET_LENGTH = 300
let protagonist = {
    "image_src": "images/spaceship.png",
    "element": null,
    "xPosition": 0,
    "yPosition": 0,
    "width": 60,
    "height": 45
}
const PIXELS_PROTAGONIST_TRAVELS_PER_CLICK = 50
let asteroids = []
const ASTEROID_IMAGES = ["asteroid_a.png", "asteroid_b.png"]
const MIN_ASTEROID_LENGTH = 15
const MAX_ASTEROID_LENGTH = 75
const PIXELS_ASTEROIDS_TRAVEL_PER_FRAME = 20

function initializeGame() {
    canvas = document.getElementsByTagName("canvas")[0]
    canvas.width = window.innerWidth - CANVAS_WIDTH_BUFFER
    canvas.height = window.innerHeight - CANVAS_HEIGHT_BUFFER
    context = canvas.getContext("2d")
    initializeLevel()
    gameLoop()
}

function initializeLevel() {
    initializePlanets()
    initializeProtagonist()
}

function initializePlanets() {
    let images = PLANET_IMAGES
    for (let planetCount = 1; planetCount <= level + 2; planetCount++) {
        let indexOfImage = Math.floor(Math.random() * images.length)
        let image = images[indexOfImage]
        images.splice(indexOfImage, 1)
        let imageSrc = `images/${image}`
        let xPosition;
        let yPosition;
        let try_again = true
        while (try_again) {
            try_again = false
            xPosition = Math.floor(Math.random() * canvas.width)
            yPosition = Math.floor(Math.random() * canvas.height)
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
        let element = document.createElement("IMG")
        element.src = imageSrc
        let length = Math.floor(Math.random() * (MAX_PLANET_LENGTH - MIN_PLANET_LENGTH)) + MIN_PLANET_LENGTH
        planets.push({
            "imageSrc": imageSrc,
            "element": element,
            "xPosition": xPosition,
            "yPosition": yPosition,
            "length": length
        })
    }
}

function initializeProtagonist() {
    protagonist["element"] = document.createElement("IMG")
    protagonist["element"].src = protagonist["image_src"]
    protagonist["xPosition"] = planets[0]["xPosition"]
    protagonist["yPosition"] = planets[0]["yPosition"]
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    drawProtagonist()
    drawPlanets()
    asteroids.push(initializeAsteroid())
    drawAsteroids()
    document.addEventListener('keydown', moveProtagonist)
    setTimeout(gameLoop, MILLISECONDS_PER_FRAME)
}

function drawProtagonist() {
    context.drawImage(protagonist["element"], protagonist["xPosition"], protagonist["yPosition"], protagonist["width"], protagonist["height"])
}

function moveProtagonist(event) {
    switch(event.key) {
        case "ArrowUp":
            protagonist["yPosition"] -= PIXELS_PROTAGONIST_TRAVELS_PER_CLICK
            break
        case "ArrowRight":
            protagonist["xPosition"] += PIXELS_PROTAGONIST_TRAVELS_PER_CLICK
            break
        case "ArrowDown":
            protagonist["yPosition"] += PIXELS_PROTAGONIST_TRAVELS_PER_CLICK
            break
        case "ArrowLeft":
            protagonist["xPosition"] -= PIXELS_PROTAGONIST_TRAVELS_PER_CLICK
            break
    }
}

function drawPlanets() {
    for (let i = 0; i < planets.length; i++) {
        let planet = planets[i]
        context.drawImage(planet["element"], planet["xPosition"], planet["yPosition"], planet["length"], planet["length"])
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
            let length = Math.floor(Math.random() * (MAX_ASTEROID_LENGTH - MIN_ASTEROID_LENGTH)) + MIN_ASTEROID_LENGTH
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

function drawAsteroids() {
    let newAsteroid = initializeAsteroid()
    asteroids.push(newAsteroid)
    for (let asteroidCount = 0; asteroidCount < asteroids.length; asteroidCount++) {
        let asteroid = asteroids[asteroidCount]
        moveAsteroid(asteroid)
        let asteroidElement = document.createElement("IMG")
        asteroidElement.src = asteroids[asteroidCount]["imageSrc"]
        context.drawImage(asteroidElement, asteroid["xPosition"], asteroid["yPosition"], asteroid["length"], asteroid["length"])
    }
}

function moveAsteroid(asteroid) {
    switch(asteroid.direction) {
        case "northeast":
            asteroid.xPosition += PIXELS_ASTEROIDS_TRAVEL_PER_FRAME
            asteroid.yPosition -= PIXELS_ASTEROIDS_TRAVEL_PER_FRAME
            break
        case "southeast":
            asteroid.xPosition += PIXELS_ASTEROIDS_TRAVEL_PER_FRAME
            asteroid.yPosition += PIXELS_ASTEROIDS_TRAVEL_PER_FRAME
            break
        case "southwest":
            asteroid.xPosition -= PIXELS_ASTEROIDS_TRAVEL_PER_FRAME
            asteroid.yPosition += PIXELS_ASTEROIDS_TRAVEL_PER_FRAME
            break
        case "northwest":
            asteroid.xPosition -= PIXELS_ASTEROIDS_TRAVEL_PER_FRAME
            asteroid.yPosition -= PIXELS_ASTEROIDS_TRAVEL_PER_FRAME
    }
}

