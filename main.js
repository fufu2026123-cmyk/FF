const STORAGE_KEY = "midnight-cabin-progress-v1";

// 关卡配置集中放在这里，后续替换文案、图标或新增关卡都优先改这个数组。
const levelData = [
  {
    id: 1,
    title: "深夜便利店",
    icon: "🏪",
    intro: "凌晨 2:17，一家还亮着灯的便利店。外面下着雨，门口的自动门忽然锁住了。",
    goal: "找到后门密码，离开便利店。",
    hint: "四位密码藏在时间、便签、货架和伞的标签里。",
    story: "后门打开的一瞬间，雨声变得清楚。你回头看见收银台上的小票慢慢摊开，上面写着：谢谢你替我关上这家店。",
    sceneClass: "scene-store",
    details: [
      { text: "雨滴敲着玻璃门", x: 10, y: 12 },
      { text: "02:17 的灯还亮着", x: 52, y: 18 },
      { text: "便签边角卷了起来", x: 14, y: 82 }
    ],
    items: [
      { id: "cashier", label: "收银台", icon: "💳", x: 58, y: 38, type: "password", password: "2358" },
      { id: "receipt", label: "小票", icon: "🧾", x: 28, y: 54, text: "小票上只看得清时间：02:17。也许第一个数字和时间有关。" },
      { id: "freezer", label: "冰柜", icon: "🧊", x: 72, y: 60, text: "冰柜门上贴着一张便签：今天第 3 排牛奶卖空了。" },
      { id: "shelf", label: "货架", icon: "🥫", x: 22, y: 32, text: "货架上空了一格，标签写着：商品编号 5。" },
      { id: "umbrella", label: "雨伞架", icon: "☂️", x: 48, y: 72, text: "最后一把伞的标签上写着 8。" }
    ]
  },
  {
    id: 2,
    title: "雨中花房",
    icon: "🌿",
    intro: "雨声落在玻璃顶上，花房里有一只空花瓶。门锁上写着：让枯萎的花重新开一次。",
    goal: "修剪枯枝，把三朵花按正确顺序放进花瓶。",
    hint: "枯枝后的墙面会告诉你花的顺序。",
    story: "三朵花在雨声里慢慢展开。玻璃门上的雾气散开，露出一句话：有些等待，并不是没有结果。",
    sceneClass: "scene-greenhouse",
    details: [
      { text: "玻璃顶覆着细雨", x: 12, y: 12 },
      { text: "潮湿泥土有淡淡香气", x: 44, y: 18 },
      { text: "墙面像藏着颜色", x: 8, y: 82 }
    ],
    items: [
      { id: "pot", label: "花盆", icon: "🪴", x: 20, y: 66 },
      { id: "branches", label: "枯枝", icon: "🍂", x: 46, y: 36 },
      { id: "whiteFlower", label: "白花", icon: "🤍", x: 20, y: 28 },
      { id: "pinkFlower", label: "粉花", icon: "🌸", x: 70, y: 30 },
      { id: "blueFlower", label: "蓝花", icon: "💙", x: 74, y: 64 },
      { id: "vase", label: "花瓶", icon: "🏺", x: 48, y: 68 }
    ]
  },
  {
    id: 3,
    title: "锁住的卧室",
    icon: "🛏️",
    intro: "房间很整洁，整洁得有些不自然。桌上有一本没有写完的日记，门边的抽屉上有一把密码锁。",
    goal: "找到密码打开抽屉，再用钥匙开门。",
    hint: "日记提到了灯光，先让房间亮起来。",
    story: "门开了，风从走廊吹进来。日记本翻到最后一页，上面写着：谢谢你替我把那盏灯打开。",
    sceneClass: "scene-bedroom",
    details: [
      { text: "床单被叠得很整齐", x: 10, y: 16 },
      { text: "灯罩落着温柔的光", x: 50, y: 15 },
      { text: "抽屉缝里有微光", x: 12, y: 84 }
    ],
    items: [
      { id: "diary", label: "日记", icon: "📓", x: 25, y: 56 },
      { id: "lamp", label: "床头灯", icon: "💡", x: 70, y: 40 },
      { id: "frame", label: "相框", icon: "🖼️", x: 45, y: 30 },
      { id: "drawer", label: "抽屉", icon: "🗄️", x: 28, y: 72, type: "password", password: "0416" },
      { id: "door", label: "房门", icon: "🚪", x: 72, y: 68 }
    ]
  }
];

const itemInfo = {
  scissors: { id: "scissors", label: "剪刀", icon: "✂️" },
  whiteFlower: { id: "whiteFlower", label: "白花", icon: "🤍" },
  pinkFlower: { id: "pinkFlower", label: "粉花", icon: "🌸" },
  blueFlower: { id: "blueFlower", label: "蓝花", icon: "💙" },
  key: { id: "key", label: "钥匙", icon: "🗝️" }
};

