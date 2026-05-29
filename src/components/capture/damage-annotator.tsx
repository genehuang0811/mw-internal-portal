"use client";

import { useEffect, useRef, useState } from "react";
import { Undo2 } from "lucide-react";

const W = 680;
const H = 380;

type Pt = { x: number; y: number };

/** Draw a simple top-down ute outline as the annotation backdrop. */
function drawVehicle(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 2;
  ctx.fillStyle = "#f8fafc";

  // body
  roundRect(ctx, 200, 40, 280, 300, 36);
  ctx.fill();
  ctx.stroke();

  // cabin
  ctx.beginPath();
  roundRect(ctx, 222, 96, 236, 120, 14);
  ctx.stroke();

  // tray divider
  ctx.beginPath();
  ctx.moveTo(222, 232);
  ctx.lineTo(458, 232);
  ctx.stroke();

  // wheels
  ctx.fillStyle = "#cbd5e1";
  for (const [x, y] of [
    [176, 110],
    [482, 110],
    [176, 250],
    [482, 250],
  ] as const) {
    ctx.beginPath();
    roundRect(ctx, x, y, 24, 56, 8);
    ctx.fill();
  }

  ctx.fillStyle = "#94a3b8";
  ctx.font = "13px Helvetica";
  ctx.fillText("FRONT", 312, 30);
  ctx.fillText("REAR", 318, 366);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Freehand damage-marking canvas over a vehicle outline. Staff circle/mark
 * damage; exports a PNG data URL. Supports undo + clear.
 */
export function DamageAnnotator({
  onChange,
}: {
  onChange: (dataUrl: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Pt[][]>([]);
  const current = useRef<Pt[] | null>(null);
  const drawing = useRef(false);
  const [count, setCount] = useState(0);

  function redraw() {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawVehicle(ctx);
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const stroke of strokes.current) {
      ctx.beginPath();
      stroke.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.stroke();
    }
  }

  useEffect(() => {
    redraw();
  }, []);

  function pos(e: React.PointerEvent<HTMLCanvasElement>): Pt {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * c.width,
      y: ((e.clientY - r.top) / r.height) * c.height,
    };
  }

  function emit() {
    const c = canvasRef.current;
    if (c) onChange(strokes.current.length ? c.toDataURL("image/png") : "");
  }

  function down(e: React.PointerEvent<HTMLCanvasElement>) {
    e.preventDefault();
    canvasRef.current?.setPointerCapture(e.pointerId);
    drawing.current = true;
    current.current = [pos(e)];
  }
  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || !current.current) return;
    current.current.push(pos(e));
    redraw();
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 3;
      ctx.beginPath();
      current.current.forEach((p, i) =>
        i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y),
      );
      ctx.stroke();
    }
  }
  function up() {
    if (!drawing.current) return;
    drawing.current = false;
    if (current.current && current.current.length > 1) {
      strokes.current.push(current.current);
      setCount(strokes.current.length);
      emit();
    }
    current.current = null;
    redraw();
  }

  function undo() {
    strokes.current.pop();
    setCount(strokes.current.length);
    redraw();
    emit();
  }
  function clear() {
    strokes.current = [];
    setCount(0);
    redraw();
    onChange("");
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
          Damage annotations
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={undo}
            disabled={count === 0}
            className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-800 disabled:opacity-40 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
            Undo
          </button>
          <button
            type="button"
            onClick={clear}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
        className="w-full touch-none rounded-md border border-zinc-300 bg-white dark:border-zinc-700"
      />
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        Mark any existing damage on the outline above.
      </p>
    </div>
  );
}
