const MILLISECONDS_PER_FRAME = 100
const MILLISECONDS_BUFFER = 250
const PIXELS_BUFFER = 20
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
const EXPLOSION_IMAGE = "images/explosion.png"
const EXPLOSION_DIAMETER = 200
const FRAMES_PER_EXPLOSION = 2
const ALIEN_IMAGES = ["images/alien_a.png", "images/alien_b.png"]
const CROWD_IMAGE = "images/crowd.png"
const CHEERER_DIAMETER = 100

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
let millisecondsBetweenAsteroidInitializations = MILLISECONDS_PER_FRAME
let placesVisited = []
let explosion = {
    "xPosition": 0,
    "yPosition": 0,
    "framesLeft": 0
}
let hasClosedLevel = false
let isSoundOn = false

function initializeLevel() {
    document.getElementById("menu").hidden = true
    document.getElementById("game").hidden = false
    canvas = document.getElementById("canvas")
    canvas.width = window.innerWidth - PIXELS_BUFFER
    canvas.height = window.innerHeight - PIXELS_BUFFER
    context = canvas.getContext("2d")
    hasClosedLevel = false
    initializePlanets()
    initializeProtagonist()
    initializeAsteroids()
    gameLoop()
}

function initializePlanets() {
    let planetImages = PLANET_IMAGES
    let alienImages = ALIEN_IMAGES
    for (let i = 0; i < level + 1; i++) {
        let element = document.createElement("IMG")
        let image = ""
        let cheerer = ""
        if (i === 0) {
            image = EARTH_IMAGE
            cheerer = CROWD_IMAGE
        } else {
            let indexOfPlanetImage = Math.floor(Math.random() * planetImages.length)
            image = planetImages[indexOfPlanetImage]
            // planetImages.splice(indexOfPlanetImage, 1)
            let indexOfAlienImage = Math.floor(Math.random() * alienImages.length)
            cheerer = alienImages[indexOfAlienImage]
            // alienImages.splice(indexOfAlienImage, 1)
        }
        element.src = image
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
        let diameter = Math.floor(Math.random() * (MAX_PLANET_DIAMETER - MIN_PLANET_DIAMETER)) + MIN_PLANET_DIAMETER
        planets.push({
            "element": element,
            "image": image,
            "xPosition": xPosition,
            "yPosition": yPosition,
            "diameter": diameter,
            "cheerer": cheerer,
        })
    }
}

function initializeProtagonist() {
    protagonist["element"] = document.createElement("IMG")
    protagonist["element"].src = protagonist["image"]
    protagonist["xPosition"] = planets[0]["xPosition"]
    protagonist["yPosition"] = planets[0]["yPosition"]
    document.onkeydown = moveProtagonist
}

function initializeAsteroids() {
    let possibleXPositions = [0, canvas.width, Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.width)]
    let xPosition = possibleXPositions[Math.floor(Math.random() * possibleXPositions.length)]
    let possibleYPositions = [0, canvas.height, Math.floor(Math.random() * canvas.height), Math.floor(Math.random() * canvas.height)]
    let yPosition = possibleYPositions[Math.floor(Math.random() * possibleYPositions.length)]
    if (xPosition === 0 || xPosition === canvas.width || yPosition === 0 || yPosition === canvas.height) {
        let possibleDirections = ["northeast", "southeast", "southwest", "northwest"]
        let direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)]
        let diameter = Math.floor(Math.random() * (MAX_ASTEROID_DIAMETER - MIN_ASTEROID_DIAMETER)) + MIN_ASTEROID_DIAMETER
        let image = ASTEROID_IMAGES[Math.floor(Math.random() * ASTEROID_IMAGES.length)]
        asteroids.push({
            "image": image,
            "xPosition": xPosition,
            "yPosition": yPosition,
            "direction": direction,
            "diameter": diameter
        })
    }
    setTimeout(initializeAsteroids, millisecondsBetweenAsteroidInitializations)
}

function initializeExplosion() {
    explosion["xPosition"] = protagonist["xPosition"]
    explosion["yPosition"] = protagonist["yPosition"]
    explosion["framesLeft"] = FRAMES_PER_EXPLOSION
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    drawProtagonist()
    drawPlanets()
    for (let i = 0; i < asteroids.length; i++) {
        drawAsteroid(asteroids[i])
        moveAsteroid(asteroids[i])
    }
    if (isProtagonistInPlanet()) {
        cheerProtagonist()
    } else if (isProtagonistInAsteroid()) {
        initializeExplosion()
        explodeProtagonist()
    }
    if (explosion["framesLeft"] > 0) {
        explodeProtagonist()
        explosion["framesLeft"]--
    }
    if (document.getElementById("menu").hidden) {
        setTimeout(gameLoop, MILLISECONDS_PER_FRAME)
    }
}

