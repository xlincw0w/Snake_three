import React, { useEffect, useState } from 'react'
import * as THREE from 'three'

// const Score = ({ score }) => {
//     return <p style={{ fontSize: '1.5rem', color: 'white', marginLeft: '3rem' }}>{score}</p>
// }

const Main = () => {
    const threeRoot = React.createRef()

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    let renderer = new THREE.WebGLRenderer()

    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0)
    const food_mat = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    const snake_mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const snake = new THREE.Mesh(geometry, snake_mat)

    const snake_speed = 0.1
    const tail_speed = 0.15
    const keypressed = {}
    const [gameover, setGameOver] = useState(false)

    let score = 0
    // const [score_toshow, setScore] = useState(0)

    let actual_food = null
    let tails = []

    const Generate_Tail = () => {
        const tail_mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        const tail = new THREE.Mesh(geometry, tail_mat)

        if (keypressed['d']) {
            tail.position.x = snake.position.x - 0.5 * (score + 1)
            tail.position.y = snake.position.y
        }
        if (keypressed['q']) {
            tail.position.x = snake.position.x + 0.5 * (score + 1)
            tail.position.y = snake.position.y
        }
        if (keypressed['z']) {
            tail.position.x = snake.position.x
            tail.position.y = snake.position.y - 0.5 * (score + 1)
        }
        if (keypressed['s']) {
            tail.position.x = snake.position.x
            tail.position.y = snake.position.y + 0.5 * (score + 1)
        }

        tails.push(tail)

        scene.add(tail)
    }

    const Generate_Food = () => {
        const food = new THREE.Mesh(geometry, food_mat)

        const food_x = Math.floor(Math.random() * 24) - 12
        const food_y = Math.floor(Math.random() * 14) - 7

        food.position.x = food_x
        food.position.y = food_y

        actual_food = food

        scene.add(food)
    }

    const Check_Collision = () => {
        if (snake.position.distanceTo(actual_food.position) < 0.5) {
            actual_food.geometry.dispose()
            actual_food.material.dispose()

            scene.remove(actual_food)

            Generate_Food()
            Generate_Tail()

            score++
            // setScore(score)
        } else {
            tails.map((elem) => {
                if (snake.position.distanceTo(elem.position) < 0.2) {
                    setGameOver(true)
                    renderer = null
                }
            })
        }
    }

    renderer.setSize(window.innerWidth, window.innerHeight)

    const animate = function () {
        setTimeout(() => requestAnimationFrame(animate), 1000 / 60)

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
            if (tails[i].position.distanceTo(tails[i - 1].position) > 0.6) {
                tails[i].position.x -= (tails[i].position.x - tails[i - 1].position.x) * tail_speed
                tails[i].position.y -= (tails[i].position.y - tails[i - 1].position.y) * tail_speed
            }
        }

        if (score >= 1) {
            if (snake.position.distanceTo(tails[0].position) > 0.6) {
                tails[0].position.x += (snake.position.x - tails[0].position.x) * tail_speed
                tails[0].position.y += (snake.position.y - tails[0].position.y) * tail_speed
            }
        }

        Check_Collision()

        if (renderer) {
            renderer.render(scene, camera)
        }
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
        <div>
            <div style={{ position: 'absolute', left: '2%', top: '3%' }}>
                {/* <Score score={score_toshow} /> */}
                <div>
                    <p style={{ fontSize: '1rem', color: '#cccccc' }}>Created by Khazem Khaled</p>
                </div>
                <div style={{ background: '#eeeeee', marginTop: '1rem', textAlign: 'center', paddingTop: '0.6rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
                    <p className='mx-auto' style={{ fontSize: '1rem', color: '#222222' }}>
                        How to play
                    </p>
                    <div style={{ marginTop: '1rem' }}>
                        <p style={{ fontSize: '0.8rem', color: '#222222' }}>Up</p>
                        <p style={{ fontSize: '0.8rem', color: '#222222' }}>Left Down Right</p>
                    </div>
                    <div style={{ marginTop: '1rem', paddingBottom: '1.5rem' }}>
                        <p style={{ fontSize: '1rem', color: '#222222' }}>Z</p>
                        <p style={{ fontSize: '1rem', color: '#222222' }}>Q S D</p>
                    </div>
                </div>
            </div>
            {gameover && (
                <div style={{ position: 'absolute', width: '100vw', textAlign: 'center' }}>
                    <p style={{ color: '#cccccc', fontSize: '4rem' }}>Vous avez perdu.</p>
                </div>
            )}
            <div ref={threeRoot} id='threeRoot'></div>
        </div>
    )
}

export default Main
