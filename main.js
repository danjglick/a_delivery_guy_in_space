let canvas;
let context;
let level = 1
let planets = []
let asteroids = []
let xPositionProtagonist;
let yPositionProtagonist;
let MILLISECONDS_PER_FRAME = 100
let PIXELS_ASTEROIDS_TRAVEL_PER_FRAME = 20
let PIXELS_PROTAGONIST_TRAVELS_PER_CLICK = 100

function start_game() {
    canvas = document.getElementsByTagName("canvas")[0]
    canvas.width = window.innerWidth - 10
    canvas.height = window.innerHeight - 110
    context = canvas.getContext("2d")
    initialize_level()
    gameLoop()
}

function initialize_level() {
    initialize_planets()
    xPositionProtagonist = planets[0]["xPosition"]
    yPositionProtagonist = planets[0]["yPosition"]
}

function initialize_planets() {
    for (let planet_counter = 1; planet_counter <= level + 2; planet_counter++) {
        let xPositionPlanet;
        let yPositionPlanet;
        let lengthPlanet;
        let try_again = true
        while (try_again) {
            try_again = false
            xPositionPlanet = Math.floor(Math.random() * (canvas.width - 200))
            yPositionPlanet = Math.floor(Math.random() * (canvas.height - 200))
            lengthPlanet = Math.floor(Math.random() * 50) + 150
            // if (planets.length > 0) {
            //     for (let i = 0; i < planets.length; i++) {
            //         let is_enough_width_between_planets = Math.abs(xPositionPlanet - planets[i]["xPosition"]) > 250
            //         let is_enough_height_between_planets = Math.abs(yPositionPlanet - planets[i]["yPosition"]) > 250
            //         if (!is_enough_width_between_planets || !is_enough_height_between_planets) {
            //             try_again = true
            //         }
            //     }
            // }
        }
        planets.push({
            "xPosition": xPositionPlanet,
            "yPosition": yPositionPlanet,
            "length": lengthPlanet
        })
    }
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    drawPlanets()
    drawAsteroids()
    drawProtagonist()
    document.addEventListener('keydown', moveProtagonist)
    setTimeout(gameLoop, MILLISECONDS_PER_FRAME)
}

function drawPlanets() {
    for (let i = 0; i < planets.length; i++) {
        context.fillStyle = "green"
        context.fillRect(planets[i]["xPosition"], planets[i]["yPosition"], planets[i]["length"], planets[i]["length"])
    }
}

function drawAsteroids() {
    let newAsteroid = initializeAsteroid()
    asteroids.push(newAsteroid)
    for (let i = 0; i < asteroids.length; i++) {
        let asteroid = asteroids[i]
        positionAsteroid(asteroid)
        context.fillStyle = "grey"
        context.fillRect(asteroid["xPosition"], asteroid["yPosition"], asteroid["length"], asteroid["length"])
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
            return {
                "xPosition": xPosition,
                "yPosition": yPosition,
                "direction": direction,
                "length": Math.floor(Math.random() * 60) + 15}
        }
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

function drawProtagonist() {
    context.fillStyle = "magenta"
    context.fillRect(xPositionProtagonist, yPositionProtagonist, 25, 25)
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

