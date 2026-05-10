# 深夜小屋 - 深度增强计划

## 优先级排序

| # | 方向 | 工作量 | 优先级 |
|---|------|--------|--------|
| 1 | 道具组合系统 | 中 | ★★★★☆ |
| 2 | 成就徽章系统 | 中 | ★★★★☆ |
| 3 | 章节间联系 | 小 | ★★★★★ |
| 4 | 环境音效 | 小 | ★★★☆☆ |
| 5 | 新谜题类型 | 大 | ★★★☆☆ |

---

## 1. 道具组合系统

### 1.1 数据结构
```javascript
// main.js 新增
const comboRecipes = {
  "candle+matchbox": "litCandle",
  "magnifying+litCandle": "brightLight",
  "oldPen+blankPaper": "finaleChoice"
};

// 在 selectedItem 逻辑中新增组合检测
function tryCombineItems(item1, item2) {
  const combo = [item1, item2].sort().join("+");
  if (comboRecipes[combo]) {
    return comboRecipes[combo];
  }
  return null;
}
```

### 1.2 实现点
- **放大镜 + 蜡烛**（第9关）：组合后显示隐藏文字
- **钢笔 + 纸**（第10关）：直接触发结局选择（已有类似逻辑）
- **火柴 + 蜡烛**（第8关）：点亮煤油灯显示隐藏线索

### 1.3 UI改进
- 背包显示"组合"按钮或自动检测
- 组合成功时显示特效动画

---

## 2. 成就徽章系统

### 2.1 成就列表
```javascript
const achievements = {
  noHint: {
    id: "noHint",
    name: "独自前行",
    desc: "不借助提示通关",
    icon: "🌟"
  },
  speedRun: {
    id: "speedRun",
    name: "速战速决",
    desc: "5分钟内通关",
    icon: "⚡"
  },
  collector: {
    id: "collector",
    name: "收藏家",
    desc: "收集所有故事碎片",
    icon: "💎"
  },
  secretEnding: {
    id: "secretEnding",
    name: "永恒守夜人",
    desc: "达成隐藏结局",
    icon: "✨"
  },
  allDoors: {
    id: "allDoors",
    name: "守夜人",
    desc: "通关全部10关",
    icon: "🌙"
  }
};
```

### 2.2 存储结构
```javascript
// progress 新增
progress.achievements = [];  // 已解锁成就列表
progress.levelTimes = {};    // 每关通关时间
```

### 2.3 UI入口
- 首页显示成就入口（星星图标）
- 点击查看已解锁/未解锁成就

---

## 3. 章节间联系

### 3.1 跨关卡引用
```javascript
// 在 intro/story 中添加引用
level.intro = "桌上的日记本写着：那天下雨，便利店的灯亮着..."; // 第3关引用第1关
level.story = "你想起在照相馆看到的那张照片..."; // 引用第5关
```

### 3.2 具体设计
| 关卡 | 引用前作 | 内容 |
|------|----------|------|
| 3 | 第1关 | 日记提到"那天下雨，便利店的灯" |
| 4 | 第2关 | 便签提到"花房老板娘的故事" |
| 5 | 第1-4关 | 照片按故事出现顺序 |
| 6 | 第3关 | 菜单背面有"卧室灯还亮着" |
| 7 | 第1关 | 退回包裹来自便利店 |
| 8 | 第1-7关 | 所有故事的关键字 |
| 9 | 第1-8关 | 照片墙展示全部记忆 |
| 10 | 第1-9关 | 回到起点，呼应所有故事 |

### 3.3 代码改动
- 每关的 intro/story 加上跨关引用
- 添加 "prequel" 字段标识前作关联

---

## 4. 环境音效

### 4.1 音效列表
```javascript
const sounds = {
  click: "data:audio/wav;base64,...",
  success: "...",
  doorOpen: "...",
  rain: "...",
  ambience: "..."
};
```

### 4.2 实现方式
- 使用 Web Audio API
- 关键音效：点击、成功、失败、通关、结局选择
- 可选：雨声环境音

### 4.3 UI
- 设置中可开关音效
- 使用 localStorage 记住设置

### 4.4 注意
- 使用极短音效（<100KB）或 base64 内嵌
- 或使用 Web Speech API 做简单反馈

---

## 5. 新谜题类型

### 5.1 可添加的新类型
| 类型 | 描述 | 关卡示例 |
|------|------|----------|
| 记忆配对 | 显示图案后隐藏，凭记忆点击顺序 | 新增第11关 |
| 文字推理 | 给出描述，找关键词组合密码 | 第4关改进 |
| 时间线排序 | 将事件按正确时间排列 | 第9关改进 |
| 组合解锁 | 多步操作解开机关 | 新增第12关 |

### 5.2 实现建议
- 新增 levelHandlers 类型
- 复用现有的 hotspot + passwordLocks 系统
- 添加拖拽排序 UI

---

## 实现顺序

1. **章节间联系**（最小改动，最大收益）
2. **成就徽章系统**（独立模块，易于实现）
3. **道具组合系统**（需要修改 handler）
4. **环境音效**（可选功能）
5. **新谜题类型**（需要设计，可后续添加）

---

## 预计代码改动量

| 功能 | main.js | style.css | 其他 |
|------|---------|-----------|------|
| 章节间联系 | ~50行 | 0 | 0 |
| 成就系统 | ~150行 | ~100行 | 0 |
| 道具组合 | ~100行 | ~30行 | 0 |
| 环境音效 | ~80行 | 0 | 音频文件 |
| 新谜题 | ~200行 | ~100行 | 0 |

**总计**：~580行 JS，~230行 CSS