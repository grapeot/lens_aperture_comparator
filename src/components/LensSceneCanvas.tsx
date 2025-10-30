import { useMemo, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  Environment,
  Html,
  OrbitControls,
  // SoftShadows, // Disabled due to shader conflicts on WebGL context recovery
} from '@react-three/drei';
import type { Lens } from '../lensData';

interface LensSceneCanvasProps {
  lenses: Lens[];
  selectedLensIds: Set<string>;
  lensColors: Record<string, string>;
  onToggleLens: (lensId: string) => void;
}

interface LensMetrics {
  height: number;
  radiusTop: number;
  radiusBottom: number;
  minFocal: number;
  maxFocal: number;
  minAperture: number;
  maxAperture: number;
}

interface NormalizedLens {
  lens: Lens;
  metrics: LensMetrics;
  position: [number, number, number];
}

const formatLabels: Record<Lens['format'], string> = {
  'full-frame': '全画幅',
  apsc: 'APS-C',
  m43: 'M4/3',
};

const EMPTY_MESSAGE =
  '请选择左侧的镜头，才能在三维场景中查看焦段与光圈分布。';

const TARGET_HEIGHT_RANGE: [number, number] = [1.2, 4.5];
const TARGET_RADIUS_RANGE: [number, number] = [0.5, 1.4];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const mapRange = (
  value: number,
  [inMin, inMax]: [number, number],
  [outMin, outMax]: [number, number],
  opts: { invert?: boolean; clampOutput?: boolean } = {},
) => {
  if (Number.isNaN(value)) return outMin;
  const safeInMin = Number.isFinite(inMin) ? inMin : 0;
  const safeInMax = Number.isFinite(inMax) ? inMax : 1;
  const denominator = safeInMax - safeInMin;
  if (Math.abs(denominator) < 1e-6) {
    return (outMin + outMax) / 2;
  }
  let normalised = (value - safeInMin) / denominator;
  if (opts.invert) {
    normalised = 1 - normalised;
  }
  const scaled = outMin + normalised * (outMax - outMin);
  return opts.clampOutput ? clamp(scaled, outMin, outMax) : scaled;
};

function computeLensMetrics(lens: Lens): LensMetrics {
  const focalLengths = lens.data.map((point) => point.focalLength);
  const apertures = lens.data.map((point) => point.aperture);
  const minFocal = Math.min(...focalLengths);
  const maxFocal = Math.max(...focalLengths);
  const minAperture = Math.min(...apertures);
  const maxAperture = Math.max(...apertures);
  return {
    minFocal,
    maxFocal,
    minAperture,
    maxAperture,
    height: maxFocal - minFocal,
    radiusTop: maxAperture,
    radiusBottom: minAperture,
  };
}

function normaliseLenses(lenses: Lens[]): NormalizedLens[] {
  if (lenses.length === 0) return [];

  const metrics = lenses.map(computeLensMetrics);

  const focalRanges = metrics.map((m) => m.height);
  const wideApertures = metrics.map((m) => m.radiusBottom);
  const teleApertures = metrics.map((m) => m.radiusTop);

  const rangeBounds: [number, number] = [
    Math.min(...focalRanges),
    Math.max(...focalRanges),
  ];
  const apertureBounds: [number, number] = [
    Math.min(...wideApertures, ...teleApertures),
    Math.max(...wideApertures, ...teleApertures),
  ];

  const spacing = 3.5;
  const cols = Math.ceil(Math.sqrt(lenses.length));

  return lenses.map((lens, index) => {
    const baseMetrics = metrics[index];
    const height = mapRange(baseMetrics.height, rangeBounds, TARGET_HEIGHT_RANGE, {
      clampOutput: true,
    });
    const radiusBottom = mapRange(baseMetrics.radiusBottom, apertureBounds, TARGET_RADIUS_RANGE, {
      invert: true,
      clampOutput: true,
    });
    const radiusTop = mapRange(baseMetrics.radiusTop, apertureBounds, TARGET_RADIUS_RANGE, {
      invert: true,
      clampOutput: true,
    });

    const row = Math.floor(index / cols);
    const col = index % cols;
    const offset = (count: number) => (count - 1) * 0.5;
    const x = (col - offset(Math.min(cols, lenses.length))) * spacing;
    const z = (row - offset(Math.ceil(lenses.length / cols))) * spacing;

    return {
      lens,
      metrics: {
        ...baseMetrics,
        height,
        radiusBottom,
        radiusTop,
      },
      position: [x, height / 2, z],
    };
  });
}

