# 主题切换 + 成就动画强化设计

## 概述

两个独立功能合并为一个 spec：1) 深色/浅色主题切换；2) 全屏成就解锁庆祝动画。

---

## 功能一：主题切换

### 机制

在 `<html>` 标签上切换 `data-theme="light"` 属性。`:root` 定义深色变量（现有），`[data-theme="light"]` 覆盖为浅色变量。

### 浅色配色（Apple 风格纯白清爽）

```
--bg: #ffffff
--bg2: #f5f5f7
--bg3: #e8e8ed
--border: #d2d2d7
--text: #1d1d1f
--muted: #86868b
--accent: #0071e3
--accent2: #7b5ea7
--gold: #e8a800
--green: #28a745
--red: #ff3b30
--theme-primary: #0071e3
--theme-secondary: #7b5ea7
--theme-card-bg: linear-gradient(135deg, #f5f5f7, #ffffff)
```

### 切换入口

Settings 页面新增主题切换开关。

### 持久化

存 localStorage（key: `theme`，值 `dark` 或 `light`）。页面加载时读取并立即应用到 `<html>` 标签，避免闪烁。

### 文件变更

| 文件 | 操作 | 职责 |
|------|------|------|
| `app/composables/useTheme.ts` | 新建 | 主题管理（toggle, isDark, 持久化） |
| `app/app.vue` | 修改 | 添加 `[data-theme="light"]` 变量覆盖 |
| `app/pages/settings.vue` | 修改 | 添加主题切换开关 UI |

### useTheme 接口

```typescript
useTheme() => {
  isDark: Ref<boolean>
  toggle(): void
  init(): void  // 页面加载时调用
}
```

---

## 功能二：成就动画强化

### 触发时机

完成任务获得勋章时（现有 `useAchievement` 触发成就通知的地方）。

### 全屏接管动画流程（约 4 秒）

```
0.0s  背景模糊遮罩淡入（backdrop-filter: blur(10px)，半透明黑色）
0.3s  勋章图标从中心放大弹入（scale 0→1.2→1）+ 金色光晕脉冲
0.6s  光束从勋章中心向四周发射（CSS radial-gradient 动画）
0.8s  Canvas 五彩纸屑粒子爆炸（从顶部洒落）
1.0s  勋章名称 + "解锁成就!" 文字淡入
1.5s  音效播放（短促胜利音效 1-2 秒）
3.5s  整体开始淡出
4.0s  动画结束，恢复正常
```

点击任意位置可提前关闭动画。

### Canvas 粒子系统

- 80-120 个粒子
- 随机颜色：金色(#ffd700)、红色(#ff5555)、蓝色(#4a9eff)、紫色(#7b5ea7)、绿色(#3ddc84)
- 从屏幕顶部中央区域抛出，重力下落 + 随机水平速度 + 随机旋转
- 粒子形状：方块 + 圆形混合
- 粒子随下落逐渐变透明（alpha 衰减）

### 音效

使用一个短促的胜利音效文件 `public/sounds/achievement.mp3`（1-2 秒），在动画 1.5s 时播放。需要找一个免费音效或生成一个简单的音效文件。

### 文件变更

| 文件 | 操作 | 职责 |
|------|------|------|
| `app/components/AchievementCelebration.vue` | 新建 | 全屏动画组件（CSS + Canvas 粒子） |
| `app/composables/useCelebration.ts` | 新建 | 动画触发控制 + 音效播放 |
| `public/sounds/achievement.mp3` | 新建 | 胜利音效文件 |
| `app/layouts/default.vue` | 修改 | 挂载全局动画组件 |
| `app/composables/useAchievement.ts` | 修改 | 在成就触发时调用 celebration |

### useCelebration 接口

```typescript
useCelebration() => {
  show: Ref<boolean>
  medalIcon: Ref<string>
  medalName: Ref<string>
  celebrate(icon: string, name: string): void
  dismiss(): void
}
```

### AchievementCelebration 组件结构

```
<div class="celebration-overlay" v-if="show" @click="dismiss">
  <canvas ref="confettiCanvas" />        ← 粒子层
  <div class="light-rays" />              ← CSS 光束
  <div class="medal-container">
    <div class="medal-glow" />            ← 金色光晕
    <div class="medal-icon">{{ icon }}</div>
    <div class="medal-text">解锁成就!</div>
    <div class="medal-name">{{ name }}</div>
  </div>
</div>
```
