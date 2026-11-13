import records from '@/data/courses.json';
export type Course = {
  slug:string; title:string; shortDescription:string; description:string; level:string;
  duration:string; image?:string; featured:boolean; topics?:{title:string;topics:string[]}[];
};
export const courses: Course[] = (records as Course[]).slice().sort((a,b)=>Number(b.featured)-Number(a.featured)||a.title.localeCompare(b.title));
export const courseBySlug = (slug:string) => courses.find(x=>x.slug.toLowerCase()===slug.toLowerCase());
