"use client";

import { useState } from "react";
import { DemoNotice } from "./demo-notice";
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
import { downloadDocument } from "@/lib/download-document";

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
  makeModel: "",
  odometer: "",
  fuelLevel: "",
  dropOffAt: "",
  existingDamage: "",
  notes: "",
  staffMember: "",
};

const REQUIRED: [keyof typeof EMPTY, string][] = [
  ["customer", "Customer name"],
  ["rego", "Vehicle rego"],
  ["makeModel", "Make / model"],
  ["odometer", "Odometer"],
  ["fuelLevel", "Fuel level"],
  ["dropOffAt", "Drop-off date / time"],
  ["existingDamage", "Existing damage notes"],
  ["staffMember", "Staff member"],
];

export function VehicleInspectionForm() {
  const [v, setV] = useState(EMPTY);
  const [blis, setBlis] = useState(false);
  const [belongings, setBelongings] = useState<string[]>([]);
  const [photos, setPhotos] = useState({
    front: "",
    rear: "",
    left: "",
    right: "",
    dash: "",
    other: "",
  });
  const [damageDiagram, setDamageDiagram] = useState("");
  const [customerSignature, setCustomerSignature] = useState("");
  const [staffSignature, setStaffSignature] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const set = (k: keyof typeof EMPTY) => (val: string) =>
    setV((s) => ({ ...s, [k]: val }));
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
    setPhotos({ front: "", rear: "", left: "", right: "", dash: "", other: "" });
    setDamageDiagram("");
    setCustomerSignature("");
    setStaffSignature("");
    setNotice(null);
  }

  async function onGenerate() {
    setNotice(null);
    const missing = REQUIRED.filter(([k]) => !v[k]?.trim());
    if (missing.length > 0) {
      setNotice({
        kind: "error",
        message: `Please complete: ${missing.map(([, l]) => l).join(", ")}.`,
      });
      return;
    }
    setSubmitting(true);
    try {
      const result = await downloadDocument("vehicle-inspection", {
        ...v,
        blisDisclaimer: blis ? "yes" : "",
        belongings: belongings.join(","),
        photoFront: photos.front,
        photoRear: photos.rear,
        photoLeft: photos.left,
        photoRight: photos.right,
        photoDash: photos.dash,
        photoOther: photos.other,
        damageDiagram,
        customerSignature,
        staffSignature,
      });
      setNotice(
        result.ok
          ? { kind: "success", message: `Generated ${result.filename}. Download started.` }
          : { kind: "error", message: result.error },
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <DemoNotice>
        Generates a branded MW PDF (photos, signatures &amp; damage marks
        embedded). Cloud upload &amp; email coming later.
      </DemoNotice>

      <NoticeBanner notice={notice} />

      <Section number={1} title="Customer & Vehicle">
        <Field label="Customer name" required full>
          <Input value={v.customer} onChange={set("customer")} />
        </Field>
        <Field label="Vehicle rego" required>
          <Input value={v.rego} onChange={set("rego")} />
        </Field>
        <Field label="Make / model" required>
          <Input value={v.makeModel} onChange={set("makeModel")} placeholder="e.g. Ford Ranger XLT" />
        </Field>
        <Field label="Odometer (km)" required>
          <Input value={v.odometer} onChange={set("odometer")} type="number" />
        </Field>
        <Field label="Fuel level" required>
          <Select value={v.fuelLevel} onChange={set("fuelLevel")} options={FUEL} />
        </Field>
        <Field label="Drop-off date / time" required full>
          <Input value={v.dropOffAt} onChange={set("dropOffAt")} type="datetime-local" />
        </Field>
      </Section>

      <Section number={2} title="Photos (all angles)">
        <div className="sm:col-span-2 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <PhotoInput label="Front" value={photos.front} onChange={setPhoto("front")} />
          <PhotoInput label="Rear" value={photos.rear} onChange={setPhoto("rear")} />
          <PhotoInput label="Left side" value={photos.left} onChange={setPhoto("left")} />
          <PhotoInput label="Right side" value={photos.right} onChange={setPhoto("right")} />
          <PhotoInput label="Dashboard / odometer" value={photos.dash} onChange={setPhoto("dash")} />
          <PhotoInput label="Other" value={photos.other} onChange={setPhoto("other")} />
        </div>
      </Section>

      <Section number={3} title="Condition & Damage">
        <Field label="Existing damage notes" required full>
          <Textarea value={v.existingDamage} onChange={set("existingDamage")} placeholder="Describe scratches, dents, or other damage" />
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
        <Field label="Staff member" required full>
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

      <Buttons submitting={submitting} onReset={reset} onGenerate={onGenerate} label="Generate drop-off record" />
    </form>
  );
}
