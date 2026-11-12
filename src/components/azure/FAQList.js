"use client";

import { useEffect, useMemo, useState } from "react";

const isYouTube = (url) => /youtu\.be|youtube\.com/.test(url);
const isVimeo = (url) => /vimeo\.com/.test(url);
const toYouTubeEmbed = (url) => {
  const id =
    url.match(/youtu\.be\/([^?&]+)/)?.[1] ||
    url.match(/[?&]v=([^?&]+)/)?.[1] ||
    url.match(/embed\/([^?&]+)/)?.[1];
  return id ? `https://www.youtube.com/embed/${id}` : url;
};
const toVimeoEmbed = (url) => {
  const id = url.match(/vimeo\.com\/(\d+)/)?.[1];
  return id ? `https://player.vimeo.com/video/${id}` : url;
};

function renderBlock(block, idx) {
  switch (block.type) {
    case "p":
      return (
        <p key={`p-${idx}`} className="text-gray-700">
          {block.text}
        </p>
      );

    case "ul":
      return (
        <ul key={`ul-${idx}`} className="list-disc space-y-2 pl-5 text-gray-700">
          {block.items?.map((it, i) => (
            <li key={`li-${idx}-${i}`}>{it}</li>
          ))}
        </ul>
      );

    case "table":
      return (
        <div key={`tbl-${idx}`} className="overflow-x-auto">
          <table className="w-full text-left text-sm md:text-base border border-gray-200 rounded-xl overflow-hidden">
            {block.headers?.length ? (
              <thead>
                <tr className="border-b border-gray-200 bg-gray-100 text-gray-800">
                  {block.headers.map((h, hIdx) => (
                    <th key={`th-${hIdx}`} className="p-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody className="divide-y divide-gray-200">
              {block.rows?.map((row, rIdx) =>
                Array.isArray(row) ? (
                  <tr key={`tr-${rIdx}`}>
                    {row.map((cell, cIdx) => (
                      <td key={`td-${rIdx}-${cIdx}`} className="p-3">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </div>
      );

    case "image":
    case "img": {
      const { src, alt = "Image", caption } = block;
      if (!src) return null;
      return (
        <figure key={`img-${idx}`} className="space-y-2">
          {/* Source FAQ illustrations may be remote and have no dimensions. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="w-full rounded-xl border border-gray-200"
            loading="lazy"
          />
          {caption && <figcaption className="text-xs text-gray-500">{caption}</figcaption>}
        </figure>
      );
    }

    case "video": {
      const { src, caption, poster } = block;
      if (!src) return null;

      if (isYouTube(src) || isVimeo(src)) {
        const embed = isYouTube(src) ? toYouTubeEmbed(src) : toVimeoEmbed(src);
        return (
          <figure key={`vid-${idx}`} className="space-y-2">
            <div
              className="w-full overflow-hidden rounded-xl border border-gray-200"
              style={{ aspectRatio: "16 / 9" }}
            >
              <iframe
                src={embed}
                title={caption || "Embedded video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            {caption && <figcaption className="text-xs text-gray-500">{caption}</figcaption>}
          </figure>
        );
      }

      return (
        <figure key={`vid-${idx}`} className="space-y-2">
          <video
            controls
            preload="metadata"
            poster={poster || undefined}
            className="w-full max-h-[70vh] rounded-xl border border-gray-200"
          >
            <source src={src} />
            Your browser does not support the video tag.
          </video>
          {caption && <figcaption className="text-xs text-gray-500">{caption}</figcaption>}
        </figure>
      );
    }

    default:
      return null;
  }
}

export default function FAQList({
  faqs,
}) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();

    if (mq.addEventListener) mq.addEventListener("change", update);
    else if (mq.addListener) mq.addListener(update);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", update);
      else if (mq.removeListener) mq.removeListener(update);
    };
  }, []);

  const prepared = useMemo(
    () =>
      (faqs || []).map((f) => {
        const blocks = Array.isArray(f.blocks) ? f.blocks : [];
        return {
          ...f,
          videoBlocks: blocks.filter((b) => b?.type === "video" && b.src),
          otherBlocks: blocks.filter((b) => b?.type !== "video"),
        };
      }),
    [faqs]
  );

  if (isDesktop) {
    return (
      <section className="md:col-span-9 space-y-4 mb-4">
        {prepared.map((f) => (
          <div
            id={f.id}
            key={f.id}
            className="relative group rounded-2xl p-3 bg-gray-50 scroll-mt-28"
          >

            <span
              aria-hidden
              className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-sky-500"
            />

            <div className="flex items-start justify-between gap-2 rounded-lg bg-indigo-200 p-2">
              <h2 className="text-lg font-bold sm:text-base md:text-xl leading-snug">
                {f.title}
              </h2>
            </div>

            <div className="mt-3 pl-4 space-y-4">
              {f.videoBlocks.map((b, idx) => renderBlock(b, `v-${idx}`))}
              {f.otherBlocks.map((b, idx) => renderBlock(b, idx))}
            </div>
          </div>
        ))}
      </section>
    );
  }

  return <MobileCollapsible prepared={prepared} />;
}

function MobileCollapsible({ prepared }) {
  return <section className="space-y-4 mb-4">{prepared.map(f => <details id={f.id} key={f.id} className="rounded-2xl bg-gray-50 p-4 scroll-mt-28"><summary className="cursor-pointer rounded-lg bg-indigo-100 p-3 text-lg font-bold">{f.title}</summary><div className="mt-4 space-y-4 px-3">{f.videoBlocks.map((b, idx) => renderBlock(b, `v-${idx}`))}{f.otherBlocks.map((b, idx) => renderBlock(b, idx))}</div></details>)}</section>
}