function LensMesh({
  normalized,
  color,
  isActive,
  onToggle,
}: {
  normalized: NormalizedLens;
  color: string;
  isActive: boolean;
  onToggle: (lensId: string) => void;
}) {
  const { lens, metrics, position } = normalized;
  const [hovered, setHovered] = useState(false);
  const accentColor = hovered || isActive ? color : '#475569';
  const [posX, , posZ] = position;
  const planarDistance = Math.hypot(posX, posZ);
  const labelRadiusOffset = 1.2;
  const offsetX = planarDistance > 0.01 ? (posX / planarDistance) * labelRadiusOffset : 0;
  const offsetZ =
    planarDistance > 0.01 ? (posZ / planarDistance) * labelRadiusOffset : labelRadiusOffset;
  const labelHeight = metrics.height / 2 + 0.9;

  return (
    <group position={position}>
      <mesh
        castShadow
        receiveShadow
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          setHovered(false);
        }}
        onClick={(event) => {
          event.stopPropagation();
          onToggle(lens.id);
        }}
      >
        <cylinderGeometry
          args={[metrics.radiusTop, metrics.radiusBottom, metrics.height, 48, 1, false]}
        />
        <meshStandardMaterial
          color={color}
          metalness={lens.dataSource === 'official' ? 0.4 : 0.1}
          roughness={lens.dataSource === 'official' ? 0.35 : 0.6}
          emissive={hovered ? color : '#000000'}
          emissiveIntensity={hovered ? 0.25 : 0}
        />
      </mesh>

      <mesh position={[0, -metrics.height / 2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[metrics.radiusBottom + 0.02, metrics.radiusBottom + 0.08, 48]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>

      <Html
        position={[offsetX, labelHeight, offsetZ]}
        center
        style={{
          pointerEvents: 'none',
          background: 'rgba(15, 23, 42, 0.78)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          padding: '8px 12px',
          borderRadius: '12px',
          minWidth: '220px',
          textAlign: 'left',
          color: '#e2e8f0',
          fontSize: '12px',
          lineHeight: '1.35',
          opacity: hovered || isActive ? 1 : 0,
          transition: 'opacity 160ms ease',
        }}
      >
        <div className="font-semibold text-slate-100">{lens.name}</div>
        <div className="mt-1 text-slate-300">
          焦段范围：{metrics.minFocal}–{metrics.maxFocal}mm
        </div>
        <div className="mt-1 text-slate-300">
          最大光圈（f 值）：f/
          {metrics.minAperture.toFixed(1)}–f/
          {metrics.maxAperture.toFixed(1)}
        </div>
        <div className="mt-1 text-slate-400 text-xs">
          {formatLabels[lens.format]} ·{' '}
          {lens.dataSource === 'official' ? '官方规格' : 'AI 研判数据，使用前请复核'}
        </div>
      </Html>
    </group>
  );
}

// WebGL context recovery handler with callback
function WebGLContextHandler({
  onContextLost,
}: {
  onContextLost: () => void;
}) {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn('WebGL context lost, attempting to recover...');
      onContextLost();
    };

    const handleContextRestored = () => {
      console.log('WebGL context restored');
      onContextLost(); // Force remount to reinitialize
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    // Also check for context loss periodically (if supported)
    let interval: ReturnType<typeof setInterval> | null = null;
    if (typeof (gl as any).isContextLost === 'function') {
      const checkContext = () => {
        try {
          if ((gl as any).isContextLost()) {
            console.warn('WebGL context check: context is lost');
            onContextLost();
          }
        } catch (e) {
          // Ignore errors during context check
        }
      };
      interval = setInterval(checkContext, 1000);
    }

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gl, onContextLost]);

  return null;
}

