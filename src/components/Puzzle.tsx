/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 public/models/cube_puzzle.glb -o src/components/Puzzle.tsx -r public --types --draco 
*/

import * as THREE from 'three'
import React, { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

import { useFrame, extend } from '@react-three/fiber'

import { useState } from 'react'

import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'

import vertex from '@/shaders/vertex.glsl'
import fragment from '@/shaders/fragment.glsl'

import { useControls } from 'leva'

import { Physics, RigidBody, RapierRigidBody } from '@react-three/rapier'

type GLTFResult = GLTF & {
  nodes: {
    lowersideBlock_01: THREE.Mesh
    upsideBlock_02: THREE.Mesh
    upsideBlock_01: THREE.Mesh
    middlelayerBlock_01: THREE.Mesh
    middlelayerBlock_02: THREE.Mesh
    upsideBlock_03: THREE.Mesh
    lowersideBlock_02: THREE.Mesh
    middlelayerBlock_03: THREE.Mesh
    middlelayerBlock_04: THREE.Mesh
  }
  materials: {
    mable_toy_blue_lowersideBlock_01: THREE.MeshStandardMaterial
    mable_toy_blue_upsideBlock02: THREE.MeshStandardMaterial
    mable_toy_blue_upsideBlock01: THREE.MeshStandardMaterial
    mable_toy_red_middleLayerBlock01: THREE.MeshStandardMaterial
    mable_toy_red_middlelayerBlock_02: THREE.MeshStandardMaterial
    mable_toy_blue_upsideBlock03: THREE.MeshStandardMaterial
    mable_toy_blue_lowersideBlock_02: THREE.MeshStandardMaterial
    mable_toy_lemon: THREE.MeshStandardMaterial
    mable_toy_red_middlelayerBlock_04: THREE.MeshStandardMaterial
  }
  // animations: GLTFAction[]
}

type PuzzleProps = JSX.IntrinsicElements['group'] & {
  lightPosition: THREE.Vector3
}

type ContextType = Record<
  string,
  React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>
>

class ToonShaderMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uEdgeRatio: {
          value: 0.02,
        },
        uEdge: { value: false },
        uLightPosition: {
          value: new THREE.Vector3(),
        },
        uNormalMap: {
          value: null,
        },
        uTexture: {
          value: null,
        },
        uStepTexture: {
          value: null,
        },
      },
    })
  }
}

extend({ ToonShaderMaterial })

export const Puzzle = ({ lightPosition, ...props }: PuzzleProps) => {
  const { nodes } = useGLTF('/models/cube_puzzle.glb') as GLTFResult

  const colorTexture = useLoader(TextureLoader, '/textures/bakedColor.jpg')

  const normalTexture = useLoader(TextureLoader, '/textures/normalColor.png')

  const stepTexture = useLoader(TextureLoader, '/textures/toonShaderStep.png')

  colorTexture.flipY = false
  normalTexture.flipY = false

  const backMaterial = useRef(new ToonShaderMaterial())
  const frontMaterial = useRef(new ToonShaderMaterial())

  frontMaterial.current.uniforms.uNormalMap.value = normalTexture
  frontMaterial.current.uniforms.uTexture.value = colorTexture
  frontMaterial.current.uniforms.uStepTexture.value = stepTexture

  backMaterial.current.uniforms.uNormalMap.value = normalTexture
  backMaterial.current.uniforms.uTexture.value = colorTexture
  backMaterial.current.uniforms.uStepTexture.value = stepTexture

  const { uEdgeRatio } = useControls({
    uEdgeRatio: { value: 0.02, min: 0.01, max: 0.027, step: 0.001 },
  })

  useEffect(() => {
    frontMaterial.current.uniforms.uLightPosition.value = lightPosition

    backMaterial.current.uniforms.uEdgeRatio.value = uEdgeRatio

    backMaterial.current.uniforms.uLightPosition.value = lightPosition
  }, [lightPosition, uEdgeRatio])

  useFrame(() => {
    backMaterial.current.uniforms.uEdge.value = true
    backMaterial.current.side = THREE.BackSide

    frontMaterial.current.uniforms.uEdge.value = false
    frontMaterial.current.side = THREE.FrontSide
  })

  const jump = (key) => {
    const rigidBody = rigidBodyRef.current[key]

    console.log(rigidBody)

    rigidBody?.applyImpulse({ x: 0, y: 980, z: 0 }, true)
  }

  const rigidBodyRef = useRef<{ [key: string]: RapierRigidBody | null }>({})

  return (
    <group {...props} position={[0, 2, 0]}>
      {Object.keys(nodes).map((key, i) => {
        if (key === 'Scene') return null

        const positions: { [key: string]: THREE.Vector3 } = {}

        positions[key] = nodes[key as keyof typeof nodes].position.clone()

        const space = 5
        const nodeLength = Object.keys(nodes).length

        positions[key].setY(
          nodes[key as keyof typeof nodes].position.y +
            space * (nodeLength - i - 1),
        )

        return (
          <RigidBody
            key={key}
            colliders="hull"
            restitution={0.2}
            friction={0.25}
            ref={(el) => {
              rigidBodyRef.current[key] = el
            }}
          >
            <group
              key={key}
              position={positions[key]}
              onClick={() => {
                jump(key)
              }}
            >
              <mesh
                castShadow
                geometry={nodes[key as keyof typeof nodes].geometry}
                material={backMaterial.current}
                renderOrder={1}
              />
              <mesh
                geometry={nodes[key as keyof typeof nodes].geometry}
                material={frontMaterial.current}
                renderOrder={2}
              />
            </group>
          </RigidBody>
        )
      })}
    </group>
  )
}

useGLTF.preload('/models/cube_puzzle.glb')