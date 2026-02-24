---
title: "The Cost of Clean Fuels: Where We Are and Where We're Going"
date: 2026-02-24T10:00:00+01:00
description: "Synthetic fuels made from captured CO₂ and green hydrogen are often dismissed as too expensive. The numbers are changing faster than most people realize."
draft: false
tags: ["cleantech", "e-fuels", "energy"]
---

## The problem with aviation and shipping

If you ask most people which sectors are hardest to decarbonize, they'll say steel, cement, and long-haul transport. They're right. The difficulty isn't political will or investment — it's physics. Batteries are extraordinary for cars and short-haul trucks. For a Boeing 787 crossing the Atlantic, or a container ship from Rotterdam to Singapore, the energy density requirements are brutal. Jet fuel stores roughly 12,000 Wh/kg. The best lithium-ion cells manage around 300 Wh/kg. That's a 40-fold gap that materials science will not close in any policy-relevant timeframe.[^1]

This is why e-fuels — synthetic hydrocarbons made by combining green hydrogen with captured CO₂ — have attracted serious attention. The basic idea is elegant: use renewable electricity to split water into hydrogen and oxygen, combine the hydrogen with CO₂ from direct air capture, and run the resulting syngas through a Fischer-Tropsch process to produce liquid fuels. The output is chemically identical to kerosene or diesel. It works in existing engines, existing pipelines, existing airports. The transition cost is almost entirely upstream.

## The cost problem, stated honestly

The honest version of the cost problem is this: as of 2025, synthetic aviation fuel (SAF from e-fuels) costs somewhere between €3 and €7 per liter to produce, against conventional jet fuel at roughly €0.60–0.80 per liter.[^2] That's a 5–10x premium, which is not a rounding error.

> The question is not whether e-fuels are expensive. They obviously are. The question is whether the cost trajectory justifies continued investment — and whether policy can bridge the gap while the technology matures.

The answer, I think, is yes — but only if you look at the right charts.

## What the learning curves actually say

Every energy technology that has ever achieved mass deployment has followed a Wright's Law learning curve: costs fall by a fixed percentage with each doubling of cumulative production. Solar PV has shown ~20% cost reduction per doubling for four decades. Lithium-ion batteries show ~18%. Electrolyzers, which are the key cost driver for green hydrogen and thus e-fuels, are currently estimated at 15–18% learning rates.[^3]

The chart below shows illustrative cost projections for electrolytic hydrogen under different deployment scenarios. Even in moderate scenarios, costs fall significantly by 2035.

<!-- Plotly chart placeholder -->
<div id="h2-cost-chart" style="width:100%;height:400px;background:var(--code-bg);border:1px solid var(--border);border-radius:6px;display:flex;align-items:center;justify-content:center;margin:2rem 0;">
  <p style="color:var(--text-tertiary);font-family:var(--font-sans);font-size:0.9rem;">
    [Chart: Green hydrogen cost projections 2024–2040 — to be embedded via Plotly]
  </p>
</div>

The math works like this: electrolyzer costs need to reach roughly €300/kW (down from ~€800 today), electricity needs to be consistently below €30/MWh (achievable with dedicated renewables in strong resource locations), and utilization rates need to exceed 4,000 hours/year. At those parameters, green hydrogen lands at roughly €1.50–2.00/kg — and the resulting e-fuel at €1.50–2.50/liter, within range of carbon-priced conventional fuel by the early 2030s.

## What this means for capital allocation

The implication is uncomfortable for anyone who wants clean energy to be simple: the window to build e-fuel infrastructure is probably now, not after costs fall further. Like solar in 2010 or EVs in 2015, the technology is past proof-of-concept but well before commodity pricing. The companies and jurisdictions that move early — and accept early-mover cost penalties — will control supply chains when the market matures.

Iceland is in an interesting position here. Abundant geothermal and hydroelectric power, cold temperatures favorable for electrolysis efficiency, and existing industrial infrastructure. The economics of building electrolysis capacity in Iceland and shipping hydrogen derivatives to European markets are increasingly compelling. It's a place I find myself thinking about often.

More on that in future writing.

---

[^1]: The energy density comparison is for usable energy at the system level. Including motor efficiency, the BEV advantage narrows somewhat, but for aircraft the airframe weight constraints make the comparison even more unfavorable for batteries. See Schafer et al., *Nature Energy*, 2019.

[^2]: Costs vary significantly by region, scale, and renewable electricity price. €3/L represents near-term optimistic; €7/L represents small-scale European production with grid power. Source: IRENA, *Green Hydrogen Cost Reduction*, 2020; BloombergNEF, *Hydrogen Economy Outlook*, 2024.

[^3]: Learning rate estimates for electrolyzers are still uncertain given limited deployment data. The 15–18% range is consistent with analysis by BNEF, IRENA, and the IEA, but real-world rates could be higher or lower depending on manufacturing scale-up dynamics.
