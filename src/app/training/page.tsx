import { redirect } from 'next/navigation';

/** Old "Training" URLs land on the career paths, which replaced this page. */
export default function TrainingPage() { redirect('/paths'); }
