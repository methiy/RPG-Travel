# Data Export Feature - Quick Start Guide

## 📊 What Can Be Exported?

### Core User Data
- **Game Progress**: EXP, Level, Titles, Completed Tasks, Medals
- **Geographic Stats**: Countries/Cities/Continents visited, progress by difficulty
- **Achievements**: 40+ achievements with unlock status
- **Photos**: Check-in photos with timestamps, location, comments
- **Timeline**: Chronological record of all travel activities

### Exportable Formats
✅ **JSON** - Most complete, best for import/restore  
✅ **CSV** - Spreadsheet-friendly, good for analysis  
✅ **HTML** - Beautiful readable report, shareable  
✅ **PDF** - Professional-looking, print-ready  
✅ **ZIP** - Complete package with all data + images  

---

## 🎮 Key Data Structures to Export

### 1. GameState (最核心)
```typescript
{
  exp: 2500,                          // Total experience
  completed: ["task-1", "task-5", ...], // 50 tasks
  medals: ["medal-1", "medal-2", ...],  // 20 medals
}
```

### 2. Profile Summary
```typescript
{
  username: "wanderer",
  displayName: "世界行者",
  level: 5,
  levelTitle: "传奇旅行家",
  avatar: "👑",
  stats: {
    tasksCompleted: 50,
    totalTasks: 100+,
    medalCount: 20,
    countriesVisited: 12,
    citiesVisited: 45,
    continentProgress: [ /* 5 continents */ ]
  }
}
```

### 3. Task Completions
```typescript
[
  {
    taskId: "task-tokyo-senso-ji",
    taskName: "浅草寺 - 感受古都风韵",
    country: "日本",
    city: "东京",
    difficulty: "easy",
    expEarned: 50,
    medalEarned: "medal-tokyo",
    dateCompleted: "2024-03-15T10:30:00Z"
  },
  // ... more tasks
]
```

### 4. Achievements
```typescript
{
  total: 42,
  unlocked: 18,
  byCategory: {
    explorer: 10,      // Location-based
    collector: 3,      // Medal collection
    challenge: 4,      // Difficulty/EXP
    social: 1          // Photos
  },
  achievements: [
    {
      id: "ach-first-step",
      name: "第一步",
      icon: "👣",
      unlocked: true,
      progress: 100
    },
    // ... more
  ]
}
```

### 5. Photos & Timeline
```typescript
{
  photoCount: 20,
  photos: [
    {
      taskId: "task-tokyo-senso-ji",
      taskName: "浅草寺",
      location: "日本 · 东京",
      timestamp: "2024-03-15T10:30:00Z",
      coordinates: { lat: 35.7148, lng: 139.7967 },
      comment: "古老的寺庙，光线很好",
      image: "base64..." // or separate file
    },
    // ... more photos
  ]
}
```

---

## 🔍 Data Volume Reference

| User Type | Game State | Metadata | Photos | **Total** |
|-----------|-----------|----------|--------|----------|
| Casual (10 tasks, 5 photos) | 0.5KB | 2KB | 400KB | **403KB** |
| Active (50 tasks, 20 photos) | 2KB | 5KB | 2MB | **2MB** |
| Power (100 tasks, 50 photos) | 4KB | 10KB | 6MB | **6MB** |

---

## 📁 File Organization for Export

### Option 1: Single JSON File
```
user-travel-export-2026-04-02.json
```

### Option 2: ZIP Package (Recommended)
```
user-travel-export-2026-04-02.zip
├── profile.json          // User & stats summary
├── progress.json         // GameState + achievements
├── tasks.json           // Completed tasks with details
├── timeline.json        // Timeline entries (metadata only)
├── photos/
│   ├── photo-001.jpg
│   ├── photo-002.jpg
│   └── ...
└── README.txt           // Export info & timestamps
```

### Option 3: CSV Files
```
user-travel-export-2026-04-02.zip
├── profile.csv          // User summary
├── tasks-completed.csv  // Task list with details
├── achievements.csv     // Achievement status
├── photos.csv          // Photo metadata (timestamps, locations, comments)
└── README.txt
```

---

## 🛠️ Implementation Architecture

### Recommended: Hybrid Approach

#### Client-Side (useDataExport composable)
```typescript
export function useDataExport() {
  // Generate JSON from client state
  async function exportAsJSON() { }
  
  // Generate CSV from client data
  async function exportAsCSV() { }
  
  // Trigger server-side export
  async function requestServerExport() { }
}
```

#### Server-Side (new API endpoint)
```typescript
// POST /api/export
// Returns: { exportId, status, downloadUrl }

// GET /api/export/[id]
// Returns: ZIP file with all data

// GET /api/export/status/[id]
// Returns: { status, progress, error }
```

---

## 🎯 Export Feature Phases

### Phase 1: MVP (Essential)
- [ ] JSON export (GameState + profile + tasks)
- [ ] CSV export (task list, achievements)
- [ ] Client-side only (no server processing)
- [ ] "Download" button on profile page

