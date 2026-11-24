import { Decode } from "@/components/motion/Decode";
import { getContent } from "@/content";
import type { Lang } from "@/content/types";
import { LiveClock } from "./LiveClock";

/**
 * Panel de telemetría de Sobre mí, en mono: filas de dato y, al pie, los
 * números grandes. Los valores entran con efecto decode y la hora de
 * Monterrey corre en vivo. Las filas salen de about.panel (es.ts / en.ts).
 */
export function Telemetry({ lang }: { lang: Lang }) {
  const { panel, panelLabel } = getContent(lang).about;
  const rows = panel.filter((item) => !item.stat);
  const stats = panel.filter((item) => item.stat);

  return (
    <section
      aria-label={panelLabel}
      className="border border-ink bg-white font-mono text-sm"
    >
      <div className="flex items-center justify-between border-b border-ink px-4 py-3">
        <p className="label font-medium">
          <Decode>{panelLabel}</Decode>
        </p>
        <span aria-hidden="true" className="telemetry-dot" />
      </div>

      <dl className="px-4">
        {rows.map((item, index) => (
          <div
            key={item.label}
            className="grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)] gap-4 border-b border-grid py-3 last:border-b-0"
          >
            <dt className="text-xs uppercase leading-6 tracking-[0.08em] text-muted">
              {item.label}
            </dt>
            <dd className="leading-6">
              {item.live === "time" && <LiveClock />}
              <Decode index={index + 1}>{item.value}</Decode>
            </dd>
          </div>
        ))}
      </dl>

      {stats.length > 0 && (
        <dl className="grid grid-cols-3 border-t border-ink">
          {stats.map((item, index) => (
            <div
              key={item.label}
              className="flex flex-col-reverse justify-end gap-2 border-r border-grid p-4 last:border-r-0"
            >
              <dt className="text-xs uppercase leading-4 tracking-[0.08em] text-muted">
                {item.label}
              </dt>
              <dd className="text-3xl font-medium leading-none tabular-nums">
                <Decode index={rows.length + index + 1}>{item.value}</Decode>
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
