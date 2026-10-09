import type { ReactNode } from "react";
import type { ZodType } from "zod";
import { CLAIMS } from "@/content/claims";
import AnswerBlock from "@/components/sections/AnswerBlock";
import AssuranceStrip from "@/components/sections/AssuranceStrip";
import BentoGrid, { type BentoItem } from "@/components/sections/BentoGrid";
import PathRouter from "@/components/sections/bespoke/PathRouter";
import HelpAndPolicies from "@/components/sections/bespoke/HelpAndPolicies";
import MeaningSection from "@/components/sections/bespoke/MeaningSection";
import ResponsibilitySplit from "@/components/sections/bespoke/ResponsibilitySplit";
import CTABand from "@/components/sections/CTABand";
import FAQSection from "@/components/sections/FAQSection";
import PricingPlans from "@/components/sections/PricingPlans";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import ProductHero from "@/components/sections/ProductHero";
import MigrationRequest from "@/components/sections/MigrationRequest";
import CaseStudy from "@/components/sections/CaseStudy";
import StatsBar from "@/components/sections/StatsBar";
import WhyChoose from "@/components/sections/bespoke/WhyChoose";
import { CASE_STUDIES } from "@/content/case-studies";
import NextImage from "next/image";
import { existsSync } from "node:fs";
import { join } from "node:path";
import SupportChannels from "@/components/sections/SupportChannels";
import Testimonials from "@/components/sections/Testimonials";
import TrustSignals from "@/components/sections/TrustSignals";
import type { TrustItem } from "@/content/trust";
import { CacheVisual, GrowthVisual, ChannelsVisual, RestoreVisual } from "@/components/sections/visuals/bento";
import { showPrices } from "@/lib/flags";
import { buildPlanCards, VAT_DISPLAY } from "@/lib/pricing/plans";
import { featureById } from "./features";
import { POLICY_LINKS, PUBLISHED_PAGES } from "./published-pages";
import { fillTemplate, passes, resolveClaimRef, resolveRequires, type ResolveContext } from "./refs";
import { loadVerifiedReviews } from "./reviews";
import * as S from "./schemas/sections";

type Of<T extends S.SectionType> = Extract<S.SectionSpec, { type: T }>;
type Entry<T extends S.SectionType> = { schema: ZodType; render: (section: Of<T>, ctx: ResolveContext) => ReactNode };

const claimId = (ref: string) => ref.replace(/^claim:/, "");

/** A real screenshot from public/screenshots, or null: with no real picture the hero shows none and centres its text. */
function heroVisual(shot: { src: string; alt: string; width: number; height: number } | undefined): ReactNode | null {
  if (!shot || !existsSync(join(process.cwd(), "public", shot.src))) return null;
  return (
    <figure className="surface surface-raised overflow-hidden !rounded-2xl shadow-xl">
      <NextImage src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} priority sizes="(min-width: 1024px) 50vw, 100vw" className="h-auto w-full" />
    </figure>
  );
}
const BENTO_VISUALS = { cache: <CacheVisual />, growth: <GrowthVisual />, restore: <RestoreVisual />, channels: <ChannelsVisual /> } as const;

/**
 * Section type to schema and renderer. The renderer adapts the page JSON (`content`) to the existing component's props and
 * applies the gates: claim refs, feature refs and per-item `requires`. A renderer returns null when it has nothing to show,
 * which is how `hideIfEmpty` works: the page never has an empty gap.
 */