### Phase 2: Enhancement
- [ ] HTML report (beautiful summary)
- [ ] Photo metadata export
- [ ] Server-side JSON aggregation
- [ ] Multiple format options

### Phase 3: Advanced
- [ ] PDF generation (professional report)
- [ ] ZIP with all data + images
- [ ] Import functionality
- [ ] Scheduled exports
- [ ] Cloud storage integration (Google Drive, OneDrive)

---

## 📍 Key File Locations

| Component | File |
|-----------|------|
| Type Definitions | `app/types/index.ts` |
| Game State Composable | `app/composables/useGameState.ts` |
| Photos Composable | `app/composables/usePhotoCheckin.ts` |
| Achievements Composable | `app/composables/useAchievements.ts` |
| Profile Page | `app/pages/profile.vue` |
| Timeline Page | `app/pages/timeline.vue` |
| Photos Page | `app/pages/photos.vue` |
| Medals Data | `app/data/medals.ts` |
| Achievements Data | `app/data/achievements.ts` |
| Tasks Data | `app/data/tasks/**/*.ts` |
| Progress API | `server/api/progress/**` |
| Photos API | `server/api/photos/**` |

---

## 🔐 Privacy & Security

✅ **Safe to Export**
- User's own game progress
- User's own photos & metadata
- User's own statistics

❌ **DO NOT Export**
- Other users' data
- Authentication tokens
- Password hashes
- Server internal IDs (use taskId instead)

---

## 📋 Export Dialog UI Mockup

```
╔═══════════════════════════════════════╗
║  📊 导出我的数据 (Export My Data)     ║
╠═══════════════════════════════════════╣
║                                       ║
║  选择导出格式：                        ║
║  ○ JSON (最全面)                     ║
║  ○ CSV (最兼容)                      ║
║  ○ HTML (最可读)                     ║
║  ○ PDF (最专业)                      ║
║  ○ ZIP (完整包)                      ║
║                                       ║
║  包含内容：                            ║
║  ☑ 游戏进度数据                        ║
║  ☑ 成就信息                          ║
║  ☑ 照片和评论 (可选)                  ║
║  ☑ 完整时间线                        ║
║                                       ║
║  [取消] [开始导出]                    ║
╚═══════════════════════════════════════╝

导出中... ████████░░ 80%
或
✓ 导出完成！ [下载文件]
```

---

## 💡 Implementation Tips

### Avoid These Common Issues
1. **Don't include base64 images in JSON** → Export as separate files in ZIP
2. **Don't export large photos uncompressed** → JPEG at 0.7 quality is already done
3. **Don't block UI during export** → Use server-side processing or web workers
4. **Don't store auth tokens in export** → Only export user-accessible data
5. **Don't forget timestamps** → Important for timeline reconstruction

### Performance Optimizations
- Server generates exports async, stores temporarily
- Client can download CSV/JSON immediately
- ZIP packaging for images happens server-side
- Implement export retry logic (failed downloads)
- Clean up old export files after 24 hours

---

## 🧪 Testing Checklist

- [ ] Export includes all completed tasks
- [ ] Export includes all earned medals
- [ ] Photos metadata is accurate (timestamps, locations)
- [ ] Achievement status is correct
- [ ] Difficulty distribution matches profile
- [ ] Continental progress calculation is accurate
- [ ] Timestamps are in correct timezone
- [ ] File downloads work reliably
- [ ] Large exports (100+ photos) work
- [ ] Privacy: no other users' data in export

---

## 🎨 Example Export JSON Structure

```json
{
  "exportVersion": 1,
  "exportedAt": "2026-04-02T10:30:45Z",
  "expiresAt": "2026-04-03T10:30:45Z",
  
  "user": {
    "id": 123,
    "username": "wanderer",
    "displayName": "世界行者"
  },
  
  "gameProgress": {
    "exp": 2500,
    "level": 5,
    "levelTitle": "传奇旅行家",
    "avatar": "👑",
    "completedTasksCount": 50,
    "totalTasksCount": 120
  },
  
  "medals": {
    "count": 20,
    "totalAvailable": 160,
    "earned": ["medal-1", "medal-2", ...]
  },
  
  "achievements": {
    "unlocked": 18,
    "total": 42,
    "categories": { ... }
  },
  
  "geography": {
    "countriesVisited": 12,
    "citiesVisited": 45,
    "continentProgress": [ ... ]
  },
  
  "completedTasks": [
    {
      "taskId": "task-xxx",
      "taskName": "...",
      "country": "...",
      "city": "...",
      "difficulty": "easy",
      "expEarned": 50,
      "dateCompleted": "2026-03-15T10:30:00Z"
    }
  ],
  
  "photos": [
    {
      "taskId": "task-xxx",
      "timestamp": "2026-03-15T10:30:00Z",
      "lat": 35.7148,
      "lng": 139.7967,
      "comment": "..."
    }
  ],
  
  "statistics": {
    "difficultyDistribution": { ... },
    "continentProgress": [ ... ]
  }
}
```

---

**Last Updated**: 2026-04-02  
**Document Version**: 1.0  
**Status**: Ready for Feature Development
