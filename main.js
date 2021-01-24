const MILLISECONDS_PER_FRAME = 100
const EARTH_IMAGE = "images/earth.png"
const PLANET_IMAGES = ["images/mars.png", "images/moon.png", "images/rainbow_planet.png", "images/sunset_planet.png", "images/golden_planet.png"]
const MIN_PLANET_LENGTH = 100
const MAX_PLANET_LENGTH = 300
const PROTAGONIST_WIDTH = 60
const PROTAGONIST_HEIGHT = 45
const PIXELS_PROTAGONIST_TRAVELS_PER_CLICK = 50
const ASTEROID_IMAGES = ["images/asteroid_a.png", "images/asteroid_b.png"]
const MIN_ASTEROID_LENGTH = 15
const MAX_ASTEROID_LENGTH = 75
const PIXELS_ASTEROIDS_TRAVEL_PER_FRAME = 20
const CROWD_IMAGE = "images/crowd.png"
const ALIEN_IMAGES = ["images/alien_a.png", "images/alien_b.png"]
const CHEERER_DIAMETER = 100
const EXPLOSION_IMAGE = "images/explosion.png"
const EXPLOSION_DIAMETER = 150
const PIXELS_BUFFER = 20

let canvas;
let context;
let level = 1
let planets = []
let protagonist = {
    "image": "images/spaceship.png",
    "element": null,
    "xPosition": 0,
    "yPosition": 0,
    "width": PROTAGONIST_WIDTH,
    "height": PROTAGONIST_HEIGHT
}
let asteroids = []
let visitedPlanets = []

function initializeGame() {
    canvas = document.getElementsByTagName("canvas")[0]
    canvas.width = window.innerWidth - PIXELS_BUFFER
    canvas.height = window.innerHeight - PIXELS_BUFFER
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
        let image = ""
        if (planetCount === 1) {
            image = EARTH_IMAGE
        } else {
            let indexOfImage = Math.floor(Math.random() * images.length)
            image = images[indexOfImage]
            images.splice(indexOfImage, 1)
        }
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
        element.src = image
        let diameter = Math.floor(Math.random() * (MAX_PLANET_LENGTH - MIN_PLANET_LENGTH)) + MIN_PLANET_LENGTH
        planets.push({
            "image": image,
            "element": element,
            "xPosition": xPosition,
            "yPosition": yPosition,
            "diameter": diameter
        })
    }
}

function initializeProtagonist() {
    protagonist["element"] = document.createElement("IMG")
    protagonist["element"].src = protagonist["image"]
    protagonist["xPosition"] = planets[0]["xPosition"]
    protagonist["yPosition"] = planets[0]["yPosition"]
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
            let diameter = Math.floor(Math.random() * (MAX_ASTEROID_LENGTH - MIN_ASTEROID_LENGTH)) + MIN_ASTEROID_LENGTH
            let image = ASTEROID_IMAGES[Math.floor(Math.random() * ASTEROID_IMAGES.length)]
            return {
                "image": image,
                "xPosition": xPosition,
                "yPosition": yPosition,
                "direction": direction,
                "diameter": diameter
            }
        }
    }
}

function gameLoop() {
    context.drawImage(protagonist["element"], protagonist["xPosition"], protagonist["yPosition"], protagonist["width"], protagonist["height"])
    drawPlanets()
    asteroids.push(initializeAsteroid())
    drawAsteroids()
    document.addEventListener('keydown', moveProtagonist)
    if (isProtagonistInPlanet()) {
        cheerProtagonist()
    } else if (isProtagonistInAsteroid()) {
        explodeProtagonist()
    }
    setTimeout(gameLoop, MILLISECONDS_PER_FRAME)
    context.clearRect(0, 0, canvas.width, canvas.height)
}

function drawPlanets() {
    for (let i = 0; i < planets.length; i++) {
        let planet = planets[i]
        context.drawImage(planet["element"], planet["xPosition"], planet["yPosition"], planet["diameter"], planet["diameter"])
    }
}

