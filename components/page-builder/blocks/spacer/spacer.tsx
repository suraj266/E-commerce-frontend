import type { SpacerProps } from "./spacer.schema";

const SIZE_CLASS: Record<SpacerProps["size"], string> = {
  sm: "h-6",
  md: "h-12",
  lg: "h-20",
  xl: "h-32",
};

export function SpacerView(props: SpacerProps) {
  if (props.divider === "line") {
    return (
      <div className="px-4">
        <div
          className={`max-w-5xl mx-auto flex items-center ${SIZE_CLASS[props.size]}`}
        >
          <hr className="flex-1 border-t border-border" />
        </div>
      </div>
    );
  }
  if (props.divider === "dots") {
    return (
      <div
        className={`flex items-center justify-center ${SIZE_CLASS[props.size]}`}
      >
        <span className="text-2xl tracking-widest text-muted-foreground/60">
          • • •
        </span>
      </div>
    );
  }
  return <div className={SIZE_CLASS[props.size]} aria-hidden="true" />;
}
