import Link from "next/link";
import type { ImageGridProps } from "./image-grid.schema";

const COLS: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export function ImageGridView(props: ImageGridProps) {
  const items = (props.items ?? []).filter((i) => i.imageUrl);
  if (items.length === 0) return null;
  return (
    <section className="px-4 py-10 sm:py-14 max-w-6xl mx-auto">
      {props.title && (
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          {props.title}
        </h2>
      )}
      <div className={`grid gap-4 ${COLS[props.columns] ?? COLS[3]}`}>
        {items.map((item, i) => {
          const inner = (
            <>
              <div className="aspect-[4/3] bg-muted overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.caption ?? ""}
                  className="h-full w-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              {item.caption && (
                <div className="px-3 py-2 text-sm font-medium">
                  {item.caption}
                </div>
              )}
            </>
          );
          if (item.link) {
            return (
              <Link
                key={i}
                href={item.link}
                className="rounded-md border bg-card overflow-hidden block"
              >
                {inner}
              </Link>
            );
          }
          return (
            <div
              key={i}
              className="rounded-md border bg-card overflow-hidden"
            >
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}
