/**
 * 28 款现象级微型独立游戏（≤3人团队）的深度分析：
 * 包含「游戏类型与看点」与「爆款逻辑/破圈驱动机制」
 */
export interface GameHighlightInfo {
  genreAnalysis: string; // 游戏类型与看点
  viralLogic: string;     // 爆款逻辑 / 破圈驱动机制
}

export const GAME_HIGHLIGHTS_DICT: Record<number, GameHighlightInfo> = {
  // 1. Balatro
  2379780: {
    genreAnalysis: "规则微创新牌组构建肉鸽（Roguelike Deckbuilder）。将全球通用的经典德州扑克规则作为极低门槛的认知载体，剥离所有繁琐叙事，纯粹依靠小丑牌（Joker）之间的乘法数值质变、塔罗牌重塑与盲注倍率跃升，创造极度爽快的心流。",
    viralLogic: "经典认知规则做减法 + 乘法指数级数值爆发 + 极简复古 CRT 滤镜视听反馈，让全球玩家与主播产生‘再来一把’的极致成瘾性循环。"
  },

  // 2. Lethal Company
  1966720: {
    genreAnalysis: "近距离语音多人合作恐怖撤离沙盒（Co-op Horror Extraction）。玩家扮演前往废弃卫星捡破烂的公司打工人，在有限电量、严苛定额与不可名状怪物的双重重压下极限求生。",
    viralLogic: "极度真实的近场语音空间衰减 + 物理布娃娃滑稽死法 + 团队连坐惩罚机制。天然契合直播切片传播，观众在惊吓与爆笑之间无缝切换，引发病毒式二创。"
  },

  // 3. Schedule I (一级管制)
  3164500: {
    genreAnalysis: "第一人称黑市帝国经营与开放世界战术模拟（Open-World Crime Tycoon）。从地下小作坊配方合成、进货包装、地推分销到雇佣小弟与躲避警方缉查，全拟真呈现商业帝国的崛起路径。",
    viralLogic: "高自由度犯罪模拟题材的稀缺性 + 严密递进的黑产经济与管理链条 + 极具沉浸感的第一人称交互，引爆全球模拟经营硬核玩家社群。"
  },

  // 4. Buckshot Roulette
  2835570: {
    genreAnalysis: "微场景心理博弈与桌面轮盘赌（Tabletop Psychological Thriller）。在潮湿阴暗的地下室与恶魔庄家对坐，将传统的左轮手枪替换为 12 号霰弹枪，配合手铐、放大镜、香烟等道具进行命悬一线的心理战。",
    viralLogic: "极具工业废土与录像带噪点美学（Lo-fi Grunge）+ 单房间极度聚焦的冷峻氛围 + 简单但极高张力的生死抉择，单局仅 15 分钟却具有现象级直播传播力。"
  },

  // 5. Manor Lords (庄园领主)
  1363080: {
    genreAnalysis: "中世纪无网格拟真城市建造与全战式战术推演（Realistic Medieval City Builder）。精细还原 14 世纪欧洲封建领地经济流转、有机无网格道路规划与季节气候对农业的真实制约。",
    viralLogic: "独狼开发者 Slavic Magic 历时 7 年全栈深耕 + 虚幻引擎极致画质打磨 + 长期社区透明开发与玩家深度共创，奠定了超越中型商业团队的坚实口碑。"
  },

  // 6. Supermarket Simulator (超市模拟器)
  2670630: {
    genreAnalysis: "第一人称日常劳动与超市经营模拟（First-Person Store Management）。涵盖订货拆箱、货架分类摆放、定价策略、扫码找零以及店铺装潢扩张的全流程沉浸式劳作。",
    viralLogic: "将繁复的日常劳动提炼为即时且强烈的正反馈 + 强迫症货架陈列治愈感 + 零门槛主播实况互动，迅速在全球掀起‘电子进货’热潮。"
  },

  // 7. TCG Card Shop Simulator (卡牌店模拟器)
  3070070: {
    genreAnalysis: "集换式卡牌店铺经营与开包收集模拟（TCG Store & Pack Opening Sim）。融合了订购卡包、线下开盒鉴定稀有闪卡、装入收藏册标价贩售、举办卡牌对决大赛的完整闭环。",
    viralLogic: "精准击中 TCG 玩家与抽卡爱好者的‘开包多巴胺’ + 强迫症整理卡册分类心流 + 真实卡店经营生态，让单人开发的商业潜力最大化释放。"
  },

  // 8. Librarian: Tidy Up the Arcane Library! (图书管理员：整理魔法图书馆吧！)
  4197610: {
    genreAnalysis: "第一人称纯粹收纳整理与魔法图书馆模拟（Pure Tidying & Library Organizing）。玩家的目标是将散落在宏大魔法图书馆内的全部 3,072 本图书逐一归位，解锁磁吸、疾跑等技能提升效率。",
    viralLogic: "极致纯粹的强迫症秩序重建 + 零战斗零挫败感的解压心流体验 + 垂类图书分类爱好的精准击中，无需复杂剧情即收获压倒性好评。"
  },

  // 9. Animal Well (动物井)
  813230: {
    genreAnalysis: "非传统解谜导向银河恶魔城（Atmospheric Puzzle Metroidvania）。没有任何常规战斗武器，玩家仅使用悠悠球、泡泡机、飞盘等玩具道具与阴森又生机勃勃的超现实地下生态深度互动。",
    viralLogic: "独狼开发者 Billy Basso 自研定制引擎实现的极致粒子光影 + ARG 级别的深层多周目谜题设计 + 密不透风的神秘探索感，树立了独立游戏解谜新标杆。"
  },

  // 10. Pizza Tower (披萨塔)
  2231450: {
    genreAnalysis: "高速横版动作与狂气平台跳跃（High-Speed Action Platformer）。继承并进化了《瓦里奥乐园 4》的设计精髓，以不可阻挡的高速冲刺破坏一切，并在关卡结尾展开惊心动魄的逃脱倒计时（Pizza Time）。",
    viralLogic: "狂暴手绘 90 年代美漫逐帧动画 + 极高上限的动量操作手感 + 极度上头的硬核配乐，打造出独一无二的作者印记（Auteur Style）。"
  },

  // 11. MECCHA CHAMELEON (涂色变色龙)
  4704690: {
    genreAnalysis: "多人涂色伪装与搞笑捉迷藏派对（Hide-and-Seek Party Game）。玩家在关卡中随意抽取颜料自定义身体花纹，完美融入环境背景，躲避抓捕者的火眼金睛。",
    viralLogic: "极简的‘变色躲猫猫’核心机制 + 玩家自主涂鸦产生的沙雕视觉笑点 + 极低的硬件与学习门槛，在年轻社交群体与直播平台中引发自发狂欢。"
  },

  // 12. How to Fish
  4001890: {
    genreAnalysis: "沙雕多人联机生存钓鱼与荒岛突围（Viral Co-op Survival Fishing）。海难幸存者必须一边用奇葩鱼竿钓取各类神秘海洋生物，一边拿起武器抵御深海怪物的侵袭。",
    viralLogic: "‘钓鱼佬绝不空军’的热梗结合 + 物理荒诞的合作失误与互坑笑料 + 2人小团队极快迭代节奏，发售 2 天内销量即破百万套。"
  },

  // 13. The Exit 8 (８番出口)
  2653790: {
    genreAnalysis: "地下通道短篇微恐与异常找茬模拟（Liminal Space Anomaly Hunt）。玩家被困在无尽循环的日本地下通道中，必须敏锐观察周遭细节，发现异常立即掉头，无异常则继续前进直至 8 号出口。",
    viralLogic: "将‘找不同’日常玩法融入阈限空间（Liminal Space）心理恐怖 + 极短单局与极强主播代入感，开创了风靡全球的‘8番出口-like’全新子品类。"
  },

  // 14. Tiny Glade (小筑微景)
  2198150: {
    genreAnalysis: "无网格自由涂抹与治愈系城堡搭建（Gridless Cozy Castle Doodler）。完全剔除了资源管理、战斗与任务惩罚，玩家仅需像画画一样自由涂抹墙体、拱门与窗户，程序会自动生成细腻的建筑逻辑。",
    viralLogic: "自研程序化几何算法实现的建筑化学反应（无缝转角、藤蔓生长、小鸟驻足）+ 极致惬意无压力的视觉听觉治愈体验，完美契合当代玩家的精神疗愈需求。"
  },

  // 15. Chained Together (链在一起)
  2881650: {
    genreAnalysis: "铁链羁绊多人硬核攀爬与平台跳跃（Chained 3D Climbing Platformer）。4 名玩家被一根带有真实物理刚体的铁链紧紧绑在一起，从地狱深渊向上攀登，一人失误全员坠落。",
    viralLogic: "极致考验友谊的连坐机制 + 物理铁链产生的意外拉扯与搞笑事故 + 极高情绪过山车带来的直播高光时刻，成为 2024 年现象级社交开黑神器。"
  },

  // 16. ZERO Sievert (零度辐射)
  1782120: {
    genreAnalysis: "2D 俯视角末日生存与硬核战术撤离射击（2D Top-Down Extraction Shooter）。深入程序化生成的废土区域搜刮物资、改装枪械配件、与各派系交涉并赶在辐射与怪物吞噬前安全撤离。",
    viralLogic: "成功将《逃离塔科夫》与《潜行者》的核心撤离博弈提炼至 2D 像素形态 + 极高风险高回报的搜刮快感，一人全栈完成全部美术与程序架构。"
  },

  // 17. Sledding Game (雪橇游戏)
  3438850: {
    genreAnalysis: "多人联机滑雪沙盒与近场语音派对（Multiplayer Snowsports Hangout）。自定义可爱动物角色与雪橇，在雪山中进行物理竞速、花式特技、打雪仗和围炉烤棉花糖。",
    viralLogic: "布娃娃物理带来的爆笑翻滚碰撞 + 惬意松弛的雪山社交氛围 + 开发者在 TikTok 上透明记录开发历程积累的深厚社群支持。"
  },

  // 18. Minami Lane (南美巷)
  2678990: {
    genreAnalysis: "极简日式风情街道规划与微经营模拟（Cozy Japanese Street Builder）。玩家通过建造拉面店、书店、花店，满足居民喜好，调节每日营业配方，撸猫并营造和谐社区氛围。",
    viralLogic: "清新水彩画风 + 2-4 小时短小精悍的零压力心流 + 极其亲民的价格与超高完成度，在女性玩家与休闲群体中收获 97%+ 极高好评。"
  },

  // 19. Slay the Princess — The Pristine Cut (斩杀公主)
  1989270: {
    genreAnalysis: "手绘黑白炭笔素描心理恐怖与多分支叙事（Hand-drawn Psychological Horror VN）。旁白命令你‘去地下室杀死那个会毁灭世界的公主’，而每一次抉择都会使公主变异为截然不同的形态。",
    viralLogic: "全手绘炭笔黑白压抑质感 + 全程顶级配音与哲学思辨 + 极致精妙的元叙事（Meta-fiction）分支网络，创造了独树一帜的叙事体验。"
  },

  // 20. Backpack Battles (背包乱斗)
  2427700: {
    genreAnalysis: "异步对战背包空间管理与自走棋构筑（Inventory Management Auto-Battler）。核心战斗在于背包网格内的物品摆放、朝向、空间压缩与道具星级协同触发（Synergy）。",
    viralLogic: "将‘整理背包’这一经典副玩法提炼为主核心博弈 + 异步对战无等待时间 + 深度装备合成进化树，引爆全球自走棋与卡牌圈层。"
  },

  // 21. Rusty's Retirement (锈迹退休)
  2666510: {
    genreAnalysis: "屏幕底部常驻放置农场与微多任务伴侣（Bottom-of-the-Screen Idle Farm）。游戏仅占用屏幕最底下一小条区域，玩家在日常办公、看剧、写代码的同时顺便收菜与自动化升级。",
    viralLogic: "颠覆传统全屏游戏的‘形态创新’ + 完美契合现代 PC 用户‘工作摸鱼/多任务伴侣’心理 + 零压力的自动化正反馈，发售即封神。"
  },

  // 22. HoloCure - Save the Fans!
  2420510: {
    genreAnalysis: "同人二次元像素弹幕射击与幸存者割草（Anime Vampire Survivors-like）。为每一位角色量身打造独特的专属武器、被动技能、小游戏与家园钓鱼系统。",
    viralLogic: "一人主导但品质全面超越大量商业同类作 + 极致纯粹的为爱发电（100% 免费无内购）+ 细节拉满的社群梗共鸣，创下 99.1% 的 Steam 历史天花板好评率。"
  },

  // 23. Pseudoregalia
  2365810: {
    genreAnalysis: "复古 N64 时代 3D 平台跳跃与类银河城动作（Retro 3D Platformer Metroidvania）。凭借翻滚、蹬墙跳、滑翔与空中挥砍，在梦境城堡中展开极致流畅的高机动性移动探索。",
    viralLogic: "单人开发对 3D 动量控制（Momentum Physics）与关卡跳跃手感的顶级调校 + 浓郁低多边形复古怀旧美学 + 紧凑刺激的探索流程。"
  },

  // 24. Crow Country (乌鸦之国)
  1996010: {
    genreAnalysis: "复古 PS1 时代低多边形古典生存恐怖（Classic 90s Survival Horror）。探访 1990 年神秘关闭的废弃游乐园，在有限弹药、物资管理与环境谜题中拼凑真相。",
    viralLogic: "对《生化危机 1》与《寂静岭》古典恐怖美学的现代改良 + 极高水准的场景谜题设计 + 双人兄弟团队多年积累的独立游戏设计功底。"
  },

  // 25. Deep Rock Galactic: Survivor
  2321470: {
    genreAnalysis: "单人俯视角自动射击与地形破坏幸存者（Single-Player Auto-Shooter with Destruction）。保留了深岩银河经典的挖矿破墙、虫潮围剿与空降仓撤离体验。",
    viralLogic: "经典成熟 IP 的轻量化幸存者变体 + 边打边挖地形的策略独特性 + 3 人微型突击队实现的高效产出与视听张力。"
  },

  // 26. Isles of Sea and Sky
  2688100: {
    genreAnalysis: "开放世界海洋推箱子与宏大环境谜题（Open-World Oceanic Sokoban Adventure）。乘船穿梭于奇幻群岛，解开数百个非线性环环相扣的推箱子与机制谜题。",
    viralLogic: "将古老的推箱子玩法升华为无引导开放世界大地图探索 + 极具沉浸感的高级像素视听，赢得硬核解谜玩家群体的一致推崇。"
  },

  // 27. Peglin (哥布林弹珠)
  2407200: {
    genreAnalysis: "弹珠台物理碰撞与爬塔卡牌构筑（Pachinko Roguelike Deckbuilder）。将《幻幻球（Peggle）》的弹球物理碰撞与《杀戮尖塔》的遗物/弹珠构筑完美融合。",
    viralLogic: "弹球下落随机性与构筑确定性的精妙平衡 + 满屏弹珠连环暴击的解压视听 + 3 人团队在抢先体验期间的持续打磨。"
  },

  // 28. Schedule 1 (独立版本)
  2125190: {
    genreAnalysis: "第一人称黑市战术模拟与化学经营（First-Person Chemical & Crime Simulation）。以地下小作坊配方合成与分销为核心的沉浸式犯罪模拟游戏。",
    viralLogic: "极具张力的题材稀缺性 + 细致的第一人称互动反馈与黑市帝国扩张路径。"
  }
};
