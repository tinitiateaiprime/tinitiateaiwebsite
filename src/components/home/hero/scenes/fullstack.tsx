import { ACCENT, Art, at, Browser, Check, Cylinder, Flow, G, Head, INK, L, LINE, MUTED, OK, P, SOFT, T, box, ring } from '@/components/home/art/kit';

/* 01 — Frontend: pieces fly out of the code and assemble a sign-up page; a cursor clicks the button. */
export function UiScene() {
  const src: [number, number] = [91, 175];
  const from = (cx: number, cy: number): [number, number] => [src[0] - cx, src[1] - cy];
  return <Art label="Interface pieces fly out of React code and assemble into a sign-up page, then a cursor clicks Sign up">
    <L d={box(36, 120, 110, 110, 22)} t={0} fill={INK} />
    <T x={91} y={186} t={200} size={32} weight={600} color="#fff" mono>{'</>'}</T>
    <Browser x={196} y={36} w={332} h={290} t={100} />

    <G t={600} from={from(362, 90)} dur={700}>
      <path d={box(214, 78, 296, 24, 7)} fill="#f4f4f5" stroke="none" />
      <path d={ring(230, 90, 6)} fill={ACCENT} stroke="none" />
      <path d="M420 90H444M456 90H476M488 90H500" stroke={LINE} strokeWidth={4} />
    </G>
    <G t={900} from={from(362, 134)} dur={700}><path d={box(250, 124, 224, 20, 7)} fill={INK} stroke="none" /></G>
    <G t={1100} from={from(362, 158)} dur={700}><path d={box(282, 153, 160, 10, 5)} fill={LINE} stroke="none" /></G>
    <G t={1300} from={from(362, 200)} dur={700}><path d={box(250, 182, 224, 36, 9)} fill="#fff" /><path d="M266 200H330" stroke={LINE} strokeWidth={4} /></G>
    <G t={1500} from={from(362, 246)} dur={700}><path d={box(250, 228, 224, 36, 9)} fill="#fff" /><path d="M266 246H306" stroke={LINE} strokeWidth={4} /></G>
    <G t={1700} from={from(362, 292)} dur={700}>
      <g className="sv-press" style={at(3000)}>
        <path d={box(250, 274, 224, 38, 11)} fill={ACCENT} stroke="none" />
        <text x={362} y={299} textAnchor="middle" fontSize={16} fontWeight={600} fill="#fff" stroke="none">Sign up</text>
      </g>
    </G>
    <path d={ring(410, 296, 16)} stroke="#fff" strokeWidth={2.5} className="sv-ping" style={at(3000)} />
    <G t={2300} from={[60, 50]} dur={700}>
      <path d="M408 290L408 318L415 311L421 324L427 321L421 309L431 309Z" fill="#fff" stroke={INK} strokeWidth={2} />
    </G>
  </Art>;
}

