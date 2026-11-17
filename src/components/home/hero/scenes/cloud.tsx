import { ACCENT, Art, at, BAD, Check, Flow, G, Head, INK, L, LINE, Logo, MUTED, OK, P, SOFT, T, WARN, box, cloud, oval, ring } from '@/components/home/art/kit';

/** Small photo thumbnail (the file that travels). */
function Photo({ cx, cy, s }: { cx: number; cy: number; s: number }) {
  const h = s / 2;
  return <>
    <path d={box(cx - h, cy - h, s, s, s * 0.2)} fill="#fff" stroke={ACCENT} />
    <path d={`M${cx - h * 0.7} ${cy + h * 0.6}L${cx - h * 0.2} ${cy}L${cx + h * 0.15} ${cy + h * 0.35}L${cx + h * 0.4} ${cy + h * 0.1}L${cx + h * 0.75} ${cy + h * 0.6}`} stroke={ACCENT} />
  </>;
}

/* 01 — Serverless: upload → storage → function → database, built on AWS and again on Azure. */
export function ServerlessScene() {
  const lanes = [
    { y: 112, t: 300, name: 'AWS', logo: 'aws', services: ['aws-s3', 'aws-lambda', 'aws-dynamodb'] },
    { y: 268, t: 3100, name: 'Azure', logo: 'azure', services: ['azure-storage', 'azure-functions', 'azure-cosmos'] },
  ];
  const xs = [80, 210, 340, 470];
  return <Art label="A photo upload flows into storage, triggers a function that resizes it, and is saved to a database, first on AWS and then on Azure">
    {lanes.map(({ y, t, name, logo, services }) => <g key={name}>
      <Logo name={logo} x={22} y={y - 82} s={30} t={t - 300} />
      <T x={60} y={y - 61} t={t - 250} size={18} weight={650} anchor="start">{name}</T>
      {[0, 1, 2].map(i => <g key={i}><L d={`M${xs[i] + 42} ${y}H${xs[i + 1] - 42}`} t={t + 100 + i * 100} color={LINE} /><Head x={xs[i + 1] - 40} y={y} dir="r" t={t + 300 + i * 100} color={MUTED} /></g>)}

      <L d={box(xs[0] - 32, y - 32, 64, 64, 14)} t={t} fill="#fff" />
      <L d={`M${xs[0] - 22} ${y + 20}L${xs[0] - 6} ${y}L${xs[0] + 6} ${y + 12}L${xs[0] + 12} ${y + 6}L${xs[0] + 24} ${y + 20}`} t={t + 200} />
      <P d={ring(xs[0] + 12, y - 12, 6)} t={t + 300} fill={WARN} />

      <L d={`M${xs[1] - 32} ${y - 26}H${xs[1] + 32}L${xs[1] + 25} ${y + 32}H${xs[1] - 25}Z`} t={t + 100} fill="#fff" />
      <L d={oval(xs[1], y - 26, 32, 8)} t={t + 200} fill="#fff" />
      <Logo name={services[0]} x={xs[1] - 15} y={y - 10} s={30} t={t + 300} />

      <L d={box(xs[2] - 34, y - 34, 68, 68, 16)} t={t + 200} fill={SOFT} color={ACCENT} />
      <Logo name={services[1]} x={xs[2] - 19} y={y - 19} s={38} t={t + 400} />
      <path d={ring(xs[2], y, 40)} stroke={ACCENT} className="sv-ping" style={at(t + 1500)} />

      <L d={`M${xs[3] - 30} ${y - 22}V${y + 24}a30 9 0 0 0 60 0V${y - 22}`} t={t + 300} fill="#fff" />
      <L d={oval(xs[3], y - 22, 30, 9)} t={t + 400} fill="#fff" />
      <Logo name={services[2]} x={xs[3] - 15} y={y - 8} s={30} t={t + 500} />
      <path d={ring(xs[3], y, 40)} stroke={OK} className="sv-ping" style={at(t + 2500)} />
      <Check cx={xs[3] + 30} cy={y - 34} r={11} t={t + 2600} />

      <G t={t + 500} fly={[130, 0]} dur={700}><Photo cx={xs[0] + 6} cy={y} s={28} /></G>
      <G t={t + 1000} fly={[130, 0]} dur={600}><Photo cx={xs[1]} cy={y} s={28} /></G>
      <G t={t + 1900} fly={[130, 0]} dur={600}><Photo cx={xs[2]} cy={y} s={18} /></G>
    </g>)}
  </Art>;
}

