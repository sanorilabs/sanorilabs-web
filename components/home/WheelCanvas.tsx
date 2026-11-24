"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import {
  MathUtils,
  SRGBColorSpace,
  TextureLoader,
  type Group,
  type MeshBasicMaterial,
  type PerspectiveCamera,
  type Texture,
} from "three";
import { wheel } from "@/lib/motion";
import { CAMERA_Z, wheelLayout } from "@/lib/wheel-layout";

const PAPER = "#f2f1ec";
const GRID = "#d9d7cf";
const TAU = Math.PI * 2;

/** Lleva un ángulo al rango (-π, π]. */
function wrapAngle(angle: number): number {
  const wrapped = ((((angle + Math.PI) % TAU) + TAU) % TAU) - Math.PI;
  return wrapped === -Math.PI ? Math.PI : wrapped;
}

/** 1 en la posición activa (derecha), 0 a un cuarto de vuelta o más. */
function activeWeight(angle: number): number {
  const x = Math.max(0, 1 - Math.abs(angle) / (Math.PI / 2));
  return x * x * (3 - 2 * x);
}

function useTextures(urls: string[]): (Texture | null)[] {
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  const [textures, setTextures] = useState<(Texture | null)[]>(() =>
    urls.map(() => null),
  );

  useEffect(() => {
    let alive = true;
    const loaded: Texture[] = [];
    const loader = new TextureLoader();

    urls.forEach((url, index) => {
      loader.load(url, (texture) => {
        if (!alive) {
          texture.dispose();
          return;
        }
        texture.colorSpace = SRGBColorSpace;
        texture.anisotropy = gl.capabilities.getMaxAnisotropy();
        loaded.push(texture);
        setTextures((previous) => {
          const next = previous.slice();
          next[index] = texture;
          return next;
        });
        invalidate();
      });
    });

    return () => {
      alive = false;
      loaded.forEach((texture) => texture.dispose());
    };
  }, [urls, gl, invalidate]);

  return textures;
}

interface RingProps {
  covers: string[];
  /** Avance del scroll dentro de la rueda, de 0 a 1. */
  progress: RefObject<number>;
  /** Portada que no se dibuja (la sustituye el DOM durante la transición). */
  hidden: RefObject<number>;
  onPick: (index: number) => void;
}

function Ring({ covers, progress, hidden, onPick }: RingProps) {
  const size = useThree((state) => state.size);
  const gl = useThree((state) => state.gl);
  const textures = useTextures(covers);
  const groups = useRef<(Group | null)[]>([]);
  const materials = useRef<(MeshBasicMaterial | null)[]>([]);
  const rotation = useRef<number | null>(null);
  const cameraHeight = useRef(0);
  const count = covers.length;

  const layout = useMemo(
    () => wheelLayout(size.width, size.height),
    [size.width, size.height],
  );

  useFrame((state, delta) => {
    // En z = 0, una unidad de la escena es un px de pantalla.
    if (cameraHeight.current !== state.size.height) {
      const view = state.camera as PerspectiveCamera;
      view.position.set(0, 0, CAMERA_Z);
      view.fov = MathUtils.radToDeg(
        2 * Math.atan(state.size.height / 2 / CAMERA_Z),
      );
      view.near = 10;
      view.far = CAMERA_Z * 3;
      view.updateProjectionMatrix();
      cameraHeight.current = state.size.height;
    }

    const target = progress.current * (count - 1);
    rotation.current =
      rotation.current === null
        ? target
        : MathUtils.damp(rotation.current, target, wheel.damping, delta);

    const time = state.clock.elapsedTime;

    for (let index = 0; index < count; index++) {
      const group = groups.current[index];
      const material = materials.current[index];
      if (!group || !material) continue;

      // Ángulo 0 = posición activa (derecha). Al avanzar, cada portada sube
      // desde abajo hasta la derecha y sigue hacia arriba.
      const angle = wrapAngle(((rotation.current - index) * TAU) / count);
      const weight = activeWeight(angle);
      const rest = 1 - weight;
      const float =
        rest * Math.sin(time * wheel.floatSpeed + index * 1.9) * wheel.floatPx;

      group.visible = hidden.current !== index;
      group.position.set(
        layout.rx * Math.cos(angle),
        layout.ry * Math.sin(angle) + float,
        -80 * rest,
      );
      group.rotation.set(
        Math.sin(angle) * wheel.tilt * rest,
        -Math.cos(angle) * wheel.tilt * rest,
        -Math.sin(angle) * 0.1 * rest,
      );
      group.scale.setScalar(MathUtils.lerp(wheel.inactiveScale, 1, weight));
      material.opacity = MathUtils.lerp(wheel.inactiveOpacity, 1, weight);
    }
  });

  return (
    <>
      {covers.map((cover, index) => (
        <group
          key={cover}
          ref={(node) => {
            groups.current[index] = node;
          }}
          onClick={(event) => {
            event.stopPropagation();
            // Si el puntero se movió, fue un arrastre y no un clic.
            if (event.delta > 6) return;
            onPick(index);
          }}
          onPointerOver={() => {
            gl.domElement.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            gl.domElement.style.cursor = "";
          }}
        >
          {/* Marco de 1px, para que una portada clara no se pierda en el papel. */}
          <mesh position={[0, 0, -1]}>
            <planeGeometry args={[layout.coverW + 2, layout.coverH + 2]} />
            <meshBasicMaterial color={GRID} />
          </mesh>
          <mesh>
            <planeGeometry args={[layout.coverW, layout.coverH]} />
            <meshBasicMaterial
              key={textures[index] ? "cover" : "empty"}
              ref={(node) => {
                materials.current[index] = node;
              }}
              color={textures[index] ? "#ffffff" : PAPER}
              map={textures[index]}
              transparent
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

/** Si WebGL falla, avisa una vez y no dibuja nada. */
class CanvasBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

interface WheelCanvasProps extends RingProps {
  /** false = el canvas deja de dibujar (rueda fuera de pantalla). */
  running: boolean;
  /** Se llama si WebGL no está disponible. */
  onError: () => void;
}

/** Lienzo WebGL de la rueda. Se carga aparte, solo en la home y en escritorio. */
export default function WheelCanvas({
  running,
  onError,
  ...ring
}: WheelCanvasProps) {
  return (
    <CanvasBoundary onError={onError}>
      <Canvas
        flat
        dpr={[1, 2]}
        frameloop={running ? "always" : "never"}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, CAMERA_Z], fov: 35 }}
        resize={{ scroll: false }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Ring {...ring} />
      </Canvas>
    </CanvasBoundary>
  );
}
