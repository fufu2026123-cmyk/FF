const STORAGE_KEY = "midnight-cabin-progress-v1";
const SOUND_SETTINGS_KEY = "midnight-cabin-sound-v1";
const debugHotspots = false;
let soundEnabled = true;
const hotspotColors = ["#ffd27a", "#8fc9ff", "#a9e6c3", "#f7a8c8", "#c8b6ff", "#ff9f7a", "#8ff0df", "#f5e38f", "#b9f18d"];
const appBaseUrl = new URL(".", document.currentScript?.src || window.location.href).href;

const inventoryConfig = {
  scissors: { id: "scissors", label: "剪刀", icon: "✂️" },
  whiteFlower: { id: "whiteFlower", label: "白花", icon: "🤍" },
  pinkFlower: { id: "pinkFlower", label: "粉花", icon: "🌸" },
  blueFlower: { id: "blueFlower", label: "蓝花", icon: "💙" },
  key: { id: "key", label: "钥匙", icon: "🗝️" },
  // 第6关 新道具
  compass: { id: "compass", label: "指南针", icon: "🧭" },
  // 第7关 新道具
  envelope: { id: "envelope", label: "旧信封", icon: "✉️" },
  lantern: { id: "lantern", label: "煤油灯", icon: "🏮" },
  // 第8关 新道具
  matchbox: { id: "matchbox", label: "火柴盒", icon: "🞱" },
  // 第9关 新道具
  magnifying: { id: "magnifying", label: "放大镜", icon: "🔍" },
  candle: { id: "candle", label: "蜡烛", icon: "🕯️" },
  // 第10关 新道具
  oldPen: { id: "oldPen", label: "旧钢笔", icon: "✒️" },
  // 组合道具
  litCandle: { id: "litCandle", label: "点燃的蜡烛", icon: "🕯️" },
  written: { id: "written", label: "写完的纸", icon: "📝" }
};

// 成就系统配置
const achievements = {
  noHint: {
    id: "noHint",
    name: "独自前行",
    desc: "不使用提示通关任意关卡",
    icon: "🌟",
    rare: false
  },
  speedRun: {
    id: "speedRun",
    name: "速战速决",
    desc: "5分钟内通关任意关卡",
    icon: "⚡",
    rare: false
  },
  collector: {
    id: "collector",
    name: "收藏家",
    desc: "收集所有9个故事碎片",
    icon: "💎",
    rare: true
  },
  secretEnding: {
    id: "secretEnding",
    name: "永恒守夜人",
    desc: "达成隐藏结局",
    icon: "✨",
    rare: true
  },
  allDoors: {
    id: "allDoors",
    name: "守夜人",
    desc: "通关全部10关",
    icon: "🌙",
    rare: true
  },
  firstStep: {
    id: "firstStep",
    name: "第一步",
    desc: "完成第一关",
    icon: "🚪",
    rare: false
  },
  allNoHint: {
    id: "allNoHint",
    name: "独行侠",
    desc: "所有关卡都不使用提示通关",
    icon: "🎭",
    rare: true
  }
};

