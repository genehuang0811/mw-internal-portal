import { RefundForm } from "./refund-form";

export const metadata = {
  title: "Refund Application · MW Internal Forms Portal",
};

export default function RefundPage() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Form
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Refund Application
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Fill out the details below. A completed Excel refund form will be
          downloaded.
        </p>
      </div>
      <RefundForm />
    </div>
  );
}
