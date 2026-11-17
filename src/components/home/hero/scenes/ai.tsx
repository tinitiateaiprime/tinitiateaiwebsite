import { ACCENT, Art, at, BAD, BAD_SOFT, Bubble, Check, Chip, Cross, Cylinder, Doc, Flow, G, Head, INK, L, LINE, MUTED, OK, P, SOFT, T, WARN, WARN_SOFT, box, ring } from '@/components/home/art/kit';

/** One vector strip: an accent bar with dots (a chunk turned into numbers). */
function Strip({ x, y, solid }: { x: number; y: number; solid?: boolean }) {
  return <>
    <path d={box(x, y, 88, 24, 8)} fill={solid ? ACCENT : SOFT} stroke={ACCENT} />
    {[0, 1, 2, 3].map(i => <path key={i} d={ring(x + 18 + i * 17, y + 12, 3.6)} fill={solid ? '#fff' : ACCENT} stroke="none" opacity={solid ? 1 : 0.35 + i * 0.18} />)}
  </>;
}

/* 01 — RAG: a PDF splits into vectors, a question finds the right one, the model answers with a source. */
export function RagScene() {
  const slots = [106, 142, 178];
  return <Art label="A PDF is split into chunks stored in a vector database; a question retrieves the matching chunk and the AI answers from it, citing the PDF">
    <Doc x={36} y={50} w={100} h={128} />
    <P d={box(52, 142, 42, 20, 5)} t={500} fill={BAD} />
    <T x={73} y={157} t={600} size={12} weight={700} color="#fff">PDF</T>
    <Flow d="M146 114H204" t={500} /><Head x={208} y={114} dir="r" t={600} />

    <T x={280} y={34} t={300} size={16} weight={500} color={MUTED}>Vector DB</T>
    <Cylinder cx={280} top={70} rx={72} ry={18} h={150} t={200} />
    {slots.map((y, i) => <G key={y} t={700 + i * 250} from={[86 - 280, 114 - (y + 12)]} dur={800}><Strip x={236} y={y} /></G>)}

    <Bubble x={34} y={250} w={206} h={56} t={1700} />
    <T x={137} y={284} t={1900} size={18} weight={500}>How many leave days?</T>
    <Flow d="M240 270H262Q280 270 280 256" t={2400} /><Head x={280} y={248} dir="u" t={2500} />
    <G t={2700} pop><Strip x={236} y={142} solid /></G>

    <T x={462} y={42} t={600} size={16} weight={500} color={MUTED}>LLM</T>
    <Chip cx={462} cy={118} s={42} t={400} lit={3800} />
    <Flow d="M330 154C380 154 380 118 404 118" t={2900} />
    <G t={3000} fly={[182, -36]} dur={900}><Strip x={236} y={142} solid /></G>

    <Flow d="M462 176V224" t={4000} /><Head x={462} y={230} dir="d" t={4100} />
    <Bubble x={334} y={240} w={196} h={78} t={4100} tail="right" />
    <T x={432} y={273} t={4300} size={20} weight={650}>24 days a year</T>
    <Check cx={362} cy={297} r={9} t={4700} />
    <T x={378} y={302} t={4750} size={14} weight={500} color={MUTED} anchor="start">leave-policy.pdf</T>
  </Art>;
}

/* 02 — Prompts: rules, context, question and format snap together, the model returns clean JSON. */
export function PromptScene() {
  const blocks: [string, string][] = [['Rules', ACCENT], ['Context', OK], ['Question', WARN], ['Format', INK]];
  return <Art label="Rules, context, the question and an output format combine into one prompt; the model returns structured JSON">
    {blocks.map(([name, color], i) => {
      const y = 46 + i * 54;
      return <G key={name} t={i * 350} from={[-70, 0]} dur={700}>
        <path d={box(36, y, 200, 44, 12)} fill="#fff" />
        <path d={`M48 ${y}H44a8 8 0 0 0 -8 8v28a8 8 0 0 0 8 8h4Z`} fill={color} stroke="none" />
        <path d={box(36, y, 200, 44, 12)} />
        <text x={62} y={y + 28} fontSize={18} fontWeight={600} fill={INK} stroke="none">{name}</text>
        <path d={`M160 ${y + 22}H218`} stroke={LINE} strokeWidth={4} />
      </G>;
    })}
    <L d="M250 46C264 46 264 58 264 78V132C264 146 268 151 278 151C268 151 264 156 264 170V224C264 244 264 254 250 254" t={1500} />
    <Flow d="M286 151H322" t={1700} /><Head x={326} y={151} dir="r" t={1800} />
    <Chip cx={388} cy={151} s={40} t={1700} lit={2300} />
    <T x={388} y={232} t={2000} size={16} weight={500} color={MUTED}>Model</T>
    <Flow d="M444 151H458" t={2400} />
    <L d={box(466, 62, 86, 178, 14)} t={2400} fill="#111113" />
    <T x={480} y={96} t={2600} size={22} color="#9ca3af" anchor="start" mono>{'{'}</T>
    {[0, 1, 2].map(i => <g key={i}>
      <P d={box(492, 112 + i * 30, 22, 9, 4.5)} t={2800 + i * 200} fill="#a5b8ff" className="sv-grow" />
      <P d={box(518, 112 + i * 30, 22, 9, 4.5)} t={2900 + i * 200} fill="#86efac" className="sv-grow" />
    </g>)}
    <T x={480} y={222} t={3300} size={22} color="#9ca3af" anchor="start" mono>{'}'}</T>
    <Check cx={546} cy={66} r={13} t={3500} />
    <T x={509} y={268} t={3400} size={16} weight={500} color={MUTED}>JSON</T>
  </Art>;
}

