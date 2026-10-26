import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { MLP, makeDataset, type Dataset, type Point } from "@/lib/mlp";
import { RETRAIN_EVENT } from "@/lib/terminal-store";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const LAYERS = [2, 10, 10, 1];
const LR = 0.012;
const GRID = 56;
const MAX_STEPS = 1500;
const HISTORY = 140;
const DATASETS: Dataset[] = ["spiral", "circle", "xor"];

type RGB = [number, number, number];

function resolveColor(cssVar: string): RGB {
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const ctx = c.getContext("2d");
  if (!ctx) return [128, 128, 128];
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}

type Engine = {
  reset: (dataset?: Dataset) => void;
  addPoint: (x: number, y: number, label: 0 | 1) => void;
  setColors: () => void;
  destroy: () => void;
};

function createEngine(canvas: HTMLCanvasElement, readout: HTMLElement, spark: SVGPathElement): Engine {
  const ctx = canvas.getContext("2d");
  const field = document.createElement("canvas");
  field.width = field.height = GRID;
  const fctx = field.getContext("2d");
  const img = fctx?.createImageData(GRID, GRID);

  let net = new MLP(LAYERS, LR);
  let points: Point[] = makeDataset("spiral");
  let step = 0;
  let loss = 1;
  let acc = 0;
  let history: number[] = [];
  let running = true;
  let visible = false;
  let raf = 0;
  let colors = { a: [0, 0, 0] as RGB, b: [0, 0, 0] as RGB, bg: [0, 0, 0] as RGB };
  let intensity = 0.4;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function draw() {
    if (!ctx || !fctx || !img) return;
    const { a, b, bg } = colors;
    for (let j = 0; j < GRID; j++) {
      for (let i = 0; i < GRID; i++) {
        const p = net.predict((i / (GRID - 1)) * 2 - 1, 1 - (j / (GRID - 1)) * 2);
        const target = p >= 0.5 ? b : a;
        const strength = Math.min(Math.abs(p - 0.5) * 2, 1) * intensity;
        const k = (j * GRID + i) * 4;
        img.data[k] = bg[0] + (target[0] - bg[0]) * strength;
        img.data[k + 1] = bg[1] + (target[1] - bg[1]) * strength;
        img.data[k + 2] = bg[2] + (target[2] - bg[2]) * strength;
        img.data[k + 3] = 255;
      }
    }
    fctx.putImageData(img, 0, 0);

    const w = canvas.width;
    const h = canvas.height;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(field, 0, 0, w, h);

    const r = Math.max(3, w / 105);
    ctx.lineWidth = Math.max(1.5, w / 260);
    ctx.strokeStyle = `rgb(${bg.join(",")})`;
    for (const p of points) {
      ctx.fillStyle = `rgb(${(p.label === 1 ? b : a).join(",")})`;
      ctx.beginPath();
      ctx.arc(((p.x + 1) / 2) * w, ((1 - p.y) / 2) * h, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  function updateReadout() {
    readout.textContent = `epoch ${String(step).padStart(4, "0")} · loss ${loss.toFixed(4)} · acc ${(acc * 100).toFixed(1)}%`;
    if (history.length > 1) {
      const max = Math.max(...history, 0.0001);
      spark.setAttribute(
        "d",
        history
          .map((v, i) => `${i === 0 ? "M" : "L"}${((i / (HISTORY - 1)) * 100).toFixed(2)},${(22 - (v / max) * 20).toFixed(2)}`)
          .join(""),
      );
    }
  }

  function frame() {
    raf = 0;
    if (!running || !visible) return;
    const stepsPerFrame = reducedMotion.matches ? 60 : 1;
    for (let i = 0; i < stepsPerFrame; i++) {
      const res = net.step(points);
      step++;
      loss = res.loss;
      acc = res.acc;
      history.push(res.loss);
      if (history.length > HISTORY) history.shift();
    }
    draw();
    const done = step >= MAX_STEPS || (acc === 1 && loss < 0.015);
    if (done || step % 3 === 0 || reducedMotion.matches) updateReadout();
    if (done) {
      running = false;
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  function schedule() {
    if (running && visible && !raf) raf = requestAnimationFrame(frame);
  }

  function wake() {
    running = true;
    schedule();
  }

  const resizeObserver = new ResizeObserver(([entry]) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.height = Math.round(entry.contentRect.width * dpr);
    draw();
  });
  resizeObserver.observe(canvas);

  let onScreen = false;
  const updateVisible = () => {
    visible = onScreen && document.visibilityState === "visible";
    schedule();
  };
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    updateVisible();
  });
  intersectionObserver.observe(canvas);
  document.addEventListener("visibilitychange", updateVisible);

  return {
    reset(dataset) {
      net = new MLP(LAYERS, LR, Math.floor(Math.random() * 1e6));
      if (dataset) points = makeDataset(dataset, 160, Math.floor(Math.random() * 1e6));
      step = 0;
      history = [];
      wake();
    },
    addPoint(x, y, label) {
      points.push({ x, y, label });
      draw();
      wake();
    },
    setColors() {
      colors = { a: resolveColor("--warm"), b: resolveColor("--accent"), bg: resolveColor("--bg-elevated") };
      // Dark backgrounds need a lighter wash for the regions to stay subtle
      intensity = document.documentElement.classList.contains("dark") ? 0.18 : 0.4;
      draw();
    },
    destroy() {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", updateVisible);
    },
  };
}

export function NeuralPlayground() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const sparkRef = useRef<SVGPathElement>(null);
  const engine = useRef<Engine | null>(null);

  const [dataset, setDataset] = useState<Dataset>("spiral");
  const [brush, setBrush] = useState<0 | 1>(1);

  useEffect(() => {
    if (!canvasRef.current || !readoutRef.current || !sparkRef.current) return;
    const e = createEngine(canvasRef.current, readoutRef.current, sparkRef.current);
    engine.current = e;
    e.setColors();
    const onRetrain = () => e.reset();
    window.addEventListener(RETRAIN_EVENT, onRetrain);
    return () => {
      window.removeEventListener(RETRAIN_EVENT, onRetrain);
      e.destroy();
      engine.current = null;
    };
  }, []);

  // Colours follow the theme
  useEffect(() => {
    engine.current?.setColors();
  }, [theme]);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = 1 - ((e.clientY - rect.top) / rect.height) * 2;
    const label = (e.shiftKey || e.button === 2 ? 1 - brush : brush) as 0 | 1;
    engine.current?.addPoint(x, y, label);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-elevated shadow-[0_30px_80px_-40px_rgb(0_0_0/0.45)]">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <div className="flex items-center gap-2 font-mono text-[11px] text-muted">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          model.train()
        </div>
        <div className="flex items-center gap-1" role="group" aria-label="Dataset">
          {DATASETS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                setDataset(d);
                engine.current?.reset(d);
              }}
              aria-pressed={dataset === d}
              className={cn(
                "rounded-md px-2 py-1 font-mono text-[11px] transition-colors",
                dataset === d ? "bg-accent-soft text-accent" : "text-faint hover:text-fg",
              )}
            >
              {d}
            </button>
          ))}
          <button
            type="button"
            onClick={() => engine.current?.reset()}
            aria-label="Re-initialise weights"
            title="Re-initialise weights"
            className="ml-1 rounded-md p-1.5 text-faint transition-colors hover:text-fg"
          >
            <RotateCcw className="size-3.5" />
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onContextMenu={(e) => e.preventDefault()}
        className="block aspect-square w-full cursor-crosshair touch-manipulation"
        role="img"
        aria-label="A small neural network learning to separate two classes of points, live in your browser. Click to add points."
      />

      <div className="space-y-2.5 border-t border-line px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <span ref={readoutRef} className="font-mono text-[10.5px] tabular-nums text-fg sm:text-[11px]">
            epoch 0000 · loss — · acc —
          </span>
          <svg viewBox="0 0 100 24" preserveAspectRatio="none" className="hidden h-5 w-20 shrink-0 text-warm min-[400px]:block" aria-hidden="true">
            <path ref={sparkRef} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10.5px] text-faint">
          <span>{LAYERS.join(" → ")} · tanh · adam</span>
          <span className="flex items-center gap-1.5">
            click to add
            {([1, 0] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setBrush(c)}
                aria-pressed={brush === c}
                aria-label={c === 1 ? "Add blue points" : "Add amber points"}
                className={cn(
                  "grid size-5 place-items-center rounded-full border transition-colors",
                  brush === c ? "border-line-strong" : "border-transparent",
                )}
              >
                <span className={cn("size-2.5 rounded-full", c === 1 ? "bg-accent" : "bg-warm")} />
              </button>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
