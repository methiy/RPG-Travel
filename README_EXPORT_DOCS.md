# 📚 Data Export Analysis Documents

This directory contains comprehensive documentation for designing and implementing a "data export" feature in the Nuxt 4 Travel RPG application.

## 📄 Documents Included

### 1. **DATA_EXPORT_ANALYSIS.md** (12KB, 462 lines)
**Comprehensive Technical Reference Document**

- **Project Overview**: Architecture, storage model, tech stack
- **Core Data Structures**: GameState, LevelInfo, Task, Medal, Achievement definitions
- **Data Categories**: 
  - Tasks & Achievements (100+ tasks, 40+ achievements)
  - Photos & Timeline (CheckinPhoto structure, timeline composition)
  - Geographic Data (5 continents, 30+ countries, 100+ cities)
  - User Profile Statistics
- **Export Format Considerations**: JSON, CSV, HTML, PDF comparison
- **Implementation Approaches**: Client-side, server-side, hybrid options
- **Data Volume Estimates**: Detailed per-user breakdown (403KB to 6MB)
- **Privacy & Security**: What to include/exclude
- **Key Files Summary**: Quick reference table
- **Export Roadmap**: 3-phase feature development plan

### 2. **DATA_RELATIONSHIPS.txt** (19KB, 299 lines)
**Visual ASCII Diagrams & Reference**

- **Data Structure Relationships**: ASCII flowcharts showing how all data connects
- **User → GameState → Level Info**: Complete hierarchy visualization
- **Tasks Organization**: 100+ tasks by country, nested structure for China
- **Geographic Hierarchy**: Continents → Countries → Cities → Tasks
- **Medals System**: Task vs. Game medals, collection tracking
- **Achievements System**: 40+ achievements by category
- **Timeline Structure**: Photo + Task integration
- **Export Data Candidates**: Tiered importance breakdown
- **Export Format Comparison**: Size, readability, compatibility matrix
- **Storage Estimates**: Per-user breakdown, scalability analysis
- **Server Endpoints**: Existing + proposed API routes

### 3. **EXPORT_FEATURE_QUICK_START.md** (15KB)
**Implementation Quick Reference Guide**

- **What Can Be Exported?**: User-friendly overview
- **Core Data Structures**: TypeScript interfaces with examples
- **Data Volume Reference**: Quick lookup table
- **File Organization**: 3 recommended package structures
- **Implementation Architecture**: Client/server split approach
- **Export Phases**: MVP → Enhancement → Advanced features
- **Key File Locations**: Quick cross-reference
- **Privacy & Security**: Practical checklist
- **Export Dialog UI Mockup**: Chinese UI design concept
- **Implementation Tips**: Common pitfalls + optimizations
- **Testing Checklist**: Validation requirements
- **Example JSON Structure**: Complete, real-world export format

---

## 🎯 How to Use These Documents

### For Planning & Design
1. Start with **EXPORT_FEATURE_QUICK_START.md**
   - Understand scope & data types
   - Review implementation phases
   - Check existing file locations

2. Reference **DATA_EXPORT_ANALYSIS.md**
   - Deep-dive into any data structure
   - Understand storage model
   - Calculate data volumes for your users

3. Use **DATA_RELATIONSHIPS.txt**
   - Visualize how data connects
   - Understand privacy boundaries
   - Plan API endpoints

### For Development
1. Review file locations table in QUICK_START
2. Check data volume estimates in ANALYSIS
3. Implement Phase 1 (JSON + CSV export)
4. Test against checklist in QUICK_START
5. Refer to example JSON structure for export format

### For Architecture Decisions
1. Check "Implementation Approaches" in ANALYSIS (Option C: Hybrid recommended)
2. Review "Implementation Architecture" in QUICK_START
3. Plan server-side API endpoints from RELATIONSHIPS
4. Consider Phase 1-3 timeline

---

## 🔑 Key Findings Summary

### Data to Export
✅ **Tier 1 (Essential)**
- User profile (username, displayName)
- Game state (exp, completed[], medals[])
- Current level & title
- Total statistics

✅ **Tier 2 (Important)**
- Achievement status
- Continental progress
- Difficulty distribution
- Photo metadata
- Task completion details

✅ **Tier 3 (Optional)**
- Photos (base64 or separate files)
- AI analysis results
- Timeline entries

❌ **Tier 4 (Exclude)**
- Server tokens
- Other users' data
- Password info

### Recommended Implementation: Hybrid Approach
- **Client**: JSON, CSV generation (fast, no server load)
- **Server**: Complete aggregation, ZIP generation, async processing
- **Formats**: JSON, CSV, HTML, PDF, ZIP
- **Timeline**: Phase 1 (MVP) → Phase 2 (Enhancement) → Phase 3 (Advanced)

