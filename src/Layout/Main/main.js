import React, { useEffect, useState } from 'react'
import * as THREE from 'three'

const Main = () => {
    const threeRoot = React.createRef()

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer()

    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0)
    const snake_mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const snake = new THREE.Mesh(geometry, snake_mat)

    const snake_speed = 0.1
    const tail_speed = 0.15
    const keypressed = {}

    let score = 0
    const [score_toshow, setScore] = useState(0)

    let foods = []
    let tails = []

    const Generate_Tail = () => {
        const tail_mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        const tail = new THREE.Mesh(geometry, tail_mat)

        if (keypressed['d']) {
            tail.position.x = snake.position.x - 0.1 * (score + 1)
            tail.position.y = snake.position.y
        }
        if (keypressed['q']) {
            tail.position.x = snake.position.x + 0.1 * (score + 1)
            tail.position.y = snake.position.y
        }
        if (keypressed['z']) {
            tail.position.x = snake.position.x - 0.1 * (score + 1)
            tail.position.y = snake.position.y
        }
        if (keypressed['s']) {
            tail.position.x = snake.position.x - 0.1 * (score + 1)
            tail.position.y = snake.position.y
        }

        tails.push(tail)

        scene.add(tail)
    }

    const Generate_Food = () => {
        const food_mat = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        const food = new THREE.Mesh(geometry, food_mat)

        const food_x = Math.floor(Math.random() * 28) - 14
        const food_y = Math.floor(Math.random() * 14) - 7

        food.position.x = food_x
        food.position.y = food_y

        foods.push(food)

        scene.add(food)
    }

    const Check_Collision = () => {
        foods.map((elem, index) => {
            if (snake.position.distanceTo(elem.position) < 0.5) {
                scene.remove(elem)
                foods.splice(index, 1)

                Generate_Food()
                Generate_Tail()

                score++
                setScore(score)
            }
        })
    }

    renderer.setSize(window.innerWidth, window.innerHeight)

    const animate = function () {
        setTimeout(() => {
            requestAnimationFrame(animate)
            if (keypressed['d']) {
                snake.position.x += snake_speed
            }
            if (keypressed['q']) {
                snake.position.x -= snake_speed
            }
            if (keypressed['z']) {
                snake.position.y += snake_speed
            }
            if (keypressed['s']) {
                snake.position.y -= snake_speed
            }

            for (let i = 1; i < score; i++) {
                tails[i].position.x -= (tails[i].position.x - tails[i - 1].position.x) * tail_speed
                tails[i].position.y -= (tails[i].position.y - tails[i - 1].position.y) * tail_speed
            }

            if (score >= 1) {
                tails[0].position.x -= (tails[0].position.x - snake.position.x) * tail_speed
                tails[0].position.y -= (tails[0].position.y - snake.position.y) * tail_speed
            }

            Check_Collision()
        }, 1000 / 60)

        renderer.render(scene, camera)
    }

    useEffect(() => {
        threeRoot.current.appendChild(renderer.domElement)

        snake.position.x = 0
        snake.position.y = 0

        scene.add(snake)

        Generate_Food()

        camera.position.z = 10

        animate()
    }, [])

    const handleKeyOff = (event) => {
        delete keypressed[event.key]
    }

    const handleKeyOn = (event) => {
        switch (event.key) {
            case 'd':
                keypressed[event.key] = true
                break
            case 'q':
                keypressed[event.key] = true
                break
            case 'z':
                keypressed[event.key] = true
                break
            case 's':
                keypressed[event.key] = true
                break
        }
    }

    document.addEventListener('keydown', handleKeyOn, false)
    document.addEventListener('keyup', handleKeyOff, false)

    return (
        <div className='text-red-400'>
            <div style={{ position: 'absolute', left: '2%', top: '3%' }}>
                <p style={{ fontSize: '1rem', color: 'white' }}>Khazem Khaled</p>
                <p style={{ fontSize: '1.5rem', color: 'white', marginLeft: '3rem' }}>{score_toshow}</p>
            </div>
            <div ref={threeRoot}></div>
        </div>
    )
}

export default Main
