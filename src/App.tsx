import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { Experience } from '@/components/Experience'
import { Sns } from '@/components/Sns'
import { MenuButton } from '@/components/MenuButton'
import { Loader } from '@react-three/drei'
import { useControls, Leva } from 'leva'
import { useRef } from 'react'
import { Suspense } from 'react'

const App = () => {
  return (
    <>
      <Leva collapsed />
      <Loader />
      <MenuButton />
      <Sns />
      <Canvas
        shadows
        camera={{
          position: [30, 20, 30],
          fov: 45,
        }}
      >
        <Suspense fallback={null}>
          {/* <Perf position="top-left" /> */}
          <Experience />
        </Suspense>
      </Canvas>
    </>
  )
}

export default App