/* 02 — CI/CD: git push → build → test → scan → deploy, live on AWS and Azure. */
export function DeployScene() {
  const nodes = [{ x: 228, name: 'Build' }, { x: 312, name: 'Test' }, { x: 396, name: 'Scan' }, { x: 480, name: 'Deploy' }];
  const y = 150;
  const icons = [
    `M218 140L228 135L238 140V160L228 165L218 160ZM218 140L228 145L238 140M228 145V165`,
    `M306 136H318M309 136V148L301 162H323L315 148V136`,
    `M396 136L406 140V150C406 157 401 161 396 164C391 161 386 157 386 150V140Z`,
    `M480 162V138M471 147L480 138L489 147`,
  ];
  const done = (i: number) => 1100 + i * 600;
  return <Art label="A git push runs a pipeline of build, test, security scan and deploy, and the app goes live on AWS and Azure">
    <L d={box(34, 114, 124, 80, 10)} t={0} fill="#fff" />
    <L d="M22 202H170L162 214H30Z" t={150} fill="#fff" />
    <L d={`${ring(78, 140, 6)}${ring(78, 172, 6)}${ring(114, 150, 6)}M78 146V166M114 156C114 168 96 166 84 170`} t={400} color={ACCENT} />
    <T x={96} y={244} t={600} size={16} weight={500} color={MUTED} mono>git push</T>

    <L d={`M170 ${y}H${nodes[3].x}`} t={500} color={LINE} w={3} />
    <path d={`M170 ${y}H${nodes[3].x}`} pathLength={1} stroke={ACCENT} strokeWidth={3} className="sv-draw" style={at(800, { '--dur': '2200ms' })} />
    {nodes.map((n, i) => <g key={n.name}>
      <T x={n.x} y={104} t={700 + i * 100} size={16} weight={600}>{n.name}</T>
      <L d={ring(n.x, y, 28)} t={600 + i * 100} fill="#fff" />
      <L d={icons[i]} t={800 + i * 100} />
      <path d={ring(n.x, y, 28)} stroke={ACCENT} strokeWidth={3} className="sv-fade" style={at(done(i) - 400)} />
      <Check cx={n.x + 22} cy={y - 22} r={10} t={done(i)} />
    </g>)}

    {[{ cx: 250, logo: 'aws', t: 3300 }, { cx: 420, logo: 'azure', t: 3450 }].map(c => <g key={c.logo}>
      <L d={cloud(c.cx, 318, 0.5)} t={c.t - 300} fill="#fff" />
      <Logo name={c.logo} x={c.cx - 18} y={274} s={36} t={c.t} />
      <path d={ring(c.cx + 58, 298, 6)} fill={OK} stroke="none" className="sv-pop" style={at(c.t + 600)} />
    </g>)}
    <Flow d="M480 180C480 222 430 214 420 238" t={3200} />
    <Flow d="M480 180C480 228 270 204 252 238" t={3250} />
    <T x={335} y={350} t={4100} size={16} weight={600} color={OK}>Live on both clouds</T>
  </Art>;
}

/* 03 — Scale: traffic spikes, two more servers join, CPU drops, the system is healthy. */
export function ScaleScene() {
  const servers = [52, 106, 160, 214];
  return <Art label="Traffic spikes past the scaling threshold, two new servers are added, CPU falls from 87% to 41% and the system is healthy">
    <T x={44} y={30} t={0} size={16} weight={500} color={MUTED} anchor="start">Traffic</T>
    <L d="M44 44V232H300" t={0} />
    <path d="M44 110H300" stroke={WARN} strokeDasharray="6 7" className="sv-fade" style={at(200)} />
    <L d="M56 212L96 206L136 198L170 178L200 130L224 80L248 68L272 104L296 150" t={300} color={ACCENT} w={3.5} dur={1500} />
    <P d={ring(248, 68, 8)} t={1600} fill={BAD} />

    {servers.map((y, i) => {
      const fresh = i > 1;
      const unit = <>
        <path d={box(350, y, 184, 42, 10)} fill={fresh ? SOFT : '#fff'} stroke={fresh ? ACCENT : INK} />
        <path d={ring(372, y + 21, 5)} fill={OK} stroke="none" />
        <path d={`M392 ${y + 21}H476`} stroke={fresh ? ACCENT : LINE} strokeWidth={4} opacity={fresh ? 0.45 : 1} />
      </>;
      return fresh ? <G key={y} t={1900 + (i - 2) * 250} from={[70, 0]} dur={600}>{unit}</G> : <G key={y} t={300 + i * 150}>{unit}</G>;
    })}
    <P d={ring(530, 160, 15)} t={2400} fill={ACCENT} />
    <T x={530} y={165} t={2450} size={13} weight={700} color="#fff">+2</T>

    <T x={44} y={284} t={600} size={16} weight={500} color={MUTED} anchor="start">CPU</T>
    <P d={box(92, 270, 208, 16, 8)} t={600} fill="#ededed" className="sv-fade" />
    <G t={800} out={2700}><P d={box(92, 270, 181, 16, 8)} t={800} fill={BAD} className="sv-grow" /><T x={312} y={284} t={900} size={17} weight={700} color={BAD} anchor="start">87%</T></G>
    <P d={box(92, 270, 85, 16, 8)} t={2700} fill={OK} className="sv-grow" />
    <T x={312} y={284} t={2800} size={17} weight={700} color={OK} anchor="start">41%</T>

    <Check cx={366} cy={300} r={15} t={3100} />
    <T x={390} y={307} t={3200} size={20} weight={650} anchor="start">Healthy</T>
  </Art>;
}