function drawProtagonist() {
    context.drawImage(protagonist["element"], protagonist["xPosition"], protagonist["yPosition"], protagonist["width"], protagonist["height"])
}

function drawPlanets() {
    for (let i = 0; i < planets.length; i++) {
        let planet = planets[i]
        context.drawImage(planet["element"], planet["xPosition"], planet["yPosition"], planet["diameter"], planet["diameter"])
    }
}

function drawAsteroid(asteroid) {
    let asteroidElement = document.createElement("IMG")
    asteroidElement.src = asteroid["image"]
    context.drawImage(asteroidElement, asteroid["xPosition"], asteroid["yPosition"], asteroid["diameter"], asteroid["diameter"])
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
    switch (asteroid.direction) {
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
    if (asteroid["xPosition"] < 0 || asteroid["xPosition"] > canvas.width || asteroid["yPosition"] < 0 || asteroid["yPosition"] > canvas.height) {
        asteroids.splice(asteroids.indexOf(asteroid), 1)
    }
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
            if (placesVisited[placesVisited.length - 1] !== planet) {
                placesVisited.push(planet)
            }
            return true
        }
    }
    if (placesVisited[placesVisited.length - 1] !== "space") {
        placesVisited.push("space")
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
            return true
        }
    }
    return false
}

function cheerProtagonist() {
    let currentPlanet = placesVisited[placesVisited.length - 1]
    let cheererImage = document.createElement("IMG")
    cheererImage.src = currentPlanet["cheerer"]
    let isFirstVisitToCurrentPlanet = placesVisited.indexOf(currentPlanet) === placesVisited.lastIndexOf(currentPlanet)
    if (currentPlanet["image"] !== EARTH_IMAGE && isFirstVisitToCurrentPlanet) {
        context.drawImage(cheererImage, currentPlanet["xPosition"], currentPlanet["yPosition"], CHEERER_DIAMETER, CHEERER_DIAMETER)
        if (isSoundOn) setTimeout(function(){ document.getElementById("smallCheerSound").play() }, MILLISECONDS_BUFFER)
        setTimeout(function(){ placesVisited.push("space") }, MILLISECONDS_BUFFER * 5)
    }
    let planetsVisited = []
    for (let i = 0; i < placesVisited.length; i++) {
        if (placesVisited[i] !== "space" && !planetsVisited.includes(placesVisited[i])) {
            planetsVisited.push(placesVisited[i])
        }
    }
    if (currentPlanet["image"] === EARTH_IMAGE && planetsVisited.length === planets.length) {
        context.drawImage(cheererImage, currentPlanet["xPosition"], currentPlanet["yPosition"], CHEERER_DIAMETER, CHEERER_DIAMETER)
        if (isSoundOn) {
            setTimeout(function(){ document.getElementById("smallCheerSound").play() }, MILLISECONDS_BUFFER)
            setTimeout(function(){ document.getElementById("bigCheerSound").play() }, MILLISECONDS_BUFFER)
        }
        setTimeout(closeLevel, MILLISECONDS_BUFFER * 5)
    }
}

function explodeProtagonist() {
    let explosionElement = document.createElement("IMG")
    explosionElement.src = EXPLOSION_IMAGE
    context.drawImage(explosionElement, (explosion["xPosition"] - protagonist["width"] - PIXELS_BUFFER), (explosion["yPosition"] - protagonist["height"] - PIXELS_BUFFER), EXPLOSION_DIAMETER, EXPLOSION_DIAMETER)
    if (isSoundOn) {
        document.getElementById("explosionSound").play()
        setTimeout(function(){ document.getElementById("booSound").play() }, MILLISECONDS_BUFFER * 2)
    }
    placesVisited = []
    setTimeout(initializeProtagonist, MILLISECONDS_BUFFER)
}

function closeLevel() {
    if (!hasClosedLevel) {
        placesVisited = []
        planets = []
        asteroids = []
        hasClosedLevel = true
        level++
        document.getElementById("level").innerHTML = String(level)
        document.getElementById("game").hidden = true
        setTimeout(function(){ document.getElementById("menu").hidden = false }, MILLISECONDS_BUFFER * 3)
    }
}

function toggleSound() {
    isSoundOn = !isSoundOn
    document.getElementById("soundOffImage").hidden = !document.getElementById("soundOffImage").hidden
    document.getElementById("soundOnImage").hidden = !document.getElementById("soundOnImage").hidden
}

