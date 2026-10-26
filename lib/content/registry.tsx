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
import HostingPricing from "@/components/sections/HostingPricing";
import RenewalCost from "@/components/sections/bespoke/RenewalCost";
import PlanGuide from "@/components/sections/bespoke/PlanGuide";
import { buildPlanGuide, buildRenewalCost, buildResourceTiers } from "@/lib/pricing/plans";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import ProductHero from "@/components/sections/ProductHero";
import OfferBanner, { type OfferPrice } from "@/components/sections/banners/OfferBanner";
import TwoColumn from "@/components/sections/TwoColumn";
import LogoStrip from "@/components/sections/LogoStrip";
import { TECH_LOGOS } from "@/content/logos";
import CurrencyAmount from "@/components/ui/CurrencyAmount";
import pricing from "@/data/pricing.json";
import { DEFAULT_CURRENCY, formatMoney } from "@/lib/pricing";
import MigrationRequest from "@/components/sections/MigrationRequest";
import MigrationPromo from "@/components/sections/bespoke/MigrationPromo";
import SupportTeam from "@/components/sections/bespoke/SupportTeam";
import { SUPPORT_PHOTO } from "@/content/team";
import CaseStudy from "@/components/sections/CaseStudy";
import StatsBar from "@/components/sections/StatsBar";
import WhyChoose from "@/components/sections/bespoke/WhyChoose";
import HonestLimits from "@/components/sections/bespoke/HonestLimits";
import PageProvenance from "@/components/sections/bespoke/PageProvenance";
import AdvantageGrid from "@/components/sections/bespoke/AdvantageGrid";
import Ecosystem from "@/components/sections/bespoke/Ecosystem";
import RatingBand from "@/components/sections/bespoke/RatingBand";
import ReviewsShowcase from "@/components/sections/bespoke/ReviewsShowcase";
import SolutionsGrid from "@/components/sections/bespoke/SolutionsGrid";
import ProductCards from "@/components/sections/bespoke/ProductCards";
import FeatureSpotlight from "@/components/sections/bespoke/FeatureSpotlight";
import { PanelMockup } from "@/components/sections/hero/PanelMockup";
import { BackupsVisual, BuilderEditorVisual, BuilderVisual, CareVisual, ManagedVsSharedVisual, MoveFlowGraphic, ShieldVisual, ControlPanelVisual, ResourceTiersVisual } from "@/components/sections/visuals/motion-graphics";
import type { ConsoleTile, HeroAssurance } from "@/components/sections/hero/ConsoleHero";
import { UI } from "@/content/strings";
import { CASE_STUDIES } from "@/content/case-studies";
import NextImage from "next/image";
import { existsSync } from "node:fs";
import { join } from "node:path";
import SupportChannels from "@/components/sections/SupportChannels";
import VideoEmbed from "@/components/sections/VideoEmbed";
import Testimonials from "@/components/sections/Testimonials";
import TrustSignals from "@/components/sections/TrustSignals";
import type { TrustItem } from "@/content/trust";
import { CacheVisual, GrowthVisual, ChannelsVisual, MoveVisual, RestoreVisual, UptimeVisual } from "@/components/sections/visuals/bento";
import { showPrices, showSamples } from "@/lib/flags";
import { COMPANY } from "@/content/company";
import { SAMPLE_CASE_STUDY, SAMPLE_RATING, SAMPLE_STATS } from "@/content/placeholders";
import { featureById } from "./features";
import { POLICY_LINKS, PUBLISHED_PAGES } from "./published-pages";
import { fillTemplate, passes, resolveClaimRef, resolveRequires, type ResolveContext } from "./refs";
import { loadPreviewReviews, loadVerifiedRating, loadVerifiedReviews } from "./reviews";
import * as S from "./schemas/sections";

type Of<T extends S.SectionType> = Extract<S.SectionSpec, { type: T }>;
/**
 * How a page looks as a whole. "luxe" is the Home look that the ProductHero "console" variant brings: ink bands, light
 * display headlines, numbered cards. Shared sections (ProcessTimeline, MigrationRequest, FAQSection, CTABand) switch to their
 * matching variant on such a page, so the page JSON stays free of styling.
 */
export type PageLook = "standard" | "luxe";
type Entry<T extends S.SectionType> = { schema: ZodType; render: (section: Of<T>, ctx: ResolveContext, look?: PageLook) => ReactNode };