function SceneContent({
  normalized,
  selectedLensIds,
  lensColors,
  onToggleLens,
  onContextLost,
}: {
  normalized: NormalizedLens[];
  selectedLensIds: Set<string>;
  lensColors: Record<string, string>;
  onToggleLens: (lensId: string) => void;
  onContextLost: () => void;
}) {
  return (
    <>
      <WebGLContextHandler onContextLost={onContextLost} />
      <color attach="background" args={['#020617']} />
      <ambientLight intensity={0.4} />
      <directionalLight
        castShadow
        intensity={1.2}
        position={[8, 12, 6]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <spotLight
        position={[-6, 10, -6]}
        angle={0.55}
        penumbra={0.4}
        intensity={1}
        castShadow
      />

      {/* SoftShadows disabled due to shader conflicts on context recovery */}
      {/* <SoftShadows size={25} samples={8} focus={0.5} /> */}

      <group>
        {/* Floor removed per user request - was causing flickering */}
        {normalized.map((item) => (
          <LensMesh
            key={item.lens.id}
            normalized={item}
            color={lensColors[item.lens.id]}
            isActive={selectedLensIds.has(item.lens.id)}
            onToggle={onToggleLens}
          />
        ))}
      </group>

      {/* ContactShadows removed to prevent flickering */}
      <Environment preset="city" />
      <OrbitControls
        enablePan
        enableRotate
        maxDistance={35}
        minDistance={6}
        target={[0, 1.8, 0]}
        enableDamping
        dampingFactor={0.15}
      />
    </>
  );
}

export default function LensSceneCanvas({
  lenses,
  selectedLensIds,
  lensColors,
  onToggleLens,
}: LensSceneCanvasProps) {
  const normalized = useMemo(() => normaliseLenses(lenses), [lenses]);
  const [canvasKey, setCanvasKey] = useState(0);

  const handleContextLost = () => {
    // Force remount by changing key
    setCanvasKey((prev) => prev + 1);
  };

  if (lenses.length === 0) {
    return (
      <div className="flex h-[480px] items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-center text-sm text-slate-400">
        {EMPTY_MESSAGE}
      </div>
    );
  }

  return (
    <div className="h-[520px] w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
      <Canvas
        key={canvasKey}
        shadows
        dpr={Math.min(window.devicePixelRatio, 2)}
        camera={{ position: [10, 7, 10], fov: 45 }}
        gl={{
          preserveDrawingBuffer: false,
          powerPreference: 'high-performance',
          antialias: true,
          alpha: false,
          stencil: false,
          depth: true,
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#020617', 1);
          // Check if context is already lost (if supported)
          if (typeof (gl as any).isContextLost === 'function' && (gl as any).isContextLost()) {
            console.warn('WebGL context already lost on creation');
            handleContextLost();
            return;
          }
          // Suppress WebGL warnings for deprecated features
          try {
            const glContext = gl.getContext() as WebGLRenderingContext | null;
            if (glContext && typeof glContext.texSubImage2D === 'function') {
              const originalTexSubImage = glContext.texSubImage2D.bind(glContext);
              (glContext as any).texSubImage2D = function (...args: Parameters<WebGLRenderingContext['texSubImage2D']>) {
                try {
                  return (originalTexSubImage as any).apply(glContext, args);
                } catch (error) {
                  // Silently ignore texture errors during recovery
                }
              };
            }
          } catch (e) {
            // Ignore if we can't wrap the function
          }
        }}
      >
        <SceneContent
          normalized={normalized}
          selectedLensIds={selectedLensIds}
          lensColors={lensColors}
          onToggleLens={onToggleLens}
          onContextLost={handleContextLost}
        />
      </Canvas>
    </div>
  );
}
