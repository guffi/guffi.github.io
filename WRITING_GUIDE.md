# Writing Guide

How to write and publish on this site.

---

## Option A: Web Editor (Sveltia CMS)

Visit [guffi.github.io/admin](https://guffi.github.io/admin) and log in with your GitHub account.

The editor lets you:
- Create and edit posts with a rich Markdown editor
- Upload images
- Set title, date, description, tags
- Save drafts or publish immediately

Changes commit directly to the GitHub repo and deploy automatically (takes ~2 minutes).

---

## Option B: Write Markdown Directly

Files live in `content/posts/`. Name them:

```
YYYY-MM-DD-slug-here.md
```

Each file starts with frontmatter:

```yaml
---
title: "Your Essay Title"
date: 2026-03-01T09:00:00+01:00
description: "One-sentence summary for listings."
draft: false
tags: ["energy", "cleantech"]
---
```

---

## Markdown Features

### Footnotes

```markdown
Main text goes here.[^1] And continues here.[^2]

[^1]: This is the first footnote.
[^2]: This is the second footnote.
```

Footnotes appear at the bottom of the article, styled and numbered automatically.

### Pull Quotes / Blockquotes

```markdown
> The question is not whether e-fuels are expensive. The question is whether the cost trajectory justifies investment.
```

Renders as a styled blockquote with a blue left border.

### Images with Captions

```markdown
{{< figure src="/images/uploads/chart.png" caption="Figure 1: Electrolyzer cost trajectories 2020–2040" >}}
```

Upload images via the web editor or place them in `static/images/uploads/`.

### Charts (Plotly)

Since HTML is enabled in Markdown, you can embed interactive Plotly charts:

```html
<div id="my-chart"></div>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<script>
Plotly.newPlot('my-chart', [{
  x: [2024, 2026, 2028, 2030, 2032, 2034],
  y: [800, 650, 500, 380, 290, 230],
  mode: 'lines+markers',
  name: 'Electrolyzer cost (€/kW)'
}], {
  title: 'Electrolyzer Cost Decline',
  xaxis: { title: 'Year' },
  yaxis: { title: '€/kW' }
});
</script>
```

Wrap in a `<div class="chart-container">` for proper responsive behavior.

### Table of Contents

If your article has more than 3 section headings (##), a table of contents automatically appears in the left sidebar on desktop. No action needed.

### Code Blocks

Fenced code blocks with language highlighting:

````markdown
```python
import pandas as pd
df = pd.read_csv('energy_data.csv')
```
````

---

## Google Docs Import (Future)

You can share Google Docs to **guffiopenc@gmail.com** and we can import them into the site. This feature is planned — ask your assistant to convert a Doc when you're ready.

---

## Deployment

Every push to `main` triggers an automatic rebuild via GitHub Actions. The site is live at **https://guffi.github.io** within ~2 minutes.

To check build status: [github.com/guffi/guffi.github.io/actions](https://github.com/guffi/guffi.github.io/actions)
