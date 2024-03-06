function init() {
    const canvas = document.querySelector("#screen")
    const context = canvas.getContext("2d")
    const canvasWidth = 1280
    const canvasHeight = 720
    const mapData = {
        size: 35,
        mapSize: 10,
        velocity: 0.1
    }
    let Map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
    let playerPos = {
        X: 2,
        Y: 2,
        angle: Math.PI / 2,
        size: mapData.size / 2.5
    }
    let currentFPS = 0
    let FPS = 0

    function resizeCanvas() {
        canvas.width = canvasWidth
        canvas.height = canvasHeight
    }

    function drawScene(mapSize, size) {

        for(let y = 0;y<mapSize;y++) {

            for(let x = 0;x<mapSize;x++) {
                
                switch(Map[y][x]) {
                    case 1:
                        context.clearRect(x * size, y * size, size, size)
                        break
                }

            }

        }

    }

    function loadFPS() {
        currentFPS++
        context.beginPath()
        context.font = "30px Arial"
        context.fillStyle = "white"
        context.fillText("FPS: " + FPS, 15, 40)
    }

    setInterval(() => {
        FPS = currentFPS
        currentFPS = 0
    }, 1000)

    function playerMove(newX, newY, newAngle) {
        newX = playerPos.X + newX
        newY = playerPos.Y + newY
        newAngle = playerPos.angle + newAngle

        //Detect collision
        if (Map[Math.floor(newY)][Math.floor(newX)] != 1) {
            playerPos.X = newX
            playerPos.Y = newY
            playerPos.angle = newAngle
        }
    }

    function castRays() {
        const rayLength = 300
        const rayIncrement = 0.1
        const viewArea = Math.PI / 4
    
        for(let rayAngle = playerPos.angle - viewArea; rayAngle <= playerPos.angle + viewArea; rayAngle += Math.PI / 180) {
            let rayX = playerPos.X
            let rayY = playerPos.Y
            let distance = 0

            let stepX = Math.cos(rayAngle)
            let stepY = Math.sin(rayAngle)

            for(let rayLengthCounter = 0; rayLengthCounter < rayLength; rayLengthCounter += rayIncrement) {
                rayX += stepX * rayIncrement
                rayY += stepY * rayIncrement
                distance += rayIncrement

                if (Map[Math.floor(rayY)][Math.floor(rayX)] == 1) {

                    //Wall
                    let wallHeight = canvasHeight / (distance * Math.cos(playerPos.angle - rayAngle))
                    let wallTop = (canvasHeight - wallHeight) / 2
                    let wallRound = (canvasWidth / 2) + ((rayAngle - playerPos.angle) * (canvasWidth / (2 * viewArea)));

                    context.beginPath()
                    for(let index = 0; index < 15; index++) {
                        context.strokeStyle = `rgba(${255 - distance * 25}, 0, 0, 1)`
                        context.moveTo(wallRound + index, wallTop)
                        context.lineTo(wallRound + index, wallTop + wallHeight)
                        context.stroke()
                    }

                    //Render rays of Raycasting
                    /*context.beginPath()
                    context.moveTo(playerPos.X * mapData.size, playerPos.Y * mapData.size)
                    context.strokeStyle = "red"
                    context.lineTo(rayX * mapData.size, rayY * mapData.size)
                    context.stroke()*/
                    break
                }
            }
        } 
    }
    

    function drawPlayer() {
        context.beginPath()
        context.arc(playerPos.X * mapData.size, playerPos.Y * mapData.size, playerPos.size, 0, Math.PI * 2)
        context.fill()
        context.stroke()

        let endX = (playerPos.X * mapData.size) + Math.cos(playerPos.angle) * mapData.size
        let endY = (playerPos.Y * mapData.size) + Math.sin(playerPos.angle) * mapData.size

        context.beginPath()
        context.moveTo(playerPos.X * mapData.size, playerPos.Y * mapData.size)
        context.lineTo(endX, endY)
        context.stroke()
    }

    document.addEventListener("keypress", (event) => {
        const currentKey = event.key

        const keysValues = {
            "w": {
                X: Math.cos(playerPos.angle) * mapData.velocity,
                Y: Math.sin(playerPos.angle) * mapData.velocity,
                angle: 0
            },
            "s": {
                X: -(Math.cos(playerPos.angle) * mapData.velocity),
                Y: -(Math.sin(playerPos.angle) * mapData.velocity),
                angle: 0
            },
            "d": {
                X: 0,
                Y: 0,
                angle: (Math.PI / 16)
            },
            "a": {
                X: 0,
                Y: 0,
                angle: -(Math.PI / 16)
            }
        }
        
        if (keysValues[currentKey]) {
            let X = keysValues[currentKey].X
            let Y = keysValues[currentKey].Y
            let Angle = keysValues[currentKey].angle
            playerMove(X, Y, Angle)
        }
    })

    function Load() {
        requestAnimationFrame(Load)
        context.beginPath()
        context.fillStyle = "Black"
        context.fillRect(0, 0, canvasWidth, canvasHeight)

        
        castRays()
        loadFPS()
    }

    Load()
    resizeCanvas()
}

document.addEventListener("load", init())