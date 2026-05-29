import { View, Text, StyleSheet } from "@react-pdf/renderer";
import {
  MWDocument,
  Section,
  FieldRow,
  Field,
  SignatureBlock,
} from "../branding/primitives";
import { COLOR, FONT, SIZE } from "../branding/theme";
import { leaveDays, type AnnualLeaveData } from "../schemas/annual-leave";

const s = StyleSheet.create({
  totalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLOR.subtle,
    borderWidth: 1,
    borderColor: COLOR.line,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  totalLabel: { fontSize: SIZE.value, color: COLOR.body },
  totalValue: { fontFamily: FONT.bold, fontSize: 13, color: COLOR.ink },
  flowRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  flowStep: {
    flexGrow: 1,
    flexBasis: 0,
    borderWidth: 1,
    borderColor: COLOR.line,
    borderRadius: 3,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  flowTitle: { fontFamily: FONT.bold, fontSize: SIZE.value, color: COLOR.ink },
  flowSub: { fontSize: SIZE.small, color: COLOR.muted },
  arrow: { paddingHorizontal: 6, color: COLOR.faint, fontSize: 12 },
});

export function AnnualLeaveTemplate({ data }: { data: AnnualLeaveData }) {
  const days = leaveDays(data.startDate, data.endDate);
  return (
    <MWDocument
      title="Annual Leave Request"
      meta={[`Employee: ${data.employeeName}`]}
    >
      <Section title="Employee">
        <FieldRow>
          <Field label="Employee name" value={data.employeeName} />
          <Field label="Leave type" value={data.leaveType} />
          <Field label="Manager" value={data.manager} />
        </FieldRow>
      </Section>

      <Section title="Dates">
        <FieldRow>
          <Field label="Start date" value={data.startDate} />
          <Field label="End date" value={data.endDate} />
        </FieldRow>
        <View style={s.totalBox}>
          <Text style={s.totalLabel}>Total days requested</Text>
          <Text style={s.totalValue}>
            {days !== null ? `${days} ${days === 1 ? "day" : "days"}` : "—"}
          </Text>
        </View>
        {data.notes ? (
          <FieldRow>
            <Field label="Reason / notes" value={data.notes} width="100%" />
          </FieldRow>
        ) : null}
      </Section>

      <Section title="Approval Flow">
        <View style={s.flowRow}>
          <View style={s.flowStep}>
            <Text style={s.flowTitle}>Employee</Text>
            <Text style={s.flowSub}>{data.employeeName}</Text>
          </View>
          <Text style={s.arrow}>»</Text>
          <View style={s.flowStep}>
            <Text style={s.flowTitle}>Manager approval</Text>
            <Text style={s.flowSub}>{data.manager}</Text>
          </View>
          <Text style={s.arrow}>»</Text>
          <View style={s.flowStep}>
            <Text style={s.flowTitle}>Accounts processing</Text>
            <Text style={s.flowSub}>Recorded & filed</Text>
          </View>
        </View>
        <View style={{ marginTop: 12 }}>
          <SignatureBlock labels={["Employee signature", "Manager approval"]} />
        </View>
      </Section>
    </MWDocument>
  );
}