/* 03 — Evals: a test checklist runs, one fails, the prompt is fixed, accuracy goes 75% → 100%. */
export function EvalScene() {
  const rows = [102, 160, 218, 276];
  const arc = 'M326 220A94 94 0 0 1 514 220';
  return <Art label="A test checklist runs: three pass, one fails, it gets fixed, and the accuracy gauge rises from 75% to 100%">
    <L d={box(36, 50, 236, 284, 18)} t={0} fill="#fff" />
    <L d={box(114, 36, 80, 30, 10)} t={200} fill="#fff" />
    {rows.map((y, i) => <g key={y}>
      <L d={box(62, y - 15, 30, 30, 8)} t={300 + i * 120} />
      <L d={`M110 ${y - 5}H240M110 ${y + 8}H200`} t={400 + i * 120} color={LINE} w={4} />
    </g>)}
    <Check cx={77} cy={102} r={14} t={900} />
    <Check cx={77} cy={160} r={14} t={1300} />
    <G t={1700} out={3100}><Cross cx={77} cy={218} r={14} t={1700} /></G>
    <Check cx={77} cy={218} r={14} t={3200} />
    <Check cx={77} cy={276} r={14} t={2100} />
    <g transform="translate(222 200) scale(1.45)"><g className="sv-pop" style={at(2600)}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" fill={SOFT} stroke={ACCENT} strokeWidth={1.6} />
    </g></g>

    <path d={arc} stroke={LINE} strokeWidth={16} className="sv-fade" style={at(300)} />
    <path d={arc} pathLength={1} stroke={ACCENT} strokeWidth={16} className="sv-arc" style={at(900, { '--to': '0.25', '--dur': '1500ms' })} />
    <path d={arc} pathLength={1} stroke={OK} strokeWidth={16} className="sv-arc" style={at(3200, { '--to': '0', '--dur': '800ms' })} />
    <G t={900} out={3200}><T x={420} y={208} t={900} size={44} weight={700}>75%</T></G>
    <T x={420} y={208} t={3300} size={44} weight={700} color={OK}>100%</T>
    <T x={420} y={250} t={1000} size={17} weight={500} color={MUTED}>Accuracy</T>
  </Art>;
}

/* 04 — Guardrails: a safe question passes, an attack is stopped, personal data is masked. */
export function GuardrailScene() {
  const shield = 'M280 96L350 122V182C350 230 322 262 280 282C238 262 210 230 210 182V122Z';
  const pill = (x: number, y: number, w: number, fill = '#fff', stroke = INK) => <path d={box(x, y, w, 42, 21)} fill={fill} stroke={stroke} />;
  return <Art label="A shield checks messages: a normal question is allowed, a prompt-injection attack is blocked, and an ID number is masked">
    <L d={shield} t={0} fill={SOFT} color={ACCENT} />
    <L d={`${box(264, 178, 32, 26, 6)}M270 178V170a10 10 0 0 1 20 0V178`} t={400} color={ACCENT} />

    <G t={300} from={[-372, 0]} dur={1500}>
      {pill(406, 100, 132)}
      <text x={472} y={127} textAnchor="middle" fontSize={16} fontWeight={500} fill={INK} stroke="none">Leave days?</text>
    </G>
    <Check cx={536} cy={100} r={12} t={1800} />
    <T x={472} y={166} t={1900} size={15} color={OK}>Allowed</T>

    <G t={1700} from={[-60, 0]} dur={700}>
      {pill(56, 168, 146, BAD_SOFT, BAD)}
      <text x={129} y={195} textAnchor="middle" fontSize={16} fontWeight={500} fill={BAD} stroke="none">Ignore the rules</text>
    </G>
    <L d={shield} t={2300} color={BAD} />
    <Cross cx={200} cy={168} r={12} t={2400} />
    <T x={129} y={236} t={2500} size={15} color={BAD}>Blocked</T>

    <G t={3000} from={[-372, 0]} dur={1500}>
      {pill(406, 236, 132)}
      <G t={3000} out={3750}><text x={472} y={263} textAnchor="middle" fontSize={16} fontWeight={500} fill={INK} stroke="none">ID 4821 7735</text></G>
      <G t={3750}><text x={472} y={263} textAnchor="middle" fontSize={16} fontWeight={600} fill={WARN} stroke="none" className="font-mono">•••• 7735</text></G>
    </G>
    <path d={ring(536, 236, 12)} fill={WARN_SOFT} stroke={WARN} className="sv-pop" style={at(4500)} />
    <T x={472} y={302} t={4600} size={15} color={WARN}>Masked</T>
  </Art>;
}
