"use client";

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

const cols = 5
const rows = 3

interface GridItemProps {
  texture: THREE.Texture
  colIndex: number
  rowIndex: number
  totalScrollRef: React.MutableRefObject<number>
  width: number
  height: number
  gap: number
}

function GridItem({ texture, colIndex, rowIndex, totalScrollRef, width, height, gap }: GridItemProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const baseX = (colIndex - 2) * (width + 0.3)
  const baseY = (rowIndex - 1) * (height + 0.5)
  const curveStrength = 1.2 * Math.abs(colIndex - 2)

  useFrame(() => {
    if (!meshRef.current) return
    const totalScroll = totalScrollRef.current
    const wrappedY = ((baseY + totalScroll) % gap + gap) % gap - gap * 0.5
    meshRef.current.position.y = wrappedY
    const curveOffset = curveStrength * (1.0 - Math.abs(((wrappedY / gap) % 1 + 1) % 1 * 2 - 1))
    meshRef.current.position.x = baseX - curveOffset
  })

  return (
    <mesh ref={meshRef} position={[baseX, baseY, 0]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  )
}

interface GridSceneProps {
  totalScrollRef: React.MutableRefObject<number>
}

// Fallback texture generation in case images don't exist yet
function generatePlaceholderTexture(color: string) {
  if (typeof document === 'undefined') return new THREE.Texture();
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = color;
    context.fillRect(0, 0, 256, 256);
    context.fillStyle = '#ffffff';
    context.font = '30px Arial';
    context.fillText('Anis Phone', 40, 130);
  }
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

function GridScene({ totalScrollRef }: GridSceneProps) {
  const { viewport } = useThree()
  
  // Try loading textures, they will be black if 404, or use generic
  // Assuming the user might not have copied images yet.
  const texPlaceholder1 = useMemo(() => generatePlaceholderTexture('#1f1f1f'), [])
  const texPlaceholder2 = useMemo(() => generatePlaceholderTexture('#292929'), [])
  const texPlaceholder3 = useMemo(() => generatePlaceholderTexture('#0c0c0c'), [])
  
  const textures = [texPlaceholder1, texPlaceholder2, texPlaceholder3]

  const width = Math.min(viewport.width * 0.15, 2)
  const height = width * 1.4
  const gap = height + 0.5

  const items = useMemo(() => {
    const result: { col: number; row: number; tex: THREE.Texture }[] = []
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        result.push({ col: i, row: j, tex: textures[(i * rows + j) % textures.length] })
      }
    }
    return result
  }, [textures])

  return (
    <group>
      {items.map((item, idx) => (
        <GridItem
          key={idx}
          texture={item.tex}
          colIndex={item.col}
          rowIndex={item.row}
          totalScrollRef={totalScrollRef}
          width={width}
          height={height}
          gap={gap}
        />
      ))}
    </group>
  )
}

interface InfiniteCylinderGridProps {
  totalScrollRef: React.MutableRefObject<number>
}

export function InfiniteCylinderGrid({ totalScrollRef }: InfiniteCylinderGridProps) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <GridScene totalScrollRef={totalScrollRef} />
      </Canvas>
    </div>
  )
}