### Data Volumes
- **Casual user** (10 tasks, 5 photos): ~403KB
- **Active user** (50 tasks, 20 photos): ~2MB
- **Power user** (100 tasks, 50 photos): ~6MB
- **Scaling**: 1000 users = ~2GB total (manageable)

### Geographic Scope
- **5 Continents**, **30+ Countries**, **100+ Cities**
- **100+ Tasks** across all locations
- **40+ Achievements** with conditional tracking
- **100+ Medals** (task + game medals)

---

## 📊 Data Structure Cheat Sheet

| Component | Count | Storage | Key Field |
|-----------|-------|---------|-----------|
| Tasks | 100+ | localStorage + DB | `task.id` |
| Medals | 160+ | medals[] array | `medal.id` |
| Achievements | 40+ | computed | `achievement.id` |
| Photos | User-limited | localStorage (max 100) + DB | `photo.taskId` |
| Countries | 30+ | data-only | `country.id` |
| Cities | 100+ | data-only | `city.id` |
| Continents | 5 | data-only | `continent.id` |
| Levels | 8 | computed | `levelInfo.lv` |

---

## 🛠️ Quick Reference: Key Files

```
Frontend:
├─ app/types/index.ts              (Type definitions)
├─ app/composables/useGameState.ts (Core game logic)
├─ app/composables/usePhotoCheckin.ts (Photos management)
├─ app/composables/useAchievements.ts (Achievement tracking)
├─ app/pages/profile.vue           (Stats display)
├─ app/pages/timeline.vue          (Timeline view)
├─ app/pages/photos.vue            (Photo gallery)

Backend:
├─ server/api/progress/**          (Game state sync)
├─ server/api/photos/**            (Photos CRUD)
└─ server/api/[new-export-endpoint]  (To implement)

Data:
├─ app/data/tasks/**/*.ts          (100+ tasks)
├─ app/data/countries.ts           (30+ countries)
├─ app/data/cities.ts              (100+ cities)
├─ app/data/medals.ts              (All medals)
├─ app/data/achievements.ts        (40+ achievements)
└─ app/data/levels.ts              (Level definitions)
```

---

## 📝 Implementation Checklist

- [ ] Phase 1: MVP
  - [ ] Create `useDataExport` composable
  - [ ] Implement JSON export (GameState + profile)
  - [ ] Implement CSV export (tasks + achievements)
  - [ ] Add export button to profile page
  - [ ] Test with various data volumes
  
- [ ] Phase 2: Enhancement
  - [ ] Server-side `/api/export` endpoint
  - [ ] HTML report generation
  - [ ] Photo metadata in export
  - [ ] Multiple format selector UI

- [ ] Phase 3: Advanced
  - [ ] PDF generation (professional report)
  - [ ] ZIP packaging (all data + images)
  - [ ] Import functionality
  - [ ] Scheduled exports
  - [ ] Cloud storage integration

---

## 📞 Questions & Answers

**Q: Should photos include full base64 data?**
A: No. Recommend separate files in ZIP. Use photo metadata in JSON only.

**Q: What's the maximum export size?**
A: ~6MB per user (100 tasks, 50 photos). ZIP compresses to ~2-3MB.

**Q: Can users restore their data by importing?**
A: Phase 3 feature. Phase 1-2 focus on export/viewing only.

**Q: Should we include leaderboard rankings?**
A: No. Include user's own ranking with link to live page instead.

**Q: What timezone should timestamps use?**
A: ISO 8601 UTC (Z suffix). Convert to user's timezone on client.

**Q: How long should exports be valid?**
A: 24-48 hours. Clean up old exports server-side.

**Q: Should exports be encrypted?**
A: Optional for Phase 3. Phase 1-2: no encryption (user owns device).

---

## 🎨 Design Principles

1. **User Privacy First**: Only export user's own data
2. **Multiple Formats**: Options for different use cases (backup, analysis, sharing)
3. **Performance**: Client-side for small exports, server-side for large
4. **Reliability**: Retry logic, clear error messages, timeout handling
5. **Accessibility**: Chinese UI labels, clear instructions, progress feedback
6. **Extensibility**: Design for Phase 1→3 roadmap

---

## 📖 Reading Order Recommendation

1. **Quick overview?** → Read this file + EXPORT_FEATURE_QUICK_START.md
2. **Implementation decision?** → Read all 3 docs, then ANALYSIS section 10
3. **Starting development?** → QUICK_START → ANALYSIS → RELATIONSHIPS
4. **Data validation?** → ANALYSIS section 5 (Profile Statistics)
5. **Privacy review?** → ANALYSIS section 12 + QUICK_START Privacy section

---

**Document Suite Generated**: 2026-04-02  
**Total Documentation**: ~46KB (3 files)  
**Status**: ✅ Complete and Ready for Implementation  
**Next Step**: Review Phase 1 scope in EXPORT_FEATURE_QUICK_START.md

