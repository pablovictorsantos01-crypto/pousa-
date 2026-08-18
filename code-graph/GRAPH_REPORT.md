# Graph Report - pousa  (2026-08-18)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 48 nodes · 52 edges · 6 communities (5 shown, 1 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5

## God Nodes (most connected - your core abstractions)
1. `renderListings()` - 5 edges
2. `cardTemplate()` - 3 edges
3. `escapeHtml()` - 3 edges
4. `fetchMe()` - 3 edges
5. `renderNavUser()` - 3 edges
6. `fetchFavorites()` - 2 edges
7. `fetchListings()` - 2 edges
8. `setupChips()` - 2 edges
9. `setupSearch()` - 2 edges
10. `scripts` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (6 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.29
Nodes (11): allListings, cardTemplate(), escapeHtml(), favoriteIds, fetchFavorites(), fetchListings(), fetchMe(), renderListings() (+3 more)

### Community 1 - "Community 1"
Cohesion: 0.20
Nodes (9): author, description, keywords, license, main, name, scripts, test (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.22
Nodes (9): bcryptjs, better-sqlite3, express, express-session, dependencies, bcryptjs, better-sqlite3, express (+1 more)

### Community 3 - "Community 3"
Cohesion: 0.25
Nodes (6): app, bcrypt, db, express, path, session

### Community 5 - "Community 5"
Cohesion: 0.50
Nodes (3): Database, db, path

## Knowledge Gaps
- **25 isolated node(s):** `allListings`, `favoriteIds`, `author`, `description`, `keywords` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Community 2` to `Community 1`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **What connects `allListings`, `favoriteIds`, `author` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._