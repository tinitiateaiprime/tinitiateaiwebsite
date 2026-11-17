import { ACCENT, Art, at, BAD, Bubble, Check, Doc, Flow, G, Head, INK, L, LINE, Logo, MUTED, OK, P, Person, SOFT, T, box, ring } from '@/components/home/art/kit';

/* 01 — Learn live: a mentor teaches on screen, a student raises a hand, the mentor answers. */
export function LearnLiveArt() {
  const students = [120, 220, 340, 440];
  return <Art label="A mentor teaches a live class on screen; a student raises a hand with a question and the mentor answers">
    <L d={box(130, 26, 300, 194, 16)} t={0} fill="#fff" />
    <L d="M280 220V244M226 248H334" t={200} />
    <g className="sv-blink"><P d={box(146, 42, 56, 22, 11)} t={600} fill={BAD} /></g>
    <T x={174} y={57} t={650} size={12} weight={700} color="#fff">LIVE</T>
    <Person cx={212} cy={112} r={24} t={300} fill={SOFT} color={ACCENT} />
    <L d="M282 86H404M282 108H384M282 130H398" t={700} color={LINE} w={5} />
    <P d={box(282, 150, 84, 12, 6)} t={1100} fill={ACCENT} className="sv-grow" />
    <P d={box(282, 172, 52, 12, 6)} t={1250} fill="#a5b8ff" className="sv-grow" />
    {students.map((x, i) => <Person key={x} cx={x} cy={282} t={500 + i * 120} />)}
    <L d={`M358 316L372 268${ring(374, 262, 6)}`} t={1600} color={ACCENT} />
    <Bubble x={444} y={226} w={60} h={42} t={1800} />
    <T x={474} y={254} t={1900} size={22} weight={700} color={ACCENT}>?</T>
    <Bubble x={440} y={34} w={114} h={44} t={2500} />
    <T x={497} y={62} t={2700} size={15} weight={600}>Here&apos;s why…</T>
  </Art>;
}

/* 02 — Build real projects: a task moves across the board while a feature branch merges into main. */
export function BuildProjectsArt() {
  const card = (x: number, y: number, accent?: boolean) => <>
    <path d={box(x, y, 118, 40, 9)} fill={accent ? SOFT : '#fff'} stroke={accent ? ACCENT : INK} />
    <path d={`M${x + 14} ${y + 20}H${x + 84}`} stroke={accent ? ACCENT : LINE} strokeWidth={4} />
  </>;
  return <Art label="A task card moves from To do to Doing to Done on a project board while a feature branch is merged into main">
    <L d={box(36, 24, 488, 206, 16)} t={0} fill="#fff" />
    <L d="M198 24V230M360 24V230" t={200} color={LINE} />
    <T x={117} y={56} t={300} size={17}>To do</T>
    <T x={279} y={56} t={350} size={17}>Doing</T>
    <T x={441} y={56} t={400} size={17}>Done</T>
    <G t={500}>{card(58, 76)}</G>
    <G t={600}>{card(382, 76)}</G>
    <Check cx={494} cy={78} r={10} t={700} />
    <G t={700}><g className="sv-scan" style={at(1000, { '--dur': '2600ms', '--x1': '162px', '--y1': '-50px', '--x2': '162px', '--y2': '-50px', '--x3': '324px', '--y3': '0px' })}>{card(58, 126, true)}</g></G>
    <Check cx={494} cy={128} r={10} t={3300} />

    <L d="M60 302H500" t={400} />
    <L d="M160 302C200 302 200 262 240 262H322C362 262 362 302 402 302" t={1200} color={ACCENT} />
    {[60, 160, 500].map((x, i) => <L key={x} d={ring(x, 302, 8)} t={600 + i * 100} fill="#fff" />)}
    {[262, 322].map((x, i) => <L key={x} d={ring(x, 262, 8)} t={1600 + i * 200} fill={SOFT} color={ACCENT} />)}
    <P d={ring(402, 302, 10)} t={3000} fill={ACCENT} />
    <T x={60} y={338} t={500} size={15} weight={500} color={MUTED} anchor="start">main</T>
    <T x={292} y={246} t={1500} size={15} weight={600} color={ACCENT}>feature</T>
    <T x={402} y={338} t={3100} size={15} weight={600} color={ACCENT}>merged</T>
  </Art>;
}