/** The look a page's hero sets for the whole page. */
export function pageLook(sections: readonly S.SectionSpec[]): PageLook {
  const hero = sections[0];
  // The console hero (Home) and the panel hero (product pages) bring the Home variants of the shared sections.
  return hero?.type === "ProductHero" && (hero.variant === "console" || hero.variant === "panel") ? "luxe" : "standard";
}

const claimId = (ref: string) => ref.replace(/^claim:/, "");
const claimOf = (ref: string) => CLAIMS.find((x) => x.id === claimId(ref));
const lowerFirst = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

/** Console tiles: a claim shows its label and value while it renders; plain text is "Label: value". */
function consoleTiles(tiles: readonly string[], ctx: ResolveContext): ConsoleTile[] {
  return tiles.flatMap((t) => {
    if (t.startsWith("claim:")) {
      const claim = claimOf(t);
      return claim && resolveClaimRef(t, ctx) ? [{ label: claim.label, value: claim.value }] : [];
    }
    const at = t.indexOf(": ");
    return [at > 0 ? { label: t.slice(0, at), value: t.slice(at + 2) } : { label: "", value: t }];
  });
}

/** The assurance rail: each rendering claim as "value label", with its terms link. */
function heroAssurances(refs: readonly string[], ctx: ResolveContext): HeroAssurance[] {
  return refs.flatMap((ref) => {
    const claim = claimOf(ref);
    if (!claim || !claim.termsPage || !resolveClaimRef(ref, ctx)) return [];
    return [{ title: `${claim.value} ${lowerFirst(claim.label)}`, href: claim.termsPage, linkLabel: claim.termsLabel ?? UI.generic.readTerms }];
  });
}

/** A real screenshot from public/screenshots, or null: with no real picture the hero shows none and centres its text. */
function heroVisual(shot: { src: string; alt: string; width: number; height: number } | undefined): ReactNode | null {
  if (!shot || !existsSync(join(process.cwd(), "public", shot.src))) return null;
  return (
    <figure className="surface surface-raised overflow-hidden !rounded-2xl shadow-xl">
      <NextImage src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} priority sizes="(min-width: 1024px) 50vw, 100vw" className="h-auto w-full" />
    </figure>
  );
}
/** The lowest annual price and its renewal price, from data/pricing.json, in every enabled currency. Null while prices are hidden. */
function lowestPlanPrice(): { planName: string; price: OfferPrice } | null {
  if (!showPrices()) return null;
  const priced = pricing.plans.filter((p) => typeof p.pricing.annual[DEFAULT_CURRENCY] === "number");
  const plan = priced.reduce<(typeof priced)[number] | null>((low, p) => (!low || (p.pricing.annual[DEFAULT_CURRENCY] ?? Infinity) < (low.pricing.annual[DEFAULT_CURRENCY] ?? Infinity) ? p : low), null);
  const amount = plan && formatMoney(plan.pricing.annual);
  if (!plan || !amount) return null;
  const renewal = formatMoney(plan.pricing.renewal);
  return {
    planName: plan.name,
    price: { amount: <CurrencyAmount amounts={amount} />, period: UI.banners.perMonthBilledAnnually, renewal: renewal ? <CurrencyAmount amounts={renewal} /> : undefined, taxLine: UI.pricing.taxLine },
  };
}

/** Plain text, or text shown only while its claim renders. */
const gated = (items: readonly (string | { text: string; requiresClaim?: string })[] | undefined, ctx: ResolveContext): string[] =>
  (items ?? []).flatMap((i) => (typeof i === "string" ? [i] : !i.requiresClaim || resolveClaimRef(i.requiresClaim, ctx) ? [i.text] : []));

const BENTO_VISUALS = { cache: <CacheVisual />, growth: <GrowthVisual />, restore: <RestoreVisual />, channels: <ChannelsVisual />, shield: <ShieldVisual />, backups: <BackupsVisual />, builder: <BuilderVisual />, panel: <ControlPanelVisual />, uptime: <UptimeVisual />, move: <MoveVisual /> } as const;

/**
 * Section type to schema and renderer. The renderer adapts the page JSON (`content`) to the existing component's props and
 * applies the gates: claim refs, feature refs and per-item `requires`. A renderer returns null when it has nothing to show,
 * which is how `hideIfEmpty` works: the page never has an empty gap.
 */