const app = document.querySelector("#app");
const modal = document.querySelector("#modal");
const modalEyebrow = document.querySelector("#modal-eyebrow");
const modalTitle = document.querySelector("#modal-title");
const modalText = document.querySelector("#modal-text");
const modalExtra = document.querySelector("#modal-extra");
const modalActions = document.querySelector("#modal-actions");

let progress = loadProgress();
let currentLevel = null;
let selectedItem = null;
let inventory = [];
let levelState = {};
let toastTimer = null;

// 只保存关卡解锁和通关进度，关卡内临时状态刷新后会重置，保持 MVP 简单。
function loadProgress() {
  const fallback = { unlockedLevel: 1, completed: [] };
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch (error) {
    return fallback;
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function resetRunState() {
  selectedItem = null;
  inventory = [];
  levelState = {};
}

function hasProgress() {
  return progress.unlockedLevel > 1 || progress.completed.length > 0;
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
            <span>解谜</span>
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
        ${levelData.map(renderLevelCard).join("")}
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

// 进入关卡时重置本次探索状态，避免上一关的道具影响当前关。
function startLevel(levelId) {
  currentLevel = levelData.find((level) => level.id === levelId);
  resetRunState();
  renderGame();
  showModal({
    eyebrow: `第 ${currentLevel.id} 关`,
    title: currentLevel.title,
    text: currentLevel.intro,
    actions: [{ label: "开始探索", className: "primary-btn", onClick: closeModal }]
  });
}

function renderGame() {
  app.innerHTML = `
    <section class="screen game-screen">
      <header class="game-header">
        <div class="game-title">
          <h2>${currentLevel.title}</h2>
          <p>${currentLevel.goal}</p>
        </div>
        <button class="small-icon-btn" data-action="levels" aria-label="返回关卡选择">↩</button>
      </header>
      <div class="scene-card ${currentLevel.sceneClass}">
        <div class="scene-visual">
          <div class="rain"></div>
          <div class="scene-light"></div>
          <div class="scene-floor"></div>
          ${renderSceneDetails()}
        </div>
        ${currentLevel.items.map(renderSceneItem).join("")}
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

function renderSceneItem(item) {
  const used = levelState[item.id] ? "used" : "";
  return `
    <button class="item-hit ${used}" data-item="${item.id}" style="left:${item.x}%;top:${item.y}%">
      <span class="item-emoji">${item.icon}</span>
      <span class="item-label">${item.label}</span>
    </button>
  `;
}

function renderInventory() {
  return `
    <aside class="inventory">
      <div class="inventory-head">
        <span class="bag-title">背包</span>
        <span>${selectedItem ? `已选中：${itemInfo[selectedItem].label}` : "点击道具选中"}</span>
      </div>
      <div class="inventory-list">
        ${inventory.length ? inventory.map(renderInventoryItem).join("") : '<div class="inventory-empty">还没有获得道具</div>'}
      </div>
    </aside>
  `;
}

function renderInventoryItem(id) {
  const item = itemInfo[id];
  return `
    <button class="inventory-item ${selectedItem === id ? "selected" : ""}" data-inventory="${id}">
      <span class="item-emoji">${item.icon}</span>
      <span class="item-label">${item.label}</span>
    </button>
  `;
}

function handleSceneItem(itemId) {
  if (currentLevel.id === 1) handleLevelOne(itemId);
  if (currentLevel.id === 2) handleLevelTwo(itemId);
  if (currentLevel.id === 3) handleLevelThree(itemId);
}

// 第 1 关是纯线索推理和密码输入，不使用道具栏。
function handleLevelOne(itemId) {
  const item = currentLevel.items.find((entry) => entry.id === itemId);
  if (item.type === "password") {
    showPasswordModal(item, () => completeLevel(1), "屏幕轻轻闪了一下，密码不对。");
    return;
  }
  showClue("线索", item.text);
}

// 第 2 关演示“选中道具后点击机关”的组合用法。
function handleLevelTwo(itemId) {
  if (itemId === "pot") {
    addItem("scissors", "花盆旁边藏着一把小剪刀。");
    levelState.pot = true;
    renderGame();
    return;
  }

  if (itemId === "branches") {
    if (selectedItem !== "scissors") {
      showClue("需要工具", "这些枯枝缠住了花架，也许需要工具。");
      return;
    }
    levelState.branches = true;
    selectedItem = null;
    showClue("颜色顺序", "你修掉了枯枝，露出墙上的颜色顺序：白、粉、蓝。");
    renderGame();
    return;
  }

  if (["whiteFlower", "pinkFlower", "blueFlower"].includes(itemId)) {
    addItem(itemId, `你拾起了${itemInfo[itemId].label}。`);
    levelState[itemId] = true;
    renderGame();
    return;
  }

  if (itemId === "vase") {
    useVase();
  }
}

function useVase() {
  if (!levelState.branches) {
    showClue("还缺线索", "花瓶旁边太暗了，似乎还少了什么线索。");
    return;
  }
  if (!selectedItem) {
    showToast("先从道具栏选一朵花。");
    return;
  }

  const order = ["whiteFlower", "pinkFlower", "blueFlower"];
  const placed = levelState.vaseOrder || [];
  if (selectedItem !== order[placed.length]) {
    levelState.vaseOrder = [];
    selectedItem = null;
    renderGame();
    showClue("顺序不对", "花轻轻垂了下去，顺序好像不对。");
    return;
  }

  levelState.vaseOrder = [...placed, selectedItem];
  removeItem(selectedItem);
  selectedItem = null;

  if (levelState.vaseOrder.length === order.length) {
    completeLevel(2);
  } else {
    renderGame();
    showToast("花被轻轻放进花瓶。");
  }
}

// 第 3 关把密码锁和钥匙道具串起来，作为后续门锁类谜题模板。
function handleLevelThree(itemId) {
  if (itemId === "diary") {
    showClue("日记", "日记最后一行写着：灯光照到的地方，藏着我没说出口的话。");
    return;
  }

  if (itemId === "lamp") {
    levelState.lamp = true;
    renderGame();
    showClue("床头灯", "灯光亮了，相框背面好像出现了一串数字：0416。");
    return;
  }

  if (itemId === "frame") {
    showClue("相框", levelState.lamp ? "你看见相框背面写着：0416。" : "相框背面太暗了，看不清。");
    return;
  }

  if (itemId === "drawer") {
    const drawer = currentLevel.items.find((item) => item.id === "drawer");
    showPasswordModal(drawer, () => {
      addItem("key", "抽屉轻轻弹开，你获得了一把钥匙。");
      levelState.drawer = true;
      renderGame();
    }, "锁芯没有反应。");
    return;
  }

  if (itemId === "door") {
    if (selectedItem === "key") {
      completeLevel(3);
    } else {
      showClue("房门", "门锁住了，需要钥匙。");
    }
  }
}

function addItem(id, message) {
  if (!inventory.includes(id)) {
    inventory.push(id);
    showToast(message);
  } else {
    showToast("这个道具已经在道具栏里了。");
  }
}

function removeItem(id) {
  inventory = inventory.filter((item) => item !== id);
}

function selectInventoryItem(id) {
  selectedItem = selectedItem === id ? null : id;
  renderGame();
}

// 通关后立即写入 localStorage，刷新页面后仍能保留已解锁关卡。
function completeLevel(levelId) {
  if (!progress.completed.includes(levelId)) {
    progress.completed.push(levelId);
  }
  progress.unlockedLevel = Math.max(progress.unlockedLevel, Math.min(levelId + 1, levelData.length));
  saveProgress();

  showModal({
    eyebrow: "故事完成",
    title: currentLevel.title,
    text: currentLevel.story,
    extra: '<p class="share-tip">可以停在这一刻截图，分享你刚打开的这扇门。</p>',
    actions: [
      {
        label: levelId < levelData.length ? "进入下一关" : "回到关卡选择",
        className: "primary-btn",
        onClick: () => {
          closeModal();
          levelId < levelData.length ? startLevel(levelId + 1) : renderLevelSelect();
        }
      },
      { label: "关卡选择", className: "secondary-btn", onClick: () => { closeModal(); renderLevelSelect(); } }
    ]
  });
}

function showClue(title, text) {
  showModal({
    eyebrow: "你发现了一点异常",
    title,
    text,
    actions: [{ label: "知道了", className: "primary-btn", onClick: closeModal }]
  });
}

function showPasswordModal(item, onSuccess, failText) {
  showModal({
    eyebrow: "锁面泛着微光",
    title: item.label,
    text: "四个数字会让机关回应。慢一点，听它有没有答应。",
    extra: '<input id="password-input" class="password-input" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="----">',
    actions: [
      { label: "确认", className: "primary-btn", onClick: () => checkPassword(item.password, onSuccess, failText) },
      { label: "取消", className: "secondary-btn", onClick: closeModal }
    ]
  });
  setTimeout(() => document.querySelector("#password-input")?.focus(), 80);
}

function checkPassword(password, onSuccess, failText) {
  const input = document.querySelector("#password-input");
  if (!input || input.value !== password) {
    showToast(failText);
    return;
  }
  closeModal();
  onSuccess();
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
  progress = loadProgress();
  showToast("进度已清空。");
  renderHome();
}

app.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  const level = event.target.closest("[data-level]")?.dataset.level;
  const item = event.target.closest("[data-item]")?.dataset.item;
  const inventoryItem = event.target.closest("[data-inventory]")?.dataset.inventory;

  if (action === "start" || action === "continue") renderLevelSelect();
  if (action === "home") renderHome();
  if (action === "levels") renderLevelSelect();
  if (action === "hint" && currentLevel) showClue("提示", currentLevel.hint);
  if (action === "reset") resetProgress();
  if (level) startLevel(Number(level));
  if (item) handleSceneItem(item);
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
