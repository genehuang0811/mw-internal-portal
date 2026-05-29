import { View, Text } from "@react-pdf/renderer";
import {
  MWDocument,
  Section,
  FieldRow,
  Field,
  Disclaimer,
  SignatureBlock,
  Note,
} from "../branding/primitives";
import type { VehicleInspectionData } from "../schemas/vehicle-inspection";

export function VehicleInspectionTemplate({
  data,
}: {
  data: VehicleInspectionData;
}) {
  const dropDate = data.dropOffAt.replace("T", " ");
  return (
    <MWDocument
      title="Vehicle Drop-Off Inspection"
      meta={[`Rego: ${data.rego}`, `Drop-off: ${dropDate}`]}
    >
      <Section title="Customer & Vehicle">
        <FieldRow>
          <Field label="Customer" value={data.customer} width="100%" />
          <Field label="Vehicle rego" value={data.rego} />
          <Field label="Make / model" value={data.makeModel} />
          <Field label="Odometer (km)" value={data.odometer} />
          <Field label="Fuel level" value={data.fuelLevel} />
          <Field label="Drop-off date / time" value={dropDate} width="100%" />
        </FieldRow>
      </Section>

      <Section title="Condition">
        <FieldRow>
          <Field
            label="Existing damage notes"
            value={data.existingDamage}
            width="100%"
          />
          {data.notes ? (
            <Field label="Additional notes" value={data.notes} width="100%" />
          ) : null}
        </FieldRow>
      </Section>

      <Disclaimer title="BLIS / Sensor Relocation Disclaimer">
        Customer acknowledges that fitment may require relocation of sensors /
        BLIS components and accepts the associated disclaimer.{"  "}
        Acknowledged: {data.blisDisclaimer ? "YES" : "NO"}.
      </Disclaimer>

      <Section title="Customer Belongings">
        {data.belongings.length > 0 ? (
          <Text>{data.belongings.join(", ")}</Text>
        ) : (
          <Note>No belongings recorded.</Note>
        )}
      </Section>

      <Section title="Photos">
        <Note>
          Photos (front, rear, sides, dashboard, existing damage) to be attached
          to this record. Cloud upload coming soon.
        </Note>
      </Section>

      <Section title="Sign-off">
        <FieldRow>
          <Field label="Staff member" value={data.staffMember} width="100%" />
        </FieldRow>
        <View style={{ marginTop: 6 }}>
          <SignatureBlock labels={["Customer signature", "Staff signature"]} />
        </View>
      </Section>
    </MWDocument>
  );
}
