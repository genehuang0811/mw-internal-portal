import type { ReactNode } from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import { BRAND, COLOR, FONT, SIZE } from "./theme";

const s = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 56,
    paddingHorizontal: 40,
    fontFamily: FONT.regular,
    fontSize: SIZE.doc,
    color: COLOR.body,
    lineHeight: 1.4,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 2,
    borderBottomColor: COLOR.ink,
    paddingBottom: 10,
    marginBottom: 16,
  },
  brandRow: { flexDirection: "row", alignItems: "center" },
  logoBox: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: COLOR.ink,
    color: COLOR.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  logoText: { fontFamily: FONT.bold, fontSize: SIZE.wordmark, color: COLOR.white },
  brandName: { fontFamily: FONT.bold, fontSize: 11, color: COLOR.ink },
  brandSub: {
    fontSize: SIZE.small,
    color: COLOR.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  headRight: { alignItems: "flex-end", maxWidth: 250 },
  docTitle: { fontFamily: FONT.bold, fontSize: SIZE.title, color: COLOR.ink },
  docMetaLine: { fontSize: SIZE.small, color: COLOR.muted, marginTop: 2 },

  // Footer
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLOR.line,
    paddingTop: 6,
    fontSize: SIZE.small,
    color: COLOR.faint,
  },

  // Section
  section: { marginBottom: 12 },
  sectionHead: {
    backgroundColor: COLOR.subtle,
    borderLeftWidth: 3,
    borderLeftColor: COLOR.accent,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZE.section,
    color: COLOR.ink,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  // Fields
  fieldRow: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  field: { paddingHorizontal: 6, marginBottom: 8 },
  label: {
    fontSize: SIZE.label,
    color: COLOR.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: { fontSize: SIZE.value, color: COLOR.ink },
  valueEmpty: { fontSize: SIZE.value, color: COLOR.faint },

  // Table
  table: { borderWidth: 1, borderColor: COLOR.line, borderRadius: 3 },
  tr: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: COLOR.line },
  trLast: { flexDirection: "row" },
  th: {
    fontFamily: FONT.bold,
    fontSize: SIZE.label,
    color: COLOR.muted,
    textTransform: "uppercase",
    backgroundColor: COLOR.subtle,
    paddingVertical: 5,
    paddingHorizontal: 7,
  },
  td: { fontSize: SIZE.value, color: COLOR.ink, paddingVertical: 5, paddingHorizontal: 7 },

  // Disclaimer
  disclaimer: {
    backgroundColor: COLOR.warnBg,
    borderWidth: 1,
    borderColor: COLOR.warnLine,
    borderRadius: 3,
    padding: 8,
    marginBottom: 12,
  },
  disclaimerTitle: { fontFamily: FONT.bold, fontSize: SIZE.value, color: COLOR.warnInk, marginBottom: 2 },
  disclaimerBody: { fontSize: SIZE.small, color: COLOR.warnInk },

  // Signature
  sigRow: { flexDirection: "row", marginHorizontal: -10, marginTop: 8 },
  sigBox: { flex: 1, marginHorizontal: 10 },
  sigLine: { borderBottomWidth: 1, borderBottomColor: COLOR.ink, height: 28 },
  sigLabel: { fontSize: SIZE.label, color: COLOR.muted, marginTop: 3, textTransform: "uppercase", letterSpacing: 0.5 },

  noteText: { fontSize: SIZE.small, color: COLOR.muted },
});

export function MWDocument({
  title,
  meta = [],
  children,
}: {
  title: string;
  /** Right-aligned header lines, e.g. "Ref: INV-200", "Date: 2026-05-29". */
  meta?: string[];
  children: ReactNode;
}) {
  const generated = new Date().toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return (
    <Document title={`${BRAND.company} — ${title}`}>
      <Page size="A4" style={s.page}>
        <View style={s.header} fixed>
          <View style={s.brandRow}>
            <View style={s.logoBox}>
              <Text style={s.logoText}>{BRAND.wordmark}</Text>
            </View>
            <View>
              <Text style={s.brandName}>{BRAND.company}</Text>
              <Text style={s.brandSub}>Internal Document</Text>
            </View>
          </View>
          <View style={s.headRight}>
            <Text style={s.docTitle}>{title}</Text>
            {meta.map((m, i) => (
              <Text key={i} style={s.docMetaLine}>
                {m}
              </Text>
            ))}
          </View>
        </View>

        {children}

        <View style={s.footer} fixed>
          <Text>{BRAND.company} — Confidential</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}  ·  Generated ${generated}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={s.section} wrap={false}>
      <View style={s.sectionHead}>
        <Text style={s.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

export function FieldRow({ children }: { children: ReactNode }) {
  return <View style={s.fieldRow}>{children}</View>;
}

export function Field({
  label,
  value,
  width = "50%",
}: {
  label: string;
  value?: string;
  width?: string;
}) {
  const has = value !== undefined && value !== null && String(value).trim() !== "";
  return (
    <View style={[s.field, { width }]}>
      <Text style={s.label}>{label}</Text>
      <Text style={has ? s.value : s.valueEmpty}>{has ? value : "—"}</Text>
    </View>
  );
}

export function Table({
  columns,
  rows,
  widths,
}: {
  columns: string[];
  rows: string[][];
  /** Optional flex weights per column; defaults to equal. */
  widths?: number[];
}) {
  const flexes = columns.map((_, i) => widths?.[i] ?? 1);
  return (
    <View style={s.table}>
      <View style={s.tr}>
        {columns.map((c, i) => (
          <Text key={i} style={[s.th, { flexGrow: flexes[i], flexBasis: 0 }]}>
            {c}
          </Text>
        ))}
      </View>
      {rows.map((r, ri) => (
        <View key={ri} style={ri === rows.length - 1 ? s.trLast : s.tr}>
          {r.map((cell, ci) => (
            <Text key={ci} style={[s.td, { flexGrow: flexes[ci], flexBasis: 0 }]}>
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

export function Disclaimer({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={s.disclaimer} wrap={false}>
      <Text style={s.disclaimerTitle}>{title}</Text>
      <Text style={s.disclaimerBody}>{children}</Text>
    </View>
  );
}

export function SignatureBlock({ labels }: { labels: string[] }) {
  return (
    <View style={s.sigRow} wrap={false}>
      {labels.map((l, i) => (
        <View key={i} style={s.sigBox}>
          <View style={s.sigLine} />
          <Text style={s.sigLabel}>{l}</Text>
        </View>
      ))}
    </View>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <Text style={s.noteText}>{children}</Text>;
}
