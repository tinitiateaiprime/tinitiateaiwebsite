import { ACCENT, Art, at, BAD, BAD_SOFT, Check, Cross, Flow, G, Head, INK, L, LINE, Logo, MUTED, OK, P, Person, SOFT, T, WARN, WARN_SOFT, box, ring } from '@/components/home/art/kit';

/** Small table glyph (grid) used for data assets. */
function TableIcon({ x, y, t }: { x: number; y: number; t: number }) {
  return <L d={`${box(x, y, 26, 22, 4)}M${x} ${y + 8}H${x + 26}M${x + 9} ${y + 8}V${y + 22}`} t={t} color={ACCENT} />;
}

/* 01 — Catalog: sources are scanned and every asset lands in one catalog, tagged. */
export function CatalogScene() {
  const sources: [string, string, number][] = [['azure-sql', 'SQL', 34], ['azure-data-lake', 'Data lake', 144], ['snowflake', 'Snowflake', 254]];
  const assets: [string, string, string, string][] = [['customers', 'PII', BAD_SOFT, BAD], ['invoices', 'Finance', WARN_SOFT, WARN], ['orders', 'Sales', SOFT, ACCENT], ['employees', 'PII', BAD_SOFT, BAD]];
  return <Art label="SQL, data lake and Snowflake sources are scanned and their tables appear in one data catalog, tagged as PII, Finance or Sales">
    {sources.map(([logo, name, y], i) => <g key={name}>
      <L d={box(34, y, 72, 72, 16)} t={i * 120} fill="#fff" />
      <Logo name={logo} x={52} y={y + 18} s={36} t={200 + i * 120} />
      <T x={70} y={y + 92} t={300 + i * 120} size={14} weight={500} color={MUTED}>{name}</T>
      <Flow d={`M110 ${y + 36}C160 ${y + 36} 170 180 206 180`} t={700 + i * 150} />
    </g>)}

    <L d={ring(250, 180, 44)} t={300} fill={SOFT} color={ACCENT} />
    <L d={`${ring(250, 180, 26)}${ring(250, 180, 10)}`} t={500} color={ACCENT} />
    <g className="sv-spin" style={{ transformOrigin: '250px 180px', transformBox: 'view-box' }}><path d="M250 180L250 140" stroke={ACCENT} strokeWidth={3} className="sv-fade" style={at(700)} /></g>
    <T x={250} y={248} t={800} size={15} weight={600} color={ACCENT}>Scan</T>
    <Flow d="M296 180H330" t={1300} /><Head x={334} y={180} dir="r" t={1400} />

    <L d={box(342, 30, 190, 300, 16)} t={200} fill="#fff" />
    <T x={360} y={62} t={500} size={17} anchor="start">Data catalog</T>
    <L d="M342 78H532" t={600} color={LINE} />
    {assets.map(([name, tag, soft, color], i) => {
      const y = 96 + i * 58;
      return <G key={name} t={1500 + i * 260} from={[-24, 0]} dur={500}>
        <TableIcon x={358} y={y} t={1500 + i * 260} />
        <text x={394} y={y + 16} fontSize={15} fontWeight={500} fill={INK} stroke="none" className="font-mono">{name}</text>
        <g className="sv-pop" style={at(1800 + i * 260)}>
          <path d={box(358, y + 28, tag.length * 8 + 22, 22, 11)} fill={soft} stroke={color} strokeWidth={1.5} />
          <text x={369} y={y + 43} fontSize={12} fontWeight={700} fill={color} stroke="none">{tag}</text>
        </g>
      </G>;
    })}
  </Art>;
}

