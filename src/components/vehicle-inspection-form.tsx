"use client";

import { useState } from "react";
import { SignaturePad } from "./capture/signature-pad";
import { PhotoInput } from "./capture/photo-input";
import { DamageAnnotator } from "./capture/damage-annotator";
import {
  Section,
  Field,
  Input,
  Textarea,
  Select,
  Buttons,
  NoticeBanner,
  type Notice,
} from "./capture/form-ui";
import { submitDocument, sentMessage } from "@/lib/submit-document";
import { vehicleInspectionSchema } from "@/lib/documents/schemas/vehicle-inspection";

const FUEL = ["Empty", "1/4", "1/2", "3/4", "Full"];
const BELONGINGS = [
  "Wallet",
  "Phone",
  "Keys",
  "Sunglasses",
  "Documents",
  "Charging cable",
  "Toll tag",
  "Other",
];

const EMPTY = {
  customer: "",
  rego: "",
  make: "",
  model: "",
  odometer: "",
  fuelLevel: "",
  dropOffAt: "",
  existingDamage: "",
  notes: "",
  staffMember: "",
};

const EMPTY_PHOTOS = {
  front: "",
  rear: "",
  driver: "",
  passenger: "",
  roof: "",
  tray: "",
  canopy: "",
  interior: "",
};

