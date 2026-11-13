import type { Metadata } from 'next';
import masterclasses from '@/data/masterclasses.json';
import { MasterclassSearch } from '@/components/MasterclassSearch';
export const metadata:Metadata={title:'MasterClasses'};
export default function MasterclassesPage(){return <main className="mx-auto max-w-7xl px-6 py-14"><p className="text-sm font-bold uppercase tracking-widest text-blue-600">No login · No paywall</p><h1 className="mt-2 text-4xl font-bold">Interactive MasterClasses</h1><p className="mt-4 max-w-3xl text-slate-600">Open the original HTML lessons directly. Six Python lessons also include prerecorded videos. Other lessons remain interactive HTML without an accompanying recording unless one is available.</p><MasterclassSearch lessons={masterclasses}/></main>}
