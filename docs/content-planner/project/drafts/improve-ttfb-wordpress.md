---
slug: /kb/improve-ttfb-wordpress
plan: 04 Problem and troubleshooting (intent: Solve)
primary_keyword: how to improve ttfb on wordpress
secondary_keywords: reduce ttfb wordpress; high ttfb wordpress
locale: en-US
state: Drafted (Option B skeleton: tested numbers missing)
author: "[HUMAN REVIEW: author name and author page]"
reviewer: "Sandipan Das (owner), until a second reviewer exists"
ai_assisted: yes
reviewed_on: "[HUMAN REVIEW: set when a person rechecks the whole post]"
next_review_on: 2027-04-08
claims_used: none
supports: /wordpress-hosting
cluster: WordPress speed (pillar planned)
seo_title: How to Improve TTFB on WordPress
meta_description: Find out why your WordPress server responds slowly and fix it in order of effort, with a check after each step. Back up first.
schema: BlogPosting + HowTo + BreadcrumbList; FAQPage for the visible FAQ
tested_versions: "[HUMAN REVIEW: WordPress and PHP versions tested, and the test date]"
---

# How to improve TTFB on WordPress

TTFB is the time between a visitor asking for your page and the first byte of the answer arriving. On WordPress it is usually slow because the server builds every page from scratch. Turn on page caching first, then update PHP, remove heavy plugins and clean the database. Google's web.dev treats 0.8 seconds or less as good.

*Drafted with AI assistance, then edited, fact-checked and approved by [HUMAN REVIEW: name]. Written by [HUMAN REVIEW: name]. Reviewed by [HUMAN REVIEW: name] on [HUMAN REVIEW: date].*

## Before you start: take a backup

Back up your files and database before you change anything. Most hosts and backup plugins can do this in a few clicks. If you can, make the changes on a staging copy first and keep the live site as it is.

`[HUMAN REVIEW: confirm this step with the tool you used, and name it]`

## How do you measure TTFB, and what is a good number?

Run the page through a speed test and read the TTFB line. Good is 0.8 seconds or less. Poor is more than 1.8 seconds, according to web.dev. Test your home page and one inner page, three times each, and write down the middle result.

Chrome DevTools also shows it. Open the Network tab, click the page request, open Timing and read "Waiting for server response".

> Source: https://web.dev/articles/ttfb, last updated 18 November 2025, read 2026-10-08.

`[HUMAN REVIEW: add your own baseline measurement here: tool, page, location, number, date]`

## How do you tell whether the cause is your site or your host?

Request a plain file from your site, such as an image, and compare its response time with a page. If the image is quick and the page is slow, WordPress is spending its time building the page. If both are slow, look at the server or the network first.

`[HUMAN REVIEW: confirm this test on a real site and record the numbers]`

## Fixes, in order of effort

Work through these in order and measure after each one. Stop when your TTFB is good.

### 1. Turn on page caching

Page caching saves a finished copy of each page so WordPress does not rebuild it for every visitor. Many hosts have it built in. If yours does not, a caching plugin can do the same job. Measure again while logged out, because logged-in visitors often skip the cache.

Check it worked: the page TTFB drops on the second and third request.

`[HUMAN REVIEW: tested? Add before and after numbers and the tool used]`

### 2. Update PHP

A newer supported PHP version usually runs WordPress faster. Check which version your site runs in your hosting panel, and switch to a version your theme and plugins support. Test on staging first, because an old plugin can break on a new version.

Check it worked: your site loads without errors and TTFB is the same or lower.

`[HUMAN REVIEW: tested? Record the PHP versions tried and the result]`

### 3. Remove or replace heavy plugins

Every active plugin adds work to each page build. Deactivate unused plugins and delete them. For the ones you keep, a profiling plugin such as Query Monitor shows which ones run slow database queries. Change one thing at a time and measure after each.

Check it worked: TTFB falls after you remove a specific plugin.

