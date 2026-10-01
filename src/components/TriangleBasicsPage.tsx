import { useState } from 'react';
import { appRoutes } from '@/lib/routes';
import { triangleBasicsContent as content } from '@/lib/learnTriangleBasics';
import { triangleSidesFromAngles } from '@/lib/triangleBasicsGeometry';
import { TriangleBasicsDiagram } from './TriangleBasicsDiagram';
import { PageContainer } from './PageContainer';

export function TriangleBasicsPage() {
  const [sideA, setSideA] = useState(5);
  const [alpha, setAlpha] = useState(60);
  const beta = 50;
  const gamma = 180 - alpha - beta;
  const interactiveSides = triangleSidesFromAngles(sideA, alpha, beta);
  const sectionLinks = [
    ['what', content.sections.what.title],
    ['used', content.sections.used.title],
    ['why', content.sections.why.title],
    ['sides-angles', content.sections.sidesAngles.title],
    ['types', content.sections.types.title],
    ['described', content.sections.described.title],
    ['try', content.sections.try.title],
  ] as const;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <main>
        <PageContainer size="content" className="py-8 sm:py-12">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
            <ol className="flex flex-wrap items-center gap-2">
              <li><a className="rounded hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" href={appRoutes.calculator}>Triangle Calculator</a></li>
              <li aria-hidden="true">/</li>
              <li>Learn</li>
              <li aria-hidden="true">/</li>
              <li><span aria-current="page" className="font-medium text-slate-700">Triangle Basics</span></li>
            </ol>
          </nav>

          <header className="mb-8 sm:mb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">Learn · Triangle Basics</p>
            <h1 className="mb-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">Triangle Basics</h1>
            <p className="max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">{content.intro}</p>
          </header>

          <nav aria-label="On this page" className="mb-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <h2 className="mb-4 text-base font-semibold text-slate-900">In this lesson</h2>
            <ol className="grid gap-2 sm:grid-cols-2">
              {sectionLinks.map(([id, title], index) => (
                <li key={id}>
                  <a href={`#${id}`} className="flex items-start gap-3 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-white hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-800">{index + 1}</span>
                    <span>{title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="space-y-14 sm:space-y-20">
            <section id="what" aria-labelledby="what-heading" className="scroll-mt-24">
              <SectionHeading id="what-heading">{content.sections.what.title}</SectionHeading>
              <div className="grid items-center gap-6 md:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <p className="mb-5 leading-relaxed text-slate-600">{content.sections.what.description}</p>
                  <dl className="grid gap-3 sm:grid-cols-3">
                    {content.sections.what.terms.map((term) => (
                      <div key={term.term} className="rounded-xl border border-slate-200 bg-white p-4">
                        <dt className="mb-1 font-semibold text-slate-900">{term.term}</dt>
                        <dd className="text-sm leading-relaxed text-slate-600">{term.definition}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-5 rounded-xl border-l-4 border-blue-500 bg-blue-50 px-4 py-3 font-medium text-blue-950">{content.sections.what.angleFact}</p>
                </div>
                <figure className="rounded-2xl bg-slate-50 p-3 sm:p-5">
                  <TriangleBasicsDiagram sides={{ a: 5, b: 6, c: 7 }} label="Triangle showing its three sides a, b and c and opposite angles alpha, beta and gamma" />
                  <figcaption className="mt-1 text-center text-xs text-slate-500">Three sides meet at three vertices to form three interior angles.</figcaption>
                </figure>
              </div>
            </section>

            <section id="used" aria-labelledby="used-heading" className="scroll-mt-24">
              <SectionHeading id="used-heading">{content.sections.used.title}</SectionHeading>
              <p className="mb-6 max-w-3xl leading-relaxed text-slate-600">{content.sections.used.intro}</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {content.sections.used.examples.map((example, index) => (
                  <div key={example.title} className="rounded-2xl border border-slate-200 p-5">
                    <RealWorldMark variant={index} />
                    <h3 className="mb-2 font-semibold text-slate-900">{example.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600">{example.text}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 rounded-xl bg-slate-50 px-5 py-4 leading-relaxed text-slate-700">{content.sections.used.takeaway}</p>
            </section>

            <section id="why" aria-labelledby="why-heading" className="scroll-mt-24">
              <SectionHeading id="why-heading">{content.sections.why.title}</SectionHeading>
              <p className="mb-6 max-w-3xl leading-relaxed text-slate-600">{content.sections.why.intro}</p>
              <ol className="grid gap-3 sm:grid-cols-3">
                {content.sections.why.steps.map((step, index) => (
                  <li key={step} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-800">{index + 1}</span>
                    <span className="font-semibold text-slate-800">{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-5 leading-relaxed text-slate-600">Triangle calculations can help with {content.sections.why.examples.join(', ')}. {content.sections.why.bridge}</p>
            </section>

            <section id="sides-angles" aria-labelledby="sides-angles-heading" className="scroll-mt-24">
              <SectionHeading id="sides-angles-heading">{content.sections.sidesAngles.title}</SectionHeading>
              <p className="mb-5 max-w-3xl leading-relaxed text-slate-600">{content.sections.sidesAngles.description}</p>
              <div className="grid items-center gap-6 md:grid-cols-2">
                <figure className="order-2 rounded-2xl bg-slate-50 p-3 sm:p-5 md:order-1">
                  <TriangleBasicsDiagram sides={{ a: 5, b: 6, c: 7 }} label="Triangle notation: side a is opposite alpha, side b is opposite beta, and side c is opposite gamma" />
                </figure>
                <div className="order-1 md:order-2">
                  <ul className="space-y-3">
                    {content.sections.sidesAngles.pairs.map((pair) => (
                      <li key={pair.side} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                        <span className="min-w-16 rounded-lg bg-blue-50 px-3 py-2 text-center font-mono text-lg font-semibold text-blue-800">{pair.side} ↔ {pair.angle}</span>
                        <span className="text-sm text-slate-700">{pair.explanation}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="my-4 rounded-xl bg-blue-50 p-4 text-center font-mono text-xl font-semibold text-blue-950" aria-label="Alpha plus beta plus gamma equals 180 degrees">{content.sections.sidesAngles.formula}</p>
                  <p className="text-sm leading-relaxed text-slate-600">{content.sections.sidesAngles.note}</p>
                </div>
              </div>
            </section>

            <section id="types" aria-labelledby="types-heading" className="scroll-mt-24">
              <SectionHeading id="types-heading">{content.sections.types.title}</SectionHeading>
              <p className="mb-7 max-w-3xl leading-relaxed text-slate-600">{content.sections.types.intro}</p>
              <div className="grid gap-8 lg:grid-cols-2">
                <TriangleTypeGroup title={content.sections.types.sideHeading} types={content.sections.types.sideTypes} />
                <TriangleTypeGroup title={content.sections.types.angleHeading} types={content.sections.types.angleTypes} />
              </div>
              <p className="mt-6 rounded-xl border-l-4 border-blue-500 bg-blue-50 px-4 py-3 leading-relaxed text-blue-950">{content.sections.types.overlap}</p>
            </section>

            <section id="described" aria-labelledby="described-heading" className="scroll-mt-24">
              <SectionHeading id="described-heading">{content.sections.described.title}</SectionHeading>
              <p className="mb-6 max-w-3xl leading-relaxed text-slate-600">{content.sections.described.intro}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {content.sections.described.outcomes.map((outcome, index) => (
                  <div key={outcome.title} className="rounded-xl border border-slate-200 p-5">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">{index + 1}</p>
                    <h3 className="mb-2 font-semibold text-slate-900">{outcome.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600">{outcome.text}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 leading-relaxed text-slate-600">{content.sections.described.close}</p>
            </section>

            <section id="try" aria-labelledby="try-heading" className="scroll-mt-24">
              <SectionHeading id="try-heading">{content.sections.try.title}</SectionHeading>
              <p className="mb-6 max-w-3xl leading-relaxed text-slate-600">{content.sections.try.intro}</p>
              <div className="grid gap-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6 lg:grid-cols-[1.1fr_0.9fr]">
                <figure className="flex items-center rounded-xl bg-white p-3 sm:p-5">
                  <TriangleBasicsDiagram sides={interactiveSides} label={`Interactive triangle with side a ${sideA}, angle alpha ${alpha} degrees, angle beta ${beta} degrees and angle gamma ${gamma} degrees`} />
                </figure>
                <div className="space-y-5">
                  <RangeControl id="triangle-side-a" label={content.sections.try.sideLabel} value={sideA} min={3} max={7} step={0.5} suffix=" units" onChange={setSideA} />
                  <RangeControl id="triangle-alpha" label={content.sections.try.alphaLabel} value={alpha} min={35} max={85} step={1} suffix="°" onChange={setAlpha} />
                  <dl aria-live="polite" className="grid grid-cols-2 gap-3 rounded-xl bg-white p-4 text-sm">
                    <dt className="text-slate-600">{content.sections.try.betaLabel}</dt><dd className="text-right font-semibold text-slate-900">{beta}°</dd>
                    <dt className="text-slate-600">{content.sections.try.gammaLabel}</dt><dd className="text-right font-semibold text-slate-900">{gamma}°</dd>
                    <dt className="border-t border-slate-100 pt-3 font-medium text-slate-700">{content.sections.try.sumLabel}</dt><dd className="border-t border-slate-100 pt-3 text-right font-semibold text-blue-800">{alpha + beta + gamma}°</dd>
                  </dl>
                  <button type="button" onClick={() => { setSideA(5); setAlpha(60); }} className="rounded-lg px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">{content.sections.try.resetLabel}</button>
                </div>
              </div>
            </section>

            <section aria-labelledby="calculator-cta-heading" className="rounded-2xl bg-slate-900 px-6 py-8 text-white sm:px-8">
              <h2 id="calculator-cta-heading" className="mb-3 text-2xl font-bold">{content.sections.calculator.title}</h2>
              <p className="mb-5 max-w-2xl leading-relaxed text-slate-300">{content.sections.calculator.text}</p>
              <a href={appRoutes.calculator} className="inline-flex min-h-11 items-center rounded-lg bg-blue-500 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">{content.sections.calculator.link}<span aria-hidden="true" className="ml-2">→</span></a>
            </section>
          </article>
        </PageContainer>
      </main>
    </div>
  );
}

function SectionHeading({ id, children }: { id: string; children: string }) {
  return <h2 id={id} className="mb-4 text-2xl font-bold text-slate-900 sm:text-3xl">{children}</h2>;
}

function TriangleTypeGroup({ title, types }: { title: string; types: readonly { name: string; property: string; description: string; sides: readonly number[] }[] }) {
  return (
    <section aria-label={title}>
      <h3 className="mb-4 text-lg font-semibold text-slate-900">{title}</h3>
      <div className="grid gap-3">
        {types.map((type) => (
          <article key={type.name} className="rounded-xl border border-slate-200 bg-white p-4">
            <TriangleBasicsDiagram sides={{ a: type.sides[0], b: type.sides[1], c: type.sides[2] }} label={`${type.name} triangle illustration`} />
            <h4 className="mb-1 font-semibold text-slate-900">{type.name}</h4>
            <p className="mb-1 text-sm font-medium text-blue-800">{type.property}</p>
            <p className="text-sm leading-relaxed text-slate-600">{type.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function RangeControl({ id, label, value, min, max, step, suffix, onChange }: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-slate-800">{label}</label>
        <output htmlFor={id} className="rounded-md bg-white px-2 py-1 text-sm font-semibold tabular-nums text-slate-900">{value}{suffix}</output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} aria-valuetext={`${value}${suffix}`} onChange={(event) => onChange(Number(event.currentTarget.value))} className="h-11 w-full cursor-pointer accent-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" />
    </div>
  );
}

function RealWorldMark({ variant }: { variant: number }) {
  const designs = [
    <><path d="M5 24 24 8l19 16v20H5z" /><path d="M17 44V29h14v15M4 24h40" /></>,
    <><path d="M4 39h40M7 39V19h34v20M7 19l8 20 9-20 9 20 8-20" /></>,
    <><path d="M8 42V18h32v24M4 42h40M24 18V7M20 7h8M24 18 12 37M24 18l12 19" /><circle cx="24" cy="18" r="3" /></>,
    <><path d="M8 40h32M12 40V17h24v23M12 17h24M16 17V9h16v8" /><path d="m18 28 6-6 6 6" /></>,
    <><path d="M6 40h36V12H6zM6 12l18 14 18-14M6 40l18-14 18 14M24 26V12" /></>,
  ];
  return <svg viewBox="0 0 48 48" aria-hidden="true" className="mb-4 h-12 w-12 rounded-xl bg-blue-50 p-2 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{designs[variant]}</svg>;
}