export const SECTION_REGISTRY: { [T in S.SectionType]: Entry<T> } = {
  OfferHero: {
    schema: S.OfferHero,
    render: ({ variant, content: c }, ctx) => {
      const offer = lowestPlanPrice();
      const risk = c.riskReducer && resolveClaimRef(c.riskReducer.requiresClaim, ctx) ? { text: c.riskReducer.text, href: c.riskReducer.href } : undefined;
      return (
        <OfferBanner
          eyebrow={c.eyebrow}
          title={c.h1}
          titleAccent={c.accent}
          description={c.lead}
          planName={offer?.planName ?? c.eyebrow}
          price={offer?.price}
          primaryCta={c.ctaPrimary}
          riskReducer={risk}
          nextStep={c.nextStep}
          highlights={gated(c.highlights, ctx)}
          layout={variant}
          headingLevel="h1"
        />
      );
    },
  },
  LogoStrip: {
    schema: S.LogoStrip,
    render: ({ variant, content: c }, ctx) => {
      const logos = TECH_LOGOS.filter((l) => ctx.claimRenders(l.claim));
      return <LogoStrip eyebrow={c.eyebrow} title={c.h2} note={c.note} logos={logos} variant={variant} />;
    },
  },
  TwoColumn: {
    schema: S.TwoColumn,
    render: ({ content: c }, ctx) => (
      <TwoColumn eyebrow={c.eyebrow} title={c.h2} description={c.description} features={gated(c.points, ctx)} cta={c.ctas}
        // The shared visuals are drawn for a tile, so they sit in a raised card here.
        visual={<div aria-hidden="true" className="surface surface-raised relative flex aspect-[4/3] items-center justify-center overflow-hidden !rounded-2xl p-8"><div className="scale-125 sm:scale-150">{BENTO_VISUALS[c.visual]}</div></div>}
        visualPosition={c.visualPosition} />
    ),
  },
  ProductHero: {
    schema: S.ProductHero,
    render: ({ variant, content: c }, ctx) => {
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
        variant={variant === "console" ? "console" : "dashboard"}
        consoleProps={
          variant === "console" && c.console
            ? {
                form: c.form && resolveRequires(c.formRequires, ctx) ? c.form : undefined,
                console: { ...c.console, tiles: consoleTiles(c.console.tiles, ctx) },
                assurances: heroAssurances(c.assurances ?? [], ctx),
              }
            : undefined
        }
        visual={
          variant === "console"
            ? null
            : variant === "tiers"
              ? <ResourceTiersVisual tiers={buildResourceTiers()} caption={UI.graphics.tiersCaption} alt={c.visual?.alt} footnote={resolveClaimRef("claim:renewal-price-same", ctx) ? UI.graphics.tiersSameRenewal : undefined} />
              : variant === "panel" && c.panel
                ? <PanelMockup domain={c.panel.domain} caption={c.panel.caption} alt={c.visual?.alt} className="drop-shadow-2xl" />
                : heroVisual(c.screenshot)
        }
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
      // Development preview only: pad with clearly marked sample numbers so the layout can be reviewed.
      const shown = stats.length < 3 && showSamples() ? [...stats, ...SAMPLE_STATS].slice(0, 4) : stats;
      return shown.length >= 3 ? <StatsBar claims={shown} label={c.h2} /> : null;
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
    render: ({ id, content: c }, _ctx, look) => (
      <MigrationRequest
        eyebrow={c.eyebrow}
        title={c.h2}
        description={c.description}
        fields={c.fields}
        anchorId={id}
        tone={look === "luxe" ? "ink" : "default"}
        submitLabel={look === "luxe" ? UI.migrationRequest.submitPlan : undefined}
      />
    ),
  },
  SupportTeam: {
    schema: S.SupportTeam,
    render: ({ content: c }, ctx) => {
      const points = c.points.filter((p) => passes(p, ctx)).map((p) => ({ title: p.title, text: p.text }));
      return <SupportTeam eyebrow={c.eyebrow} title={c.h2} accent={c.accent} description={c.description} points={points} links={c.links} photo={SUPPORT_PHOTO} visual={c.visual} />;
    },
  },
  MigrationPromo: {
    schema: S.MigrationPromo,
    render: ({ id, content: c }) => {
      // The client area is the only action today; with no URL set, the section has nothing to offer and is left out.
      const href = c.cta.action === "client-area" ? COMPANY.clientAreaUrl : null;
      if (!href) return null;
      return <MigrationPromo anchorId={id} eyebrow={c.eyebrow} title={c.h2} description={c.description} points={c.points} cta={{ label: c.cta.label, href }} note={c.note} graphic={c.graphic} />;
    },
  },
  Evidence: {
    schema: S.Evidence,
    render: ({ content: c }) => {
      const study = CASE_STUDIES[0];
      if (study) return <CaseStudy title={c.h2 ?? study.title} description={study.description} metrics={study.metrics} sourceUrl={study.sourceUrl} />;
      // Development preview only: the sample case study from content/placeholders.ts.
      return showSamples() ? <CaseStudy title={SAMPLE_CASE_STUDY.title} description={SAMPLE_CASE_STUDY.description} metrics={SAMPLE_CASE_STUDY.metrics} showSamples /> : null;
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
    render: ({ content: c }) => <AnswerBlock eyebrow={c.eyebrow} title={c.h2} answer={c.answer} detail={c.detail} link={c.link} visual={c.visual === "care" ? <CareVisual /> : undefined} />,
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
          visual={c.visual === "managed-vs-shared" ? <ManagedVsSharedVisual /> : undefined}
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
    render: ({ content: c }, _ctx, look) => (
      <ProcessTimeline eyebrow={c.eyebrow} title={c.h2} description={c.description} steps={c.steps.map((s) => ({ title: s.title, description: s.text }))} variant={look === "luxe" ? "cards" : "rail"} graphic={c.graphic ? <MoveFlowGraphic {...c.graphic} /> : undefined} />
    ),
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
    // Every page shows the same lineup at the same prices (decision 73): the spec sets only the heading, never the plans.
    render: ({ id, content: c }) => (
      <HostingPricing anchorId={id} title={c.h2} description={c.description} extras={false}>
        {c.link && (
          <p className="mt-8 text-center">
            <a href={c.link.href} className="text-base font-semibold text-link underline underline-offset-4">
              {c.link.label}
            </a>
          </p>
        )}
      </HostingPricing>
    ),
  },
  RenewalCost: {
    schema: S.RenewalCost,
    // Totals are computed from data/pricing.json; the section's requiresClaim keeps it hidden unless renewal-price-same renders.
    render: ({ content: c }) => <RenewalCost eyebrow={c.eyebrow} title={c.h2} description={c.description} rows={buildRenewalCost()} finding={c.finding} link={c.link} />,
  },
  PlanGuide: {
    schema: S.PlanGuide,
    // Figures come from data/pricing.json; the spec supplies only who each plan fits. Plans without a fit line are left out.
    render: ({ content: c }) => {
      const fit = new Map(c.fit.map((f) => [f.plan, f.text]));
      const rows = buildPlanGuide().flatMap((r) => (fit.has(r.id) ? [{ ...r, fit: fit.get(r.id) ?? "" }] : []));
      return rows.length >= 2 ? <PlanGuide eyebrow={c.eyebrow} title={c.h2} description={c.description} rows={rows} note={c.note} link={c.link} /> : null;
    },
  },
  SupportChannels: {
    schema: S.SupportChannels,
    render: ({ content: c }) => <SupportChannels title={c.h2} description={c.description} layout={c.layout} />,
  },
  Testimonials: {
    schema: S.Testimonials,
    render: ({ content: c }) => {
      const real = loadVerifiedReviews();
      // Development preview only: every review in data/reviews.json, including those not yet cleared for production.
      const items = real.length ? real : showSamples() ? loadPreviewReviews() : [];
      return items.length ? <Testimonials title={c.h2} items={items} showSamples={!real.length && showSamples()} /> : null;
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
    render: ({ content: c }, ctx, look) => {
      const items = c.items
        .filter((i) => passes(i, ctx))
        .map((i) => ({ question: i.q, answer: fillTemplate(i.a).trim() }))
        .filter((i) => i.answer.length > 0);
      return items.length >= 3 ? <FAQSection title={c.h2} items={items} link={c.link} photos={c.photos} variant={look === "luxe" ? "lines" : "cards"} /> : null;
    },
  },
  HonestLimits: {
    schema: S.HonestLimits,
    render: ({ content: c }, ctx) => {
      // Each limit gates on its own claim or condition; fewer than two left and the section is omitted.
      const items = c.items.filter((i) => passes(i, ctx)).map((i) => ({ text: i.text, reason: i.reason, link: i.link, firstHand: i.firstHand }));
      return <HonestLimits eyebrow={c.eyebrow} title={c.h2} description={c.description} items={items} />;
    },
  },
  PageProvenance: {
    schema: S.PageProvenance,
    // The editorial policy link shows only once that page is published, like every policy link.
    render: ({ content: c }) => <PageProvenance reviewer={c.reviewer} role={c.role} reviewedOn={c.reviewedOn} howLine={c.howLine} report={c.report} policyHref={c.policyHref && PUBLISHED_PAGES.has(c.policyHref) ? c.policyHref : undefined} variant={c.variant} />,
  },
  CTABand: {
    schema: S.CTABand,
    render: ({ content: c }, ctx, look) => (
      <CTABand
        title={c.h2}
        description={c.description}
        primaryCta={c.ctaPrimary}
        secondaryCta={c.ctaSecondary && resolveRequires(c.ctaSecondaryRequires, ctx) ? c.ctaSecondary : undefined}
        note={c.note}
        tone={look === "luxe" ? "ink" : "card"}
      />
    ),
  },
  RatingBand: {
    schema: S.RatingBand,
    render: () => {
      const real = loadVerifiedRating();
      // Development preview only: the sample rating from content/placeholders.ts.
      const rating = real ?? (showSamples() ? SAMPLE_RATING : null);
      return rating ? <RatingBand rating={rating} showSamples={!real} /> : null;
    },
  },
  AdvantageGrid: {
    schema: S.AdvantageGrid,
    render: ({ content: c }, ctx) => {
      const items = c.items.filter((i) => resolveClaimRef(i.requiresClaim, ctx)).map((i) => ({ value: i.value, title: i.title, text: i.text, link: i.link, firstHand: i.firstHand }));
      return <AdvantageGrid eyebrow={c.eyebrow} title={c.h2} accent={c.accent} description={c.description} items={items} />;
    },
  },
  FeatureSpotlight: {
    schema: S.FeatureSpotlight,
    render: ({ content: c }, ctx) => {
      const points = c.points.filter((p) => passes(p, ctx)).map((p) => ({ title: p.title, text: p.text }));
      return <FeatureSpotlight eyebrow={c.eyebrow} title={c.h2} description={c.description} points={points} visual={c.visual === "builder" ? <BuilderEditorVisual /> : undefined} note={c.note} source={c.source} reverse={c.reverse} />;
    },
  },
  VideoEmbed: {
    schema: S.VideoEmbed,
    render: ({ content: c }) => <VideoEmbed eyebrow={c.eyebrow} title={c.h2} description={c.description} video={c.video} />,
  },
  ProductCards: {
    schema: S.ProductCards,
    render: ({ content: c }, ctx) => {
      const items = c.items.filter((i) => passes(i, ctx)).map((i) => ({ icon: i.icon, tag: i.tag, title: i.title, text: i.text, href: i.href, cta: i.cta }));
      return <ProductCards title={c.h2} items={items} />;
    },
  },
  SolutionsGrid: {
    schema: S.SolutionsGrid,
    render: ({ id, content: c }, ctx) => {
      const featured = c.featured.filter((f) => passes(f, ctx)).map((f) => ({ tag: f.tag, title: f.title, text: f.text, href: f.href, cta: f.cta }));
      const items = c.items.filter((i) => passes(i, ctx)).map((i) => ({ icon: i.icon, title: i.title, text: i.text, href: i.href }));
      return <SolutionsGrid eyebrow={c.eyebrow} title={c.h2} description={c.description} featured={featured} items={items} note={c.note} anchorId={id} />;
    },
  },
  Ecosystem: {
    schema: S.Ecosystem,
    render: ({ content: c }, ctx) => {
      const points = c.points.filter((p) => passes(p, ctx)).map((p) => ({ title: p.title, text: p.text }));
      return <Ecosystem eyebrow={c.eyebrow} title={c.h2} accent={c.accent} description={c.description} points={points} nodes={c.nodes} center={c.center} />;
    },
  },
  ReviewsShowcase: {
    schema: S.ReviewsShowcase,
    render: ({ content: c }) => {
      const study = CASE_STUDIES[0] ?? null;
      const reviews = loadVerifiedReviews();
      const props = { eyebrow: c.eyebrow, title: c.h2, description: c.description };
      // Development preview: every review in data/reviews.json joins the real study.
      if (showSamples()) return <ReviewsShowcase {...props} study={study ?? { ...SAMPLE_CASE_STUDY, sample: true }} reviews={reviews.length ? reviews : loadPreviewReviews()} showSamples />;
      return study || reviews.length ? <ReviewsShowcase {...props} study={study} reviews={reviews} /> : null;
    },
  },
};
