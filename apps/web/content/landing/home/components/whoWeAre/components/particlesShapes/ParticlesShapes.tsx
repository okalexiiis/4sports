'use client'

import { IOpacityAnimation, RangeValue, RecursivePartial } from '@tsparticles/engine'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadPolygonShape } from '@tsparticles/shape-polygon'
import { loadSlim } from '@tsparticles/slim'
/* HOOKS */
import { useEffect, useState } from 'react'

export function ParticlesShapes({
  backColor,
  shapeColor,
  opacity,
  opacityAnimation,
  idContainer,
}: {
  backColor: string
  shapeColor: string
  opacity: RangeValue
  opacityAnimation: RecursivePartial<IOpacityAnimation>
  idContainer: string
}) {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
      await loadPolygonShape(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden">
      {init && (
        <Particles
          id={idContainer}
          className="w-full h-full"
          options={{
            fullScreen: { enable: false },
            background: {
              color: backColor,
            },
            fpsLimit: 40,
            particles: {
              color: { value: shapeColor },
              /* links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.2,
                width: 1,
              }, */
              move: {
                direction: 'none',
                enable: true,
                outModes: { default: 'out' },
                random: false,
                speed: 0.2,
                straight: false,
              },
              number: {
                density: { enable: true, height: 1000, width: 1000 },
                value: 40,
              },
              opacity: {
                value: opacity,
                animation: opacityAnimation,
              },
              size: {
                value: { min: 5, max: 15 },
                animation: {
                  enable: true,
                  mode: 'random',
                  speed: 1,
                },
              },
              shape: {
                type: ['polygon'],
                options: {
                  polygon: {
                    sides: 4,
                    rotate: 30,
                  },
                },
              },
              rotate: {
                value: 30, // ángulo inicial opcional
                direction: 'clockwise', // "counter-clockwise" si prefieres al revés
                animation: {
                  enable: true,
                  speed: 5, // velocidad de rotación
                  sync: false, // false para que cada partícula rote de forma independiente
                },
              },
              collisions: {
                enable: true,
              },
            },
            interactivity: {
              events: {
                onHover: {
                  enable: false,
                },
                onClick: {
                  enable: false,
                },
              },
              modes: {},
            },
          }}
          /* particlesLoaded={particlesLoaded} */
        />
      )}
    </div>
  )
}