export const SECTION_REGISTRY: { [T in S.SectionType]: Entry<T> } = {
  ProductHero: {
    schema: S.ProductHero,
    render: ({ content: c }, ctx) => {
      // The reason-led headline shows only while the claims behind its reason render. The fallback is the plain version.
      const reasonOk = !c.h1Requires || c.h1Requires.every((r) => resolveClaimRef(r, ctx));
      const h1 = reasonOk ? c.h1 : (c.h1Fallback ?? c.h1);
      const accent = reasonOk ? c.accent : c.accentFallback;
      return (
      <ProductHero
        eyebrow={c.eyebrow}
        title={accent && h1.endsWith(accent) ? h1.slice(0, -accent.length).trimEnd() : h1}
        titleAccent={accent && h1.endsWith(accent) ? accent : undefined}
        description={c.leadRequiresClaims && !c.leadRequiresClaims.every((r) => resolveClaimRef(r, ctx)) ? (c.leadFallback ?? c.lead) : c.lead}
        primaryCta={c.ctaPrimary}
        secondaryCta={c.ctaSecondary && resolveRequires(c.ctaSecondaryRequires, ctx) ? c.ctaSecondary : undefined}
        visual={heroVisual(c.screenshot)}
        mockup={c.mockup}
        highlights={(c.highlights ?? []).flatMap((h) => {
          if (!h.startsWith("claim:")) return [h];
          const claim = CLAIMS.find((x) => x.id === claimId(h));
          return claim && resolveClaimRef(h, ctx) ? [claim.text] : [];
        })}
      />
      );
    },
  },
  AssuranceStrip: {
    schema: S.AssuranceStrip,
    render: ({ content: c }, ctx) => {
      // The resolve context decides which claims render; the strip then shows exactly those.
      const claims = c.claims.flatMap((ref) => {
        const claim = CLAIMS.find((x) => x.id === claimId(ref));
        return claim && claim.kind === "assurance" && resolveClaimRef(ref, ctx) ? [{ ...claim, verified: true }] : [];
      });
      return claims.length ? <AssuranceStrip claims={claims} label={c.label} /> : null;
    },
  },
  ProofBar: {
    schema: S.ProofBar,
    render: ({ content: c }, ctx) => {
      // Measured numbers only, each from a claim that renders. Fewer than three is not a proof bar.
      const stats = c.claims.flatMap((ref) => {
        const claim = CLAIMS.find((x) => x.id === claimId(ref));
        return claim && claim.kind === "stat" && resolveClaimRef(ref, ctx) ? [{ ...claim, verified: true }] : [];
      });
      return stats.length >= 3 ? <StatsBar claims={stats} label={c.h2} /> : null;
    },
  },
  WhyChoose: {
    schema: S.WhyChoose,
    render: ({ content: c }, ctx) => {
      const reasons = c.items.filter((i) => resolveClaimRef(i.requiresClaim, ctx)).map((i) => ({ icon: i.icon, title: i.title, text: i.text, source: i.source }));
      return <WhyChoose eyebrow={c.eyebrow} title={c.h2} description={c.description} reasons={reasons} />;
    },
  },
  MigrationRequest: {
    schema: S.MigrationRequest,
    render: ({ id, content: c }) => <MigrationRequest eyebrow={c.eyebrow} title={c.h2} description={c.description} fields={c.fields} anchorId={id} />,
  },
  Evidence: {
    schema: S.Evidence,
    render: ({ content: c }) => {
      const study = CASE_STUDIES[0];
      return study ? <CaseStudy title={c.h2 ?? study.title} description={study.description} metrics={study.metrics} sourceUrl={study.sourceUrl} /> : null;
    },
  },
  PathRouter: {
    schema: S.PathRouter,
    render: ({ content: c }, ctx) => {
      // Gate with the resolve context, then drop the claim ids so the component does not gate a second time.
      const paths = c.paths.filter((p) => !p.requiresClaim || resolveClaimRef(p.requiresClaim, ctx)).map((p) => ({ title: p.title, line: p.line, href: p.href, cta: p.cta, icon: p.icon }));
      return <PathRouter eyebrow={c.eyebrow} title={c.h2} description={c.description} paths={paths} compact={c.compact} />;
    },
  },
  AnswerBlock: {
    schema: S.AnswerBlock,
    render: ({ content: c }) => <AnswerBlock eyebrow={c.eyebrow} title={c.h2} answer={c.answer} detail={c.detail} link={c.link} />,
  },
  ResponsibilitySplit: {
    schema: S.ResponsibilitySplit,
    render: ({ content: c }, ctx) => {
      // Gate with the resolve context, then pass plain items so the component does not gate a second time.
      const norm = (items: typeof c.weLookAfter) =>
        items.flatMap((i) => (typeof i === "string" ? [{ text: i }] : !i.requiresClaim || resolveClaimRef(i.requiresClaim, ctx) ? [{ text: i.text }] : []));
      return <ResponsibilitySplit eyebrow={c.eyebrow} title={c.h2} description={c.description} weLookAfter={norm(c.weLookAfter)} youKeep={norm(c.youKeep)} note={c.note} />;
    },
  },
  Meaning: {
    schema: S.Meaning,
    render: ({ content: c }, ctx) => {
      const norm = (items: typeof c.weLookAfter) =>
        items.flatMap((i) => (typeof i === "string" ? [{ text: i }] : !i.requiresClaim || resolveClaimRef(i.requiresClaim, ctx) ? [{ text: i.text }] : []));
      // The answer shows only while the claim behind it renders; the heading follows the answer.
      const answerOk = Boolean(c.answer) && resolveRequires(c.answerRequires, ctx);
      return (
        <MeaningSection
          eyebrow={c.eyebrow}
          title={answerOk ? c.h2 : (c.h2Fallback ?? c.h2)}
          answer={answerOk ? c.answer : undefined}
          weLookAfter={norm(c.weLookAfter)}
          youKeep={norm(c.youKeep)}
          lookAfterLabel={c.lookAfterLabel}
          keepLabel={c.keepLabel}
          note={c.note}
        />
      );
    },
  },
  HelpAndPolicies: {
    schema: S.HelpAndPolicies,
    render: ({ content: c }) => {
      const policies: TrustItem[] = c.links
        .filter((href) => !c.onlyPublished || PUBLISHED_PAGES.has(href))
        .flatMap((href) => {
          const p = POLICY_LINKS[href];
          return p ? [{ id: href, icon: p.icon, title: p.title, description: p.description, href, linkLabel: p.linkLabel, verified: true }] : [];
        });
      return <HelpAndPolicies eyebrow={c.eyebrow} title={c.h2} description={c.description} supportLabel={c.supportLabel} policiesLabel={c.policiesLabel} policies={policies} />;
    },
  },
  ProcessTimeline: {
    schema: S.ProcessTimeline,
    render: ({ content: c }) => <ProcessTimeline eyebrow={c.eyebrow} title={c.h2} description={c.description} steps={c.steps.map((s) => ({ title: s.title, description: s.text }))} />,
  },
  BentoGrid: {
    schema: S.BentoGrid,
    render: ({ content: c }, ctx) => {
      const items: BentoItem[] = c.tiles.flatMap((ref) => {
        const feature = featureById(ref.replace(/^feature:/, ""));
        if (!feature || !(ctx.claimRenders(feature.claim) && (feature.inPlan === null || ctx.plansWithFeature(feature.id).length > 0))) return [];
        const { visual, ...tile } = feature.tile;
        return [{ ...tile, visual: visual ? BENTO_VISUALS[visual] : undefined }];
      });
      // One lonely tile looks unfinished, so the section waits until two or more tiles can show.
      return items.length >= 2 ? <BentoGrid eyebrow={c.eyebrow} title={c.h2} description={c.description} items={items} /> : null;
    },
  },
  PricingPlans: {
    schema: S.PricingPlans,
    render: ({ content: c }, ctx) => {
      const plans = buildPlanCards()
        .filter((p) => c.show.includes(p.id))
        .map((p) => ({ ...p, highlight: p.id === c.highlight }));
      if (plans.length === 0) return null;
      return (
        <PricingPlans
          title={c.h2}
          description={c.description}
          plans={plans}
          showPrices={showPrices()}
          vatDisplay={VAT_DISPLAY}
          guaranteeNote={ctx.claimRenders("money-back") ? `${CLAIMS.find((x) => x.id === "money-back")?.text ?? ""}.` : null}
          renewalPromise={ctx.claimRenders("renewal-price-same")}
        >
          {c.link && (
            <p className="mt-8 text-center">
              <a href={c.link.href} className="text-base font-semibold text-link underline underline-offset-4">
                {c.link.label}
              </a>
            </p>
          )}
        </PricingPlans>
      );
    },
  },
  SupportChannels: {
    schema: S.SupportChannels,
    render: ({ content: c }) => <SupportChannels title={c.h2} description={c.description} layout={c.layout} />,
  },
  Testimonials: {
    schema: S.Testimonials,
    render: ({ content: c }) => {
      const items = loadVerifiedReviews();
      return items.length ? <Testimonials title={c.h2} items={items} /> : null;
    },
  },
  TrustSignals: {
    schema: S.TrustSignals,
    render: ({ content: c }) => {
      const items: TrustItem[] = c.links
        .filter((href) => !c.onlyPublished || PUBLISHED_PAGES.has(href))
        .flatMap((href) => {
          const p = POLICY_LINKS[href];
          return p ? [{ id: href, icon: p.icon, title: p.title, description: p.description, href, linkLabel: p.linkLabel, verified: true }] : [];
        });
      return items.length ? <TrustSignals title={c.h2} items={items} variant={c.variant} /> : null;
    },
  },
  FAQSection: {
    schema: S.FAQSection,
    render: ({ content: c }, ctx) => {
      const items = c.items
        .filter((i) => passes(i, ctx))
        .map((i) => ({ question: i.q, answer: fillTemplate(i.a).trim() }))
        .filter((i) => i.answer.length > 0);
      return items.length >= 3 ? <FAQSection title={c.h2} items={items} /> : null;
    },
  },
  CTABand: {
    schema: S.CTABand,
    render: ({ content: c }, ctx) => <CTABand title={c.h2} description={c.description} primaryCta={c.ctaPrimary} secondaryCta={c.ctaSecondary && resolveRequires(c.ctaSecondaryRequires, ctx) ? c.ctaSecondary : undefined} note={c.note} />,
  },
};
