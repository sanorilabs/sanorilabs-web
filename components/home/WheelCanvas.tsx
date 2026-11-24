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

/** 1 en la posición activa (al frente), 0 a un cuarto de vuelta o más. */
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

/**
 * Anillo vertical, como una noria vista de frente: la portada activa queda
 * al frente y a tamaño real; la anterior asoma por arriba y la siguiente por
 * abajo, más lejos, así que se ven algo más chicas y atenuadas.
 */
function Ring({ covers, progress, hidden, onPick }: RingProps) {
  const size = useThree((state) => state.size);
  const gl = useThree((state) => state.gl);
  const textures = useTextures(covers);
  const groups = useRef<(Group | null)[]>([]);
  const veils = useRef<(MeshBasicMaterial | null)[]>([]);
  const rotation = useRef<number | null>(null);
  const cameraKey = useRef("");
  const count = covers.length;

  const layout = useMemo(() => wheelLayout(size.width), [size.width]);

  useFrame((state, delta) => {
    // En z = 0, una unidad de la escena es un px de pantalla. El centro de la
    // perspectiva se desplaza al centro del anillo, que no es el del lienzo.
    const key = `${state.size.width}x${state.size.height}`;
    if (cameraKey.current !== key) {
      const view = state.camera as PerspectiveCamera;
      view.position.set(0, 0, CAMERA_Z);
      view.fov = MathUtils.radToDeg(
        2 * Math.atan(state.size.height / 2 / CAMERA_Z),
      );
      view.near = 10;
      view.far = CAMERA_Z * 3;
      view.setViewOffset(
        state.size.width,
        state.size.height,
        -layout.centerX,
        0,
        state.size.width,
        state.size.height,
      );
      view.updateProjectionMatrix();
      cameraKey.current = key;
    }

    const target = progress.current * (count - 1);
    rotation.current =
      rotation.current === null
        ? target
        : MathUtils.damp(rotation.current, target, wheel.damping, delta);

    const time = state.clock.elapsedTime;

    for (let index = 0; index < count; index++) {
      const group = groups.current[index];
      const veil = veils.current[index];
      if (!group || !veil) continue;

      // Ángulo 0 = al frente. La siguiente portada (ángulo negativo) espera
      // abajo y sube al frente al avanzar; la anterior se va por arriba.
      const angle = wrapAngle(((rotation.current - index) * TAU) / count);
      const weight = activeWeight(angle);
      const rest = 1 - weight;
      const float =
        rest * Math.sin(time * wheel.floatSpeed + index * 1.9) * wheel.floatPx;

      group.visible = hidden.current !== index;
      group.position.set(
        0,
        layout.radius * Math.sin(angle) + float,
        -layout.radius * (1 - Math.cos(angle)),
      );
      // Cada portada mira un poco hacia afuera del anillo.
      group.rotation.set(-angle * wheel.tilt, 0, 0);
      veil.opacity = wheel.inactiveDim * rest;
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
          {/* Marco de 1px alrededor de la portada. */}
          <mesh position={[0, 0, -1]}>
            <planeGeometry args={[layout.coverW + 2, layout.coverH + 2]} />
            <meshBasicMaterial color={GRID} />
          </mesh>
          <mesh>
            <planeGeometry args={[layout.coverW, layout.coverH]} />
            <meshBasicMaterial
              key={textures[index] ? "cover" : "empty"}
              color={textures[index] ? "#ffffff" : PAPER}
              map={textures[index]}
            />
          </mesh>
          {/* Velo color papel: atenúa las portadas que no están al frente
              sin volverlas transparentes (no se ven unas a través de otras). */}
          <mesh position={[0, 0, 1]}>
            <planeGeometry args={[layout.coverW + 2, layout.coverH + 2]} />
            <meshBasicMaterial
              ref={(node) => {
                veils.current[index] = node;
              }}
              color={PAPER}
              transparent
              opacity={0}
              depthWrite={false}
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
