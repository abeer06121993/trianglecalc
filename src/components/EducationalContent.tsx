import { getTranslation, faqData } from '@/lib/i18n';
import { ChevronDown } from 'lucide-react';
import { useState, useId } from 'react';

export function EducationalContent() {
  const t = getTranslation();

  return (
    <div className="space-y-12 lg:space-y-16">
      {/* How it works */}
      <section aria-labelledby="how-it-works-heading">
        <h2 id="how-it-works-heading" className="text-2xl font-bold text-slate-900 mb-4">
          {t.howItWorksTitle}
        </h2>
        <p className="text-slate-600 leading-relaxed">{t.howItWorksText}</p>
      </section>

      {/* How to calculate missing angles */}
      <section aria-labelledby="calc-angles-heading">
        <h2 id="calc-angles-heading" className="text-2xl font-bold text-slate-900 mb-4">
          {t.calcAnglesTitle}
        </h2>
        <p className="text-slate-600 leading-relaxed mb-4">{t.calcAnglesText1}</p>
        <div className="my-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
          <p className="text-lg font-mono text-slate-800">{t.calcAnglesFormula}</p>
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">{t.calcAnglesExampleTitle}</h3>
        <p className="text-slate-600 leading-relaxed">{t.calcAnglesExample}</p>
      </section>

      {/* How to calculate a missing side */}
      <section aria-labelledby="calc-sides-heading">
        <h2 id="calc-sides-heading" className="text-2xl font-bold text-slate-900 mb-4">
          {t.calcSidesTitle}
        </h2>
        <p className="text-slate-600 leading-relaxed mb-4">{t.calcSidesText1}</p>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">{t.calcSidesExampleTitle}</h3>
        <ul className="space-y-2 text-slate-600">
          <li className="flex gap-2"><span className="text-blue-600 font-bold">•</span> {t.calcSidesExample1}</li>
          <li className="flex gap-2"><span className="text-blue-600 font-bold">•</span> {t.calcSidesExample2}</li>
        </ul>
      </section>

      <div id="formulas" className="space-y-12">
      {/* Pythagorean theorem */}
      <section aria-labelledby="pythagoras-heading">
        <h2 id="pythagoras-heading" className="text-2xl font-bold text-slate-900 mb-4">
          {t.pythagorasTitle}
        </h2>
        <p className="text-slate-600 leading-relaxed mb-4">{t.pythagorasText}</p>
        <div className="my-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
          <p className="text-lg font-mono text-slate-800">{t.pythagorasFormula}</p>
        </div>
        <p className="text-slate-600 leading-relaxed">{t.pythagorasExample}</p>
      </section>

      {/* Sine rule */}
      <section aria-labelledby="sine-rule-heading">
        <h2 id="sine-rule-heading" className="text-2xl font-bold text-slate-900 mb-4">
          {t.sineRuleTitle}
        </h2>
        <p className="text-slate-600 leading-relaxed mb-4">{t.sineRuleText}</p>
        <div className="my-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
          <p className="text-lg font-mono text-slate-800">{t.sineRuleFormula}</p>
        </div>
        <p className="text-slate-600 leading-relaxed">{t.sineRuleNote}</p>
      </section>

      {/* Cosine rule */}
      <section aria-labelledby="cosine-rule-heading">
        <h2 id="cosine-rule-heading" className="text-2xl font-bold text-slate-900 mb-4">
          {t.cosineRuleTitle}
        </h2>
        <p className="text-slate-600 leading-relaxed mb-4">{t.cosineRuleText}</p>
        <div className="my-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
          <p className="text-lg font-mono text-slate-800">{t.cosineRuleFormula}</p>
        </div>
        <p className="text-slate-600 leading-relaxed">{t.cosineRuleNote}</p>
      </section>
      </div>

      {/* How to solve a triangle yourself */}
      <section aria-labelledby="solve-yourself-heading">
        <h2 id="solve-yourself-heading" className="text-2xl font-bold text-slate-900 mb-4">
          {t.solveYourselfTitle}
        </h2>
        <ol className="space-y-3">
          {t.solveYourselfSteps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-slate-600 leading-relaxed pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Types of triangles */}
      <section aria-labelledby="types-heading">
        <h2 id="types-heading" className="text-2xl font-bold text-slate-900 mb-4">
          {t.typesTitle}
        </h2>
        <p className="text-slate-600 leading-relaxed mb-6">{t.typesIntro}</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <TriangleTypeCard title={t.equilateralTitle} text={t.equilateralText} />
          <TriangleTypeCard title={t.isoscelesTitle} text={t.isoscelesText} />
          <TriangleTypeCard title={t.scaleneTitle} text={t.scaleneText} />
          <TriangleTypeCard title={t.rightTitle} text={t.rightText} />
          <TriangleTypeCard title={t.acuteTitle} text={t.acuteText} />
          <TriangleTypeCard title={t.obtuseTitle} text={t.obtuseText} />
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />
    </div>
  );
}

function TriangleTypeCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="p-4 bg-white rounded-xl border border-slate-200">
      <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
    </div>
  );
}

function FaqSection() {
  const t = getTranslation();

  return (
    <section id="faq" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-2xl font-bold text-slate-900 mb-6">
        {t.faqTitle}
      </h2>
      <div className="space-y-3">
        {faqData.map((item, i) => (
          <FaqItem key={i} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left hover:bg-slate-50 transition-colors"
        aria-expanded={open}
        aria-controls={contentId}
      >
        <span className="font-medium text-slate-800">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <div id={contentId} className="px-4 pb-4" hidden={!open}>
        <p className="text-slate-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}