`[HUMAN REVIEW: tested? Add the plugin you removed and the number change]`

### 4. Clean the database

Old post revisions, expired temporary data and spam comments make the database larger and slower to search. Back up first, then remove what you do not need. Do not delete anything you cannot name.

Check it worked: the database is smaller and TTFB is the same or lower.

`[HUMAN REVIEW: tested? Add the size before and after, and the tool used]`

### 5. Add a CDN that caches full pages

A CDN keeps copies of your files in many places, closer to your visitors. A CDN that only serves images and scripts will not change your page TTFB. One that caches the full page can, especially for visitors far from your server.

Check it worked: test from a location far from your server and compare.

`[HUMAN REVIEW: tested? Add the locations and the numbers, and verify the full-page caching claim]`

## When the cause is your host

If cached pages are still slower than 0.8 seconds after the steps above, the server may be the limit. Ask your host three things: how many sites share your server, which PHP version you can use, and whether server-level page caching is on. Moving host is the last step, not the first.

If you want to compare, see our [WordPress hosting plans](/pricing). Our [WordPress hosting page](/wordpress-hosting) explains what we offer.

## When to ask for help

Ask for help if TTFB stays poor after step 4, or if a change breaks your site and you cannot undo it. Send us your site address and the measurements you took, and we will tell you what we see. [Send us your test results](/contact).

## How to keep it fast

- Measure again after every major plugin or theme update.
- Keep PHP on a supported version.
- Keep the plugin list short and remove what you do not use.
- Write down your baseline, so you can see a slow-down early.

## FAQ

### What is a good TTFB for a WordPress site?

Web.dev says a good TTFB is 0.8 seconds or less, and a poor one is more than 1.8 seconds. These are targets for the page request, so measure your real pages, not a blank test page. Your result also depends on where the visitor is, so test from more than one place if your audience is spread out.

### Is TTFB a Core Web Vital?

No. The three Core Web Vitals are Largest Contentful Paint, Interaction to Next Paint and Cumulative Layout Shift. TTFB comes before all of them, so a slow server response makes a good Largest Contentful Paint harder to reach. Treat TTFB as a way to find the cause, not as the goal.

`[HUMAN REVIEW: add a source link and retrieval date for this answer]`

### Does a caching plugin always fix a high TTFB?

No. It helps most when the slow part is building the page. It does little if the server itself is overloaded, if visitors are logged in, or if the page cannot be cached, such as a cart or checkout. Measure before and after so you know whether it helped on your site.

### Will updating PHP lower my TTFB?

Often a little, and sometimes a lot, but it depends on your site. Newer PHP versions run WordPress code faster, yet a slow database or a heavy plugin can still dominate. Update and then measure. If your site breaks, go back to the earlier version and update the plugin that caused the problem.

`[HUMAN REVIEW: add the PHP versions you tested and the numbers]`

### Can I lower TTFB if my host is slow?

You can reduce it with caching and a clean site, but you cannot go below what the server allows. If cached pages are still slow, the host is the limit. Before you move, ask the host the three questions above and compare plans on what each states publicly.

### Why is my TTFB high only on some pages?

Pages that run more database queries or more plugin code take longer to build. Cart, search and account pages are common examples. Compare a slow page with a fast one, then use a profiling plugin to see what the slow page does that the fast one does not.

## Sources

1. web.dev, "Time to First Byte (TTFB)": https://web.dev/articles/ttfb, last updated 18 November 2025, read 2026-10-08.
2. `[HUMAN REVIEW: a second primary source, such as WordPress or PHP documentation, with retrieval date]`

## Open flags (all must clear before review)

- Author, reviewer, review date and author page.
- First-hand tested steps for every fix, with before and after numbers and one real screenshot (the original element).
- WordPress and PHP versions tested, and the test date.
- Second primary source. Source for the Core Web Vitals answer.
- "People also ask" questions from a real search, to check the FAQ against.
- Verify the CDN full-page caching statement.
