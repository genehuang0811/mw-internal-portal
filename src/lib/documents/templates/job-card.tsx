/* eslint-disable jsx-a11y/alt-text -- react-pdf <Image> is not an HTML img and has no alt prop */
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import {
  MWDocument,
  Section,
  FieldRow,
  Field,
  Table,
  Note,
} from "../branding/primitives";
import { COLOR, FONT, SIZE } from "../branding/theme";
import type { JobCardData } from "../schemas/job-card";

const s = StyleSheet.create({
  checkItem: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  box: {
    width: 11,
    height: 11,
    borderWidth: 1,
    borderColor: COLOR.body,
    borderRadius: 2,
    marginRight: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  boxDone: { backgroundColor: COLOR.ink, borderColor: COLOR.ink },
  tick: { color: COLOR.white, fontSize: 8, fontFamily: FONT.bold },
  checkLabel: { fontSize: SIZE.value, color: COLOR.ink },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLOR.subtle,
    borderWidth: 1,
    borderColor: COLOR.line,
    borderRadius: 3,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  statusLabel: { fontSize: SIZE.value, color: COLOR.body },
  statusValue: { fontFamily: FONT.bold, fontSize: SIZE.value, color: COLOR.ink },
  sigImg: { height: 46, objectFit: "contain" },
  sigLine: { borderBottomWidth: 1, borderBottomColor: COLOR.ink, marginTop: 4, width: 240 },
  sigLabel: {
    fontSize: SIZE.label,
    color: COLOR.muted,
    marginTop: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

export function JobCardTemplate({ data }: { data: JobCardData }) {
  const parts = data.parts.filter((p) => p.description);
  return (
    <MWDocument
      title="Workshop Job Card"
      meta={[`Order: ${data.orderNumber}`, `Job: ${data.jobNumber}`, `Start: ${data.startDate}`]}
    >
      <Section title="Order & Customer">
        <FieldRow>
          <Field label="MW order number" value={data.orderNumber} />
          <Field label="Job number" value={data.jobNumber} />
          <Field label="Customer" value={data.customer} />
          <Field label="Vehicle" value={data.vehicle} />
          <Field label="Installer assigned" value={data.installer} />
          <Field label="Estimated hours" value={data.estimatedHours} />
          <Field label="Start date" value={data.startDate} />
        </FieldRow>
      </Section>

      <Section title="Work Scope">
        <FieldRow>
          <Field label="Work required" value={data.workRequired} width="100%" />
        </FieldRow>
      </Section>

      <Section title="Parts List">
        {parts.length > 0 ? (
          <Table
            columns={["Part / description", "Qty", "SKU"]}
            widths={[4, 1, 2]}
            rows={parts.map((p) => [p.description, p.qty || "—", p.sku || "—"])}
          />
        ) : (
          <Note>No parts listed.</Note>
        )}
      </Section>

      {data.checklist.length > 0 ? (
        <Section title="Installer Checklist">
          {data.checklist.map((c, i) => (
            <View key={i} style={s.checkItem}>
              <View style={[s.box, ...(c.done ? [s.boxDone] : [])]}>
                {c.done ? <Text style={s.tick}>X</Text> : null}
              </View>
              <Text style={s.checkLabel}>{c.label}</Text>
            </View>
          ))}
        </Section>
      ) : null}

      <Section title="Completion Sign-off">
        <View style={s.statusRow}>
          <Text style={s.statusLabel}>Job completed: </Text>
          <Text style={s.statusValue}>{data.completed ? "YES" : "NO"}</Text>
          {data.completionDate ? (
            <Text style={[s.statusLabel, { marginLeft: 16 }]}>
              Date: <Text style={s.statusValue}>{data.completionDate}</Text>
            </Text>
          ) : null}
        </View>
        {data.completionNotes ? (
          <FieldRow>
            <Field label="Completion notes" value={data.completionNotes} width="100%" />
          </FieldRow>
        ) : null}
        <View style={{ marginTop: 6 }}>
          {data.installerSignature ? (
            <Image src={data.installerSignature} style={s.sigImg} />
          ) : (
            <View style={{ height: 46 }} />
          )}
          <View style={s.sigLine} />
          <Text style={s.sigLabel}>Installer signature</Text>
        </View>
      </Section>
    </MWDocument>
  );
}
