import { ACCENT, Art, at, Browser, Bubble, Check, Cylinder, Flow, G, Head, INK, L, LINE, MUTED, OK, P, Robot, SOFT, T, box, ring } from '@/components/home/art/kit';

/* 01 — Search: the agent scans web pages with a magnifier, keeps the papers, drops the blog. */
export function SearchScene() {
  const pages = [[196, 54], [326, 54], [196, 196], [326, 196]] as const;
  const keep = [0, 1, 3];
  return <Art label="An AI agent searches the web, scans four pages, keeps three research papers and skips a blog post">
    <Bubble x={22} y={52} w={146} h={48} t={400} />
    <T x={95} y={82} t={600} size={16} weight={500}>find AI papers</T>
    <Robot x={46} y={150} t={0} />
    <T x={94} y={268} t={600} size={16} weight={500} color={MUTED}>Agent</T>

    {pages.map(([x, y], i) => <g key={i}>
      <Browser x={x} y={y} w={110} h={118} t={800 + i * 150} />
      <L d={`M${x + 16} ${y + 48}H${x + 86}M${x + 16} ${y + 64}H${x + 72}M${x + 16} ${y + 80}H${x + 92}M${x + 16} ${y + 96}H${x + 62}`} t={950 + i * 150} color={LINE} w={4} />
    </g>)}

    <G t={1200} out={3700}>
      <g className="sv-scan" style={at(1300, { '--dur': '2400ms', '--x1': '130px', '--y1': '0px', '--x2': '0px', '--y2': '142px', '--x3': '130px', '--y3': '142px' })}>
        <path d={ring(251, 118, 30)} fill="rgb(47 84 235 / 0.07)" stroke={ACCENT} strokeWidth={3.5} />
        <path d="M273 140L296 163" stroke={ACCENT} strokeWidth={6} />
      </g>
    </G>
    {keep.map(i => <Check key={i} cx={pages[i][0] + 104} cy={pages[i][1] + 6} r={13} t={[1500, 2100, 0, 3300][i]} />)}
    <P d={box(197, 197, 108, 116, 13)} t={2700} fill="rgb(255 255 255 / 0.72)" className="sv-fade" />
    <T x={251} y={262} t={2750} size={15} weight={600} color={MUTED}>skipped</T>

    {keep.map((p, i) => {
      const [x, y] = pages[p];
      return <G key={p} t={3700 + i * 160} from={[x + 55 - 498, y + 59 - (90 + i * 86)]} dur={750}>
        <path d={box(470, 56 + i * 86, 58, 70, 8)} fill="#fff" />
        <path d={`M482 ${78 + i * 86}H516M482 ${92 + i * 86}H508M482 ${106 + i * 86}H514`} stroke={LINE} strokeWidth={4} />
        <path d={ring(526, 58 + i * 86, 9)} fill={OK} stroke="none" />
      </G>;
    })}
    <T x={499} y={334} t={4300} size={16} weight={600}>3 papers</T>
  </Art>;
}

/* 02 — Code: Python appears line by line, runs in a sandbox, and produces three summaries. */
export function CodeScene() {
  const code: [number, number, string][] = [[0, 70, '#c084fc'], [0, 120, '#93a8ff'], [24, 150, '#e5e7eb'], [24, 110, '#86efac'], [24, 170, '#93a8ff'], [0, 90, '#c084fc'], [24, 130, '#e5e7eb'], [0, 100, '#86efac']];
  return <Art label="The agent writes Python in an editor, runs it in a sandbox, and three summaries are produced">
    <L d={box(34, 36, 292, 206, 16)} t={0} fill="#111113" color="#111113" />
    <P d={`${ring(54, 56, 4)}${ring(68, 56, 4)}${ring(82, 56, 4)}`} t={200} fill="#3f3f46" />
    <T x={102} y={61} t={300} size={14} color="#71717a" anchor="start" mono>summarise.py</T>
    {code.map(([indent, w, color], i) => <P key={i} d={box(58 + indent, 86 + i * 18, w, 8, 4)} t={400 + i * 170} fill={color} className="sv-grow" />)}
    <P d={ring(298, 56, 14)} t={1900} fill={OK} />
    <P d="M293 49L305 56L293 63Z" t={1950} fill="#fff" />

    <L d={box(34, 258, 292, 66, 14)} t={1900} fill="#111113" color="#111113" />
    <T x={56} y={296} t={2100} size={18} color="#71717a" anchor="start" mono>›</T>
    <P d={box(78, 286, 176, 10, 5)} t={2100} fill="#27272a" className="sv-fade" />
    <P d={box(78, 286, 176, 10, 5)} t={2200} fill={OK} className="sv-grow" />
    <Check cx={290} cy={291} r={13} t={3100} />

    <Flow d="M336 180H374" t={3100} /><Head x={378} y={180} dir="r" t={3200} />
    {[0, 1, 2].map(i => {
      const y = 44 + i * 98;
      return <G key={i} t={3200 + i * 200} from={[-40, 0]} dur={600}>
        <path d={box(392, y, 140, 80, 12)} fill="#fff" />
        <path d={`M408 ${y + 24}H478`} stroke={INK} strokeWidth={5} />
        <path d={`M408 ${y + 44}H512M408 ${y + 58}H490`} stroke={LINE} strokeWidth={4} />
        <path d={`M514 ${y + 12}C515 ${y + 19} 517 ${y + 21} 524 ${y + 22}C517 ${y + 23} 515 ${y + 25} 514 ${y + 32}C513 ${y + 25} 511 ${y + 23} 504 ${y + 22}C511 ${y + 21} 513 ${y + 19} 514 ${y + 12}Z`} fill={ACCENT} stroke="none" />
      </G>;
    })}
  </Art>;
}

/* 03 — Save: the summaries drop into a database, rows light up, the agent reports done. */
export function SaveScene() {
  return <Art label="Three summaries drop into a database, three new rows light up, and the agent reports the task is done">
    {[0, 1, 2].map(i => {
      const y = 46 + i * 92;
      const card = <>
        <path d={box(30, y, 130, 66, 12)} fill="#fff" />
        <path d={`M46 ${y + 22}H108`} stroke={INK} strokeWidth={5} />
        <path d={`M46 ${y + 42}H140`} stroke={LINE} strokeWidth={4} />
      </>;
      return <g key={i}>
        <G t={i * 120} from={[-30, 0]} dur={500}><g className="sv-dim" style={at(800 + i * 300)}>{card}</g></G>
        <G t={800 + i * 300} fly={[300 - 95, 166 - (y + 33)]} dur={900}>{card}</G>
      </g>;
    })}
    <Cylinder cx={300} top={70} rx={86} ry={20} h={196} t={200} />
    {[0, 1, 2].map(i => <g key={i}>
      <P d={box(232, 118 + i * 46, 136, 28, 8)} t={1700 + i * 300} fill={SOFT} stroke={ACCENT} />
      <P d={`${ring(250, 132 + i * 46, 4)}M266 ${132 + i * 46}H348`} t={1750 + i * 300} fill={ACCENT} stroke={ACCENT} />
    </g>)}
    <T x={300} y={318} t={1500} size={16} weight={500} color={MUTED}>papers table</T>

    <Robot x={428} y={150} t={300} />
    <Bubble x={404} y={56} w={144} h={50} t={2700} tail="right" />
    <T x={476} y={87} t={2900} size={17} weight={600}>Done · 3 saved</T>
    <Check cx={476} cy={290} r={20} t={3100} />
  </Art>;
}
