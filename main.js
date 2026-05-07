const STORAGE_KEY = "midnight-cabin-progress-v1";

const inventoryConfig = {
  scissors: { id: "scissors", label: "剪刀", icon: "✂️" },
  whiteFlower: { id: "whiteFlower", label: "白花", icon: "🤍" },
  pinkFlower: { id: "pinkFlower", label: "粉花", icon: "🌸" },
  blueFlower: { id: "blueFlower", label: "蓝花", icon: "💙" },
  key: { id: "key", label: "钥匙", icon: "🗝️" }
};

// 关卡配置集中在 levels。新增关卡时优先补 objects、hints、passwordLocks，再写少量 custom handler。
const levels = [
  {
    id: 1,
    title: "深夜便利店",
    icon: "🏪",
    intro: "凌晨 2:17，一家还亮着灯的便利店。外面下着雨，门口的自动门忽然锁住了。",
    goal: "打开后门电子锁。",
    sceneClass: "scene-store",
    handler: "store",
    story: "后门打开的一瞬间，雨声变得清楚。你回头看见收银台上的小票慢慢摊开，上面写着：谢谢你替我关上这家店。",
    successText: "你把路线和数字连起来了。锁芯轻轻响了一声，像是认可了你的推理。",
    hints: [
      "密码不是散落的数字，而是某个人走过的路线。",
      "注意最后一位客人经过了哪些地方。",
      "按冷柜、货架、雨伞架、收银台的顺序整理数字。"
    ],
    details: [
      { text: "雨滴敲着玻璃门", x: 10, y: 12 },
      { text: "02:17 的灯还亮着", x: 52, y: 18 },
      { text: "后门锁在微微发光", x: 10, y: 84 }
    ],
    objects: [
      { id: "receipt", label: "小票", icon: "🧾", x: 28, y: 54 },
      { id: "sensor", label: "感应器", icon: "🚶", x: 22, y: 24 },
      { id: "freezer", label: "冰柜", icon: "🧊", x: 74, y: 55 },
      { id: "shelf", label: "货架", icon: "🥫", x: 58, y: 35 },
      { id: "umbrella", label: "雨伞架", icon: "☂️", x: 46, y: 72 },
      { id: "cashier", label: "收银台", icon: "💳", x: 78, y: 74 },
      { id: "backDoor", label: "后门锁", icon: "🔐", x: 18, y: 70 }
    ],
    passwordLocks: {
      backDoor: { password: "3582", fail: "电子锁低低闪了一下，顺序还没有对上。" }
    }
  },
  {
    id: 2,
    title: "雨中花房",
    icon: "🌿",
    intro: "雨声落在玻璃顶上，花房里有一只空花瓶。门锁上写着：让枯萎的花重新开一次。",
    goal: "打开花房玻璃门。",
    sceneClass: "scene-greenhouse",
    handler: "greenhouse",
    story: "三朵花在雨声里慢慢展开。玻璃门上的雾气散开，露出一句话：有些等待，并不是没有结果。",
    successText: "这一次，不是你撞对了答案。你让花按故事里的顺序重新开了一次。",
    hints: [
      "先找到能处理枯枝的工具。",
      "枯枝后面的句子不是装饰，它在描述顺序。",
      "把雨停、天亮、回来对应到蓝、白、粉。"
    ],
    details: [
      { text: "玻璃顶覆着细雨", x: 12, y: 12 },
      { text: "日历页潮潮的", x: 54, y: 18 },
      { text: "花瓶在等一个顺序", x: 8, y: 82 }
    ],
    objects: [
      { id: "pot", label: "花盆", icon: "🪴", x: 20, y: 66 },
      { id: "branches", label: "枯枝", icon: "🍂", x: 46, y: 36 },
      { id: "calendar", label: "日历", icon: "📅", x: 24, y: 28 },
      { id: "flowerCard", label: "花语卡", icon: "🏷️", x: 72, y: 28 },
      { id: "blueFlower", label: "蓝花", icon: "💙", x: 76, y: 50 },
      { id: "whiteFlower", label: "白花", icon: "🤍", x: 20, y: 48 },
      { id: "pinkFlower", label: "粉花", icon: "🌸", x: 70, y: 68 },
      { id: "vase", label: "花瓶", icon: "🏺", x: 48, y: 68 },
      { id: "glassDoor", label: "玻璃门", icon: "🚪", x: 48, y: 18 }
    ]
  },
  {
    id: 3,
    title: "锁住的卧室",
    icon: "🛏️",
    intro: "房间很整洁，整洁得有些不自然。桌上有一本没有写完的日记，门边的抽屉上有一把密码锁。",
    goal: "打开抽屉，获得钥匙，再开门。",
    sceneClass: "scene-bedroom",
    handler: "bedroom",
    story: "门开了，风从走廊吹进来。日记本翻到最后一页，上面写着：谢谢你替我把那盏灯打开。",
    successText: "房间安静下来，仿佛终于被理解。抽屉把钥匙交给了你。",
    hints: [
      "日记里的页码不是普通页码。",
      "灯亮之后，相框和照片才会给出更明确的证据。",
      "第 4 页和第 16 页可以组合成四位数字。"
    ],
    details: [
      { text: "床单被叠得很整齐", x: 10, y: 16 },
      { text: "灯罩落着温柔的光", x: 50, y: 15 },
      { text: "音乐盒停在桌角", x: 12, y: 84 }
    ],
    objects: [
      { id: "diary", label: "日记", icon: "📓", x: 25, y: 56 },
      { id: "lamp", label: "床头灯", icon: "💡", x: 70, y: 40 },
      { id: "frame", label: "相框", icon: "🖼️", x: 45, y: 30 },
      { id: "musicBox", label: "音乐盒", icon: "🎵", x: 72, y: 70 },
      { id: "drawer", label: "抽屉", icon: "🗄️", x: 28, y: 72 },
      { id: "door", label: "房门", icon: "🚪", x: 74, y: 56 }
    ],
    passwordLocks: {
      drawer: { password: "0416", fail: "锁芯没有反应，数字之间还少了一点联系。" }
    }
  },
  {
    id: 4,
    title: "无人书店",
    icon: "📚",
    intro: "凌晨的旧书店没有店员，柜台上放着一本借阅登记册。门口的卷帘门被锁住，旁边有一个四位数字锁。",
    goal: "找到卷帘门密码，离开书店。",
    sceneClass: "scene-bookstore",
    handler: "bookstore",
    story: "卷帘门缓缓升起，风吹动柜台上的登记册。最后一行多了一句话：有些故事，读完才算离开。",
    successText: "你没有被书名带走，而是找到了归还顺序。门锁轻轻松开了。",
    hints: [
      "门锁要的不是书名，也不是分类名称。",
      "登记册写的是归还顺序，分类牌告诉你字母属于哪个书架。",
      "按 A-3、C-1、B-4、D-2 取空位数字。"
    ],
    details: [
      { text: "旧纸页有温热的灰尘味", x: 9, y: 14 },
      { text: "分类牌挂得很整齐", x: 48, y: 18 },
      { text: "卷帘门锁着一串数字", x: 10, y: 84 }
    ],
    objects: [
      { id: "register", label: "登记册", icon: "📖", x: 24, y: 60 },
      { id: "category", label: "分类牌", icon: "🔖", x: 68, y: 26 },
      { id: "fiction", label: "小说架", icon: "📕", x: 20, y: 32 },
      { id: "life", label: "生活架", icon: "📗", x: 70, y: 44 },
      { id: "plant", label: "植物架", icon: "📘", x: 44, y: 34 },
      { id: "travel", label: "旅行架", icon: "📙", x: 78, y: 66 },
      { id: "counterNote", label: "便签", icon: "📝", x: 42, y: 72 },
      { id: "shutterLock", label: "卷帘门锁", icon: "🔐", x: 20, y: 78 }
    ],
    passwordLocks: {
      shutterLock: { password: "3142", fail: "锁面没有亮起。也许门锁不认书名，只认顺序。" }
    }
  },
  {
    id: 5,
    title: "旧照相馆",
    icon: "📷",
    intro: "墙上挂满了没有人脸的照片，暗房门口有一把密码锁。红色安全灯轻轻闪烁。",
    goal: "打开暗房门。",
    sceneClass: "scene-studio",
    handler: "studio",
    story: "暗房门打开，红色灯光慢慢熄灭。照片上的空白位置，终于显出一个模糊的背影。",
    successText: "你没有按时间排序，而是按故事把照片放回了它们的位置。",
    hints: [
      "照片上的时间会误导你，先看相框背面。",
      "显影液标签在提示前几关的故事顺序。",
      "照片编号按故事出现：便利店、花瓶、早餐桌、雨伞。"
    ],
    details: [
      { text: "红色安全灯轻轻闪烁", x: 10, y: 13 },
      { text: "照片里的人脸都是空白", x: 46, y: 18 },
      { text: "暗房门后很安静", x: 14, y: 84 }
    ],
    objects: [
      { id: "photos", label: "墙上照片", icon: "🖼️", x: 24, y: 34 },
      { id: "frameBack", label: "相框背面", icon: "🔍", x: 70, y: 32 },
      { id: "developer", label: "显影液", icon: "🧪", x: 28, y: 68 },
      { id: "darkroomDoor", label: "暗房门", icon: "🚪", x: 72, y: 68 }
    ],
    passwordLocks: {
      darkroomDoor: { password: "2143", fail: "红灯闪了一下。你也许又按成了时间顺序。" }
    }
  }
];

