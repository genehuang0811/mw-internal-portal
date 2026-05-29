import { PageHeader } from "@/components/page-header";
import { DemoNotice } from "@/components/demo-notice";
import {
  VehicleDimensionsTable,
  type VehicleDimension,
} from "@/components/vehicle-dimensions-table";
import { findModuleById } from "@/lib/modules";

const MODULE = findModuleById("vehicle-dimensions")!;

export const metadata = {
  title: `${MODULE.title} · MW Staff Hub`,
};

const ROWS: VehicleDimension[] = [
  {
    vehicle: "Ford Ranger (2022+ Next-Gen)",
    chassisNotes: "Wider tub than PX; check tie-down rail spacing.",
    trayLength: "1564 mm (Double Cab)",
    canopyNotes: "Sports bar clearance — confirm before canopy fit.",
    fitmentComments: "Most popular fitment; BLIS sensors in rear bar.",
  },
  {
    vehicle: "Toyota Hilux SR5 (2015+)",
    chassisNotes: "Standard tub; sail plane optional.",
    trayLength: "1525 mm (Double Cab)",
    canopyNotes: "Check roof rail load rating for canopy racks.",
    fitmentComments: "Tub liner may reduce internal width slightly.",
  },
  {
    vehicle: "Isuzu D-Max (2020+)",
    chassisNotes: "Chassis rail mounts differ from earlier model.",
    trayLength: "1571 mm (Crew Cab)",
    canopyNotes: "Central locking canopy compatible.",
    fitmentComments: "Confirm tow bar wiring before rear work.",
  },
  {
    vehicle: "Mazda BT-50 (2021+)",
    chassisNotes: "Shares platform with D-Max — similar mounting.",
    trayLength: "1571 mm (Double Cab)",
    canopyNotes: "Canopy seals well; verify gutter alignment.",
    fitmentComments: "Rear sensors present on higher trims.",
  },
  {
    vehicle: "Mitsubishi Triton (2019–2023)",
    chassisNotes: "Narrower tub; tray brackets must be checked.",
    trayLength: "1520 mm (Double Cab)",
    canopyNotes: "Lower roof line — taller canopies may overhang.",
    fitmentComments: "Confirm headboard clearance with sports bar.",
  },
  {
    vehicle: "VW Amarok (2023+)",
    chassisNotes: "Re-badged Ranger platform; use Ranger references.",
    trayLength: "1544 mm (Double Cab)",
    canopyNotes: "As per Next-Gen Ranger.",
    fitmentComments: "BLIS / sensor relocation disclaimer applies.",
  },
];

export default function VehicleDimensionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Knowledge Base · Demo"
        title={MODULE.title}
        description="Reference dimensions and fitment notes for common vehicles. View only for now."
      />

      <VehicleDimensionsTable rows={ROWS} />

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <label
          htmlFor="vd-ai"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-200"
        >
          Ask about a vehicle
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="vd-ai"
            type="text"
            disabled
            placeholder="e.g. What tray length does the Next-Gen Ranger have?"
            className="block w-full cursor-not-allowed rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-500"
          />
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Future version will connect this to MW AI Assistant."
            className="inline-flex h-10 shrink-0 cursor-not-allowed items-center justify-center rounded-md bg-zinc-900 px-5 text-sm font-medium text-white opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Ask AI
          </button>
        </div>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Future version will connect this to MW AI Assistant.
        </p>
      </div>

      <DemoNotice>
        Demo only — vehicle data is example content and editing is not connected
        yet.
      </DemoNotice>
    </div>
  );
}
