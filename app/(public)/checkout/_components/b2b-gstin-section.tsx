"use client";

/**
 * B2B GSTIN capture — optional. When ticked, the entered GSTIN is printed as
 * the recipient on each seller's tax invoice so the buyer can claim input tax
 * credit. State is owned by the orchestrator so it can forward the value to the
 * checkout mutation.
 */
export function B2bGstinSection({
  b2bChecked,
  onToggle,
  buyerGstin,
  onGstinChange,
  buyerGstinValid,
}: {
  b2bChecked: boolean;
  onToggle: (checked: boolean) => void;
  buyerGstin: string;
  onGstinChange: (value: string) => void;
  buyerGstinValid: boolean;
}) {
  return (
    <section className="rounded-lg border bg-card p-6">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={b2bChecked}
          onChange={(e) => onToggle(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-input"
        />
        <div>
          <span className="text-sm font-medium">
            I&apos;m buying for business (GSTIN invoice)
          </span>
          <p className="text-xs text-foreground/60 mt-0.5">
            Your GSTIN appears on each seller&apos;s tax invoice so you can claim
            input tax credit.
          </p>
        </div>
      </label>

      {b2bChecked && (
        <div className="mt-4 ml-7">
          <label
            htmlFor="buyerGstin"
            className="block text-xs font-medium mb-1.5"
          >
            GSTIN *
          </label>
          <input
            id="buyerGstin"
            type="text"
            value={buyerGstin}
            onChange={(e) => onGstinChange(e.target.value.toUpperCase().slice(0, 15))}
            placeholder="27AABCS1234A1Z5"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono outline-none focus:border-brand transition"
            maxLength={15}
            aria-invalid={!buyerGstinValid}
          />
          <p
            className={`mt-1 text-xs ${
              buyerGstinValid ? "text-foreground/50" : "text-destructive"
            }`}
          >
            {buyerGstinValid
              ? "Will be printed on your tax invoice."
              : "Enter a valid 15-character GSTIN."}
          </p>
        </div>
      )}
    </section>
  );
}