/* 03 — Work experience: your team badge, the daily stand-up, and a product you helped ship. */
export function WorkExperienceArt() {
  const tiles: [number, number][] = [[260, 88], [340, 88], [260, 138], [340, 138]];
  return <Art label="A project team badge, a daily stand-up call with the team, and a live product the team shipped">
    <L d="M128 14L146 62M176 14L158 62" t={0} color={ACCENT} />
    <L d={box(88, 62, 128, 170, 16)} t={100} fill="#fff" />
    <P d={box(128, 72, 48, 9, 4.5)} t={400} fill={LINE} />
    <Person cx={152} cy={112} r={20} t={400} fill={SOFT} color={ACCENT} />
    <L d="M116 176H188" t={700} w={5} />
    <L d="M128 194H176" t={800} color={LINE} w={4} />
    <P d={box(102, 206, 100, 20, 10)} t={1000} fill={ACCENT} />
    <T x={152} y={220} t={1050} size={10.5} weight={700} color="#fff">PROJECT TEAM</T>

    <Flow d="M222 146H244" t={1100} />
    <L d={box(250, 78, 170, 112, 10)} t={300} fill="#fff" />
    <L d="M236 198H434L426 210H244Z" t={450} fill="#fff" />
    {tiles.map(([x, y], i) => <g key={i}>
      <P d={box(x, y, 72, 44, 6)} t={600 + i * 120} fill={i === 3 ? SOFT : '#f4f4f5'} className="sv-fade" />
      {i < 3 ? <Person cx={x + 36} cy={y + 15} r={7} t={700 + i * 120} /> : <P d={`${box(x + 10, y + 12, 44, 6, 3)}${box(x + 10, y + 24, 30, 6, 3)}`} t={1000} fill={ACCENT} />}
    </g>)}
    <T x={335} y={240} t={1400} size={15} weight={500} color={MUTED}>Daily stand-up</T>

    <Flow d="M426 142H446" t={1800} />
    <L d={box(452, 92, 94, 100, 12)} t={1900} fill="#fff" />
    <P d={ring(470, 112, 5)} t={2200} fill={OK} />
    <T x={481} y={117} t={2200} size={13} weight={600} color={OK} anchor="start">Live</T>
    <L d="M466 176L484 158L500 166L528 134" t={2300} color={ACCENT} w={3} />

    {['Plan', 'Build', 'Ship'].map((s, i) => <g key={s}>
      <P d={box(146 + i * 104, 282, 84, 36, 18)} t={2500 + i * 200} fill={i === 2 ? ACCENT : '#fff'} stroke={i === 2 ? ACCENT : INK} />
      <T x={188 + i * 104} y={306} t={2550 + i * 200} size={16} color={i === 2 ? '#fff' : INK}>{s}</T>
      {i < 2 && <><L d={`M${234 + i * 104} 300H${246 + i * 104}`} t={2600 + i * 200} color={MUTED} /><Head x={248 + i * 104} y={300} dir="r" t={2650 + i * 200} color={MUTED} /></>}
    </g>)}
  </Art>;
}

/* 04 — Job-ready: a resume fills with proof, the portfolio lights up, you're ready. */
export function JobReadyArt() {
  return <Art label="A resume gets ticked off, a portfolio fills with project activity, and a job-ready badge appears">
    <Doc x={36} y={36} w={154} h={208} lines={0} />
    <L d={ring(72, 80, 16)} t={300} fill={SOFT} color={ACCENT} />
    <L d="M98 76H162" t={400} w={5} />
    <L d="M98 90H146" t={450} color={LINE} w={4} />
    {[132, 164, 196].map((y, i) => <g key={y}>
      <L d={`M82 ${y}H170`} t={500 + i * 100} color={LINE} w={4} />
      <Check cx={62} cy={y} r={9} t={1200 + i * 250} />
    </g>)}

    <Flow d="M196 140H210" t={1100} />
    <L d={box(216, 36, 172, 208, 14)} t={200} fill="#fff" />
    <T x={234} y={66} t={500} size={16} anchor="start">Portfolio</T>
    <Logo name="github" x={350} y={48} s={24} t={600} />
    {Array.from({ length: 42 }, (_, k) => {
      const c = k % 7, r = Math.floor(k / 7);
      const strength = 0.14 + (((c * 7 + r * 3) % 5) * 0.2);
      return <P key={k} d={box(232 + c * 21, 86 + r * 21, 15, 15, 3.5)} t={800 + k * 30} fill={`rgb(47 84 235 / ${strength.toFixed(2)})`} />;
    })}

    <Flow d="M394 140H406" t={2300} />
    <L d={ring(474, 140, 62)} t={400} fill={SOFT} color={ACCENT} />
    <L d={`${box(444, 128, 60, 42, 8)}M462 128V120H486V128M444 144H504`} t={700} />
    <Check cx={518} cy={96} r={17} t={2600} />
    <T x={474} y={238} t={2700} size={19} weight={650}>Job-ready</T>
  </Art>;
}
