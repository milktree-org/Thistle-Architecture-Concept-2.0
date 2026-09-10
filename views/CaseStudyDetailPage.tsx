"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTina } from 'tinacms/dist/react';
import { Reveal } from '../components/animations/Reveal';
import { DocumentCards } from '../components/case-study/DocumentCards';
import { SketchViewer } from '../components/case-study/SketchViewer';
import { BeforeAfter } from '../components/case-study/BeforeAfter';
import { isDrawing } from '../components/case-study/imageFit';
import { ArrowUpRight, ArrowLeft, CheckCircle2, HardHat, Maximize2, X } from 'lucide-react';
import { caseStudies, type CaseStudy } from '../data/caseStudiesData';
import { conversions, conversionPath } from '../data/conversionsData';
import { f, type TinaQuery, EMPTY_QUERY } from '../lib/tina-fields';
import { str, arr, normalizeImage } from '../lib/tina';

// Drawings (converted sketch PDFs) live in /images/projects/ and must never
// be crop-covered; photography can fill its frame. That rule now travels on the
// image itself as an explicit `kind`, because the CMS uploads to
// /images/uploads/ and the old path test failed silently for anything an editor
// replaced — see components/case-study/imageFit.ts, which is the only copy.
const Frame: React.FC<{
  src: string;
  alt: string;
  kind?: string;
  /** CMS field id for THIS image, so a click opens this picker and no other. */
  tina?: string;
  aspect?: string;
  sizes?: string;
}> = ({
  src,
  alt,
  kind,
  tina,
  aspect = 'aspect-[4/3]',
  sizes = '(max-width: 1024px) 92vw, 640px',
}) => {
  const drawing = isDrawing(src, kind);
  // Item 108: "Click to enlarge" was only on the template sketch, so a study
  // with four drawings in its gallery had none of them readable. Every drawing
  // now opens full size; photographs do not, because a photo fills its frame
  // and gains nothing.
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; };
  }, [open]);

  const frame = (
    <div className={`relative ${aspect} rounded-2xl border border-thistle-black/[0.06] overflow-hidden ${drawing ? 'bg-white' : 'bg-thistle-white/60'}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        // On the image, not the frame around it: Tina resolves a click by walking
        // up with closest(), so a marker on the wrapper would swallow anything
        // else that ever sits inside it.
        data-tina-field={tina}
        className={drawing ? 'object-contain p-3' : 'object-cover'}
      />
      {drawing && (
        <span className="pointer-events-none absolute top-fl-3 right-fl-3 inline-flex items-center gap-1.5 rounded-full bg-thistle-black/70 text-white text-[11px] px-3 py-1.5">
          <Maximize2 size={12} /> Click to enlarge
        </span>
      )}
    </div>
  );

  if (!drawing) return frame;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={`Open ${alt} full screen`} className="block w-full text-left cursor-zoom-in">
        {frame}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-thistle-black/95 flex items-center justify-center p-fl-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="absolute top-fl-4 right-fl-4 text-white/70 hover:text-white transition-colors">
            <X size={26} />
          </button>
          {/* Scrollable, so a large drawing can be read rather than shrunk to fit. */}
          <div className="max-h-full max-w-full overflow-auto" onClick={(e) => e.stopPropagation()}>
            <Image src={src} alt={alt} width={2400} height={1700} className="w-auto max-w-none h-auto bg-white" />
          </div>
        </div>
      )}
    </>
  );
};

/**
 * The field id for one entry of a list of plain strings — the roadmap steps and
 * the project-story paragraphs.
 *
 * `f()` has no index parameter, and the rule for lists is to mark each item
 * rather than the list: a marker on the list opens the form with nothing
 * selected, so a click on the fourth paragraph would present all four. Tina's
 * id format is documented as "queryId---path.to.array.index", so appending the
 * index to the list's own id addresses that one input.
 *
 * Returns undefined when there is no list id at all, because `${undefined}.3`
 * is a real attribute value that matches nothing, and an empty or wrong marker
 * still swallows the click.
 */
const at = (listId: string | undefined, index: number): string | undefined =>
  listId ? `${listId}.${index}` : undefined;

interface CaseStudyDetailPageProps {
  /**
   * This case study's own document, passed straight through from the server
   * page so useTina can re-run the query against the editor's live values.
   * Optional so the page still renders if it is mounted without it.
   */
  page?: TinaQuery;
}

export const CaseStudyDetailPage: React.FC<CaseStudyDetailPageProps> = ({ page }) => {
  const { slug } = useParams<{ slug: string }>();

  // useTina returns the server data verbatim on the public site and swaps in
  // the live form values inside the editor. Passing a null-ish query is not
  // allowed, so the hook runs against the shared stub when the prop is absent.
  const { data: live } = useTina(page ?? EMPTY_QUERY);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const cms = page ? (live as any)?.caseStudy : undefined;

  // The record in data/caseStudiesData.ts stays the fallback rather than
  // becoming dead weight: this page renders byte-for-byte as it does today when
  // mounted without a CMS query, and every provenance note in that file stays
  // next to the words it explains. It is also still the source for the listing
  // pages, the home page band and the conversion pages.
  const fallback = caseStudies.find((c) => c.slug === slug);

  if (!fallback && !cms) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-fluid-h2 font-medium tracking-tight mb-fl-4">Case study not found.</h1>
          <Link href="/case-studies" className="text-fluid-sm text-thistle-green hover:underline">Back to all work</Link>
        </div>
      </section>
    );
  }

  // `|| fallback` is pruneEmpty written out. A field an editor has cleared comes
  // back as '' and must leave the standing copy in place rather than blank the
  // page. It is spelled out rather than spread because several of these are
  // meaningfully absent on most records — a study with no recommendation must
  // not inherit the previous one's, so those fall through to undefined.
  const kind = (str(cms?.kind) || fallback?.kind || 'project') as CaseStudy['kind'];
  const title = str(cms?.title) || fallback?.title || '';
  const location = str(cms?.location) || fallback?.location || '';
  const provenance = str(cms?.listing?.provenance) || fallback?.provenance;
  const tag = str(cms?.tag) || fallback?.tag || '';
  const desc = str(cms?.desc) || fallback?.desc || '';
  const buildingType = str(cms?.buildingType) || fallback?.buildingType || '';
  const planningRoute = str(cms?.facts?.planningRoute) || fallback?.planningRoute;
  const completionDate = str(cms?.facts?.completionDate) || fallback?.completionDate;
  const recommendation = (str(cms?.listing?.recommendation) || fallback?.recommendation) as CaseStudy['recommendation'];
  const status = (str(cms?.listing?.status) || fallback?.status) as CaseStudy['status'];
  const challenge = str(cms?.writeup?.challenge) || fallback?.challenge;
  const approach = str(cms?.writeup?.approach) || fallback?.approach;
  const outcome = str(cms?.writeup?.outcome) || fallback?.outcome;

  const image = normalizeImage(cms?.image?.src, fallback?.image ?? '');
  const imageKind = str(cms?.image?.kind) || undefined;

  const isProject = kind === 'project';
  const backHref = isProject ? '/case-studies/completed-projects' : '/case-studies/feasibility-studies';
  const backLabel = isProject ? 'All Projects' : 'All Feasibility Studies';

  // Next link cycles within the same category, so a project never hands
  // over to a feasibility study mid-browse.
  //
  // Still read from code, not from the CMS: this is the browsing order of the
  // whole set, which no single document knows, and fetching all 35 into every
  // one of 35 static pages to render one link would be a poor trade. The title
  // shown here carries no marker for the same reason, and because a marker on a
  // link cancels the navigation.
  const siblings = caseStudies.filter(c => c.kind === kind);
  const idx = siblings.findIndex(c => c.slug === slug);
  const nextCase = siblings[(idx + 1) % siblings.length];

  // Lists are all-or-nothing rather than merged item by item: the record in
  // code stands in only while the CMS has no list at all, because an editor
  // deleting the third fact has to be able to delete it, not have it reappear.
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const cmsStats = arr<any>(cms?.facts?.stats);
  const stats = cmsStats.length
    ? cmsStats.map((s) => ({
        label: str(s?.label),
        value: str(s?.value),
        tinaLabel: f(s, 'label'),
        tinaValue: f(s, 'value'),
      }))
    : (fallback?.stats ?? []).map((s) => ({ label: s.label, value: s.value, tinaLabel: undefined, tinaValue: undefined }));

  const cmsGallery = arr<any>(cms?.galleryImages);
  const gallery = cmsGallery.length
    ? cmsGallery.map((g) => ({ src: normalizeImage(g?.src), kind: str(g?.kind) || undefined, tina: f(g, 'src') }))
    : (fallback?.galleryImages ?? []).map((src) => ({ src, kind: undefined, tina: undefined }));

  const cmsTypes = arr<any>(cms?.listing?.conversionTypes).map(str).filter(Boolean);
  const conversionTypes = (cmsTypes.length ? cmsTypes : fallback?.conversionTypes ?? []) as string[];

  // The three headings are the page's own, identical on every case study, so
  // only the bodies carry a marker. Sections with nothing written stay out.
  const narrative = ([
    { num: '01', title: 'The Challenge', body: challenge, tina: f(cms, 'challenge') },
    { num: '02', title: 'Our Approach', body: approach, tina: f(cms, 'approach') },
    { num: '03', title: 'The Outcome', body: outcome, tina: f(cms, 'outcome') },
  ] as { num: string; title: string; body?: string; tina?: string }[])
    .filter((s): s is { num: string; title: string; body: string; tina?: string } => !!s.body);

  // Completed projects carry real photography, often a dozen shots or more.
  // Feasibility studies carry drawings, usually one or two.
  const photoGrid = isProject && gallery.length > 3;

  // The reverse of the link on each Expertise page, which already points to
  // its strongest case study. Ed's August 2026 final brief asks for two-way
  // contextual links, so a reader landing here can go straight to the
  // relevant service page rather than only browsing forward within case
  // studies. Silently absent when a study has no conversionTypes set.
  const relatedExpertise = conversionTypes
    .map((type) => conversions.find((c) => c.slug === type))
    .filter((c): c is (typeof conversions)[number] => !!c);

  // One modest fact band replaces both the old display-size stats row and
  // the near-empty sidebar. The three labels added here are the page's own
  // wording rather than anything on the record, so only the values carry a
  // marker.
  const facts = [
    ...stats,
    { label: 'Building type', value: buildingType, tinaLabel: undefined, tinaValue: f(cms, 'buildingType') },
    ...(planningRoute ? [{ label: 'Planning route', value: planningRoute, tinaLabel: undefined, tinaValue: f(cms, 'planningRoute') }] : []),
    ...(completionDate ? [{ label: isProject ? 'Completed' : 'Feasibility date', value: completionDate, tinaLabel: undefined, tinaValue: f(cms, 'completionDate') }] : []),
  ].slice(0, 6);

  // Both templates stay optional, which is the reason data/caseStudiesData.ts
  // gives for keeping them optional there: a study or project moves on to Ed's
  // template only when there is real material to fill it, and the rest keep the
  // older challenge / approach / outcome narrative until they are written up.
  const cmsFeas = cms?.feasibility;
  const fbFeas = fallback?.feasibility;
  const cmsKeyInfo = arr<any>(cmsFeas?.keyInfo);
  const cmsRoadmap = arr<any>(cmsFeas?.roadmap).map(str).filter(Boolean);
  const feasibility = (cmsFeas || fbFeas)
    ? {
        keyInfo: cmsKeyInfo.length
          ? cmsKeyInfo.map((k) => ({
              label: str(k?.label),
              value: str(k?.value),
              tinaLabel: f(k, 'label'),
              tinaValue: f(k, 'value'),
            }))
          : (fbFeas?.keyInfo ?? []).map((k) => ({ label: k.label, value: k.value, tinaLabel: undefined, tinaValue: undefined })),
        indicativeValue: str(cmsFeas?.indicativeValue) || fbFeas?.indicativeValue,
        brief: str(cmsFeas?.brief) || fbFeas?.brief || '',
        found: str(cmsFeas?.found) || fbFeas?.found || '',
        recommendation: str(cmsFeas?.recommendation) || fbFeas?.recommendation || '',
        sketchCaption: str(cmsFeas?.sketchCaption) || fbFeas?.sketchCaption || '',
        guidanceLabel: str(cmsFeas?.guidance?.label) || fbFeas?.guidance?.label,
        guidanceHref: str(cmsFeas?.guidance?.href) || fbFeas?.guidance?.href,
        decision: str(cmsFeas?.decision) || fbFeas?.decision || '',
        roadmap: cmsRoadmap.length ? cmsRoadmap : fbFeas?.roadmap ?? [],
        // The list ids the per-item markers hang off. Read once here so the
        // markup below stays readable.
        tinaRoadmap: f(cmsFeas, 'roadmap'),
      }
    : undefined;

  const cmsStory = cms?.projectStory;
  const fbStory = fallback?.projectStory;
  const cmsSummary = arr<any>(cmsStory?.summary).map(str).filter(Boolean);
  const cmsSections = arr<any>(cmsStory?.sections);
  const cmsBeforeAfter = cmsStory?.beforeAfter;
  const fbBeforeAfter = fbStory?.beforeAfter;
  const projectStory = (cmsStory || fbStory)
    ? {
        summary: cmsSummary.length ? cmsSummary : fbStory?.summary ?? [],
        tinaSummary: f(cmsStory, 'summary'),
        beforeAfter: (cmsBeforeAfter || fbBeforeAfter)
          ? {
              before: normalizeImage(cmsBeforeAfter?.before, fbBeforeAfter?.before ?? ''),
              after: normalizeImage(cmsBeforeAfter?.after, fbBeforeAfter?.after ?? ''),
              beforeAlt: str(cmsBeforeAfter?.beforeAlt) || fbBeforeAfter?.beforeAlt || '',
              afterAlt: str(cmsBeforeAfter?.afterAlt) || fbBeforeAfter?.afterAlt || '',
              tina: { before: f(cmsBeforeAfter, 'before'), after: f(cmsBeforeAfter, 'after') },
            }
          : undefined,
        sections: cmsSections.length
          ? cmsSections.map((s) => ({
              title: str(s?.title),
              caption: str(s?.caption) || undefined,
              tinaTitle: f(s, 'title'),
              tinaCaption: f(s, 'caption'),
              images: arr<any>(s?.images).map((i) => ({
                src: normalizeImage(i?.src),
                alt: str(i?.alt),
                tina: f(i, 'src'),
              })),
            }))
          : (fbStory?.sections ?? []).map((s) => ({
              title: s.title,
              caption: s.caption,
              tinaTitle: undefined,
              tinaCaption: undefined,
              images: s.images.map((i) => ({ src: i.src, alt: i.alt, tina: undefined })),
            })),
      }
    : undefined;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return (
    <>
      {/* Split header: copy left, framed image right. Drawings never sit
          behind text. */}
      <section className="bg-thistle-white pt-32 pb-fl-8 px-fl-margin">
        <div className="max-w-[1360px] mx-auto">
          <Link href={backHref} className="inline-flex items-center gap-2 text-sm text-thistle-black/50 hover:text-thistle-black transition-colors mb-fl-6">
            <ArrowLeft size={14} /> {backLabel}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-fl-7 items-center">
            <div>
              <Reveal>
                <div className="flex flex-wrap items-center gap-fl-2 mb-fl-4">
                  <span
                    className="px-3 py-1.5 rounded-full bg-thistle-green/10 text-[10px] uppercase tracking-widest text-thistle-green font-semibold"
                    data-tina-field={f(cms, 'tag')}
                  >
                    {tag}
                  </span>
                  {recommendation && (
                    <span
                      className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-semibold ${
                        recommendation === 'No-Go'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-thistle-black/[0.05] text-thistle-black/60'
                      }`}
                      data-tina-field={f(cms, 'recommendation')}
                    >
                      {recommendation}
                    </span>
                  )}
                  {isProject && (
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-thistle-black/[0.05] text-[10px] uppercase tracking-widest text-thistle-black/60 font-semibold"
                      data-tina-field={f(cms, 'status')}
                    >
                      {status === 'On site' ? (
                        <HardHat size={11} className="text-thistle-green" />
                      ) : (
                        <CheckCircle2 size={11} className="text-thistle-green" />
                      )}
                      {status ?? 'Complete'}
                    </span>
                  )}
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                {/* break-words + hyphens: --font-h1 bottoms out at 50.88px, and
                    a long single word in a title ("Reconfiguration") is wider
                    than a 320px screen, which pushed the whole page sideways.
                    Both only engage when a word genuinely cannot fit. */}
                <h1
                  className="text-fluid-h1 font-medium tracking-tight leading-[1.05] text-thistle-black mb-fl-3 break-words hyphens-auto"
                  data-tina-field={f(cms, 'title')}
                >
                  {title}
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p
                  className={`text-sm uppercase tracking-wider text-thistle-black/45 font-medium ${provenance ? 'mb-fl-2' : 'mb-fl-5'}`}
                  data-tina-field={f(cms, 'location')}
                >
                  {location}
                </p>
                {provenance && (
                  <p className="text-sm text-thistle-black/50 mb-fl-5" data-tina-field={f(cms, 'provenance')}>{provenance}</p>
                )}
              </Reveal>
              <Reveal delay={0.15}>
                <p className="text-fluid-lg text-thistle-black/75 leading-relaxed max-w-xl" data-tina-field={f(cms, 'desc')}>
                  {desc}
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              {/* alt is the title, so it stays correct on its own when the
                  title is edited and needs no field of its own. */}
              <Frame src={image} alt={title} kind={imageKind} tina={f(cms?.image, 'src')} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Fact band. Hidden on template studies: the key information table below
          covers the same ground, and two rows of facts a few hundred pixels
          apart repeated the communal space and the planning route verbatim. */}
      {!feasibility && (
      <section className="bg-white border-y border-thistle-black/[0.06] px-fl-margin">
        <div className="max-w-[1360px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {facts.map((fact, i) => (
            <div
              key={i}
              className={`py-fl-5 px-fl-4 ${i > 0 ? 'sm:border-l sm:border-thistle-black/[0.05]' : ''}`}
            >
              <span className="block text-[10px] uppercase tracking-widest text-thistle-black/40 font-semibold mb-1.5" data-tina-field={fact.tinaLabel}>{fact.label}</span>
              <span className="block text-fluid-h6 font-medium tracking-tight text-thistle-black leading-snug" data-tina-field={fact.tinaValue}>{fact.value}</span>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* Ed's project template, from Project Explanations.docx: the finished
          building first, the transformation next because many readers stop
          there, then the stages the project can actually evidence. Projects
          without a story keep the older layout. */}
      {projectStory && (
        <>
          <section className="bg-thistle-white py-fl-section px-fl-margin">
            <div className="max-w-[820px] mx-auto space-y-fl-4">
              {projectStory.summary.map((para, i) => (
                <Reveal key={i} delay={Math.min(i * 0.05, 0.2)}>
                  <p
                    className={i === 0
                      ? "text-fluid-lg text-thistle-black/85 leading-relaxed"
                      : "text-fluid-base text-thistle-black/70 leading-relaxed"}
                    data-tina-field={at(projectStory.tinaSummary, i)}
                  >
                    {para}
                  </p>
                </Reveal>
              ))}
            </div>
          </section>

          {projectStory.beforeAfter && (
            <section className="bg-white py-fl-section px-fl-margin">
              <div className="max-w-[1000px] mx-auto">
                <Reveal>
                  {/* The heading and standfirst are the template's fixed
                      wording, the same on every project, so they stay in code
                      and carry no marker. */}
                  <h2 className="text-fluid-h4 font-medium tracking-tight text-thistle-black mb-fl-2">Existing And Proposed</h2>
                  <p className="text-fluid-sm text-thistle-black/55 mb-fl-6">The house before work, and as completed.</p>
                </Reveal>
                <Reveal>
                  <BeforeAfter {...projectStory.beforeAfter} />
                </Reveal>
              </div>
            </section>
          )}

          {projectStory.sections.map((sec, i) => (
            <section key={sec.title} className={`${i % 2 === 0 ? 'bg-thistle-white' : 'bg-white'} py-fl-section px-fl-margin`}>
              <div className="max-w-[1000px] mx-auto">
                <Reveal>
                  <h2 className="text-fluid-h4 font-medium tracking-tight text-thistle-black mb-fl-3" data-tina-field={sec.tinaTitle}>{sec.title}</h2>
                </Reveal>
                {sec.caption && (
                  <Reveal>
                    <p className="text-fluid-base text-thistle-black/70 leading-relaxed max-w-2xl mb-fl-6" data-tina-field={sec.tinaCaption}>{sec.caption}</p>
                  </Reveal>
                )}
                <div className={sec.images.length > 1 ? 'grid grid-cols-1 sm:grid-cols-2 gap-fl-4' : ''}>
                  {sec.images.map((img, j) => (
                    <Reveal key={img.src} delay={Math.min(j * 0.06, 0.2)}>
                      {/* Cover, unconditionally, and no drawing/photograph
                          choice on these: the stage grid crops everything to a
                          common shape so the rows line up, which is what the
                          section is for. Only the hero image and the gallery
                          below fork on kind. */}
                      <div className={`relative rounded-2xl overflow-hidden border border-thistle-black/[0.06] bg-thistle-white/60 ${sec.images.length === 1 ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
                        <Image src={img.src} alt={img.alt} fill sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 500px" className="object-cover" data-tina-field={img.tina} />
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </>
      )}

      {/* Ed's feasibility template. Only studies carrying `feasibility` data use
          it, so the rest keep the older layout until they are written up. */}
      {feasibility && (
        <>
          {/* 2. Key project information. Full-bleed band with dividers, the
              same treatment the fact band uses, rather than a contained card:
              it reads as the page's headline numbers that way. */}
          <section className="bg-white border-y border-thistle-black/[0.06] px-fl-margin">
            <div className="max-w-[1360px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {feasibility.keyInfo.map((info, i) => (
                <div key={info.label} className={`py-fl-5 px-fl-4 ${i > 0 ? 'sm:border-l sm:border-thistle-black/[0.05]' : ''}`}>
                  <span className="block text-[10px] uppercase tracking-widest text-thistle-black/40 font-semibold mb-1.5" data-tina-field={info.tinaLabel}>{info.label}</span>
                  <span className="block text-fluid-h6 font-medium tracking-tight text-thistle-black leading-snug" data-tina-field={info.tinaValue}>{info.value}</span>
                </div>
              ))}
            </div>
          </section>
          {feasibility.indicativeValue && (
            <section className="bg-white px-fl-margin pb-fl-5 border-b border-thistle-black/[0.06]">
              <div className="max-w-[1360px] mx-auto px-fl-4">
                <span className="text-fluid-sm text-thistle-black/55">
                  {/* The marker is on the figure alone: "Indicative end value:"
                      is the page's label, not part of the field. */}
                  Indicative end value: <span className="text-thistle-black font-medium" data-tina-field={f(cmsFeas, 'indicativeValue')}>{feasibility.indicativeValue}</span>
                </span>
              </div>
            </section>
          )}

          {/* 3. Feasibility in brief. Numbered rows in the reading column,
              not three columns: these run to a paragraph each, and at a third
              of the width they set as narrow ragged blocks. */}
          <section className="bg-thistle-white py-fl-section px-fl-margin">
            <div className="max-w-[820px] mx-auto">
              <Reveal>
                <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-7">Feasibility In Brief</p>
              </Reveal>
              <div className="space-y-fl-8">
                {[
                  { num: '01', h: 'The Brief', b: feasibility.brief, tina: f(cmsFeas, 'brief') },
                  { num: '02', h: 'What We Found', b: feasibility.found, tina: f(cmsFeas, 'found') },
                  { num: '03', h: 'Our Recommendation', b: feasibility.recommendation, tina: f(cmsFeas, 'recommendation') },
                ].map((c, i) => (
                  <Reveal key={c.h} delay={i * 0.05}>
                    <div>
                      {/* The three headings are the template's, identical on
                          every study, so they stay in code. */}
                      <div className="flex items-baseline gap-fl-3 mb-fl-4">
                        <span className="text-sm font-semibold text-thistle-green tabular-nums">{c.num}</span>
                        <h2 className="text-fluid-h4 font-medium tracking-tight text-thistle-black">{c.h}</h2>
                      </div>
                      <p className="text-fluid-base text-thistle-black/75 leading-relaxed" data-tina-field={c.tina}>{c.b}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* 4. The sketch */}
          {gallery.length > 0 && (
            <section className="bg-white py-fl-section px-fl-margin">
              <div className="max-w-[1000px] mx-auto">
                <Reveal>
                  <h2 className="text-fluid-h4 font-medium tracking-tight text-thistle-black mb-fl-6">The Proposed Layout</h2>
                </Reveal>
                <Reveal>
                  <SketchViewer
                    images={gallery.map((g) => g.src)}
                    tina={gallery.map((g) => g.tina)}
                    alt={`Feasibility sketch for ${title}`}
                    caption={feasibility.sketchCaption}
                    tinaCaption={f(cmsFeas, 'sketchCaption')}
                  />
                </Reveal>
              </div>
            </section>
          )}

          {/* 5. What the client received */}
          <section className="bg-thistle-white py-fl-section px-fl-margin">
            <div className="max-w-[1000px] mx-auto">
              <Reveal>
                <h2 className="text-fluid-h4 font-medium tracking-tight text-thistle-black mb-fl-6">What The Client Received</h2>
              </Reveal>
              <Reveal>
                <DocumentCards
                  guidance={feasibility.guidanceLabel ? { label: feasibility.guidanceLabel, href: feasibility.guidanceHref } : undefined}
                  tinaLabel={f(cmsFeas?.guidance, 'label')}
                />
              </Reveal>
            </div>
          </section>

          {/* 6. The decision. Standfirst and roadmap label are Ed's words from
              the template; both were dropped on the first pass.
              The roadmap is a numbered timeline rather than the pills it was:
              pills wrapped mid-sequence and read as equal-weight tags, which
              loses the one thing a roadmap has to show, the order.

              Gated on content since item 66: the five older studies were moved
              onto this template with their decision and roadmap left empty for
              Ed to supply, and a heading over nothing is worse than no section. */}
          {(feasibility.decision || feasibility.roadmap.length > 0) && (
          <section className="bg-white py-fl-section px-fl-margin">
            <div className="max-w-[1000px] mx-auto">
              <Reveal>
                <h2 className="text-fluid-h4 font-medium tracking-tight text-thistle-black mb-fl-2">The Decision</h2>
                <p className="text-fluid-base text-thistle-green mb-fl-5">A clear route forward before purchase.</p>
              </Reveal>
              <Reveal>
                <p className="text-fluid-base text-thistle-black/75 leading-relaxed max-w-2xl mb-fl-8" data-tina-field={f(cmsFeas, 'decision')}>{feasibility.decision}</p>
              </Reveal>
              <Reveal>
                <p className="text-xs uppercase tracking-[0.2em] text-thistle-black/40 font-semibold mb-fl-5">Recommended roadmap</p>
              </Reveal>
              <Reveal>
                <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-fl-5 gap-y-fl-5">
                  {feasibility.roadmap.map((step, i) => (
                    <li key={step} className="relative flex items-start gap-fl-3 pt-fl-4 border-t border-thistle-black/[0.08]">
                      {/* The number is generated from the position, so the
                          marker goes on the step's own words. */}
                      <span className="text-sm font-semibold text-thistle-green tabular-nums shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-fluid-sm text-thistle-black/75 leading-snug" data-tina-field={at(feasibility.tinaRoadmap, i)}>{step}</span>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </section>
          )}
        </>
      )}

      {/* Narrative, or the in-preparation panel when there is none. Template
          studies render neither: they carry Feasibility in Brief instead, and
          the ternary was falling through to the placeholder for them. */}
      {!feasibility && !projectStory && (narrative.length > 0 ? (
        /* Numbered narrative at reading size */
        <section className="bg-thistle-white py-fl-section px-fl-margin">
          <div className="max-w-[820px] mx-auto space-y-fl-8">
            {narrative.map((section, i) => (
              <Reveal key={section.num} delay={i * 0.05}>
                <div>
                  <div className="flex items-baseline gap-fl-3 mb-fl-4">
                    <span className="text-sm font-semibold text-thistle-green tabular-nums">{section.num}</span>
                    <h2 className="text-fluid-h4 font-medium tracking-tight text-thistle-black">{section.title}</h2>
                  </div>
                  <p className="text-fluid-base text-thistle-black/75 leading-relaxed" data-tina-field={section.tina}>{section.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      ) : (
        /* Placeholder projects get a designed in-preparation panel, not an
           orphan sentence in an empty grid. This is the site's own apology for
           a missing write-up rather than anything about this building, so it
           stays in code: the fix is to write the project up, not to edit the
           holding text. */
        <section className="bg-thistle-white py-fl-section px-fl-margin">
          <div className="max-w-[820px] mx-auto">
            <Reveal>
              <div className="rounded-2xl bg-white border border-thistle-black/[0.06] p-fl-7 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">Write-Up In Preparation</p>
                <h2 className="text-fluid-h4 font-medium tracking-tight text-thistle-black mb-fl-4">
                  The full story of this project is on its way.
                </h2>
                <p className="text-fluid-base text-thistle-black/70 leading-relaxed max-w-md mx-auto mb-fl-6">
                  Photography and a detailed write-up are being prepared. In the meantime, our feasibility studies show exactly how we approach buildings like this one.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-fl-4">
                  <Link
                    href={backHref}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-thistle-green hover:text-thistle-black transition-colors"
                  >
                    {isProject ? 'Browse completed projects' : 'Browse feasibility studies'}
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      {/* Drawings, full width and never cropped */}
      {!feasibility && !projectStory && gallery.length > 0 && (
        <section className="bg-white py-fl-section px-fl-margin">
          {/* Drawings need full width to stay readable, so they stay stacked in
              a narrow column. Photography does not, and a long set of photos
              stacked one per row is an unreasonable scroll, so it goes two up. */}
          <div className={`mx-auto ${photoGrid ? 'max-w-[1360px]' : 'max-w-[1000px]'}`}>
            <Reveal>
              <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-6">
                {isProject ? 'Gallery' : 'The Drawings'}
              </p>
            </Reveal>
            <div className={photoGrid ? 'grid grid-cols-1 sm:grid-cols-2 gap-fl-5' : 'space-y-fl-6'}>
              {gallery.map((img, i) => (
                <Reveal key={i} delay={Math.min(i * 0.08, 0.2)}>
                  <Frame
                    src={img.src}
                    kind={img.kind}
                    tina={img.tina}
                    alt={`${title}, ${isProject ? 'photograph' : 'drawing'} ${i + 1}`}
                    aspect="aspect-[16/10]"
                    sizes={photoGrid ? '(max-width: 640px) 92vw, (max-width: 1360px) 46vw, 660px' : '(max-width: 1024px) 92vw, 1000px'}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Item 87: this block used to be skipped on a page with no conversion
          type, so six project pages dropped straight from body copy to the
          closing banner. It now always renders; a page whose building fits none
          of the five sectors (the church that became offices) gets the package
          itself. */}
      <section className="bg-white py-fl-7 px-fl-margin border-t border-thistle-black/[0.06]">
        <div className="max-w-[1360px] mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-thistle-black/40 font-semibold mb-fl-4">
            We Can Help With This
          </p>
          <div className="flex flex-wrap gap-fl-3">
            {relatedExpertise.map((c) => (
              <Link
                key={c.slug}
                href={conversionPath(c.slug)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-thistle-black/[0.08] text-sm font-medium text-thistle-black hover:border-thistle-green/40 hover:text-thistle-green transition-colors"
              >
                {c.label} Feasibility
                <ArrowUpRight size={14} />
              </Link>
            ))}
            {relatedExpertise.length === 0 && (
              <Link
                href="/feasibility-package"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-thistle-black/[0.08] text-sm font-medium text-thistle-black hover:border-thistle-green/40 hover:text-thistle-green transition-colors"
              >
                Feasibility For Your Building
                <ArrowUpRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Next, within the same category */}
      <section className="bg-thistle-white py-fl-8 px-fl-margin border-t border-thistle-black/[0.06]">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-fl-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-thistle-black/40 font-semibold mb-fl-3">
              {isProject ? 'Next Project' : 'Next Study'}
            </p>
            <Link href={`/case-studies/${nextCase.slug}`} className="group inline-flex items-center gap-fl-3">
              <h3 className="text-fluid-h3 font-medium tracking-tight text-thistle-black group-hover:text-thistle-green transition-colors">{nextCase.title}</h3>
              <ArrowUpRight size={22} className="text-thistle-black/30 group-hover:text-thistle-green transition-colors" />
            </Link>
          </div>
          <Link href={backHref} className="text-sm font-medium text-thistle-black/50 hover:text-thistle-black transition-colors">
            {backLabel} &rarr;
          </Link>
        </div>
      </section>
    </>
  );
};