/* 02 — API: a request travels to the server, data is saved, a 201 response comes back in 84 ms. */
export function ApiScene() {
  return <Art label="The browser sends a POST request to the API server, the user is saved to the database, and a 201 response returns in 84 milliseconds">
    <Browser x={26} y={92} w={156} h={134} t={0} />
    <G t={300} out={3100}>
      <path d={box(50, 168, 108, 34, 10)} fill={INK} stroke="none" />
      <text x={104} y={190} textAnchor="middle" fontSize={15} fontWeight={600} fill="#fff" stroke="none">Sign up</text>
    </G>
    <Check cx={104} cy={170} r={24} t={3200} />

    <T x={295} y={52} t={400} size={16} weight={500} color={MUTED}>API server</T>
    {[0, 1, 2].map(i => <g key={i}>
      <L d={box(240, 70 + i * 56, 110, 44, 10)} t={200 + i * 120} fill="#fff" />
      <g className="sv-blink"><P d={ring(262, 92 + i * 56, 5)} t={400 + i * 120} fill={OK} /></g>
      <L d={`M282 ${92 + i * 56}H330`} t={450 + i * 120} color={LINE} w={4} />
    </g>)}

    <L d="M186 122H232" t={500} color={LINE} /><Head x={234} y={122} dir="r" t={600} color={MUTED} />
    <G t={700} fly={[70, 0]} dur={800}>
      <path d={box(150, 108, 84, 28, 14)} fill={ACCENT} stroke="none" />
      <text x={192} y={127} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff" stroke="none" className="font-mono">POST</text>
    </G>

    <Flow d="M295 240V266" t={1400} />
    <Cylinder cx={295} top={276} rx={48} ry={12} h={44} t={1300} />
    <P d={box(264, 296, 62, 10, 5)} t={1900} fill={ACCENT} className="sv-grow" />

    <L d="M236 196H190" t={2200} color={LINE} /><Head x={186} y={196} dir="l" t={2300} color={MUTED} />
    <G t={2400} fly={[-74, 0]} dur={800}>
      <path d={box(238, 182, 76, 28, 14)} fill={OK} stroke="none" />
      <text x={276} y={201} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff" stroke="none" className="font-mono">201 OK</text>
    </G>

    <L d={ring(462, 168, 62)} t={300} fill="#fff" />
    <L d="M462 106V94M448 90H476" t={500} />
    <path d={ring(462, 168, 62)} pathLength={1} stroke={ACCENT} strokeWidth={5} className="sv-draw" style={at(700, { '--dur': '2200ms' })} />
    <T x={462} y={178} t={2900} size={28} weight={700}>84 ms</T>
    <T x={462} y={262} t={3000} size={16} weight={500} color={MUTED}>response time</T>
  </Art>;
}

/* 03 — Database: a new row slides into the users table, the dashboard greets the user. */
export function DataScene() {
  const bars = [52, 84, 66, 112, 94];
  return <Art label="A new user row slides into the database, and the app shows a personal dashboard with charts and an Ask AI button">
    <Cylinder cx={124} top={68} rx={88} ry={22} h={214} t={0} />
    {[0, 1, 2].map(i => <P key={i} d={box(58, 112 + i * 40, 132, 26, 7)} t={300 + i * 100} fill="#f4f4f5" className="sv-fade" />)}
    <G t={900} from={[130, 0]} dur={700}>
      <path d={box(58, 232, 132, 26, 7)} fill={ACCENT} stroke="none" />
      <path d={`${ring(74, 245, 4)}M88 245H172`} fill="#fff" stroke="#fff" strokeWidth={3} />
    </G>
    <T x={124} y={330} t={600} size={16} weight={500} color={MUTED}>users</T>

    <Flow d="M218 180H258" t={1500} /><Head x={262} y={180} dir="r" t={1600} />
    <Browser x={272} y={36} w={258} h={292} t={1500} />
    <P d={ring(306, 90, 17)} t={1900} fill={SOFT} stroke={ACCENT} />
    <P d={`${ring(306, 85, 5.5)}M296 99C298 93 314 93 316 99`} t={1950} fill="none" stroke={ACCENT} />
    <T x={334} y={97} t={2000} size={19} weight={650} anchor="start">Hi, Priya</T>
    <G t={2900} pop>
      <path d={box(292, 124, 128, 32, 16)} fill={INK} stroke="none" />
      <path d="M312 130C313 136 315 138 321 139C315 140 313 142 312 148C311 142 309 140 303 139C309 138 311 136 312 130Z" fill="#a5b8ff" stroke="none" />
      <text x={368} y={145} textAnchor="middle" fontSize={14} fontWeight={600} fill="#fff" stroke="none">Ask AI</text>
    </G>
    <L d="M292 300H510" t={2000} color={LINE} />
    {bars.map((h, i) => <P key={i} d={box(304 + i * 42, 298 - h, 26, h, 6)} t={2200 + i * 110} fill={i === 3 ? ACCENT : SOFT} className="sv-rise" />)}
    <Check cx={500} cy={98} r={13} t={3300} color={OK} />
  </Art>;
}