function drawAsteroids() {
    let newAsteroid = initializeAsteroid()
    asteroids.push(newAsteroid)
    for (let i = 0; i < asteroids.length; i++) {
        let asteroid = asteroids[i]
        moveAsteroid(asteroid)
        let asteroidElement = document.createElement("IMG")
        asteroidElement.src = asteroid["image"]
        context.drawImage(asteroidElement, asteroid["xPosition"], asteroid["yPosition"], asteroid["diameter"], asteroid["diameter"])
    }
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

function moveAsteroid(asteroid) {
    switch(asteroid.direction) {
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

function isProtagonistInPlanet() {
    let xPositionsCoveredByProtagonist = []
    for (let i = protagonist["xPosition"]; i < protagonist["xPosition"] + protagonist["width"]; i++) {
        xPositionsCoveredByProtagonist.push(i)
    }
    let yPositionsCoveredByProtagonist = []
    for (let i = protagonist["yPosition"]; i < protagonist["yPosition"] + protagonist["height"]; i++) {
        yPositionsCoveredByProtagonist.push(i)
    }
    for (let i = 0; i < planets.length; i++) {
        let planet = planets[i]
        let xPositionsCoveredByPlanet = []
        for (let ii = planet["xPosition"]; ii < planet["xPosition"] + planet["diameter"]; ii++) {
            xPositionsCoveredByPlanet.push(ii)
        }
        let yPositionsCoveredByPlanet = []
        for (let ii = planet["yPosition"]; ii < planet["yPosition"] + planet["diameter"]; ii++) {
            yPositionsCoveredByPlanet.push(ii)
        }
        let isProtagonistHorizontallyAlignedWithPlanet = (xPositionsCoveredByProtagonist.filter(xPositionCoveredByProtagonist => xPositionsCoveredByPlanet.includes(xPositionCoveredByProtagonist)).length > 0)
        let isProtagonistVerticallyAlignedWithPlanet = (yPositionsCoveredByProtagonist.filter(yPositionCoveredByProtagonist => yPositionsCoveredByPlanet.includes(yPositionCoveredByProtagonist)).length > 0)
        if (isProtagonistHorizontallyAlignedWithPlanet && isProtagonistVerticallyAlignedWithPlanet) {
            visitedPlanets.push(planet)
            return true
        }
    }
    return false
}

function isProtagonistInAsteroid() {
    let xPositionsCoveredByProtagonist = []
    for (let i = protagonist["xPosition"]; i < (protagonist["xPosition"]) + protagonist["width"]; i++) {
        xPositionsCoveredByProtagonist.push(i)
    }
    let yPositionsCoveredByProtagonist = []
    for (let i = protagonist["yPosition"]; i < protagonist["yPosition"] + protagonist["height"]; i++) {
        yPositionsCoveredByProtagonist.push(i)
    }
    for (let i = 0; i < asteroids.length; i++) {
        let asteroid = asteroids[i]
        let xPositionsCoveredByAsteroid = []
        for (let ii = asteroid["xPosition"]; (ii < asteroid["xPosition"] + asteroid["diameter"]); ii++) {
            xPositionsCoveredByAsteroid.push(ii)
        }
        let yPositionsCoveredByAsteroid = []
        for (let ii = asteroid["yPosition"]; (ii < asteroid["yPosition"] + asteroid["diameter"]); ii++) {
            yPositionsCoveredByAsteroid.push(ii)
        }
        let isProtagonistHorizontallyAlignedWithAsteroid = (xPositionsCoveredByProtagonist.filter(xPositionCoveredByProtagonist => xPositionsCoveredByAsteroid.includes(xPositionCoveredByProtagonist)).length > 0)
        let isProtagonistVerticallyAlignedWithAsteroid = (yPositionsCoveredByProtagonist.filter(yPositionCoveredByProtagonist => yPositionsCoveredByAsteroid.includes(yPositionCoveredByProtagonist)).length > 0)
        if (isProtagonistHorizontallyAlignedWithAsteroid && isProtagonistVerticallyAlignedWithAsteroid) {
            return true
        }
    }
    return false
}

function cheerProtagonist() {
    let currentPlanet = visitedPlanets[visitedPlanets.length - 1]
    if (currentPlanet["image"] !== EARTH_IMAGE) {
        let alienElement = document.createElement("IMG")
        alienElement.src = "images/alien_a.png"
        context.drawImage(alienElement, currentPlanet["xPosition"], currentPlanet["yPosition"], CHEERER_DIAMETER, CHEERER_DIAMETER)
    } else if ([...new Set(visitedPlanets)].length === planets.length) {
        let familyElement = document.createElement("IMG")
        familyElement.src = "images/crowd.png"
        context.drawImage(familyElement, currentPlanet["xPosition"], currentPlanet["yPosition"], CHEERER_DIAMETER, CHEERER_DIAMETER)
    }
}

function explodeProtagonist() {
    let explosionElement = document.createElement("IMG")
    explosionElement.src = EXPLOSION_IMAGE
    context.drawImage(explosionElement, (protagonist["xPosition"] - protagonist["width"] + PIXELS_BUFFER), (protagonist["yPosition"] - protagonist["height"] + PIXELS_BUFFER), EXPLOSION_DIAMETER, EXPLOSION_DIAMETER)
    visitedPlanets = []
    initializeProtagonist()
}