export function VehicleInspectionForm() {
  const [v, setV] = useState(EMPTY);
  const [blis, setBlis] = useState(false);
  const [belongings, setBelongings] = useState<string[]>([]);
  const [photos, setPhotos] = useState(EMPTY_PHOTOS);
  const [damageDiagram, setDamageDiagram] = useState("");
  const [customerSignature, setCustomerSignature] = useState("");
  const [staffSignature, setStaffSignature] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof EMPTY) => (val: string) => {
    setV((s) => ({ ...s, [k]: val }));
    if (errors[k]) {
      setErrors((e) => {
        const rest = { ...e };
        delete rest[k];
        return rest;
      });
    }
  };
  const setPhoto = (k: keyof typeof photos) => (val: string) =>
    setPhotos((s) => ({ ...s, [k]: val }));

  function toggleBelonging(opt: string) {
    setBelongings((b) =>
      b.includes(opt) ? b.filter((x) => x !== opt) : [...b, opt],
    );
  }

  function reset() {
    setV(EMPTY);
    setBlis(false);
    setBelongings([]);
    setPhotos(EMPTY_PHOTOS);
    setDamageDiagram("");
    setCustomerSignature("");
    setStaffSignature("");
    setNotice(null);
    setErrors({});
  }

  async function onGenerate() {
    setNotice(null);

    // Raw string payload — the shape the document schema validates and the
    // server re-parses. Validate client-side with the SAME schema so on-screen
    // errors match exactly what the engine would reject.
    const payload = {
      ...v,
      blisDisclaimer: blis ? "yes" : "",
      belongings: belongings.join(","),
      photoFront: photos.front,
      photoRear: photos.rear,
      photoDriver: photos.driver,
      photoPassenger: photos.passenger,
      photoRoof: photos.roof,
      photoTray: photos.tray,
      photoCanopy: photos.canopy,
      photoInterior: photos.interior,
      damageDiagram,
      customerSignature,
      staffSignature,
    };

    const parsed = vehicleInspectionSchema.safeParse(payload);
    if (!parsed.success) {
      const flat = parsed.error.flatten();
      const fieldErrs: Record<string, string> = {};
      for (const [k, msgs] of Object.entries(flat.fieldErrors)) {
        if (msgs && msgs.length > 0) fieldErrs[k] = msgs[0]!;
      }
      setErrors(fieldErrs);
      setNotice({
        kind: "error",
        message: "Please fix the highlighted fields and try again.",
      });
      const firstKey = Object.keys(fieldErrs)[0];
      if (firstKey) {
        const el = document.getElementById(`field-${firstKey}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const result = await submitDocument("vehicle-inspection", payload);
      setNotice(
        result.ok
          ? { kind: "success", message: sentMessage(result) }
          : { kind: "error", message: result.error },
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <NoticeBanner notice={notice} />

      <Section number={1} title="Customer & Vehicle">
        <Field id="customer" label="Customer name" required full error={errors.customer}>
          <Input value={v.customer} onChange={set("customer")} />
        </Field>
        <Field id="rego" label="Vehicle registration" required error={errors.rego}>
          <Input value={v.rego} onChange={set("rego")} />
        </Field>
        <Field id="odometer" label="Odometer (km)" required error={errors.odometer}>
          <Input value={v.odometer} onChange={set("odometer")} type="number" />
        </Field>
        <Field id="make" label="Make" required error={errors.make}>
          <Input value={v.make} onChange={set("make")} placeholder="e.g. Ford" />
        </Field>
        <Field id="model" label="Model" required error={errors.model}>
          <Input value={v.model} onChange={set("model")} placeholder="e.g. Ranger XLT" />
        </Field>
        <Field id="fuelLevel" label="Fuel level" required error={errors.fuelLevel}>
          <Select value={v.fuelLevel} onChange={set("fuelLevel")} options={FUEL} />
        </Field>
        <Field id="dropOffAt" label="Drop-off date / time" required full error={errors.dropOffAt}>
          <Input value={v.dropOffAt} onChange={set("dropOffAt")} type="datetime-local" />
        </Field>
      </Section>

      <Section number={2} title="Photos (all angles)">
        <div className="sm:col-span-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <PhotoInput label="Front" value={photos.front} onChange={setPhoto("front")} />
          <PhotoInput label="Rear" value={photos.rear} onChange={setPhoto("rear")} />
          <PhotoInput label="Driver side" value={photos.driver} onChange={setPhoto("driver")} />
          <PhotoInput label="Passenger side" value={photos.passenger} onChange={setPhoto("passenger")} />
          <PhotoInput label="Roof" value={photos.roof} onChange={setPhoto("roof")} />
          <PhotoInput label="Tray" value={photos.tray} onChange={setPhoto("tray")} />
          <PhotoInput label="Canopy" value={photos.canopy} onChange={setPhoto("canopy")} />
          <PhotoInput label="Interior" value={photos.interior} onChange={setPhoto("interior")} />
        </div>
      </Section>

      <Section number={3} title="Condition & Damage">
        <Field
          id="existingDamage"
          label="Existing damage notes"
          required
          full
          error={errors.existingDamage}
        >
          <Textarea
            value={v.existingDamage}
            onChange={set("existingDamage")}
            placeholder="Describe scratches, dents, or other damage"
          />
        </Field>
        <div className="sm:col-span-2">
          <DamageAnnotator onChange={setDamageDiagram} />
        </div>
        <div className="sm:col-span-2">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={blis}
              onChange={(e) => setBlis(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-950"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              Customer acknowledges that fitment may require relocation of
              sensors / BLIS components and accepts the associated disclaimer.
            </span>
          </label>
        </div>
      </Section>

      <Section number={4} title="Belongings & Sign-off">
        <div className="sm:col-span-2">
          <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Customer belongings left in vehicle
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {BELONGINGS.map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={belongings.includes(opt)}
                  onChange={() => toggleBelonging(opt)}
                  className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-950"
                />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">{opt}</span>
              </label>
            ))}
          </div>
        </div>
        <Field id="staffMember" label="Staff member" required full error={errors.staffMember}>
          <Input value={v.staffMember} onChange={set("staffMember")} placeholder="e.g. Sarah Lee" />
        </Field>
        <Field label="Additional notes" full>
          <Textarea value={v.notes} onChange={set("notes")} />
        </Field>
        <div className="sm:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SignaturePad label="Customer signature" onChange={setCustomerSignature} />
          <SignaturePad label="Staff signature" onChange={setStaffSignature} />
        </div>
      </Section>

      <Buttons submitting={submitting} onReset={reset} onGenerate={onGenerate} label="Send drop-off record" />
    </form>
  );
}