// 关卡配置集中在 levels。新增关卡时优先补 objects、hints、passwordLocks，再写少量 custom handler。
// 故事主线：守夜人在深夜游走，帮助每一个需要帮助的人。每关帮助的都是"过去的自己"。
const levels = [
  // ========== 第1关：深夜便利店 ==========
  // 故事：守夜人遇到一个迷失在雨夜的便利店店员，帮助他找到离开的路
  {
    id: 1,
    title: "深夜便利店",
    icon: "🏪",
    intro: "凌晨2:17，雨还在下。便利店的灯亮着，收银台后面空无一人——最后一位客人刚离开，门就锁住了。柜台上有一张小票，写着02:17。后门锁上闪烁着微光。",
    goal: "帮最后一位客人找到离开的路。",
    sceneImage: "assets/scenes/store.png",
    sceneClass: "scene-store",
    handler: "store",
    story: "你站在雨里，看着那扇门关上又打开。你想起很久以前，也曾有人这样为我留过一盏灯——在你最需要的时候，有人替你守过门。",
    successText: "你把路线和数字连起来了。原来每一盏亮着的灯，都是为了等一个人。",
    storyFragment: "「路线」——在深夜的便利店里，你学会了第一件事：有些路，需要别人为你点亮。",
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
  hotspots: [
  { id: "receipt", label: "小票", x: 56.1, y: 72.3, width: 18.0, height: 8.0, priority: 90 },
  { id: "fridge", label: "冰柜", targetObjectId: "freezer", x: 0.0, y: 24.2, width: 26.0, height: 36.0, priority: 40 },
  { id: "shelf", label: "货架", x: 27.0, y: 27.1, width: 25.0, height: 31.6, priority: 30 },
  { id: "umbrella", label: "雨伞架", x: 78.8, y: 39.6, width: 16.0, height: 24.0, priority: 70 },
  { id: "doorLock", label: "门锁", targetObjectId: "backDoor", x: 53.7, y: 24.2, width: 20.7, height: 33.2, priority: 95 },
  { id: "cashier", label: "收银台", x: 0.0, y: 63.3, width: 38.0, height: 22.0, priority: 20 }
],
    passwordLocks: {
      backDoor: { password: "3582", fail: "电子锁低低闪了一下，顺序还没有对上。" }
    }
  },
  // ========== 第2关：雨中花房 ==========
  // 故事：守夜人遇到一个在花房等待的人，帮助他让枯萎的花重新开放
  {
    id: 2,
    title: "雨中花房",
    icon: "🌿",
    intro: "雨声落在玻璃顶上，花房里有一只空花瓶。门锁上写着：让枯萎的花重新开一次。日历停在三月十三日，那是很久以前的一个雨天。",
    goal: "让枯萎的花重新按正确的顺序绽放。",
    sceneImage: "assets/scenes/greenhouse.png",
    sceneClass: "scene-greenhouse",
    handler: "greenhouse",
    story: "三朵花在雨声里慢慢展开。你想起自己也曾在某扇门前等待，等一个永远不会回来的人。但现在你明白了——等待本身，就是一种答案。",
    successText: "这一次，不是你撞对了答案。你让花按故事里的顺序重新开了一次。",
    storyFragment: "「等待」——在雨中花房，你学会了第二件事：有些等待，不是为了等那个人回来，而是为了等自己放下。",
    prevChapter: {
      level: 1,
      title: "深夜便利店",
      text: "你想起那天下雨，便利店的灯亮着——也许，有些等待从那时就开始了。"
    },
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
    ],
    hotspots: [
  { id: "pot", label: "花盆", x: 4.2, y: 62.7, width: 22.4, height: 8.6, priority: 55 },
  { id: "branches", label: "枯枝", x: 72.2, y: 27.7, width: 25.9, height: 12.5, priority: 65 },
  { id: "blueFlower", label: "蓝花", x: 72.0, y: 40.9, width: 26.7, height: 13.3, priority: 85 },
  { id: "whiteFlower", label: "白花", x: 72.5, y: 54.2, width: 26.0, height: 13.5, priority: 85 },
  { id: "pinkFlower", label: "粉花", x: 73.9, y: 69.1, width: 25.3, height: 10.6, priority: 85 },
  { id: "vase", label: "花瓶", x: 42.2, y: 60.6, width: 13.2, height: 13.3, priority: 90 },
  { id: "calendar", label: "日历", x: 4.1, y: 27.9, width: 17.3, height: 14.8, priority: 75 },
  { id: "flowerCard", label: "花语卡", x: 4.2, y: 51.8, width: 24.9, height: 9.7, priority: 80 },
  { id: "glassDoor", label: "玻璃门", x: 42.0, y: 28.9, width: 28.8, height: 32.6, priority: 25 }
]
  },
  // ========== 第3关：锁住的卧室 ==========
  // 故事：守夜人遇到一个忘记关灯的人，帮助他找到抽屉里的钥匙
  {
    id: 3,
    title: "锁住的卧室",
    icon: "🛏️",
    intro: "房间很整洁，整洁得有些不自然。桌上有一本没有写完的日记，门边的抽屉上有一把密码锁。床头灯还亮着，仿佛在等一个人回来。日记本的封面写着：那天下雨，便利店的灯亮了一整夜。",
    goal: "打开抽屉里的记忆，找回那把钥匙。",
    sceneImage: "assets/scenes/bedroom.png",
    sceneClass: "scene-bedroom",
    handler: "bedroom",
    story: "门开了，风从走廊吹进来。你记得这个房间，记得那盏灯。但你不记得自己是什么时候离开的。日记本上写着：谢谢你替我把那盏灯打开——也许，是你替我关上的。就像那天下雨，便利店的灯为谁亮了一整夜一样。",
    successText: "房间安静下来，仿佛终于被理解。抽屉把钥匙交给了你。",
    storyFragment: "「灯」——在锁住的卧室里，你学会了第三件事：有些灯，不是为了照亮别人，而是为了照亮自己回家的路。",
    prevChapter: {
      level: 2,
      title: "雨中花房",
      text: "你想起那盆等待开放的花——有些东西，不是等那个人回来，而是等自己放下。"
    },
    prevChapter: {
      level: 2,
      title: "雨中花房",
      text: "你想起那盆等待开放的花——有些东西，不是等那个人回来，而是等自己放下。"
    },
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
   hotspots: [
  { id: "diary", label: "日记", x: 12.9, y: 70.6, width: 45.0, height: 15.1, priority: 85 },
  { id: "lamp", label: "床头灯", x: 32.8, y: 30.7, width: 14.8, height: 14.7, priority: 80 },
  { id: "frame", label: "相框", x: 53.8, y: 24.1, width: 14.9, height: 10.4, priority: 70 },
  { id: "musicBox", label: "音乐盒", x: 59.0, y: 41.1, width: 39.2, height: 10.1, priority: 80 },
  { id: "drawer", label: "抽屉", x: 60.7, y: 50.7, width: 34.4, height: 21.3, priority: 75 },
  { id: "roomDoor", label: "房门", targetObjectId: "door", x: 71.1, y: 13.6, width: 22.7, height: 27.8, priority: 25 }
],
    passwordLocks: {
      drawer: { password: "0416", fail: "锁芯没有反应，数字之间还少了一点联系。" }
    }
  },
  // ========== 第4关：无人书店 ==========
  // 故事：守夜人遇到一个读不完故事的人，帮助他找到离开的书
  {
    id: 4,
    title: "无人书店",
    icon: "📚",
    intro: "凌晨的旧书店没有店员，柜台上放着一本借阅登记册。最后一行写着：有些故事，读完才算离开。门口的卷帘门锁着，像是在等谁来读完它。便签上夹着一朵干枯的花——和花房里的一样。",
    goal: "帮那个读不完故事的人，找到离开的顺序。",
    sceneImage: "assets/scenes/bookstore.png",
    sceneClass: "scene-bookstore",
    handler: "bookstore",
    story: "卷帘门缓缓升起，风吹动柜台上的登记册。你想起自己也曾在这里读过一本书，等一个永远不会来的人。你明白了——故事从来没有结局，只有读到一半的人。就像花房里那朵等待的花，等的不是人回来，而是等自己放下。",
    successText: "你没有被书名带走，而是找到了归还顺序。门锁轻轻松开了。",
    storyFragment: "「故事」——在无人书店，你学会了第四件事：有些故事，不是给别人读的，而是给自己一个交代。",
    prevChapter: {
      level: 3,
      title: "锁住的卧室",
      text: "你想起那盏亮了一整夜的灯——有些门，需要钥匙才能打开；而有些心门，需要放下才能打开。"
    },
    prevChapter: {
      level: 3,
      title: "锁住的卧室",
      text: "你想起那盏亮了一整夜的灯——有些门，需要钥匙才能打开；而有些心门，需要放下才能打开。"
    },
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
    hotspots: [
  { id: "register", label: "借阅登记册", x: 16.6, y: 59.2, width: 39.7, height: 13.6, priority: 80 },
  { id: "categorySign", label: "分类牌", targetObjectId: "category", x: 8.8, y: 7.1, width: 34.0, height: 12.0, priority: 70 },
  { id: "note", label: "柜台便签", targetObjectId: "counterNote", x: 59.5, y: 62.7, width: 16.0, height: 10.0, priority: 90 },
  { id: "bookshelf", label: "书架", x: 80.9, y: 16.4, width: 19.1, height: 43.5, priority: 10 },
  { id: "shutterLock", label: "卷帘门锁", x: 70.1, y: 32.9, width: 3.0, height: 13.2, priority: 95 },
  { id: "shutter", label: "卷帘门", x: 43.5, y: 21.0, width: 29.7, height: 31.6, priority: 20 }
],
    passwordLocks: {
      shutterLock: { password: "3142", fail: "锁面没有亮起。也许门锁不认书名，只认顺序。" }
    }
  },
  // ========== 第5关：旧照相馆 ==========
  // 故事：守夜人遇到一个忘记自己样子的人，帮助他找回照片里的记忆
  {
    id: 5,
    title: "旧照相馆",
    icon: "📷",
    intro: "墙上挂满了没有人脸的照片，暗房门口有一把密码锁。红色安全灯轻轻闪烁——那些照片里的人，都忘记了自己是谁。显影液标签上写着：便利店、花房、卧室、书店……顺序，是记忆的关键。",
    goal: "找回照片里的记忆，打开那扇门。",
    sceneImage: "assets/scenes/photo-studio.png",
    sceneClass: "scene-studio",
    handler: "studio",
    story: "暗房门打开，红色灯光慢慢熄灭。照片上的空白位置，终于显出一个模糊的背影——那是你自己。原来，你一直都在这里，只是不记得了。便利店、花房、卧室、书店……你走过的每一步，都在等你自己回来认出自己。",
    successText: "你没有按时间排序，而是按故事把照片放回了它们的位置。",
    storyFragment: "「顺序」——在旧照相馆里，你学会了第五件事：不是时间定义顺序，而是经历定义你是谁。",
    prevChapter: {
      level: 4,
      title: "无人书店",
      text: "你想起那本读不完的书——有些故事，读到一半就够了，剩下的留给下一个迷路的人。"
    },
    prevChapter: {
      level: 4,
      title: "无人书店",
      text: "你想起那本读不完的书——有些故事，读到一半就够了，剩下的留给下一个迷路的人。"
    },
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
    hotspots: [
      { id: "photos", label: "墙上照片", x: 0.0, y: 12.6, width: 59.2, height: 22.5, priority: 25 },
      { id: "frameBack", label: "相框背面", x: 0.1, y: 35.5, width: 56.4, height: 12.0, priority: 80 },
      { id: "developerLiquid", label: "显影液", targetObjectId: "developer", x: 0.0, y: 66.9, width: 67.9, height: 14.1, priority: 75 },
      { id: "darkroomLock", label: "暗房门锁", targetObjectId: "darkroomDoor", x: 87.5, y: 46.3, width: 12.0, height: 14.0, priority: 95 },
      { id: "darkroomDoor", label: "暗房门", x: 62.5, y: 24.8, width: 24.5, height: 47.6, priority: 20 },
      { id: "redLamp", label: "红色安全灯", x: 13.7, y: 1.5, width: 26.9, height: 11.1, priority: 85 }
    ],
    passwordLocks: {
      darkroomDoor: { password: "2143", fail: "红灯闪了一下。你也许又按成了时间顺序。" }
    }
  },
  // ========== 第6关：清晨食堂 ==========
  // 故事：守夜人遇到一个错过最后一班车的人，帮助他找到留下的东西
  {
    id: 6,
    title: "清晨食堂",
    icon: "🍜",
    intro: "凌晨五点，城市还没醒。小餐馆的蒸笼正冒着热气，墙上贴着今日菜单。角落里有一扇员工专用门，门上是一把四位数字锁。桌上有一张车票——目的地写着「终点站」。菜单背面写着一行小字：卧室的灯，还亮着吗？",
    goal: "找到老板留下的东西，看看那是谁的车票。",
    sceneImage: "assets/scenes/restaurant.png",
    sceneClass: "scene-restaurant",
    handler: "restaurant",
    story: "员工门打开，里面没有老板，只有一张纸条：谢谢你替我关了灯。这些年，凌晨来吃饭的人，都是错过最后一班车的人——包括我自己。就像那个卧室的灯亮了整晚，便利店的灯也亮了一整夜。有些灯，不是为了等谁回来，而是为了照亮下一个迷路的人。",
    successText: "你没有按点餐顺序，而是按外卖小哥的取餐路线找到了数字。",
    storyFragment: "「时间」——在清晨食堂里，你学会了第六件事：有些错过，不是结束，而是另一种开始。",
    prevChapter: {
      level: 5,
      title: "旧照相馆",
      text: "你想起那张没有脸的照片——原来，那些模糊的轮廓，是你自己。"
    },
    prevChapter: {
      level: 5,
      title: "旧照相馆",
      text: "你想起那张没有脸的照片——原来，那些模糊的轮廓，是你自己。"
    },
    hints: [
      "菜单上标注的'A区''B区'不是给顾客看的。",
      "外卖小哥每次取餐都会先看一眼墙上的路线图。",
      "路线经过的格子顺序：收银台(0)→冷柜(3)→调料台(7)→出餐口(2)。",
      "但你只需要路线经过的'最后一个'数字，按经过顺序排列。"
    ],
    details: [
      { text: "蒸笼正冒着热气", x: 12, y: 14 },
      { text: "墙上贴着今日菜单", x: 52, y: 18 },
      { text: "员工门锁在角落", x: 10, y: 82 }
    ],
    objects: [
      { id: "menu", label: "菜单", icon: "📋", x: 25, y: 32 },
      { id: "deliveryBoard", label: "外卖板", icon: "📝", x: 68, y: 26 },
      { id: "routeMap", label: "路线图", icon: "🗺️", x: 44, y: 48 },
      { id: "fridge", label: "冷柜", icon: "🧊", x: 72, y: 55 },
      { id: "counter", label: "收银台", icon: "💳", x: 20, y: 70 },
      { id: "spice", label: "调料台", icon: "🫙", x: 52, y: 64 },
      { id: "window", label: "出餐口", icon: "🪟", x: 80, y: 44 },
      { id: "staffDoor", label: "员工门", icon: "🚪", x: 18, y: 56 }
    ],
    hotspots: [
      { id: "menu", label: "菜单", x: 19.2, y: 11.7, width: 50.8, height: 15.6, priority: 75 },
      { id: "deliveryBoard", label: "外卖记录板", x: 17.4, y: 29.3, width: 31.1, height: 18.2, priority: 80 },
      { id: "routeMap", label: "墙上路线图", x: 48.7, y: 27.8, width: 27.6, height: 19.3, priority: 85 },
      { id: "fridge", label: "冷柜", x: 3.3, y: 49.9, width: 25.7, height: 24.3, priority: 50 },
      { id: "counter", label: "收银台", x: 27.7, y: 49.4, width: 33.2, height: 36.0, priority: 55 },
      { id: "spice", label: "调料台", x: 61.5, y: 57.4, width: 38.5, height: 28.1, priority: 60 },
      { id: "window", label: "出餐口", x: 76.0, y: 36.0, width: 18.0, height: 20.0, priority: 45 },
      { id: "staffDoor", label: "员工门", x: 0.0, y: 24.8, width: 17.3, height: 24.0, priority: 95 },
      { id: "staffDoorLock", label: "员工门锁", targetObjectId: "staffDoor", x: 2.7, y: 34.6, width: 13.0, height: 8.2, priority: 98 }
    ],
    passwordLocks: {
      staffDoor: { password: "0372", fail: "锁芯纹丝不动。也许不是点餐顺序，也不是取餐顺序，而是外卖小哥实际走过的路线。" }
    }
  },
  // ========== 第7关：雨天邮局 ==========
  // 故事：守夜人遇到一个收不到信的人，帮助他把信送到该去的地方
  {
    id: 7,
    title: "雨天邮局",
    icon: "📮",
    intro: "清晨的邮局堆满了无法送达的退回包裹。桌上有一本厚厚的包裹登记簿，每一件包裹的邮戳日期都清晰可见。角落里有一扇铁门，门上贴着封条——但封条旁边有一把四位数字密码锁。登记簿最后一页写着：那些寄不出的信，都退回了便利店。",
    goal: "撕开封条，找到那些没有送达的信。",
    sceneImage: "assets/scenes/postoffice.png",
    sceneClass: "scene-postoffice",
    handler: "postoffice",
    story: "铁门打开，里面是一辆老旧的邮递自行车，车篮里有一封信。信上写着：谢谢你替我把该送达的信都送出去了——包括那些寄给过去的自己的信。从便利店到花房，从卧室到书店，从食堂到灯塔……每一封信，都是寄给曾经的自己。",
    successText: "你没有按日期先后，而是按邮戳上'退回次数'的多少，找到了正确的顺序。",
    storyFragment: "「送达」——在雨天邮局里，你学会了第七件事：有些信，注定要经历退回，才能找到收件人。",
    prevChapter: {
      level: 6,
      title: "清晨食堂",
      text: "你想起那张开往终点站的车票——有些错过，是为了让下一班车准时到达。"
    },
    prevChapter: {
      level: 6,
      title: "清晨食堂",
      text: "你想起那张开往终点站的车票——有些错过，是为了让下一班车准时到达。"
    },
    hints: [
      "登记簿上的日期会让你误入歧途。",
      "仔细看，每件包裹右下角有一个被盖住的数字——那是退回次数。",
      "按退回次数从少到多排列，再取对应格子的数字。",
      "退回1次的在格3，退回2次在格7，退回3次在格5，退回4次在格1。",
      "按次数排列：1→2→3→4，对应数字：3→7→5→1。"
    ],
    details: [
      { text: "退回包裹堆满角落", x: 8, y: 14 },
      { text: "登记簿翻到最后一页", x: 50, y: 18 },
      { text: "铁门上的封条很旧了", x: 14, y: 84 }
    ],
    objects: [
      { id: "registerBook", label: "登记簿", icon: "📖", x: 28, y: 38 },
      { id: "package1", label: "包裹A", icon: "📦", x: 62, y: 28 },
      { id: "package2", label: "包裹B", icon: "📦", x: 78, y: 42 },
      { id: "package3", label: "包裹C", icon: "📦", x: 58, y: 54 },
      { id: "package4", label: "包裹D", icon: "📦", x: 74, y: 66 },
      { id: "locker", label: "储物柜", icon: "🗄️", x: 16, y: 44 },
      { id: "ironDoor", label: "铁门", icon: "🚪", x: 40, y: 70 }
    ],
    hotspots: [
      { id: "registerBook", label: "包裹登记簿", x: 25.9, y: 69.9, width: 51.2, height: 25.3, priority: 80 },
      { id: "packageA", label: "包裹 A", x: 24.8, y: 30.2, width: 23.0, height: 11.7, priority: 70 },
      { id: "packageB", label: "包裹 B", x: 48.1, y: 30.8, width: 20.3, height: 11.6, priority: 70 },
      { id: "packageC", label: "包裹 C", x: 25.5, y: 43.9, width: 22.5, height: 12.2, priority: 70 },
      { id: "packageD", label: "包裹 D", x: 47.8, y: 43.9, width: 22.2, height: 12.3, priority: 70 },
      { id: "locker", label: "储物柜", x: 0.0, y: 4.5, width: 24.5, height: 10.5, priority: 75 },
      { id: "ironDoor", label: "铁门", x: 72.3, y: 19.4, width: 27.0, height: 48.1, priority: 90 },
      { id: "ironDoorLock", label: "铁门锁", targetObjectId: "ironDoor", x: 80.0, y: 44.4, width: 17.1, height: 11.7, priority: 98 }
    ],
    passwordLocks: {
      ironDoor: { password: "3751", fail: "锁芯卡住了一下。也许日期不是线索，退回次数才是。" }
    }
  },
  // ========== 第8关：灯塔码头 ==========
  // 故事：守夜人来到灯塔，意识到自己的身份
  {
    id: 8,
    title: "灯塔码头",
    icon: "🏝️",
    intro: "清晨的海边，一座废弃灯塔还亮着灯。塔顶有一扇生锈的铁门，门上是一把字母锁。门边有一块被海水侵蚀的木牌，上面刻着：你已经走了很远，但最后一扇门，只认一个名字。风从海上吹来，带着便利店雨夜的气息，带着花房里枯萎的花香，带着那盏卧室里亮了一整晚的灯的光。",
    goal: "找到自己的名字。",
    sceneImage: "assets/scenes/lighthouse.png",
    sceneClass: "scene-lighthouse",
    handler: "lighthouse",
    story: "门打开了。灯塔顶没有宝藏，只有一张旧照片——照片上是一扇门，和你一路走来的那些门一模一样。照片背后写着：你不是过客，你是守夜人。你终于想起来了——那些你帮助的人便利店店员、花房等待的人、卧室忘关灯的人、读不完故事的人、邮局里收不到信的人……都是过去的你自己。就像这灯塔，为所有在深夜迷路的人亮着。",
    successText: "你没有寻找数字，而是想起了这一路陪你的那些名字。守夜人——这就是答案。",
    storyFragment: "「守夜人」——在灯塔码头，你终于想起来了：那些在深夜迷路的人，从来都是你自己。",
    prevChapter: {
      level: 7,
      title: "雨天邮局",
      text: "你想起那些退回的信——每一封退信，都是为了找到真正需要它的人。"
    },
    prevChapter: {
      level: 7,
      title: "雨天邮局",
      text: "你想起那些退回的信——每一封退信，都是为了找到真正需要它的人。"
    },
    hints: [
      "这不是数字锁，而是字母锁。",
      "回顾你一路走来的故事，每一关的主角留下了什么？",
      "便利店留下了'路线'，花房留下了'等待'，卧室留下了'灯'，书店留下了'故事'，相馆留下了'顺序'。",
      "第一个字：路。第二个字：等。第三个字：灯。第四个字：事。",
      "但门的密码是'守夜人'——三个字，只取首字母：S Y R。"
    ],
    details: [
      { text: "海风吹动灯塔的风铃", x: 12, y: 14 },
      { text: "木牌上的字迹被海水侵蚀", x: 52, y: 18 },
      { text: "灯塔的光还在亮着", x: 14, y: 84 }
    ],
    objects: [
      { id: "woodenSign", label: "木牌", icon: "🪧", x: 30, y: 52 },
      { id: "oldPhoto", label: "旧照片", icon: "🖼️", x: 66, y: 34 },
      { id: "lighthouseDoor", label: "灯塔门", icon: "🚪", x: 48, y: 68 },
      { id: "window", label: "灯塔窗", icon: "🪟", x: 72, y: 28 },
      { id: "seaweed", label: "海藻", icon: "🌿", x: 18, y: 76 }
    ],
    hotspots: [
      { id: "woodenSign", label: "木牌", x: 4.7, y: 34.5, width: 36.6, height: 11.1, priority: 80 },
      { id: "oldPhoto", label: "旧照片", x: 72.9, y: 29.4, width: 25.3, height: 18.9, priority: 75 },
      { id: "lighthouseDoor", label: "灯塔门", x: 42.5, y: 25.7, width: 24.8, height: 43.4, priority: 90 },
      { id: "lighthouseLock", label: "字母锁", targetObjectId: "lighthouseDoor", x: 43.3, y: 41.5, width: 24.2, height: 11.0, priority: 98 },
      { id: "window", label: "灯塔窗", x: 68.0, y: 49.6, width: 30.6, height: 20.7, priority: 60 },
      { id: "seaweed", label: "海藻", x: 68.6, y: 86.3, width: 31.4, height: 13.7, priority: 40 }
    ],
    passwordLocks: {
      lighthouseDoor: { password: "SYR", fail: "字母锁没有反应。也许这个门不认识文字，它只认识身份。" }
    }
  },
  // ========== 第9关：守夜人档案室 ==========
  // 故事：守夜人找回所有记忆，明白了一切都是自己的故事
  {
    id: 9,
    title: "守夜人档案室",
    icon: "🗂️",
    intro: "你进入了一间堆满档案的房间。墙上钉满了照片，每张照片下面都有编号和一行手写备注。房间中央有一张桌子，桌上有一本打开的档案册，册子的最后一页写着：把所有照片按正确的顺序排列，门才会开。桌上的台灯亮着——和那间卧室里的一模一样。",
    goal: "整理记忆，找到最后的真相。",
    sceneImage: "assets/scenes/archive.png",
    sceneClass: "scene-archive",
    handler: "archive",
    story: "照片排列正确的那一刻，房间里的灯全部亮了起来。你看到墙上写着一行字：欢迎回家，守夜人。你终于明白了——那些深夜帮助过的人便利店店员、花房等待的人、卧室里忘关灯的人、读不完故事的人、忘记自己样子的人、错过车的人、收不到信的人、灯塔上等待的人——都是过去的你自己。每一个深夜，都在帮助自己回家。",
    successText: "你把所有的故事按时间线串了起来。原来，每一扇你打开的门，都是你自己的门。",
    storyFragment: "「真相」——在守夜人档案室，你终于明白了全部真相：每个深夜，你都在帮助自己回家。",
    prevChapter: {
      level: 8,
      title: "灯塔码头",
      text: "你想起那扇只认名字的门——你不是过客，你是守夜人。"
    },
    prevChapter: {
      level: 8,
      title: "灯塔码头",
      text: "你想起那扇只认名字的门——你不是过客，你是守夜人。"
    },
    hints: [
      "不是按照片上的时间排列，而是按你通关的顺序。",
      "但有一个陷阱：第3关的卧室照片，其实拍摄于第1关的便利店之前。",
      "照片背面有真正的拍摄顺序：便利店(1)→花房(2)→卧室(3)→书店(4)→相馆(5)→食堂(6)→邮局(7)→灯塔(8)。",
      "你需要按背面编号重新排列，再按新顺序取每个照片框上的数字：1→2→3→4。",
      "照片1框上写7，照片2框上写3，照片3框上写9，照片4框上写1。"
    ],
    details: [
      { text: "档案堆积如山", x: 12, y: 14 },
      { text: "照片墙等待整理", x: 52, y: 18 },
      { text: "档案册翻到最后一页", x: 14, y: 84 }
    ],
    objects: [
      { id: "photo1", label: "照片①", icon: "🖼️", x: 18, y: 30 },
      { id: "photo2", label: "照片②", icon: "🖼️", x: 38, y: 26 },
      { id: "photo3", label: "照片③", icon: "🖼️", x: 58, y: 32 },
      { id: "photo4", label: "照片④", icon: "🖼️", x: 78, y: 28 },
      { id: "archiveBook", label: "档案册", icon: "📖", x: 30, y: 64 },
      { id: "candle", label: "蜡烛", icon: "🕯️", x: 70, y: 56 },
      { id: "archiveRoom", label: "档案柜", icon: "🚪", x: 85, y: 40 },
      { id: "desk", label: "桌子", icon: "🪑", x: 48, y: 72 },
      { id: "cabinet", label: "铁皮柜", icon: "🗄️", x: 14, y: 52 }
    ],
    hotspots: [
      { id: "photoWall1", label: "照片①", x: 19.7, y: 9.6, width: 39.0, height: 21.3, priority: 75 },
      { id: "photoWall2", label: "照片②", x: 57.0, y: 8.1, width: 42.0, height: 23.1, priority: 75 },
      { id: "photoWall3", label: "照片③", x: 20.7, y: 30.9, width: 38.2, height: 20.8, priority: 75 },
      { id: "photoWall4", label: "照片④", x: 60.5, y: 31.3, width: 37.6, height: 21.0, priority: 75 },
      { id: "archiveBook", label: "档案册", x: 27.4, y: 54.9, width: 50.3, height: 18.3, priority: 85 },
      { id: "candle", label: "蜡烛", x: 66.0, y: 50.0, width: 15.0, height: 15.0, priority: 80 },
      { id: "archiveRoom", label: "档案柜", x: 80.0, y: 35.0, width: 18.0, height: 30.0, priority: 90 },
      { id: "desk", label: "桌子", x: 0.0, y: 73.0, width: 97.2, height: 15.0, priority: 50 },
      { id: "cabinet", label: "铁皮柜", x: 0.0, y: 5.0, width: 22.6, height: 66.3, priority: 60 }
    ],
    passwordLocks: {
      archiveRoom: { password: "7391", fail: "档案柜没有反应。也许照片的顺序不是按墙上的编号，而是按真正的拍摄顺序。" }
    }
  },
  // ========== 第10关：永恒守夜人（双结局） ==========
  // 故事：回到原点，面对最终选择
  {
    id: 10,
    title: "永恒守夜人",
    icon: "🌙",
    intro: "一切故事开始的地方。一间和你记忆中完全相同的房间，但桌上有一张空白的纸和一支旧钢笔。窗外是深夜，雨声和最初一样。桌角有一盏煤油灯，灯芯还没有熄灭。门已经不存在了——这里已经是终点，也是起点。便利店、花房、卧室、书店、相馆、食堂、邮局、灯塔……你走过的每一扇门，都在这里等着你回来。",
    goal: "写下你的选择——继续，或者离开。",
    sceneImage: "assets/scenes/finale.png",
    sceneClass: "scene-finale",
    handler: "finale",
    story_continue: "煤油灯亮了起来。你拿起笔，在纸上写下了两个字：继续。窗外，雨声停了。新的深夜开始了——新的守夜人，在等着被你照亮。就像那晚便利店的灯，为你亮了一整夜。",
    story_leave: "你放下笔，站起身。煤油灯慢慢熄灭，但这一次，你没有感到黑暗。门外的光亮了起来，像黎明。你终于可以休息了。那些你帮助过的人，会继续帮助别人。这是守夜人的传承。",
    story_secret: "你拿起笔，在纸上写下了所有你想说的话——给便利店雨夜里等待的人，给花房里放下执念的人，给卧室里忘记关灯的人，给书店里读不完故事的人，给相馆里忘记自己的人，给食堂里错过车的人，给邮局里寄不出信的人，给灯塔上守望的人。煤油灯亮得像太阳。你明白了：守夜人不是一个人的名字，而是每一个愿意在深夜为别人点亮灯火的人的称号。",
    hints: [
      "这不是谜题。这是选择。",
      "守夜人的工作，是等待下一位需要帮助的人，还是就此离开？",
      "写下'继续'，你将继续守夜。写下'离开'，你将走进光里。",
      "或者，你也可以什么都不写，关闭这扇门。"
    ],
    details: [
      { text: "雨声和最初一样", x: 12, y: 14 },
      { text: "一切都回到了起点", x: 52, y: 18 },
      { text: "煤油灯还亮着", x: 14, y: 84 }
    ],
    objects: [
      { id: "blankPaper", label: "空白纸张", icon: "📄", x: 42, y: 44 },
      { id: "oldPen", label: "旧钢笔", icon: "✒️", x: 62, y: 58 },
      { id: "oilLamp", label: "煤油灯", icon: "🏮", x: 28, y: 52 },
      { id: "window", label: "窗户", icon: "🪟", x: 72, y: 28 },
      { id: "rain", label: "雨", icon: "🌧️", x: 18, y: 18 }
    ],
    hotspots: [
      { id: "blankPaper", label: "空白纸张", x: 29.2, y: 59.4, width: 53.9, height: 21.0, priority: 85 },
      { id: "oldPen", label: "旧钢笔", x: 49.7, y: 68.5, width: 45.1, height: 12.9, priority: 80 },
      { id: "oilLamp", label: "煤油灯", x: 7.7, y: 37.9, width: 31.2, height: 31.3, priority: 75 },
      { id: "window", label: "窗户", x: 50.8, y: 7.6, width: 42.4, height: 39.5, priority: 60 },
      { id: "rain", label: "雨", x: 43.8, y: 1.6, width: 56.2, height: 53.0, priority: 30 }
    ]
  },
  // ========== 第11关：记忆配对 ==========
  // 故事：守夜人测试自己的记忆
  {
    id: 11,
    title: "记忆碎片",
    icon: "🧩",
    intro: "一扇特殊的门出现在你面前。门上写着：只有在深夜记住光明的人，才能通过这扇门。门上有四张图卡，正面朝下，等待你凭记忆翻面配对。",
    goal: "凭记忆配对所有图卡。",
    sceneImage: "assets/scenes/memory.png",
    sceneClass: "scene-memory",
    handler: "memory",
    story: "四对图卡，八个图案。便利店的灯、花房的窗、守夜人的灯塔、相馆的光……你回忆起每一个深夜走过的路。原来这些记忆，从来没有消失，只是等待被唤醒。",
    successText: "你凭记忆配对了所有图卡。门缓缓打开，露出一条通往更深处的路。",
    storyFragment: "「记忆」——在记忆碎片中，你证明了：有些东西，永远不会真正消失。",
    hints: [
      "先记住所有图卡的位置，再开始配对。",
      "仔细观察每张卡片的图案，它们代表你走过的故事。",
      "便利店对应花房，灯塔对应相馆。"
    ],
    details: [
      { text: "图卡排列整齐", x: 12, y: 14 },
      { text: "门在等待记忆苏醒", x: 52, y: 18 }
    ],
    objects: [],
    hotspots: [
      { id: "card1", label: "图卡1", x: 20, y: 30, width: 15, height: 20, priority: 80 },
      { id: "card2", label: "图卡2", x: 40, y: 30, width: 15, height: 20, priority: 80 },
      { id: "card3", label: "图卡3", x: 60, y: 30, width: 15, height: 20, priority: 80 },
      { id: "card4", label: "图卡4", x: 80, y: 30, width: 15, height: 20, priority: 80 },
      { id: "card5", label: "图卡5", x: 20, y: 55, width: 15, height: 20, priority: 80 },
      { id: "card6", label: "图卡6", x: 40, y: 55, width: 15, height: 20, priority: 80 },
      { id: "card7", label: "图卡7", x: 60, y: 55, width: 15, height: 20, priority: 80 },
      { id: "card8", label: "图卡8", x: 80, y: 55, width: 15, height: 20, priority: 80 },
      { id: "startBtn", label: "开始记忆", x: 30, y: 82, width: 40, height: 12, priority: 90 }
    ]
  },
  // ========== 第12关：时间线排序 ==========
  // 故事：守夜人整理自己的故事时间线
  {
    id: 12,
    title: "时间之河",
    icon: "⏳",
    intro: "你来到一条由故事组成的长河前。河面上漂浮着六个故事片段，你需要按它们发生的顺序排列。正确的顺序，才能让故事之河流向终点。",
    goal: "将故事按正确的时间顺序排列。",
    sceneImage: "assets/scenes/timeline.png",
    sceneClass: "scene-timeline",
    handler: "timeline",
    story: "六个故事，按时间排列：便利店的花房等待，卧室的书店相馆，食堂的邮局灯塔。你终于明白了时间的力量——每一个故事都在正确的时间发生，即使你当时并不知道。",
    successText: "故事之河按正确的顺序流淌。终点就在前方。",
    storyFragment: "「时间」——在时间之河中，你理解了：每个故事都有它该发生的时间。",
    hints: [
      "回忆你第一次遇到这些故事是在哪一关。",
      "按通关顺序排列：第一关在最前，第8关在最后。",
      "正确顺序：便利店 → 花房 → 卧室 → 书店 → 邮局 → 灯塔"
    ],
    details: [
      { text: "故事漂浮在河面", x: 12, y: 14 },
      { text: "时间之河等待着整理", x: 52, y: 18 }
    ],
    objects: [],
    hotspots: [
      { id: "slot1", label: "位置1", x: 20, y: 20, width: 60, height: 12, priority: 70 },
      { id: "slot2", label: "位置2", x: 20, y: 35, width: 60, height: 12, priority: 70 },
      { id: "slot3", label: "位置3", x: 20, y: 50, width: 60, height: 12, priority: 70 },
      { id: "slot4", label: "位置4", x: 20, y: 65, width: 60, height: 12, priority: 70 },
      { id: "submitBtn", label: "确认顺序", x: 30, y: 82, width: 40, height: 12, priority: 90 }
    ]
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
let inventory = [];
let levelState = {};
let toastTimer = null;
let hotspotDrag = null;
let suppressNextHotspotClick = false;
let moonClickCount = 0; // 彩蛋计数器

function loadProgress() {
  const fallback = { unlockedLevel: 1, completed: [], runs: {}, collectibles: [], shards: [], secretUnlocked: false, endingsSeen: [], achievements: [], levelTimes: {}, noHintLevels: [] };
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
  const collectibles = Array.isArray(raw.collectibles) ? raw.collectibles : [];
  const shards = Array.isArray(raw.shards) ? raw.shards : [];
  const endingsSeen = Array.isArray(raw.endingsSeen) ? raw.endingsSeen : [];
  const achievements = Array.isArray(raw.achievements) ? raw.achievements : [];
  const levelTimes = raw.levelTimes && typeof raw.levelTimes === "object" ? raw.levelTimes : {};
  const noHintLevels = Array.isArray(raw.noHintLevels) ? raw.noHintLevels : [];
  return {
    unlockedLevel: Math.max(Math.min(raw.unlockedLevel || 1, levels.length), nextUnlocked),
    completed,
    runs,
    collectibles,
    shards,
    secretUnlocked: raw.secretUnlocked || false,
    endingsSeen,
    achievements,
    levelTimes,
    noHintLevels
  };
}

function unlockAchievement(id) {
  if (!progress.achievements.includes(id) && achievements[id]) {
    progress.achievements.push(id);
    saveProgress();
    const ach = achievements[id];
    showToast(`🏆 成就解锁：${ach.icon} ${ach.name}`);
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function getDefaultRunState() {
  return {
    selectedItems: [],
    inventory: [],
    levelState: { notes: [], hintIndex: 0, hotspotsClicked: {} }
  };
}

function resetRunState() {
  const run = getDefaultRunState();
  selectedItems = [];
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
  selectedItems = Array.isArray(saved.selectedItems) ? saved.selectedItems.filter(i => inventory.includes(i)) : [];
  levelState = saved.levelState && typeof saved.levelState === "object"
    ? { notes: [], hintIndex: 0, hotspotsClicked: {}, ...saved.levelState }
    : { notes: [], hintIndex: 0, hotspotsClicked: {} };
  if (!Array.isArray(levelState.notes)) levelState.notes = [];
  if (typeof levelState.hintIndex !== "number") levelState.hintIndex = 0;
  if (!levelState.hotspotsClicked || typeof levelState.hotspotsClicked !== "object") levelState.hotspotsClicked = {};
}

function saveRunSnapshot() {
  if (!currentLevel) return;
  progress.runs = progress.runs || {};
  progress.runs[currentLevel.id] = {
    selectedItems,
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
        <div class="moon" data-easter-egg="moon"></div>
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
        <button class="ghost-btn" data-action="achievements">🏆 成就</button>
        <button class="ghost-btn" data-action="storybook">📖 故事回顾</button>
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
  // 记录关卡开始时间
  levelState.startTime = Date.now();
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
  const showSceneTouchHint = !levelState.sceneHintSeen;
  levelState.sceneHintSeen = true;
  saveRunSnapshot();
  const hotspots = getLevelHotspots();
  const sceneImageUrl = getAssetUrl(currentLevel.sceneImage);

  // 特殊关卡渲染
  let specialContent = "";
  if (currentLevel.handler === "memory") {
    specialContent = renderMemoryGame();
  } else if (currentLevel.handler === "timeline") {
    specialContent = renderTimelineGame();
  }

  app.innerHTML = `
    <section class="screen game-screen">
      ${debugHotspots ? '<div class="debug-mode-badge">热区调试模式</div>' : ""}
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
      ${specialContent ? specialContent : `
      <div class="scene-card scene-image-card ${currentLevel.sceneClass} ${debugHotspots ? "debug-hotspots" : ""}">
        <div class="scene-visual">
          <img class="scene-image" src="${sceneImageUrl}" alt="${currentLevel.title}场景" onerror="this.closest('.scene-card').classList.add('image-error'); this.remove();">
          <div class="scene-fallback">
            <strong>${currentLevel.title}</strong>
            <span>场景图片加载失败，请检查 ${currentLevel.sceneImage}</span>
          </div>
          <div class="scene-vignette"></div>
          ${showSceneTouchHint ? '<div class="scene-touch-hint" aria-hidden="true"></div>' : ""}
        </div>
        <div class="hotspot-layer">
          ${hotspots.map((hotspot, index) => renderHotspot(hotspot, index)).join("")}
        </div>
      </div>
      `}
      ${debugHotspots && !specialContent ? renderHotspotEditorPanel(hotspots) : ""}
      ${!specialContent ? '<button class="hint-btn" data-action="hint" aria-label="提示">?</button>' : ""}
      ${!specialContent ? renderInventory() : ""}
    </section>
  `;
}

// 渲染记忆配对游戏
function renderMemoryGame() {
  const cards = levelState.memoryCards || [];
  const phase = levelState.memoryPhase || "ready";

  return `
    <div class="memory-game">
      ${phase === "ready" ? `
        <p class="memory-intro">点击"开始记忆"按钮，记住图卡的位置后凭记忆配对。</p>
        <button class="memory-start-btn primary-btn" data-action="memory-start">开始记忆</button>
      ` : ""}
      <div class="memory-cards">
        ${cards.map((card, index) => `
          <button class="memory-card ${card.flipped || card.matched ? 'flipped' : ''} ${card.matched ? 'matched' : ''}"
                  data-action="memory-card" data-card="${index}" ${card.matched ? 'disabled' : ''}>
            ${card.flipped || card.matched || phase === "showing" ? `
              <span class="card-front">${card.icon}</span>
              <span class="card-back"></span>
            ` : `
              <span class="card-back"></span>
            `}
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

// 渲染时间线排序游戏
function renderTimelineGame() {
  const slots = levelState.timelineSlots || [null, null, null, null, null, null];
  const items = levelState.timelineItems || [];

  return `
    <div class="timeline-game">
      <p class="timeline-intro">按通关顺序排列故事：从第1关到第8关。</p>
      <div class="timeline-slots">
        ${slots.map((slot, index) => `
          <div class="timeline-slot ${slot ? 'filled' : ''}" data-action="timeline-slot" data-slot="${index}">
            ${slot ? `<span class="slot-icon">${slot.icon}</span><span class="slot-name">${slot.name}</span>` : `<span class="slot-empty">位置 ${index + 1}</span>`}
          </div>
        `).join("")}
      </div>
      <div class="timeline-items">
        <p class="timeline-items-label">待选故事：</p>
        ${items.filter(item => !slots.includes(item)).map(item => `
          <button class="timeline-item" data-action="timeline-select" data-item="${item.id}">
            <span>${item.icon}</span><span>${item.name}</span>
          </button>
        `).join("")}
      </div>
      <button class="timeline-submit-btn primary-btn" data-action="timeline-submit">确认顺序</button>
    </div>
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

function getAssetUrl(path) {
  return new URL(path, appBaseUrl).href;
}

// 背包已选中道具（支持选择两个进行组合）
let selectedItems = [];

function renderInventory() {
  // 计算可组合的道具对
  const combinable = [];
  for (let i = 0; i < inventory.length; i++) {
    for (let j = i + 1; j < inventory.length; j++) {
      if (tryCombineItems(inventory[i], inventory[j])) {
        combinable.push([inventory[i], inventory[j]]);
      }
    }
  }

  return `
    <aside class="inventory">
      <div class="inventory-head">
        <span class="bag-title">背包</span>
        <span>${selectedItems.length > 0 ? `已选${selectedItems.length}个` : "点击道具选中"}</span>
      </div>
      ${combinable.length > 0 ? `<div class="combine-hint">💡 有可组合的道具</div>` : ""}
      <div class="inventory-list">
        ${inventory.length ? inventory.map(renderInventoryItem).join("") : '<div class="inventory-empty">还没有获得道具</div>'}
      </div>
      ${selectedItems.length === 2 ? `<button class="combine-btn" data-action="combine">🔗 组合</button>` : ""}
    </aside>
  `;
}

function renderInventoryItem(id) {
  const item = inventoryConfig[id];
  const isSelected = selectedItems.includes(id);
  return `
    <button class="inventory-item ${isSelected ? "selected" : ""}" data-inventory="${id}">
      <span class="item-emoji">${item.icon}</span>
      <span class="item-label">${item.label}</span>
    </button>
  `;
}

function handleSceneObject(objectId, hotspotId = objectId) {
  levelState.hotspotsClicked = levelState.hotspotsClicked || {};
  levelState.hotspotsClicked[hotspotId] = true;
  saveRunSnapshot();
  const handler = levelHandlers[currentLevel.handler];
  handler?.(objectId);
}

function triggerHotspotFeedback(button) {
  if (!button) return;
  button.classList.remove("is-rippling");
  void button.offsetWidth;
  button.classList.add("is-rippling");
  setTimeout(() => button.classList.remove("is-rippling"), 420);
}

function addNote(title, text, silent = false) {
  if (!levelState.notes.some((note) => note.title === title)) {
    levelState.notes.push({ title, text });
    saveRunSnapshot();
    if (!silent) showToast("线索已加入笔记。");
  }
}

function getLevelHotspots() {
  return currentLevel.hotspots || currentLevel.objects;
}

function getHotspotPriority(hotspot) {
  if (typeof hotspot.priority === "number") return hotspot.priority;
  const area = Math.max(0.1, Number(hotspot.width || 0) * Number(hotspot.height || 0));
  return Math.max(1, 10000 / area);
}

function getHotspotZIndex(hotspot) {
  return Math.round(getHotspotPriority(hotspot) * 100 + Math.max(0, 10000 - ((hotspot.width || 0) * (hotspot.height || 0))));
}

function formatHotspotNumber(value) {
  return Number(value).toFixed(1);
}

function renderHotspot(hotspot, index = 0) {
  const used = isHotspotUsed(hotspot) ? "used" : "";
  const color = hotspotColors[index % hotspotColors.length];
  return `
    <button class="hotspot ${used}" data-hotspot="${hotspot.id}" data-object="${hotspot.targetObjectId || hotspot.id}" aria-label="${hotspot.label}" style="left:${hotspot.x}%;top:${hotspot.y}%;width:${hotspot.width}%;height:${hotspot.height}%;z-index:${getHotspotZIndex(hotspot)};--hotspot-color:${color}">
      <span class="hotspot-label">${hotspot.id} | ${hotspot.label}</span>
      <span class="hotspot-id">${hotspot.id}</span>
      ${debugHotspots ? '<span class="hotspot-resize" data-resize-handle="true" aria-hidden="true"></span>' : ""}
    </button>
  `;
}

function isHotspotUsed(hotspot) {
  const clicked = levelState.hotspotsClicked || {};
  return Boolean(clicked[hotspot.id] || levelState[hotspot.targetObjectId || hotspot.id]);
}

function renderHotspotEditorPanel(hotspots) {
  return `
    <section class="hotspot-editor" aria-label="热区校准面板">
      <div class="hotspot-editor-head">
        <div>
          <strong>Hotspot Editor</strong>
          <span>拖动矩形移动，拖右下角缩放。</span>
        </div>
        <button class="copy-hotspots-btn" data-action="copy-hotspots">复制当前关卡热区配置</button>
      </div>
      <div class="hotspot-table">
        <div class="hotspot-table-row hotspot-table-title">
          <span>id</span><span>label</span><span>x</span><span>y</span><span>width</span><span>height</span>
        </div>
        ${hotspots.map(renderHotspotPanelRow).join("")}
      </div>
      <textarea class="hotspot-copy-fallback" readonly hidden></textarea>
    </section>
  `;
}

function renderHotspotPanelRow(hotspot) {
  return `
    <div class="hotspot-table-row" data-hotspot-row="${hotspot.id}">
      <span>${hotspot.id}</span>
      <span>${hotspot.label}</span>
      <span data-field="x">${formatHotspotNumber(hotspot.x)}</span>
      <span data-field="y">${formatHotspotNumber(hotspot.y)}</span>
      <span data-field="width">${formatHotspotNumber(hotspot.width)}</span>
      <span data-field="height">${formatHotspotNumber(hotspot.height)}</span>
    </div>
  `;
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
  if (!lock) return;

  const isLetterLock = lock.password && /^[a-zA-Z]+$/.test(lock.password);
  const inputType = isLetterLock ? "text" : "numeric";
  const maxLen = lock.password ? lock.password.length : 4;
  const placeholder = isLetterLock ? "___".repeat(maxLen).slice(0, maxLen) : "----".slice(0, maxLen);
  const lockTitle = isLetterLock ? "字母锁" : "数字锁";
  const lockText = isLetterLock ? "请输入字母密码。答案不是数字，是名字。" : "请输入四位密码。答案应该来自已经连起来的线索。";

  showModal({
    eyebrow: `锁面泛着微光 · ${lockTitle}`,
    title: object.label,
    text: lockText,
    extra: `<input id="password-input" class="password-input" inputmode="${inputType}" maxlength="${maxLen}" autocomplete="off" placeholder="${placeholder}" style="letter-spacing:${isLetterLock ? '8px' : '6px'}">`,
    actions: [
      { label: "确认", className: "primary-btn", onClick: () => checkPassword(lockId, lock) },
      { label: "取消", className: "secondary-btn", onClick: closeModal }
    ]
  });
  setTimeout(() => document.querySelector("#password-input")?.focus(), 80);
}

function checkPassword(lockId, lock) {
  const input = document.querySelector("#password-input");
  const value = input ? input.value.trim().toUpperCase() : "";
  const expected = lock.password.toUpperCase();
  if (!input || value !== expected) {
    const card = modal.querySelector(".modal-card");
    card?.classList.remove("password-error");
    void card?.offsetWidth;
    card?.classList.add("password-error");
    showToast(lock.fail);
    return;
  }
  const card = modal.querySelector(".modal-card");
  card?.classList.add("password-success");
  setTimeout(() => {
    card?.classList.remove("password-success");
    closeModal();
    levelHandlers[currentLevel.handler]?.(`${lockId}:success`);
  }, 260);
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
  // 如果已选中两个，检查点击的是否是可组合对
  if (selectedItems.length === 2) {
    // 已经在组合模式，不处理点击
    return;
  }

  // 检查是否已选中
  const idx = selectedItems.indexOf(id);
  if (idx > -1) {
    // 取消选中
    selectedItems.splice(idx, 1);
  } else {
    // 选中道具
    if (selectedItems.length < 2) {
      selectedItems.push(id);
    }
  }

  saveRunSnapshot();
  renderGame();

  // 如果选中了两个且可组合，显示提示
  if (selectedItems.length === 2) {
    const combo = tryCombineItems(selectedItems[0], selectedItems[1]);
    if (combo) {
      showToast("两个道具可以组合，点击下方'组合'按钮");
    } else {
      showToast("这两个道具无法组合");
      // 清空选择
      selectedItems = [];
      saveRunSnapshot();
      renderGame();
    }
  }
}

// 处理组合按钮点击
function handleCombineItems() {
  if (selectedItems.length !== 2) return;

  const combo = tryCombineItems(selectedItems[0], selectedItems[1]);
  if (combo) {
    // 组合成功
    inventory = inventory.filter(i => i !== selectedItems[0] && i !== selectedItems[1]);
    inventory.push(combo.id);
    selectedItems = [];
    saveRunSnapshot();
    renderGame();
    showToast(`组合成功：${combo.label}`);
    playClickSound();
  }
}

// 道具组合配置
const comboRecipes = {
  "candle+matchbox": { id: "litCandle", label: "点燃的蜡烛", icon: "🕯️" },
  "candle+oldPen": { id: "litCandle", label: "点燃的蜡烛", icon: "🕯️" },
  "magnifying+candle": { id: "litCandle", label: "点燃的蜡烛", icon: "🕯️" },
  "oldPen+blankPaper": { id: "written", label: "写完的纸", icon: "📝" }
};

function tryCombineItems(item1, item2) {
  const combo = [item1, item2].sort().join("+");
  return comboRecipes[combo] || null;
}

function completeLevel(levelId) {
  if (!progress.completed.includes(levelId)) {
    progress.completed.push(levelId);
  }
  progress.unlockedLevel = Math.max(progress.unlockedLevel, Math.min(levelId + 1, levels.length));
  clearRunSnapshot(levelId);

  // 添加故事碎片
  const level = levels.find(l => l.id === levelId);
  if (level && level.storyFragment && !progress.shards.includes(levelId)) {
    progress.shards.push(levelId);
  }

  // 检查是否解锁隐藏结局（收集全部9个故事碎片 + 第9关完成）
  if (progress.shards.length >= 9 && levelId === 9) {
    progress.secretUnlocked = true;
  }

  // 记录通关时间和成就
  if (levelState.startTime) {
    const duration = (Date.now() - levelState.startTime) / 1000;
    progress.levelTimes[levelId] = duration;
    // 速通成就（5分钟内）
    if (duration < 300) {
      unlockAchievement("speedRun");
    }
  }

  // 不使用提示通关成就
  if (levelState.hintIndex === 0 && !progress.noHintLevels.includes(levelId)) {
    progress.noHintLevels.push(levelId);
    unlockAchievement("noHint");
  }

  // 检查所有关卡不用提示
  if (progress.noHintLevels.length >= 10) {
    unlockAchievement("allNoHint");
  }

  // 第一关完成
  if (levelId === 1) {
    unlockAchievement("firstStep");
  }

  // 通关全部10关
  if (progress.completed.length >= 10) {
    unlockAchievement("allDoors");
  }

  // 收集所有碎片
  if (progress.shards.length >= 9) {
    unlockAchievement("collector");
  }

  // 达成隐藏结局
  if (progress.endingsSeen.includes("secret")) {
    unlockAchievement("secretEnding");
  }

  saveProgress();

  // 构建前章引用提示
  let prevChapterTip = "";
  if (level.prevChapter) {
    prevChapterTip = `<p class="chapter-tip prev-chapter-tip">💭 ${level.prevChapter.text}</p>`;
  }

  showModal({
    eyebrow: "推理完成",
    title: currentLevel.title,
    text: `${currentLevel.successText}\n\n${currentLevel.story}${level.storyFragment ? `\n\n${level.storyFragment}` : ""}`,
    extra: `${prevChapterTip}<p class="chapter-tip">${progress.shards.length >= 9 && levelId < 9 ? "你已经收集了足够的记忆碎片……真相，正在等待揭晓。" : progress.shards.length >= 9 && levelId === 9 ? "所有记忆碎片已收集完毕。隐藏的结局，已经向你敞开。" : "这一章已经结束。你可以继续下一扇门，也可以回到关卡选择。"}</p>`,
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
      if (!selectedItems.includes("scissors")) {
        showClue("枯枝", "这些枯枝缠住了花架，也许需要工具。", { title: "枯枝", text: "需要工具才能修剪。" });
        return;
      }
      levelState.branches = true;
      selectedItems = selectedItems.filter(id => id !== "scissors");
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
      bookshelf: {
        title: "左右书架",
        text: "四个分类书架各有一个空位：小说 A 是 3，植物 C 是 1，生活 B 是 4，旅行 D 是 2。",
        note: { title: "书架空位", text: "A=3，C=1，B=4，D=2；要结合归还顺序。" }
      },
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
    if (objectId === "shutter") {
      showClue("卷帘门", "卷帘门被锁住了，旁边的数字锁还没有打开。");
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
      },
      redLamp: {
        title: "红色安全灯",
        text: "红灯只是在提醒你：这里看重照片显影后的顺序，不看拍摄时间。",
        note: { title: "红色安全灯", text: "不要被照片时间误导，按故事顺序整理。" }
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
  },

  // ========== 第6关：清晨食堂 ==========
  // 谜题核心：外卖小哥路线图，不是按菜单的A/B区，而是按实际行走路线的最后一位
  restaurant(objectId) {
    const clues = {
      menu: {
        title: "今日菜单",
        text: "菜单上贴着A区、B区、C区标注，旁边用红笔写着：员工走右边，顾客走左边。",
        note: { title: "菜单提示", text: "A/B/C区是给顾客看的，员工要走不同的路线。" }
      },
      deliveryBoard: {
        title: "外卖记录板",
        text: "四张外卖单按时间排列：第1单冷柜取饮料，第2单调料台拿一次性餐具，第3单出餐口取打包盒，第4单收银台结账。但这是点餐顺序，不是取餐顺序。",
        note: { title: "外卖单", text: "点餐顺序：冷柜→调料台→出餐口→收银台。但这误导你——外卖小哥按实际路线走。" }
      },
      routeMap: {
        title: "墙上路线图",
        text: "路线图用红色箭头标注了一条路径：收银台(起点0)→冷柜(第1站3)→调料台(第2站7)→出餐口(第3站2)。图下方写着：只取最后一站经过的数字。",
        note: { title: "路线图关键", text: "路线：收银台0→冷柜3→调料台7→出餐口2。只取经过顺序的最后一位：0→3→7→2。" }
      },
      fridge: {
        title: "冷柜",
        text: "冷柜玻璃上贴着一张便利贴：第1站，数字3。",
        note: { title: "冷柜数字", text: "冷柜是路线第1站，数字3。" }
      },
      counter: {
        title: "收银台",
        text: "收银台屏幕显示：起点，数字0。旁边用马克笔写着：这是外卖小哥出发的地方。",
        note: { title: "收银台", text: "收银台是起点，数字0。" }
      },
      spice: {
        title: "调料台",
        text: "调料台上放着一张取餐确认单：第2站，数字7。",
        note: { title: "调料台数字", text: "调料台是路线第2站，数字7。" }
      },
      window: {
        title: "出餐口",
        text: "出餐口窗口挂着一块小牌子：第3站，终点，数字2。",
        note: { title: "出餐口数字", text: "出餐口是终点，数字2。" }
      }
    };
    if (objectId === "staffDoor") {
      showClue("员工门", "门锁是四位数字锁，提示写着：答案不在菜单里，在送餐的路上。");
      showPasswordModal("staffDoor");
      return;
    }
    if (objectId === "staffDoor:success") {
      completeLevel(6);
      return;
    }
    showClue(clues[objectId]?.title || "未知物品", clues[objectId]?.text || "这里什么都没有。", clues[objectId]?.note);
  },

  // ========== 第7关：雨天邮局 ==========
  // 谜题核心：按退回次数排列包裹，再取格子数字。退回次数藏在下角。
  postoffice(objectId) {
    const clues = {
      registerBook: {
        title: "包裹登记簿",
        text: "登记簿记录了每件包裹的邮戳日期：A件2019.03.07，B件2021.08.15，C件2022.11.02，D件2023.05.21。最下方用铅笔写着：按送达顺序排列。",
        note: { title: "日期陷阱", text: "日期不是线索！登记簿下方还有一行小字：退回次数见包裹右下角。" }
      },
      packageA: {
        title: "包裹 A",
        text: "包裹A邮戳日期2019.03.07，右下角印章显示：退回1次。格3。",
        note: { title: "包裹A", text: "退回1次，格3，数字3。" }
      },
      packageB: {
        title: "包裹 B",
        text: "包裹B邮戳日期2021.08.15，右下角印章显示：退回2次。格7。",
        note: { title: "包裹B", text: "退回2次，格7，数字7。" }
      },
      packageC: {
        title: "包裹 C",
        text: "包裹C邮戳日期2022.11.02，右下角印章显示：退回3次。格5。",
        note: { title: "包裹C", text: "退回3次，格5，数字5。" }
      },
      packageD: {
        title: "包裹 D",
        text: "包裹D邮戳日期2023.05.21，右下角印章显示：退回4次。格1。",
        note: { title: "包裹D", text: "退回4次，格1，数字1。" }
      },
      locker: {
        title: "储物柜",
        text: "储物柜门没锁，里面有一张便签写着：按退回次数从少到多排列，1→2→3→4，对应格子的数字就是答案。",
        note: { title: "储物柜便签", text: "按退回次数排列：1(A)→2(B)→3(C)→4(D)，对应数字：3→7→5→1。" }
      }
    };
    if (objectId === "ironDoor") {
      showClue("铁门", "铁门被封条封住，旁边有一把四位数字锁。锁边刻着一行字：寄不出的东西，按被退回的次数决定顺序。");
      showPasswordModal("ironDoor");
      return;
    }
    if (objectId === "ironDoor:success") {
      completeLevel(7);
      return;
    }
    showClue(clues[objectId]?.title || "未知物品", clues[objectId]?.text || "这里什么都没有。", clues[objectId]?.note);
  },

  // ========== 第8关：灯塔码头 ==========
  // 谜题核心：不是找数字，而是找名字。答案守夜人，首字母SYR
  lighthouse(objectId) {
    const clues = {
      woodenSign: {
        title: "木牌",
        text: "木牌上的字迹模糊，写着：你已经走了很远，但最后一扇门，只认一个名字。不是数字，是身份。",
        note: { title: "木牌提示", text: "这不是数字锁，是字母锁。门只认身份，不认数字。" }
      },
      oldPhoto: {
        title: "旧照片",
        text: "照片上是一扇门，和你一路走来的那些门一模一样。照片背面写着一行字：守夜人，是你的名字。",
        note: { title: "旧照片", text: "守夜人——这是你的身份。" }
      },
      window: {
        title: "灯塔窗",
        text: "透过窗户可以看到海面，窗台上有一行被海风吹散的字：路、灯、等待、故事……你是谁？",
        note: { title: "灯塔窗", text: "回顾每关的关键词：路、等待、灯、故事——但答案不是这些词。" }
      },
      seaweed: {
        title: "海藻",
        text: "海藻丛中有一块被冲刷干净的小石子，上面刻着：SY。后面被海水冲掉了。",
        note: { title: "石子", text: "石子上有SY两个字母开头。" }
      }
    };
    if (objectId === "lighthouseDoor") {
      showClue("灯塔门", "这是一把字母锁，不是数字锁。门上刻着：只认名字，不认数字。");
      showPasswordModal("lighthouseDoor");
      return;
    }
    if (objectId === "lighthouseDoor:success") {
      completeLevel(8);
      return;
    }
    showClue(clues[objectId]?.title || "未知物品", clues[objectId]?.text || "这里什么都没有。", clues[objectId]?.note);
  },

  // ========== 第9关：守夜人档案室 ==========
  // 谜题核心：照片背面有真实拍摄顺序，按背面顺序取框上数字
  archive(objectId) {
    // 使用放大镜查看照片可以看到隐藏文字
    if (objectId === "photo1" || objectId === "photoWall1") {
      levelState.photo1Clicked = true;
      const extraText = selectedItems.includes("magnifying") ? "\n\n🔍 用放大镜仔细看，背面还有一行小字：'这是第三次拍摄，第一次是在那个雨夜。'" : "";
      showClue("照片①", "墙上的照片①标注着拍摄时间：便利店场景07:30。框的右上角写着数字7。翻到背面，背面用红笔写着：实际拍摄顺序是3。" + extraText, { title: "照片①", text: "框上数字7，背面真实顺序3。" });
      return;
    }
    if (objectId === "photo2" || objectId === "photoWall2") {
      levelState.photo2Clicked = true;
      const extraText = selectedItems.includes("magnifying") ? "\n\n🔍 用放大镜仔细看，背面还有一行小字：'花房里等待的人，也曾在这里拍照。'" : "";
      showClue("照片②", "墙上的照片②标注着拍摄时间：花房场景15:40。框的右上角写着数字3。翻到背面，背面用红笔写着：实际拍摄顺序是1。" + extraText, { title: "照片②", text: "框上数字3，背面真实顺序1。" });
      return;
    }
    if (objectId === "photo3" || objectId === "photoWall3") {
      levelState.photo3Clicked = true;
      const extraText = selectedItems.includes("magnifying") ? "\n\n🔍 用放大镜仔细看，背面还有一行小字：'那晚卧室的灯亮着，你忘关了吗？'" : "";
      showClue("照片③", "墙上的照片③标注着拍摄时间：卧室场景22:15。框的右上角写着数字9。翻到背面，背面用红笔写着：实际拍摄顺序是2。" + extraText, { title: "照片③", text: "框上数字9，背面真实顺序2。" });
      return;
    }
    if (objectId === "photo4" || objectId === "photoWall4") {
      levelState.photo4Clicked = true;
      const extraText = selectedItems.includes("magnifying") ? "\n\n🔍 用放大镜仔细看，背面还有一行小字：'书店的故事，还没有写完。'" : "";
      showClue("照片④", "墙上的照片④标注着拍摄时间：书店场景09:20。框的右上角写着数字1。翻到背面，背面用红笔写着：实际拍摄顺序是4。" + extraText, { title: "照片④", text: "框上数字1，背面真实顺序4。" });
      return;
    }
    if (objectId === "archiveBook") {
      showPasswordModal("archiveRoom");
      return;
    }
    if (objectId === "cabinet") {
      addItem("magnifying", "铁皮柜里有一把旧放大镜。");
      addNote("放大镜", "获得放大镜，可以仔细观察细节。");
      renderGame();
      showClue("铁皮柜", "柜子里有一把积灰的放大镜。用它可以仔细看看照片背面的小字。");
      return;
    }
    if (objectId === "candle") {
      addItem("candle", "桌上有一根旧蜡烛，也许可以用火柴点亮。");
      renderGame();
      showClue("蜡烛", "一根旧蜡烛。可以用火柴点亮来照亮黑暗的地方。");
      return;
    }
    if (objectId === "desk") {
      showClue("桌子", "桌子很干净，没有特别的东西。照片墙才是关键。");
      return;
    }
    // 点击照片墙时根据点击顺序检测是否排列正确
    if (objectId === "archiveRoom" || objectId === "photoWall1" || objectId === "photoWall2" || objectId === "photoWall3" || objectId === "photoWall4") {
      if (!levelState.photo1Clicked || !levelState.photo2Clicked || !levelState.photo3Clicked || !levelState.photo4Clicked) {
        showClue("照片墙", "档案册说要按真实顺序排列。你还没有看完所有照片的背面。");
        return;
      }
      showPasswordModal("archiveRoom");
      return;
    }
    if (objectId === "archiveRoom:success") {
      completeLevel(9);
      return;
    }
  },

  // ========== 第10关：永恒守夜人（双结局） ==========
  // 谜题核心：不是密码，而是文字选择。继续=守夜，离开=结束
  finale(objectId) {
    if (objectId === "blankPaper") {
      if (selectedItems.includes("oldPen")) {
        // 点燃蜡烛后可以看到纸上隐藏的字迹
        if (selectedItems.includes("litCandle")) {
          showFinaleChoice();
          return;
        }
        showClue("空白纸张", "纸上隐约有一些痕迹，但光线太暗看不清楚。也许需要点亮什么东西来照亮。", { title: "纸张", text: "拿起蜡烛，用光来照亮它。" });
        return;
      }
      showClue("空白纸张", "纸上什么都没有。也许你应该拿起笔，写下你的选择。", { title: "纸张", text: "这不是密码，是选择。你可以用笔写下'继续'或'离开'。" });
      return;
    }
    if (objectId === "oldPen") {
      addItem("oldPen", "旧钢笔拿起的那一刻，煤油灯的火苗亮了起来。");
      addNote("钢笔", "获得旧钢笔。也许该写点什么了。");
      renderGame();
      showClue("旧钢笔", "钢笔很旧，但还能用。笔尖指向那张空白的纸。");
      return;
    }
    if (objectId === "oilLamp") {
      levelState.lampLit = true;
      renderGame();
      showClue("煤油灯", "你点燃了煤油灯。灯光照亮了整个房间，也照亮了那张空白的纸。");
      return;
    }
    if (objectId === "window" || objectId === "rain") {
      showClue("窗外", "雨还在下。深夜还没有结束，但你可以选择要不要继续留在这里。");
      return;
    }
    showClue("房间", "一切都回到了起点。桌上有一张空白的纸和一支旧钢笔。你可以选择写下什么，或者什么都不写。", { title: "起点", text: "拿起笔，写下你的选择。" });
  },

  // ========== 第11关：记忆配对 ==========
  // 谜题核心：8张卡片（4对图案），翻开两张相同即配对成功
  memory(objectId) {
    // 初始化卡片
    if (!levelState.memoryCards) {
      levelState.memoryCards = [
        { id: 0, pattern: "便利店", icon: "🏪", flipped: false, matched: false },
        { id: 1, pattern: "花房", icon: "🌿", flipped: false, matched: false },
        { id: 2, pattern: "灯塔", icon: "🗼", flipped: false, matched: false },
        { id: 3, pattern: "相馆", icon: "📷", flipped: false, matched: false },
        { id: 4, pattern: "便利店", icon: "🏪", flipped: false, matched: false },
        { id: 5, pattern: "花房", icon: "🌿", flipped: false, matched: false },
        { id: 6, pattern: "灯塔", icon: "🗼", flipped: false, matched: false },
        { id: 7, pattern: "相馆", icon: "📷", flipped: false, matched: false }
      ];
      // 洗牌
      levelState.memoryCards.sort(() => Math.random() - 0.5);
    }

    if (objectId === "startBtn") {
      // 显示所有卡片3秒后隐藏（记忆环节）
      levelState.memoryPhase = "showing";
      levelState.memoryShowTime = Date.now();
      showClue("记忆挑战", "记住这些图案的位置：\n\n🏪 便利店\n🌿 花房\n🗼 灯塔\n📷 相馆\n\n每个图案会出现两次，3秒后它们会翻转过去。凭记忆翻开配对吧！");
      setTimeout(() => {
        if (levelState.memoryPhase === "showing") {
          levelState.memoryPhase = "playing";
          renderGame();
        }
      }, 3000);
      renderGame();
      return;
    }

    // 处理卡片点击
    const cardIndex = parseInt(objectId.replace("card", ""));
    if (isNaN(cardIndex)) return;

    const card = levelState.memoryCards[cardIndex];
    if (!card || card.flipped || card.matched) return;

    // 翻开卡片
    card.flipped = true;

    // 检查是否翻开两张
    const flippedCards = levelState.memoryCards.filter(c => c.flipped && !c.matched);
    if (flippedCards.length === 2) {
      // 检查是否匹配
      if (flippedCards[0].pattern === flippedCards[1].pattern) {
        // 配对成功
        flippedCards[0].matched = true;
        flippedCards[1].matched = true;
        showToast("配对成功！");
      } else {
        // 配对失败，2秒后翻回
        setTimeout(() => {
          flippedCards[0].flipped = false;
          flippedCards[1].flipped = false;
          renderGame();
        }, 1500);
      }
    }

    // 检查是否全部配对成功
    const matchedCount = levelState.memoryCards.filter(c => c.matched).length;
    if (matchedCount === 8) {
      completeLevel(11);
      return;
    }

    renderGame();
  },

  // ========== 第12关：时间线排序 ==========
  // 谜题核心：拖拽故事卡片按正确顺序排列
  timeline(objectId) {
    // 初始化插槽
    if (!levelState.timelineSlots) {
      levelState.timelineSlots = [null, null, null, null, null, null];
      levelState.timelineItems = [
        { id: 0, name: "便利店", icon: "🏪", correctPos: 0 },
        { id: 1, name: "花房", icon: "🌿", correctPos: 1 },
        { id: 2, name: "卧室", icon: "🛏️", correctPos: 2 },
        { id: 3, name: "书店", icon: "📚", correctPos: 3 },
        { id: 4, name: "邮局", icon: "📮", correctPos: 4 },
        { id: 5, name: "灯塔", icon: "🗼", correctPos: 5 }
      ];
    }

    if (objectId === "submitBtn") {
      // 检查顺序是否正确
      const correct = levelState.timelineSlots.every((item, index) =>
        item !== null && item.correctPos === index
      );
      if (correct) {
        completeLevel(12);
      } else {
        showToast("顺序不正确，再想想你通关的顺序...");
      }
      return;
    }

    // 拖拽逻辑
    const slotIndex = parseInt(objectId.replace("slot", ""));
    if (isNaN(slotIndex)) return;

    // 如果点击的是槽位，将该槽位的物品移回待选区
    if (levelState.timelineSlots[slotIndex]) {
      const item = levelState.timelineSlots[slotIndex];
      levelState.timelineSlots[slotIndex] = null;
      showToast(`将"${item.name}"放回待选区`);
      renderGame();
      return;
    }

    // 如果没有选中物品，显示提示
    showClue("时间线", "从下方选择一个故事，按你通关的顺序拖入上方的时间线。", { title: "时间线", text: "按通关顺序：便利店→花房→卧室→书店→邮局→灯塔" });
  },

  // 点击时间线物品选择
  timelineSelect(objectId) {
    if (!levelState.timelineSlots) return;

    const itemIndex = parseInt(objectId.replace("timelineItem", ""));
    if (isNaN(itemIndex)) return;

    const item = levelState.timelineItems[itemIndex];
    if (!item) return;

    // 找到空槽位放入
    const emptySlot = levelState.timelineSlots.findIndex(s => s === null);
    if (emptySlot !== -1) {
      levelState.timelineSlots[emptySlot] = item;
      showToast(`将"${item.name}"放入时间线位置${emptySlot + 1}`);
      renderGame();
    } else {
      showToast("时间线已满，请先移除某个故事");
    }
  }
};

function useVase() {
  if (!levelState.branches) {
    showClue("花瓶", "花瓶旁边太暗了，似乎还少了能确定顺序的句子。");
    return;
  }
  if (selectedItems.length === 0) {
    showToast("先从背包选一朵花。");
    return;
  }
  const selectedFlower = selectedItems.find(id => ["blueFlower", "whiteFlower", "pinkFlower"].includes(id));
  if (!selectedFlower) {
    showToast("这个道具不能放进花瓶。");
    return;
  }

  const order = ["blueFlower", "whiteFlower", "pinkFlower"];
  const placed = levelState.vaseOrder || [];
  if (selectedFlower !== order[placed.length]) {
    returnItems(placed);
    levelState.vaseOrder = [];
    // 移除选择的花
    selectedItems = selectedItems.filter(id => id !== selectedFlower);
    renderGame();
    showClue("顺序不对", "花没有枯萎，只是顺序还没被想起。");
    return;
  }

  levelState.vaseOrder = [...placed, selectedFlower];
  removeItem(selectedFlower);
  selectedItems = selectedItems.filter(id => id !== selectedFlower);

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

function showFinaleChoice() {
  const hasSecret = progress.secretUnlocked;
  showModal({
    eyebrow: "最后的抉择",
    title: "写下你的选择",
    text: hasSecret
      ? "你已经收集了全部的记忆碎片。现在，你可以选择：\n\n继续守夜，为下一个深夜等待的人点亮灯；\n\n或者，走进门外那道光，离开这里。\n\n又或者……你已经准备好了面对永恒的真相。"
      : "你已经走了很远。现在，你可以选择：\n\n继续守夜，为下一个深夜等待的人点亮灯；\n\n或者，走进门外那道光，离开这里。",
    extra: `
      <div class="finale-choices">
        ${hasSecret ? `
        <button class="finale-choice-btn finale-secret" data-finale="secret">
          <span class="finale-choice-icon">✨</span>
          <span class="finale-choice-text">面对永恒</span>
          <span class="finale-choice-hint">你已经准备好了</span>
        </button>
        ` : ""}
        <button class="finale-choice-btn finale-continue" data-finale="continue">
          <span class="finale-choice-icon">🌙</span>
          <span class="finale-choice-text">继续守夜</span>
          <span class="finale-choice-hint">守夜人的工作还没有结束</span>
        </button>
        <button class="finale-choice-btn finale-leave" data-finale="leave">
          <span class="finale-choice-icon">🚪</span>
          <span class="finale-choice-text">走进光里</span>
          <span class="finale-choice-hint">门外的光在等着你</span>
        </button>
      </div>
    `,
    actions: []
  });
}

function handleFinaleChoice(choice) {
  closeModal();

  // 隐藏真结局「永恒」
  if (choice === "secret" || (choice === "continue" && progress.secretUnlocked)) {
    progress.endingsSeen.push("secret");
    saveProgress();
    showModal({
      eyebrow: "结局 · 永恒",
      title: "永恒守夜人",
      text: currentLevel.story_secret || "你拿起笔，在纸上写下了所有你想说的话——给过去的自己，给未来的自己。煤油灯亮得像太阳。你明白了：守夜人不是一个人的名字，而是每一个愿意在深夜为别人点亮灯火的人的称号。",
      extra: `
        <div class="secret-ending-shards">
          <p>你收集的所有记忆碎片：</p>
          <div class="shards-list">
            ${levels.filter(l => l.storyFragment && progress.shards.includes(l.id)).map(l => `<p class="shard-item">${l.storyFragment}</p>`).join("")}
          </div>
          <p class="chapter-tip finale-ending">你带着全部的记忆，继续守夜。但这一次，你知道了一切——每一个深夜等待帮助的人，都是曾经的自己。</p>
        </div>
      `,
      actions: [
        { label: "回到首页", className: "primary-btn", onClick: () => { closeModal(); renderHome(); } },
        { label: "重新开始", className: "secondary-btn", onClick: () => { closeModal(); resetProgress(); renderHome(); } }
      ]
    });
    return;
  }

  // 普通结局 A：继续守夜
  if (choice === "continue") {
    progress.endingsSeen.push("continue");
    saveProgress();
    showModal({
      eyebrow: "结局 · 守夜",
      title: currentLevel.title,
      text: currentLevel.story_continue,
      extra: `<p class="chapter-tip finale-ending">你选择了继续守夜。新的深夜开始了，新的故事在等待被点亮。</p>
        <div class="ending-progress">故事碎片：${progress.shards.length}/9</div>`,
      actions: [
        { label: "回到首页", className: "primary-btn", onClick: () => { closeModal(); renderHome(); } },
        { label: "关卡选择", className: "secondary-btn", onClick: () => { closeModal(); renderLevelSelect(); } }
      ]
    });
    return;
  }

  // 普通结局 B：走进光里
  if (choice === "leave") {
    progress.endingsSeen.push("leave");
    saveProgress();
    showModal({
      eyebrow: "结局 · 离开",
      title: currentLevel.title,
      text: currentLevel.story_leave,
      extra: `<p class="chapter-tip finale-ending">你放下了笔，走进了门外的光里。感谢你成为守夜人，这个故事因为有你而完整。</p>
        <div class="ending-progress">故事碎片：${progress.shards.length}/9</div>`,
      actions: [
        { label: "查看故事回顾", className: "primary-btn", onClick: () => { closeModal(); renderCredits(); } },
        { label: "回到首页", className: "secondary-btn", onClick: () => { closeModal(); renderHome(); } }
      ]
    });
    return;
  }
  // 标记第10关为已完成
  if (!progress.completed.includes(10)) {
    progress.completed.push(10);
    saveProgress();
  }
}

function showModal({ eyebrow = "", title, text, extra = "", actions }) {
  modal.querySelector(".modal-card")?.classList.remove("password-error", "password-success");
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

function renderCredits() {
  showModal({
    eyebrow: "感谢游玩",
    title: "深夜小屋",
    text: "感谢你成为守夜人。",
    extra: `
      <div class="credits-container">
        <div class="credits-shards">
          <h3>故事回顾</h3>
          ${levels.filter(l => l.storyFragment).map(l => `<p class="shard-item">${l.storyFragment}</p>`).join("")}
        </div>
        <p class="credits-tagline">每一个深夜，都是守夜人的故事。</p>
      </div>
    `,
    actions: [
      { label: "回到首页", className: "primary-btn", onClick: () => { closeModal(); renderHome(); } }
    ]
  });
}

function renderAchievements() {
  const earnedIds = progress.achievements || [];
  const allAchievements = Object.values(achievements);

  showModal({
    eyebrow: "成就系统",
    title: "守夜人成就",
    text: `已解锁 ${earnedIds.length}/${allAchievements.length} 个成就`,
    extra: `
      <div class="achievements-list">
        ${allAchievements.map(ach => {
          const earned = earnedIds.includes(ach.id);
          return `
            <div class="achievement-item ${earned ? "earned" : "locked"}">
              <span class="achievement-icon">${ach.icon}</span>
              <div class="achievement-info">
                <span class="achievement-name">${ach.name}</span>
                <span class="achievement-desc">${ach.desc}</span>
              </div>
              ${ach.rare ? '<span class="achievement-rare">稀有</span>' : ''}
            </div>
          `;
        }).join("")}
      </div>
    `,
    actions: [
      { label: "关闭", className: "primary-btn", onClick: closeModal }
    ]
  });
}

function renderStorybook() {
  const collectedShards = progress.shards || [];
  const completedLevels = progress.completed || [];

  showModal({
    eyebrow: "故事回顾",
    title: "守夜人手册",
    text: `已收集 ${collectedShards.length} / 9 个故事碎片`,
    extra: `
      <div class="storybook-list">
        ${levels.slice(0, 9).map(level => {
          const hasShard = collectedShards.includes(level.id);
          const isCompleted = completedLevels.includes(level.id);
          return `
            <div class="storybook-item ${hasShard ? "collected" : "locked"}">
              <div class="storybook-header">
                <span class="storybook-icon">${isCompleted ? level.icon : "🔒"}</span>
                <div class="storybook-info">
                  <span class="storybook-title">第 ${level.id} 关：${level.title}</span>
                  <span class="storybook-status">${hasShard ? "已收集" : isCompleted ? "未收集" : "未通关"}</span>
                </div>
              </div>
              ${hasShard ? `<div class="storybook-fragment">${level.storyFragment}</div>` : ""}
            </div>
          `;
        }).join("")}
      </div>
      ${collectedShards.length >= 9 ? '<div class="storybook-secret">✨ 隐藏结局已解锁</div>' : ""}
    `,
    actions: [
      { label: "关闭", className: "primary-btn", onClick: closeModal }
    ]
  });
}

function findCurrentHotspot(id) {
  return getLevelHotspots().find((hotspot) => hotspot.id === id);
}

function clampHotspot(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function roundHotspotValue(value) {
  return Math.round(value * 10) / 10;
}

function updateHotspotElement(element, hotspot) {
  element.style.left = `${hotspot.x}%`;
  element.style.top = `${hotspot.y}%`;
  element.style.width = `${hotspot.width}%`;
  element.style.height = `${hotspot.height}%`;
  element.style.zIndex = getHotspotZIndex(hotspot);
}

function updateHotspotPanelRow(hotspot) {
  const row = document.querySelector(`[data-hotspot-row="${hotspot.id}"]`);
  if (!row) return;
  ["x", "y", "width", "height"].forEach((field) => {
    const cell = row.querySelector(`[data-field="${field}"]`);
    if (cell) cell.textContent = formatHotspotNumber(hotspot[field]);
  });
}

function startHotspotDrag(event) {
  if (!debugHotspots || !currentLevel) return;
  const button = event.target.closest("[data-hotspot]");
  if (!button) return;
  const hotspot = findCurrentHotspot(button.dataset.hotspot);
  const scene = button.closest(".scene-card");
  if (!hotspot || !scene) return;

  event.preventDefault();
  event.stopPropagation();

  const sceneRect = scene.getBoundingClientRect();
  const mode = event.target.closest("[data-resize-handle]") ? "resize" : "move";
  hotspotDrag = {
    mode,
    button,
    hotspot,
    sceneRect,
    pointerId: event.pointerId,
    startClientX: event.clientX,
    startClientY: event.clientY,
    startX: Number(hotspot.x),
    startY: Number(hotspot.y),
    startWidth: Number(hotspot.width),
    startHeight: Number(hotspot.height),
    moved: false
  };
  button.classList.add("editing");
  button.setPointerCapture?.(event.pointerId);
}

function moveHotspotDrag(event) {
  if (!hotspotDrag || event.pointerId !== hotspotDrag.pointerId) return;
  event.preventDefault();

  const dx = ((event.clientX - hotspotDrag.startClientX) / hotspotDrag.sceneRect.width) * 100;
  const dy = ((event.clientY - hotspotDrag.startClientY) / hotspotDrag.sceneRect.height) * 100;
  if (Math.abs(dx) > 0.2 || Math.abs(dy) > 0.2) hotspotDrag.moved = true;

  if (hotspotDrag.mode === "resize") {
    hotspotDrag.hotspot.width = roundHotspotValue(clampHotspot(hotspotDrag.startWidth + dx, 3, Math.max(3, 100 - hotspotDrag.hotspot.x)));
    hotspotDrag.hotspot.height = roundHotspotValue(clampHotspot(hotspotDrag.startHeight + dy, 3, Math.max(3, 100 - hotspotDrag.hotspot.y)));
  } else {
    hotspotDrag.hotspot.x = roundHotspotValue(clampHotspot(hotspotDrag.startX + dx, 0, Math.max(0, 100 - hotspotDrag.hotspot.width)));
    hotspotDrag.hotspot.y = roundHotspotValue(clampHotspot(hotspotDrag.startY + dy, 0, Math.max(0, 100 - hotspotDrag.hotspot.height)));
  }

  updateHotspotElement(hotspotDrag.button, hotspotDrag.hotspot);
  updateHotspotPanelRow(hotspotDrag.hotspot);
}

function endHotspotDrag(event) {
  if (!hotspotDrag || event.pointerId !== hotspotDrag.pointerId) return;
  if (!hotspotDrag.moved) {
    console.log(`clicked hotspot: ${hotspotDrag.hotspot.id} ${hotspotDrag.hotspot.label}`);
  }
  hotspotDrag.button.classList.remove("editing");
  hotspotDrag.button.releasePointerCapture?.(event.pointerId);
  suppressNextHotspotClick = true;
  hotspotDrag = null;
}

function serializeCurrentHotspots() {
  const lines = getLevelHotspots().map((hotspot) => {
    const fields = [
      `id: "${hotspot.id}"`,
      `label: "${hotspot.label}"`,
      hotspot.targetObjectId ? `targetObjectId: "${hotspot.targetObjectId}"` : "",
      `x: ${formatHotspotNumber(hotspot.x)}`,
      `y: ${formatHotspotNumber(hotspot.y)}`,
      `width: ${formatHotspotNumber(hotspot.width)}`,
      `height: ${formatHotspotNumber(hotspot.height)}`,
      typeof hotspot.priority === "number" ? `priority: ${hotspot.priority}` : ""
    ].filter(Boolean).join(", ");
    return `  { ${fields} }`;
  });
  return `hotspots: [\n${lines.join(",\n")}\n]`;
}

function copyCurrentHotspots() {
  const text = serializeCurrentHotspots();
  const fallback = document.querySelector(".hotspot-copy-fallback");
  const showFallback = () => {
    if (!fallback) return;
    fallback.hidden = false;
    fallback.value = text;
    fallback.focus();
    fallback.select();
    showToast("浏览器未允许自动复制，请手动复制文本框内容。");
  };

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => showToast("当前关卡热区配置已复制。"))
      .catch(showFallback);
  } else {
    showFallback();
  }
}

app.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  const level = event.target.closest("[data-level]")?.dataset.level;
  const hotspotButton = event.target.closest("[data-hotspot]");
  const hotspot = hotspotButton?.dataset.hotspot;
  const object = hotspotButton?.dataset.object || event.target.closest("[data-object]")?.dataset.object;
  const inventoryItem = event.target.closest("[data-inventory]")?.dataset.inventory;

  if (action === "start" || action === "continue") { renderLevelSelect(); playClickSound(); }
  if (action === "home") { renderHome(); playClickSound(); }
  if (action === "levels") { renderLevelSelect(); playClickSound(); }
  if (action === "hint" && currentLevel) showLayeredHint();
  if (action === "notes" && currentLevel) showNotes();
  if (action === "achievements") { renderAchievements(); playClickSound(); }
  if (action === "storybook") { renderStorybook(); playClickSound(); }
  if (action === "combine" && currentLevel) { handleCombineItems(); }
  if (action === "reset") resetProgress();
  if (action === "copy-hotspots" && currentLevel) copyCurrentHotspots();

  // 记忆游戏开始按钮
  if (action === "memory-start") {
    levelHandlers.memory("startBtn");
    playClickSound();
    return;
  }

  // 记忆游戏卡片点击
  if (action === "memory-card") {
    const cardIndex = event.target.closest("[data-card]")?.dataset.card;
    if (cardIndex !== undefined) {
      levelHandlers.memory(`card${cardIndex}`);
      playClickSound();
    }
    return;
  }

  // 时间线槽位点击
  if (action === "timeline-slot") {
    const slotIndex = event.target.closest("[data-slot]")?.dataset.slot;
    if (slotIndex !== undefined) {
      levelHandlers.timeline(`slot${slotIndex}`);
      playClickSound();
    }
    return;
  }

  // 时间线物品选择
  if (action === "timeline-select") {
    const itemIndex = event.target.closest("[data-item]")?.dataset.item;
    if (itemIndex !== undefined) {
      levelHandlers.timelineSelect(`timelineItem${itemIndex}`);
      playClickSound();
    }
    return;
  }

  // 时间线提交按钮
  if (action === "timeline-submit") {
    levelHandlers.timeline("submitBtn");
    playClickSound();
    return;
  }

  // 月亮彩蛋：连续点击10次触发
  const moonBtn = event.target.closest("[data-easter-egg='moon']");
  if (moonBtn) {
    moonClickCount++;
    if (moonClickCount >= 10) {
      moonClickCount = 0;
      showModal({
        eyebrow: "🌙 彩蛋",
        title: "守夜人的秘密",
        text: "你发现了一个隐藏的秘密：月亮会记住每一个在深夜迷路的人。当你在点击月亮的时候，守夜人也在看着你。\n\n谢谢你成为下一个守夜人。",
        actions: [
          { label: "继续守夜", className: "primary-btn", onClick: () => { closeModal(); renderLevelSelect(); } }
        ]
      });
      playClickSound();
      return;
    } else if (moonClickCount >= 5) {
      showToast(`月亮闪了一下...（${moonClickCount}/10）`);
    }
  }

  if (level) { startLevel(Number(level)); playClickSound(); }
  if (object) {
    if (debugHotspots) {
      if (suppressNextHotspotClick) {
        suppressNextHotspotClick = false;
        return;
      }
      return;
    }
    triggerHotspotFeedback(hotspotButton);
    handleSceneObject(object, hotspot || object);
  }
  if (inventoryItem) selectInventoryItem(inventoryItem);
});

app.addEventListener("pointerdown", startHotspotDrag);
app.addEventListener("pointermove", moveHotspotDrag);
app.addEventListener("pointerup", endHotspotDrag);
app.addEventListener("pointercancel", endHotspotDrag);

document.addEventListener("click", (event) => {
  // 捕获 modal-actions 里的按钮点击
  const button = event.target.closest("[data-modal-action]");
  if (button) {
    const index = Number(button.dataset.modalAction);
    const actions = modalActions._actions;
    if (actions && actions[index] && actions[index].onClick) {
      actions[index].onClick();
    }
  }
  // 结局选择
  const finaleChoice = event.target.closest("[data-finale]")?.dataset.finale;
  if (finaleChoice) {
    handleFinaleChoice(finaleChoice);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  if (event.key === "Enter" && document.activeElement?.id === "password-input") {
    modalActions.querySelector("[data-modal-action='0']")?.click();
  }
});

// ===== 音效系统 =====
let audioContext = null;

function getAudioContext() {
  if (!audioContext && window.AudioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // 不同音效类型
    switch (type) {
      case "click":
        oscillator.frequency.value = 600;
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
        break;
      case "success":
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        oscillator.start(ctx.currentTime);
        oscillator.frequency.setValueAtTime(1000, ctx.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(1200, ctx.currentTime + 0.2);
        oscillator.stop(ctx.currentTime + 0.3);
        break;
      case "fail":
        oscillator.frequency.value = 200;
        oscillator.type = "sawtooth";
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.15);
        break;
      case "unlock":
        oscillator.frequency.value = 440;
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        oscillator.start(ctx.currentTime);
        oscillator.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        oscillator.stop(ctx.currentTime + 0.2);
        break;
      case "ending":
        // 结局选择音效 - 和弦
        const freqs = [523, 659, 784]; // C5, E5, G5
        freqs.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          osc.start(ctx.currentTime + i * 0.1);
          osc.stop(ctx.currentTime + 0.5 + i * 0.1);
        });
        return; // 提前返回，因为上面已经处理了
    }

  } catch (e) {
    // 静默失败，不影响游戏
  }
}

// 加载音效设置
function loadSoundSettings() {
  try {
    const saved = localStorage.getItem(SOUND_SETTINGS_KEY);
    if (saved !== null) {
      soundEnabled = JSON.parse(saved);
    }
  } catch (e) {}
}

// 保存音效设置
function saveSoundSettings() {
  try {
    localStorage.setItem(SOUND_SETTINGS_KEY, JSON.stringify(soundEnabled));
  } catch (e) {}
}

loadSoundSettings();

// 音效包装
function playClickSound() { playSound && playSound("click"); }
function playSuccessSound() { playSound && playSound("success"); }
function playEndingSound() { playSound && playSound("ending"); }
function playUnlockSound() { playSound && playSound("unlock"); }

renderHome();
