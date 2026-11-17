'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';

export type Faq = { q: string; a: string };

/** Accessible accordion (keyboard + screen reader support from Radix). First answer starts open. */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  return <Accordion.Root type="single" collapsible defaultValue="faq-0" className="divide-y divide-neutral-200 border-y border-neutral-200">
    {faqs.map((f, i) => <Accordion.Item key={f.q} value={`faq-${i}`} className="group">
      <Accordion.Header>
        <Accordion.Trigger className="flex w-full items-center justify-between gap-6 py-5 text-left text-[17px] font-semibold leading-snug text-ink transition-colors hover:text-accent sm:text-lg">
          {f.q}
          <span className="grid size-8 shrink-0 place-items-center rounded-full border border-neutral-200 text-neutral-600 transition-[transform,background-color,color,border-color] duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:border-accent group-data-[state=open]:bg-accent group-data-[state=open]:text-white">
            <Plus aria-hidden="true" className="size-4" />
          </span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="faq-content overflow-hidden">
        <p className="max-w-2xl pb-6 pr-12 text-[15px] leading-7 text-neutral-600 sm:text-base">{f.a}</p>
      </Accordion.Content>
    </Accordion.Item>)}
  </Accordion.Root>;
}