/* 02 — Lineage: columns flow from source to report; PII never reaches the report. */
export function LineageScene() {
  const cols: [string, boolean][] = [['order_id', true], ['email', false], ['amount', true], ['region', true]];
  return <Art label="Column-level lineage: order id, amount and region flow from the source table through a transform into the revenue report, while the email column is stopped as PII">
    <L d={box(26, 50, 168, 236, 14)} t={0} fill="#fff" />
    <T x={42} y={80} t={300} size={15} anchor="start">orders</T>
    <T x={178} y={80} t={300} size={12} weight={500} color={MUTED} anchor="end">source</T>
    <L d="M26 96H194" t={400} color={LINE} />
    {cols.map(([c, ok], i) => {
      const y = 126 + i * 42;
      return <g key={c}>
        <T x={42} y={y + 5} t={500 + i * 120} size={15} weight={500} anchor="start" mono>{c}</T>
        <P d={ring(194, y, 5)} t={600 + i * 120} fill={ok ? ACCENT : BAD} />
        {ok ? <L d={`M199 ${y}C222 ${y} 214 172 240 172`} t={1200 + i * 250} color={ACCENT} />
          : <><L d={`M199 ${y}H220`} t={1200 + i * 250} color={BAD} /><Cross cx={230} cy={y} r={10} t={1500} /></>}
      </g>;
    })}

    <L d={box(240, 140, 100, 64, 14)} t={300} fill={SOFT} color={ACCENT} />
    <T x={290} y={170} t={600} size={14} weight={600} color={ACCENT} mono>clean</T>
    <T x={290} y={190} t={650} size={14} weight={600} color={ACCENT} mono>join</T>
    <T x={290} y={232} t={800} size={13} weight={500} color={MUTED}>transform</T>

    <L d={box(386, 40, 148, 280, 14)} t={400} fill="#fff" />
    <T x={402} y={70} t={700} size={15} anchor="start">Revenue report</T>
    <L d="M386 86H534" t={800} color={LINE} />
    {[48, 74, 60, 92].map((h, i) => <P key={i} d={box(408 + i * 28, 196 - h, 18, h, 4)} t={2600 + i * 100} fill={i === 3 ? ACCENT : SOFT} className="sv-rise" />)}
    <L d="M400 198H520" t={2500} color={LINE} />
    {['revenue', 'region'].map((c, i) => <g key={c}>
      <P d={ring(386, 236 + i * 40, 5)} t={2300} fill={ACCENT} />
      <T x={402} y={241 + i * 40} t={2400 + i * 100} size={15} weight={500} anchor="start" mono>{c}</T>
      <L d={`M340 172C370 172 360 ${236 + i * 40} 381 ${236 + i * 40}`} t={2100 + i * 150} color={ACCENT} />
    </g>)}
    <Check cx={520} cy={56} r={11} t={3100} />
  </Art>;
}

/* 03 — Access policies: the same table, masked for an analyst, full for HR. */
export function PolicyScene() {
  const rows = [0, 1, 2];
  const table = (x: number, masked: boolean, t: number) => <>
    <L d={box(x, 118, 196, 176, 14)} t={t} fill="#fff" />
    {['name', 'email', 'salary'].map((h, i) => <T key={h} x={x + 16 + i * 62} y={146} t={t + 300} size={13} weight={600} color={MUTED} anchor="start" mono>{h}</T>)}
    <L d={`M${x} 158H${x + 196}`} t={t + 300} color={LINE} />
    {rows.map(r => {
      const y = 186 + r * 36;
      return <g key={r}>
        <L d={`M${x + 16} ${y}H${x + 56}`} t={t + 500 + r * 100} w={5} />
        {masked
          ? <><G t={t + 500} out={2200}><path d={`M${x + 78} ${y}H${x + 124}M${x + 140} ${y}H${x + 176}`} stroke={LINE} strokeWidth={5} /></G>
            <G t={2300 + r * 120}><text x={x + 78} y={y + 5} fontSize={15} fontWeight={700} fill={WARN} stroke="none" className="font-mono">•••• ••••</text></G></>
          : <path d={`M${x + 78} ${y}H${x + 124}M${x + 140} ${y}H${x + 176}`} stroke={ACCENT} strokeWidth={5} className="sv-fade" style={at(t + 600 + r * 100)} />}
      </g>;
    })}
  </>;
  return <Art label="An access policy shows the same employee table masked for an analyst and in full for HR">
    <Person cx={128} cy={48} r={16} t={0} />
    <T x={170} y={66} t={300} size={16} anchor="start">Analyst</T>
    <Person cx={428} cy={48} r={16} t={150} fill={SOFT} color={ACCENT} />
    <T x={470} y={66} t={400} size={16} anchor="start">HR</T>
    {table(24, true, 200)}
    {table(340, false, 350)}

    <L d="M280 150L310 161V184C310 204 298 216 280 223C262 216 250 204 250 184V161Z" t={900} fill={SOFT} color={ACCENT} />
    <L d={`${box(270, 182, 20, 16, 4)}M274 182V177a6 6 0 0 1 12 0V182`} t={1200} color={ACCENT} />
    <T x={280} y={250} t={1300} size={14} weight={600} color={ACCENT}>Policy</T>
    <Flow d="M246 186H226" t={1600} /><Head x={222} y={186} dir="l" t={1700} />
    <Flow d="M314 186H334" t={1600} /><Head x={338} y={186} dir="r" t={1700} />

    <T x={122} y={326} t={2700} size={15} weight={600} color={WARN}>PII masked</T>
    <Check cx={530} cy={122} r={12} t={2600} />
    <T x={438} y={326} t={2700} size={15} weight={600} color={OK}>Full access</T>
  </Art>;
}
