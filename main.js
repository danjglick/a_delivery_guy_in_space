const MILLISECONDS_PER_FRAME = 100
const PIXELS_BUFFER = 20
const MILLISECONDS_BUFFER = 250
const EARTH_IMAGE = "images/earth.png"
const PLANET_IMAGES = ["images/mars.png", "images/moon.png", "images/rainbow_planet.png", "images/sunset_planet.png", "images/golden_planet.png"]
const MIN_PLANET_DIAMETER = 100
const MAX_PLANET_DIAMETER = 300
const PROTAGONIST_IMAGE = "images/spaceship.png"
const PROTAGONIST_WIDTH = 60
const PROTAGONIST_HEIGHT = 45
const PIXELS_PROTAGONIST_TRAVELS_PER_CLICK = 50
const ASTEROID_IMAGES = ["images/asteroid_a.png", "images/asteroid_b.png"]
const MIN_ASTEROID_DIAMETER = 15
const MAX_ASTEROID_DIAMETER = 75
const PIXELS_ASTEROIDS_TRAVEL_PER_FRAME = 20
const ALIEN_IMAGES = ["images/alien_a.png", "images/alien_b.png"]
const CROWD_IMAGE = "images/crowd.png"
const CHEERER_DIAMETER = 100
const EXPLOSION_IMAGE = "images/explosion.png"
const EXPLOSION_DIAMETER = 200
const FRAMES_PER_EXPLOSION = 2

let canvas;
let context;
let level = 1
let planets = []
let protagonist = {
    "image": PROTAGONIST_IMAGE,
    "element": null,
    "xPosition": 0,
    "yPosition": 0,
    "width": PROTAGONIST_WIDTH,
    "height": PROTAGONIST_HEIGHT
}
let asteroids = []
let visitedPlaces = []
let explosion = {
    "xPosition": 0,
    "yPosition": 0,
    "framesLeft": 0
}

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
        let diameter = Math.floor(Math.random() * (MAX_PLANET_DIAMETER - MIN_PLANET_DIAMETER)) + MIN_PLANET_DIAMETER
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
    protagonist["element"].src = PROTAGONIST_IMAGE
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
            let diameter = Math.floor(Math.random() * (MAX_ASTEROID_DIAMETER - MIN_ASTEROID_DIAMETER)) + MIN_ASTEROID_DIAMETER
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
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(protagonist["element"], protagonist["xPosition"], protagonist["yPosition"], protagonist["width"], protagonist["height"])
    drawPlanets()
    drawAsteroids()
    document.addEventListener('keydown', moveProtagonist)
    if (isProtagonistInPlanet()) {
        cheerProtagonist()
    } else if (isProtagonistInAsteroid()) {
        explodeProtagonist()
    }
    if (explosion["framesLeft"] > 0) {
        explodeProtagonist()
        explosion["framesLeft"]--
    }
    setTimeout(gameLoop, MILLISECONDS_PER_FRAME)
}

function drawPlanets() {
    for (let i = 0; i < planets.length; i++) {
        let planet = planets[i]
        context.drawImage(planet["element"], planet["xPosition"], planet["yPosition"], planet["diameter"], planet["diameter"])
    }
}

function drawAsteroids() {
    asteroids.push(initializeAsteroid())
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
    asteroids = asteroids.filter(asteroid => asteroid["xPosition"] >= 0 && asteroid["xPosition"] <= canvas.width && asteroid["yPosition"] >= 0 && asteroid["yPosition"] <= canvas.height)
}

function getXPositionsCoveredByProtagonist() {
    let xPositionsCoveredByProtagonist = []
    for (let i = protagonist["xPosition"]; i < protagonist["xPosition"] + protagonist["width"]; i++) {
        xPositionsCoveredByProtagonist.push(i)
    }
    return xPositionsCoveredByProtagonist
}

function getYPositionsCoveredByProtagonist() {
    let yPositionsCoveredByProtagonist = []
    for (let i = protagonist["yPosition"]; i < protagonist["yPosition"] + protagonist["height"]; i++) {
        yPositionsCoveredByProtagonist.push(i)
    }
    return yPositionsCoveredByProtagonist
}

function isProtagonistInPlanet() {
    let xPositionsCoveredByProtagonist = getXPositionsCoveredByProtagonist()
    let yPositionsCoveredByProtagonist = getYPositionsCoveredByProtagonist()
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
            if (visitedPlaces[visitedPlaces.length - 1] !== planet) {
                visitedPlaces.push(planet)
            }
            return true
        }
    }
    if (visitedPlaces[visitedPlaces.length - 1] !== "space") {
        visitedPlaces.push("space")
    }
    return false
}

function isProtagonistInAsteroid() {
    let xPositionsCoveredByProtagonist = getXPositionsCoveredByProtagonist()
    let yPositionsCoveredByProtagonist = getYPositionsCoveredByProtagonist()
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
            explosion["xPosition"] = protagonist["xPosition"]
            explosion["yPosition"] = protagonist["yPosition"]
            explosion["framesLeft"] = FRAMES_PER_EXPLOSION
            return true
        }
    }
    return false
}

function cheerProtagonist() {
    let currentPlanet = visitedPlaces[visitedPlaces.length - 1]
    let isFirstVisitToCurrentPlanet = visitedPlaces.indexOf(currentPlanet) === visitedPlaces.lastIndexOf(currentPlanet)
    if (currentPlanet["image"] !== EARTH_IMAGE && isFirstVisitToCurrentPlanet) {
        setTimeout(function() {document.getElementById("smallCheerSound").play()}, MILLISECONDS_BUFFER)
        let alienElement = document.createElement("IMG")
        alienElement.src = "images/alien_a.png"
        context.drawImage(alienElement, currentPlanet["xPosition"], currentPlanet["yPosition"], CHEERER_DIAMETER, CHEERER_DIAMETER)
        setTimeout(function() {visitedPlaces.push("space")}, MILLISECONDS_BUFFER * 5)
    }
    let visitedPlanets = []
    for (let i = 0; i < visitedPlaces.length; i++) {
        let visitedPlace = visitedPlaces[i]
        if (visitedPlace !== "space" && !visitedPlanets.includes(visitedPlace)) {
            visitedPlanets.push(visitedPlace)
        }
    }
    if (currentPlanet["image"] === EARTH_IMAGE && visitedPlanets.length === planets.length) {
        setTimeout(function() {document.getElementById("smallCheerSound").play()}, MILLISECONDS_BUFFER)
        setTimeout(function() {document.getElementById("bigCheerSound").play()}, MILLISECONDS_BUFFER)
        let crowdElement = document.createElement("IMG")
        crowdElement.src = CROWD_IMAGE
        context.drawImage(crowdElement, currentPlanet["xPosition"], currentPlanet["yPosition"], CHEERER_DIAMETER, CHEERER_DIAMETER)
        setTimeout(function() {visitedPlaces = []}, MILLISECONDS_BUFFER * 20)
    }
}

function explodeProtagonist() {
    document.getElementById("explosionSound").play()
    setTimeout(function() {document.getElementById("booSound").play()}, MILLISECONDS_BUFFER * 2)
    let explosionElement = document.createElement("IMG")
    explosionElement.src = EXPLOSION_IMAGE
    context.drawImage(explosionElement, (explosion["xPosition"] - protagonist["width"] - PIXELS_BUFFER), (explosion["yPosition"] - protagonist["height"] - PIXELS_BUFFER), EXPLOSION_DIAMETER, EXPLOSION_DIAMETER)
    visitedPlaces = []
    setTimeout(function() {initializeProtagonist()}, MILLISECONDS_BUFFER)
}

