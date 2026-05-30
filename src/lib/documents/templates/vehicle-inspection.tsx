/* eslint-disable jsx-a11y/alt-text -- react-pdf <Image> is not an HTML img and has no alt prop */
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import {
  MWDocument,
  Section,
  FieldRow,
  Field,
  Disclaimer,
  Note,
} from "../branding/primitives";
import { COLOR, SIZE } from "../branding/theme";
import type { VehicleInspectionData } from "../schemas/vehicle-inspection";

const s = StyleSheet.create({
  photoGrid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -4 },
  photoCell: { width: "33.33%", paddingHorizontal: 4, marginBottom: 8 },
  photo: {
    width: "100%",
    height: 90,
    objectFit: "cover",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: COLOR.line,
  },
  photoLabel: { fontSize: SIZE.label, color: COLOR.muted, marginTop: 2 },
  diagram: {
    width: 340,
    height: 190,
    borderWidth: 1,
    borderColor: COLOR.line,
    borderRadius: 3,
    objectFit: "contain",
  },
  sigRow: { flexDirection: "row", marginHorizontal: -10, marginTop: 4 },
  sigBox: { flex: 1, marginHorizontal: 10 },
  sigImg: { height: 48, objectFit: "contain" },
  sigLine: { borderBottomWidth: 1, borderBottomColor: COLOR.ink, marginTop: 4 },
  sigLabel: {
    fontSize: SIZE.label,
    color: COLOR.muted,
    marginTop: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

export function VehicleInspectionTemplate({
  data,
}: {
  data: VehicleInspectionData;
}) {
  const dropDate = data.dropOffAt.replace("T", " ");
  const photos = [
    { label: "Front", src: data.photoFront },
    { label: "Rear", src: data.photoRear },
    { label: "Driver side", src: data.photoDriver },
    { label: "Passenger side", src: data.photoPassenger },
    { label: "Roof", src: data.photoRoof },
    { label: "Tray", src: data.photoTray },
    { label: "Canopy", src: data.photoCanopy },
    { label: "Interior", src: data.photoInterior },
  ].filter((p) => p.src);

  return (
    <MWDocument
      title="Vehicle Drop-Off Inspection"
      meta={[`Rego: ${data.rego}`, `Drop-off: ${dropDate}`]}
    >
      <Section title="Customer & Vehicle">
        <FieldRow>
          <Field label="Customer" value={data.customer} width="100%" />
          <Field label="Vehicle registration" value={data.rego} />
          <Field label="Odometer (km)" value={data.odometer} />
          <Field label="Make" value={data.make} />
          <Field label="Model" value={data.model} />
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

      {data.damageDiagram ? (
        <Section title="Damage Diagram">
          <Image src={data.damageDiagram} style={s.diagram} />
        </Section>
      ) : null}

      <Section title="Customer Belongings">
        {data.belongings.length > 0 ? (
          <Text>{data.belongings.join(", ")}</Text>
        ) : (
          <Note>No belongings recorded.</Note>
        )}
      </Section>

      <Section title="Photos">
        {photos.length > 0 ? (
          <View style={s.photoGrid}>
            {photos.map((p) => (
              <View key={p.label} style={s.photoCell}>
                <Image src={p.src} style={s.photo} />
                <Text style={s.photoLabel}>{p.label}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Note>No photos attached.</Note>
        )}
      </Section>

      <Section title="Sign-off">
        <FieldRow>
          <Field label="Staff member" value={data.staffMember} width="100%" />
        </FieldRow>
        <View style={s.sigRow}>
          <SignatureColumn label="Customer signature" src={data.customerSignature} />
          <SignatureColumn label="Staff signature" src={data.staffSignature} />
        </View>
      </Section>
    </MWDocument>
  );
}

function SignatureColumn({ label, src }: { label: string; src: string }) {
  return (
    <View style={s.sigBox}>
      {src ? (
        <Image src={src} style={s.sigImg} />
      ) : (
        <View style={{ height: 48 }} />
      )}
      <View style={s.sigLine} />
      <Text style={s.sigLabel}>{label}</Text>
    </View>
  );
}