const app = document.querySelector("#app");
const modal = document.querySelector("#modal");
const modalEyebrow = document.querySelector("#modal-eyebrow");
const modalTitle = document.querySelector("#modal-title");
const modalText = document.querySelector("#modal-text");
const modalExtra = document.querySelector("#modal-extra");
const modalActions = document.querySelector("#modal-actions");

let progress = normalizeProgress(loadProgress());
let currentLevel = null;
let selectedItem = null;
let inventory = [];
let levelState = {};
let toastTimer = null;

function loadProgress() {
  const fallback = { unlockedLevel: 1, completed: [], runs: {} };
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch (error) {
    return fallback;
  }
}

function normalizeProgress(raw) {
  const completed = Array.isArray(raw.completed) ? raw.completed.filter((id) => id <= levels.length) : [];
  const nextUnlocked = completed.length ? Math.min(Math.max(...completed) + 1, levels.length) : 1;
  const runs = raw.runs && typeof raw.runs === "object" ? raw.runs : {};
  return {
    unlockedLevel: Math.max(Math.min(raw.unlockedLevel || 1, levels.length), nextUnlocked),
    completed,
    runs
  };
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function getDefaultRunState() {
  return {
    selectedItem: null,
    inventory: [],
    levelState: { notes: [], hintIndex: 0 }
  };
}

function resetRunState() {
  const run = getDefaultRunState();
  selectedItem = run.selectedItem;
  inventory = run.inventory;
  levelState = run.levelState;
}

function loadRunState(levelId) {
  const saved = progress.runs?.[levelId];
  if (!saved) {
    resetRunState();
    return;
  }
  inventory = Array.isArray(saved.inventory) ? [...saved.inventory] : [];
  selectedItem = inventory.includes(saved.selectedItem) ? saved.selectedItem : null;
  levelState = saved.levelState && typeof saved.levelState === "object"
    ? { notes: [], hintIndex: 0, ...saved.levelState }
    : { notes: [], hintIndex: 0 };
  if (!Array.isArray(levelState.notes)) levelState.notes = [];
  if (typeof levelState.hintIndex !== "number") levelState.hintIndex = 0;
}

function saveRunSnapshot() {
  if (!currentLevel) return;
  progress.runs = progress.runs || {};
  progress.runs[currentLevel.id] = {
    selectedItem,
    inventory: [...inventory],
    levelState: JSON.parse(JSON.stringify(levelState))
  };
  saveProgress();
}

function clearRunSnapshot(levelId) {
  if (!progress.runs) return;
  delete progress.runs[levelId];
}

function hasProgress() {
  return progress.unlockedLevel > 1 || progress.completed.length > 0 || Object.keys(progress.runs || {}).length > 0;
}

function renderHome() {
  currentLevel = null;
  resetRunState();
  app.innerHTML = `
    <section class="screen home">
      <div class="hero-scene">
        <div class="rain"></div>
        <div class="moon"></div>
        <div class="home-copy">
          <p class="eyebrow">微信小游戏 MVP</p>
          <h1>深夜小屋</h1>
          <p class="tagline">每一扇门后，都有一个没说完的故事。</p>
          <div class="hero-badges">
            <span>找物</span>
            <span>逻辑推理</span>
            <span>治愈故事</span>
          </div>
        </div>
        <div class="home-note">今晚的雨声，把第一扇门留给了你。</div>
        <div class="cabin" aria-hidden="true">
          <div class="cabin-roof"></div>
          <div class="cabin-body">
            <span class="cabin-window"></span>
            <span class="cabin-door"></span>
          </div>
        </div>
      </div>
      <div class="home-actions">
        <button class="primary-btn" data-action="start">开始游戏</button>
        ${hasProgress() ? '<button class="secondary-btn" data-action="continue">继续游戏</button>' : ""}
        <button class="ghost-btn" data-action="reset">重新开始</button>
      </div>
    </section>
  `;
}

function renderLevelSelect() {
  currentLevel = null;
  resetRunState();
  app.innerHTML = `
    <section class="screen">
      <header class="screen-header">
        <div class="screen-title">
          <h2>选择一扇门</h2>
          <p>已解锁的故事可以进入探索。</p>
        </div>
        <button class="small-icon-btn" data-action="home" aria-label="返回首页">⌂</button>
      </header>
      <div class="level-list">
        ${levels.map(renderLevelCard).join("")}
      </div>
    </section>
  `;
}

function renderLevelCard(level) {
  const unlocked = level.id <= progress.unlockedLevel;
  const complete = progress.completed.includes(level.id);
  return `
    <button class="level-card level-card-${level.id} ${unlocked ? "" : "locked"}" data-level="${level.id}" ${unlocked ? "" : "disabled"}>
      <span class="level-glow"></span>
      <span class="level-icon">${unlocked ? level.icon : "🔒"}</span>
      <span>
        <h3>第 ${level.id} 关：${level.title}</h3>
        <p>${level.goal}</p>
      </span>
      <span class="level-state">${complete ? "已完成" : unlocked ? "进入" : "锁定"}</span>
    </button>
  `;
}

function startLevel(levelId) {
  currentLevel = levels.find((level) => level.id === levelId);
  loadRunState(levelId);
  addNote("当前目标", currentLevel.goal, true);
  renderGame();
  showModal({
    eyebrow: `第 ${currentLevel.id} 关`,
    title: currentLevel.title,
    text: currentLevel.intro,
    actions: [{ label: "开始探索", className: "primary-btn", onClick: closeModal }]
  });
}

function renderGame() {
  saveRunSnapshot();
  app.innerHTML = `
    <section class="screen game-screen">
      <header class="game-header">
        <div class="game-title">
          <h2>${currentLevel.title}</h2>
          <p>${currentLevel.goal}</p>
        </div>
        <div class="game-tools">
          <button class="small-icon-btn" data-action="notes" aria-label="线索笔记">✎</button>
          <button class="small-icon-btn" data-action="levels" aria-label="返回关卡选择">↩</button>
        </div>
      </header>
      <div class="scene-card ${currentLevel.sceneClass}">
        <div class="scene-visual">
          <div class="rain"></div>
          <div class="scene-light"></div>
          <div class="scene-floor"></div>
          ${renderSceneDetails()}
        </div>
        ${currentLevel.objects.map(renderSceneObject).join("")}
      </div>
      <button class="hint-btn" data-action="hint" aria-label="提示">?</button>
      ${renderInventory()}
    </section>
  `;
}

function renderSceneDetails() {
  return currentLevel.details.map((detail) => (
    `<span class="scene-detail" style="left:${detail.x}%;top:${detail.y}%">${detail.text}</span>`
  )).join("");
}

function renderSceneObject(object) {
  const used = levelState[object.id] ? "used" : "";
  return `
    <button class="item-hit ${used}" data-object="${object.id}" style="left:${object.x}%;top:${object.y}%">
      <span class="item-emoji">${object.icon}</span>
      <span class="item-label">${object.label}</span>
    </button>
  `;
}

function renderInventory() {
  return `
    <aside class="inventory">
      <div class="inventory-head">
        <span class="bag-title">背包</span>
        <span>${selectedItem ? `已选中：${inventoryConfig[selectedItem].label}` : "点击道具选中"}</span>
      </div>
      <div class="inventory-list">
        ${inventory.length ? inventory.map(renderInventoryItem).join("") : '<div class="inventory-empty">还没有获得道具</div>'}
      </div>
    </aside>
  `;
}

function renderInventoryItem(id) {
  const item = inventoryConfig[id];
  return `
    <button class="inventory-item ${selectedItem === id ? "selected" : ""}" data-inventory="${id}">
      <span class="item-emoji">${item.icon}</span>
      <span class="item-label">${item.label}</span>
    </button>
  `;
}

function handleSceneObject(objectId) {
  const handler = levelHandlers[currentLevel.handler];
  handler?.(objectId);
}

function addNote(title, text, silent = false) {
  if (!levelState.notes.some((note) => note.title === title)) {
    levelState.notes.push({ title, text });
    saveRunSnapshot();
    if (!silent) showToast("线索已加入笔记。");
  }
}

function showNotes() {
  const notes = levelState.notes.length ? levelState.notes : [{ title: "还没有线索", text: "先观察场景里的物品。" }];
  const list = notes.map((note) => `
    <li>
      <strong>${note.title}</strong>
      <span>${note.text}</span>
    </li>
  `).join("");
  showModal({
    eyebrow: "线索笔记",
    title: currentLevel.title,
    text: "已知信息会留在这里，方便你把线索连起来。",
    extra: `<ul class="note-list">${list}</ul>`,
    actions: [{ label: "继续推理", className: "primary-btn", onClick: closeModal }]
  });
}

function showLayeredHint() {
  const hintIndex = Math.min(levelState.hintIndex, currentLevel.hints.length - 1);
  levelState.hintIndex = Math.min(levelState.hintIndex + 1, currentLevel.hints.length);
  saveRunSnapshot();
  showModal({
    eyebrow: `提示 ${hintIndex + 1} / ${currentLevel.hints.length}`,
    title: "别急，线索已经在房间里",
    text: currentLevel.hints[hintIndex],
    actions: [{ label: "我再想想", className: "primary-btn", onClick: closeModal }]
  });
}

function showClue(title, text, note) {
  if (note) addNote(note.title, note.text);
  showModal({
    eyebrow: "你发现了一点异常",
    title,
    text,
    actions: [{ label: "记下了", className: "primary-btn", onClick: closeModal }]
  });
}

function showPasswordModal(lockId) {
  const object = currentLevel.objects.find((entry) => entry.id === lockId);
  const lock = currentLevel.passwordLocks[lockId];
  showModal({
    eyebrow: "锁面泛着微光",
    title: object.label,
    text: "请输入四位密码。答案应该来自已经连起来的线索。",
    extra: '<input id="password-input" class="password-input" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="----">',
    actions: [
      { label: "确认", className: "primary-btn", onClick: () => checkPassword(lockId, lock) },
      { label: "取消", className: "secondary-btn", onClick: closeModal }
    ]
  });
  setTimeout(() => document.querySelector("#password-input")?.focus(), 80);
}

function checkPassword(lockId, lock) {
  const input = document.querySelector("#password-input");
  if (!input || input.value !== lock.password) {
    showToast(lock.fail);
    return;
  }
  closeModal();
  levelHandlers[currentLevel.handler]?.(`${lockId}:success`);
}

function addItem(id, message) {
  if (!inventory.includes(id)) {
    inventory.push(id);
    saveRunSnapshot();
    showToast(message);
  } else {
    showToast("这个道具已经在背包里了。");
  }
}

function removeItem(id) {
  inventory = inventory.filter((item) => item !== id);
  saveRunSnapshot();
}

function returnItems(ids) {
  ids.forEach((id) => {
    if (!inventory.includes(id)) inventory.push(id);
  });
  saveRunSnapshot();
}

function selectInventoryItem(id) {
  selectedItem = selectedItem === id ? null : id;
  saveRunSnapshot();
  renderGame();
}

function completeLevel(levelId) {
  if (!progress.completed.includes(levelId)) {
    progress.completed.push(levelId);
  }
  progress.unlockedLevel = Math.max(progress.unlockedLevel, Math.min(levelId + 1, levels.length));
  clearRunSnapshot(levelId);
  saveProgress();

  showModal({
    eyebrow: "推理完成",
    title: currentLevel.title,
    text: `${currentLevel.successText}\n\n${currentLevel.story}`,
    extra: '<p class="share-tip">可以停在这一刻截图，分享你刚打开的这扇门。</p>',
    actions: [
      {
        label: levelId < levels.length ? "进入下一关" : "回到关卡选择",
        className: "primary-btn",
        onClick: () => {
          closeModal();
          levelId < levels.length ? startLevel(levelId + 1) : renderLevelSelect();
        }
      },
      { label: "关卡选择", className: "secondary-btn", onClick: () => { closeModal(); renderLevelSelect(); } }
    ]
  });
}

const levelHandlers = {
  store(objectId) {
    if (objectId === "backDoor:success") {
      completeLevel(1);
      return;
    }
    const clues = {
      receipt: {
        title: "小票",
        text: "小票上写着 02:17。背面还有一行字：最后一位客人的路线：进门、冷柜、货架、雨伞架、收银台。",
        note: { title: "小票时间", text: "02:17；背面记录了最后一位客人的行动路线。" }
      },
      sensor: {
        title: "门口感应器",
        text: "感应器记录了最后一位客人的进店路线：冷柜 → 货架 → 雨伞架 → 收银台。",
        note: { title: "路线顺序", text: "冷柜 → 货架 → 雨伞架 → 收银台。" }
      },
      freezer: {
        title: "冰柜",
        text: "第 2 层第 3 格是空的。第 2 层像是区域，真正缺掉的是第 3 格。",
        note: { title: "冰柜空位", text: "第 2 层第 3 格，关键数字是 3。" }
      },
      shelf: {
        title: "货架",
        text: "5 号商品被拿走了，标签下面留下一个很浅的方形印子。",
        note: { title: "货架空位", text: "被拿走的是 5 号商品。" }
      },
      umbrella: {
        title: "雨伞架",
        text: "只剩下编号 8 的伞，伞柄还带着一点雨水。",
        note: { title: "雨伞标签", text: "剩下的伞编号是 8。" }
      },
      cashier: {
        title: "收银台",
        text: "今日收银次数停在第 2 次。屏幕角落写着：按店内动线排列。",
        note: { title: "收银台提示", text: "收银次数是 2；密码要按最后一位客人的店内动线排列。" }
      }
    };
    if (objectId === "backDoor") {
      addNote("后门锁提示", "密码来自最后一位客人的行动顺序。");
      showPasswordModal("backDoor");
      return;
    }
    showClue(clues[objectId].title, clues[objectId].text, clues[objectId].note);
  },

  greenhouse(objectId) {
    if (objectId === "pot") {
      levelState.pot = true;
      addItem("scissors", "花盆旁边藏着一把小剪刀。");
      addNote("花盆", "获得剪刀，可以处理枯枝。");
      renderGame();
      return;
    }
    if (objectId === "branches") {
      if (selectedItem !== "scissors") {
        showClue("枯枝", "这些枯枝缠住了花架，也许需要工具。", { title: "枯枝", text: "需要工具才能修剪。" });
        return;
      }
      levelState.branches = true;
      selectedItem = null;
      addNote("墙上句子", "先是雨停，后来天亮，最后有人回来。");
      renderGame();
      showClue("墙上句子", "你修掉了枯枝，露出一句话：先是雨停，后来天亮，最后有人回来。");
      return;
    }
    if (objectId === "calendar") {
      showClue("日历", "雨天标记是蓝色。晴天标记是白色。纪念日标记是粉色。", { title: "天气颜色", text: "雨天=蓝色，晴天=白色，纪念日=粉色。" });
      return;
    }
    if (objectId === "flowerCard") {
      showClue("花语卡片", "蓝花：雨停。白花：天亮。粉花：回来。", { title: "花语卡片", text: "蓝花=雨停，白花=天亮，粉花=回来。" });
      return;
    }
    if (["blueFlower", "whiteFlower", "pinkFlower"].includes(objectId)) {
      levelState[objectId] = true;
      addItem(objectId, `你拾起了${inventoryConfig[objectId].label}。`);
      renderGame();
      return;
    }
    if (objectId === "vase") {
      useVase();
      return;
    }
    if (objectId === "glassDoor") {
      if (levelState.vaseDone) {
        completeLevel(2);
      } else {
        showClue("玻璃门", "门把手被花瓶旁的机关扣住了。也许要先让三朵花按正确顺序站好。");
      }
    }
  },

  bedroom(objectId) {
    if (objectId === "diary") {
      showClue("日记", "第 4 页写着早晨，第 16 页夹着照片。灯亮的时候，我才敢看那一天。", { title: "日记页码", text: "第 4 页和第 16 页被特别提到。" });
      return;
    }
    if (objectId === "lamp") {
      levelState.lamp = true;
      renderGame();
      showClue("床头灯", "灯光亮了，房间里那些太整齐的地方终于有了影子。", { title: "灯光", text: "开灯后，相框背面可以看清。" });
      return;
    }
    if (objectId === "frame") {
      if (!levelState.lamp) {
        showClue("相框", "照片背面太暗了，看不清。");
        return;
      }
      showClue("相框", "照片背后写着：04 / 16。", { title: "相框背面", text: "开灯后看到 04 / 16。" });
      return;
    }
    if (objectId === "musicBox") {
      showClue("音乐盒", "旋律停在第四个音，随后重复了十六下。", { title: "音乐盒", text: "第四个音，十六下，和 04 / 16 呼应。" });
      return;
    }
    if (objectId === "drawer") {
      showPasswordModal("drawer");
      return;
    }
    if (objectId === "drawer:success") {
      levelState.drawer = true;
      addItem("key", "抽屉轻轻弹开，你获得了一把钥匙。");
      addNote("抽屉钥匙", "密码 0416 打开抽屉，获得钥匙。");
      renderGame();
      return;
    }
    if (objectId === "door") {
      if (selectedItem === "key") {
        completeLevel(3);
      } else {
        showClue("房门", "门锁住了，需要钥匙。");
      }
    }
  },

  bookstore(objectId) {
    const clues = {
      register: {
        title: "借阅登记册",
        text: "最后借出的四本书，按照归还顺序放回原来的书架：雨夜来信 A-3；花房笔记 C-1；便利店灯光 B-4；没有名字的门 D-2。",
        note: { title: "归还顺序", text: "A-3 → C-1 → B-4 → D-2。" }
      },
      category: {
        title: "分类牌",
        text: "A = 小说，B = 生活，C = 植物，D = 旅行。",
        note: { title: "分类牌", text: "A小说，B生活，C植物，D旅行。" }
      },
      fiction: { title: "小说架", text: "小说书架上有一个空位，数字是 3。", note: { title: "小说架空位", text: "小说 A 的空位数字是 3。" } },
      life: { title: "生活架", text: "生活书架上有一个空位，数字是 4。", note: { title: "生活架空位", text: "生活 B 的空位数字是 4。" } },
      plant: { title: "植物架", text: "植物书架上有一个空位，数字是 1。", note: { title: "植物架空位", text: "植物 C 的空位数字是 1。" } },
      travel: { title: "旅行架", text: "旅行书架上有一个空位，数字是 2。", note: { title: "旅行架空位", text: "旅行 D 的空位数字是 2。" } },
      counterNote: { title: "柜台便签", text: "门锁只认归还顺序，不认书名。", note: { title: "柜台便签", text: "门锁只认归还顺序。" } }
    };
    if (objectId === "shutterLock") {
      showPasswordModal("shutterLock");
      return;
    }
    if (objectId === "shutterLock:success") {
      completeLevel(4);
      return;
    }
    showClue(clues[objectId].title, clues[objectId].text, clues[objectId].note);
  },

  studio(objectId) {
    const clues = {
      photos: {
        title: "墙上照片",
        text: "四张照片贴着小编号：1 早餐桌 07:30；2 便利店 02:17；3 花瓶 15:40；4 雨伞 21:10。",
        note: { title: "照片编号", text: "1早餐桌，2便利店，3花瓶，4雨伞。" }
      },
      frameBack: {
        title: "相框背面",
        text: "不是从早到晚，而是按故事出现的顺序。",
        note: { title: "相框背面", text: "不要按时间排序，要按故事顺序。" }
      },
      developer: {
        title: "显影液",
        text: "标签写着：便利店之后，是花房；花房之后，是卧室；卧室之后，才是书店。旁边又补了一句：卧室的早晨，门外有一把雨伞。",
        note: { title: "显影液标签", text: "故事顺序指向：便利店 → 花房 → 卧室/早餐桌 → 雨伞。" }
      }
    };
    if (objectId === "darkroomDoor") {
      showPasswordModal("darkroomDoor");
      return;
    }
    if (objectId === "darkroomDoor:success") {
      completeLevel(5);
      return;
    }
    showClue(clues[objectId].title, clues[objectId].text, clues[objectId].note);
  }
};

function useVase() {
  if (!levelState.branches) {
    showClue("花瓶", "花瓶旁边太暗了，似乎还少了能确定顺序的句子。");
    return;
  }
  if (!selectedItem) {
    showToast("先从背包选一朵花。");
    return;
  }
  if (!["blueFlower", "whiteFlower", "pinkFlower"].includes(selectedItem)) {
    showToast("这个道具不能放进花瓶。");
    return;
  }

  const order = ["blueFlower", "whiteFlower", "pinkFlower"];
  const placed = levelState.vaseOrder || [];
  if (selectedItem !== order[placed.length]) {
    returnItems(placed);
    levelState.vaseOrder = [];
    selectedItem = null;
    renderGame();
    showClue("顺序不对", "花没有枯萎，只是顺序还没被想起。");
    return;
  }

  levelState.vaseOrder = [...placed, selectedItem];
  removeItem(selectedItem);
  selectedItem = null;

  if (levelState.vaseOrder.length === order.length) {
    levelState.vaseDone = true;
    addNote("花瓶顺序", "蓝花 → 白花 → 粉花，对应雨停 → 天亮 → 回来。");
    renderGame();
    showClue("花瓶", "三朵花在雨声里抬起头。玻璃门的机关轻轻松开了。");
  } else {
    renderGame();
    showToast("花被轻轻放进花瓶。");
  }
}

function showModal({ eyebrow = "", title, text, extra = "", actions }) {
  modalEyebrow.textContent = eyebrow;
  modalTitle.textContent = title;
  modalText.textContent = text;
  modalExtra.innerHTML = extra;
  modalActions.innerHTML = actions.map((action, index) => (
    `<button class="${action.className}" data-modal-action="${index}">${action.label}</button>`
  )).join("");
  modalActions._actions = actions;
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  modalExtra.innerHTML = "";
  modalActions.innerHTML = "";
}

function showToast(message) {
  clearTimeout(toastTimer);
  document.querySelector(".toast")?.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  toastTimer = setTimeout(() => toast.remove(), 1800);
}

function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
  progress = normalizeProgress(loadProgress());
  showToast("进度已清空。");
  renderHome();
}

app.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  const level = event.target.closest("[data-level]")?.dataset.level;
  const object = event.target.closest("[data-object]")?.dataset.object;
  const inventoryItem = event.target.closest("[data-inventory]")?.dataset.inventory;

  if (action === "start" || action === "continue") renderLevelSelect();
  if (action === "home") renderHome();
  if (action === "levels") renderLevelSelect();
  if (action === "hint" && currentLevel) showLayeredHint();
  if (action === "notes" && currentLevel) showNotes();
  if (action === "reset") resetProgress();
  if (level) startLevel(Number(level));
  if (object) handleSceneObject(object);
  if (inventoryItem) selectInventoryItem(inventoryItem);
});

modalActions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-modal-action]");
  if (!button) return;
  const action = modalActions._actions[Number(button.dataset.modalAction)];
  action?.onClick();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  if (event.key === "Enter" && document.activeElement?.id === "password-input") {
    modalActions.querySelector("[data-modal-action='0']")?.click();
  }
});

renderHome();
