// 随机数据生成器
const Generator = {
  // 工具方法
  pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
  range(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },

  // ===== 剧情生成 =====
  storyData: {
    scenes: ['古老的森林', '废弃的城堡', '地下迷宫', '火山口', '冰封雪原', '沙漠绿洲', '海底神殿', '浮空岛屿', '暗影裂隙', '圣光神殿', '被遗忘的村庄', '龙之巢穴', '魔法学院', '地精矿洞', '精灵树屋', '恶魔领域', '时间裂缝', '星空祭坛'],
    events: ['发现了一个神秘的宝箱', '遭遇了一群强大的怪物', '遇到了一位神秘的旅人', '触发了古老的机关', '找到了失落的地图碎片', '听到了远处的求救声', '发现了隐藏的通道', '目睹了一场激烈的战斗', '获得了神秘力量的觉醒', '收到了来自远方的信件', '发现了被封印的武器', '遇到了命运的抉择'],
    conflicts: ['与黑暗势力的对抗', '寻找失落的神器', '拯救被囚禁的同伴', '解开古老的谜题', '阻止即将到来的灾难', '揭露隐藏的阴谋', '守护最后的圣地', '打破永恒的诅咒', '寻找回家的路', '对抗命运的安排'],
    twists: ['但事情并没有那么简单', '然而真相远比想象的更加复杂', '一个意想不到的盟友出现了', '隐藏的敌人终于露出了真面目', '古老的预言开始应验', '一切都是精心设计的陷阱', '真正的考验才刚刚开始']
  },

  generateStory() {
    const d = this.storyData;
    const scene = this.pick(d.scenes);
    const event = this.pick(d.events);
    const conflict = this.pick(d.conflicts);
    const twist = this.pick(d.twists);

    return {
      title: `${scene}的${this.pick(['秘密', '传说', '危机', '奇遇', '试炼', '觉醒'])}`,
      chapter: `第${this.range(1, 20)}章`,
      scene: scene,
      characters: '',
      content: `在${scene}中，主角${event}。\n\n这一切都与${conflict}有着密切的关系。${twist}。\n\n（在此继续补充剧情细节...）`,
      notes: '',
      tags: '随机生成'
    };
  },

  // ===== 装备生成 =====
  equipData: {
    prefixes: ['暗影', '烈焰', '寒冰', '雷霆', '圣光', '虚空', '血色', '翡翠', '黄金', '白银', '远古', '混沌', '命运', '永恒', '破晓', '黄昏'],
    weaponTypes: ['之剑', '之刃', '长弓', '法杖', '战锤', '匕首', '长枪', '巨斧', '权杖', '双刀'],
    armorTypes: ['胸甲', '头盔', '护腿', '战靴', '护手', '披风', '盾牌'],
    accessoryTypes: ['戒指', '项链', '耳环', '腰带', '护符', '徽章'],
    effects: [
      '攻击时有10%概率造成双倍伤害',
      '受到致命伤害时有一次免死机会（冷却60秒）',
      '每次击杀恢复5%最大生命值',
      '移动速度提升15%',
      '暴击率提升8%',
      '每秒恢复1%法力值',
      '对精英怪物伤害提升20%',
      '受到的火焰伤害降低30%',
      '攻击附带冰冻效果，持续2秒',
      '闪避率提升12%',
      '击杀敌人获得双倍经验',
      '技能冷却缩减15%'
    ]
  },

  generateEquipment() {
    const d = this.equipData;
    const typeRoll = this.range(1, 3);
    let type, nameSuffix;
    if (typeRoll === 1) { type = '武器'; nameSuffix = this.pick(d.weaponTypes); }
    else if (typeRoll === 2) { type = '防具'; nameSuffix = this.pick(d.armorTypes); }
    else { type = '饰品'; nameSuffix = this.pick(d.accessoryTypes); }

    const rarity = this.pick(['普通', '优秀', '稀有', '史诗', '传说']);
    const rarityMult = { '普通': 1, '优秀': 1.5, '稀有': 2, '史诗': 3, '传说': 5 };
    const mult = rarityMult[rarity];
    const level = this.range(1, 60);

    return {
      name: this.pick(d.prefixes) + nameSuffix,
      type,
      rarity,
      level: level.toString(),
      attack: type === '武器' ? Math.round(level * mult * this.range(2, 5)).toString() : '0',
      defense: type === '防具' ? Math.round(level * mult * this.range(1, 4)).toString() : '0',
      hp: Math.round(level * mult * this.range(5, 15)).toString(),
      special: rarity === '普通' ? '' : this.pick(d.effects),
      affixes: this.generateAffixText(rarity),
      description: `一件${rarity}品质的${type}，散发着神秘的光芒。`,
      tags: `随机生成,${rarity}`
    };
  },

  // ===== 角色生成 =====
  charData: {
    surnames: ['龙', '凤', '影', '星', '月', '风', '雷', '冰', '焰', '暗'],
    names: ['辰', '曦', '渊', '灵', '羽', '尘', '夜', '霜', '岚', '澈', '瑶', '墨', '寒', '烟', '雪'],
    roles: ['战士', '法师', '刺客', '弓箭手', '牧师', '骑士', '召唤师', '炼金术士', '游侠', '武僧'],
    factions: ['光明教廷', '暗影联盟', '自由佣兵团', '精灵议会', '矮人王国', '龙族后裔', '流浪者', '帝国军团', '叛逆者联盟', '隐世门派'],
    personalities: ['沉默寡言但内心善良', '热血冲动的冒险家', '冷静理性的策略家', '幽默风趣的乐天派', '神秘莫测的独行者', '正义感极强的守护者', '狡猾多变的投机者', '温柔体贴的治愈者']
  },

  generateCharacter() {
    const d = this.charData;
    const level = this.range(1, 50);
    const role = this.pick(d.roles);

    return {
      name: this.pick(d.surnames) + this.pick(d.names),
      role,
      faction: this.pick(d.factions),
      level: level.toString(),
      hp: (level * this.range(20, 50)).toString(),
      attack: (level * this.range(3, 8)).toString(),
      defense: (level * this.range(2, 6)).toString(),
      skills: `技能1: ${role}基础技能\n技能2: （待补充）\n技能3: （待补充）`,
      backstory: `（在此补充${this.pick(d.surnames)}${this.pick(d.names)}的背景故事...）`,
      personality: this.pick(d.personalities),
      tags: `随机生成,${role}`
    };
  },

  // ===== 词条系统 =====
  affixData: {
    prefixes: [
      { name: '锋利的', stat: '攻击力', min: 5, max: 50, type: 'flat' },
      { name: '坚固的', stat: '防御力', min: 5, max: 40, type: 'flat' },
      { name: '活力的', stat: '生命值', min: 20, max: 200, type: 'flat' },
      { name: '迅捷的', stat: '攻击速度', min: 3, max: 15, type: 'percent' },
      { name: '精准的', stat: '暴击率', min: 2, max: 12, type: 'percent' },
      { name: '毁灭的', stat: '暴击伤害', min: 10, max: 50, type: 'percent' },
      { name: '吸血的', stat: '生命偷取', min: 1, max: 8, type: 'percent' },
      { name: '敏捷的', stat: '闪避率', min: 2, max: 10, type: 'percent' },
      { name: '智慧的', stat: '法力值', min: 15, max: 150, type: 'flat' },
      { name: '强韧的', stat: '韧性', min: 5, max: 30, type: 'flat' }
    ],
    suffixes: [
      { name: '烈焰', stat: '火焰伤害', min: 10, max: 80, type: 'flat' },
      { name: '寒霜', stat: '冰冻伤害', min: 10, max: 80, type: 'flat' },
      { name: '雷鸣', stat: '雷电伤害', min: 10, max: 80, type: 'flat' },
      { name: '剧毒', stat: '中毒伤害', min: 5, max: 40, type: 'flat' },
      { name: '治愈', stat: '每秒回血', min: 1, max: 20, type: 'flat' },
      { name: '守护', stat: '格挡率', min: 3, max: 15, type: 'percent' },
      { name: '穿透', stat: '护甲穿透', min: 3, max: 20, type: 'percent' },
      { name: '反射', stat: '伤害反射', min: 2, max: 12, type: 'percent' },
      { name: '祝福', stat: '经验加成', min: 5, max: 25, type: 'percent' },
      { name: '贪婪', stat: '金币加成', min: 5, max: 30, type: 'percent' }
    ],
    special: [
      '击杀时有5%概率掉落额外物品',
      '受到伤害时有8%概率触发护盾（吸收10%最大生命值）',
      '攻击时有3%概率使敌人眩晕1秒',
      '生命值低于30%时攻击力提升25%',
      '满血时暴击率额外提升10%',
      '每次闪避后下次攻击必定暴击',
      '击杀精英怪物时恢复20%生命和法力',
      '连续攻击同一目标时伤害递增（最高+30%）',
      '受到控制效果时间缩短20%',
      '对生命值低于20%的敌人造成双倍伤害'
    ]
  },

  generateAffixes(count) {
    const affixes = [];
    const usedStats = new Set();
    const pool = [...this.affixData.prefixes, ...this.affixData.suffixes];

    for (let i = 0; i < count && pool.length > 0; i++) {
      const idx = this.range(0, pool.length - 1);
      const affix = pool[idx];
      if (usedStats.has(affix.stat)) { i--; continue; }
      usedStats.add(affix.stat);
      const value = this.range(affix.min, affix.max);
      affixes.push({
        name: affix.name,
        stat: affix.stat,
        value,
        display: `${affix.stat} +${value}${affix.type === 'percent' ? '%' : ''}`
      });
    }

    // 稀有以上有概率出特殊词条
    if (count >= 4 && Math.random() > 0.5) {
      affixes.push({
        name: '特殊',
        stat: '特殊效果',
        value: 0,
        display: this.pick(this.affixData.special)
      });
    }

    return affixes;
  },

  generateAffixText(rarity) {
    const countMap = { '普通': 1, '优秀': 2, '稀有': 3, '史诗': 4, '传说': 6 };
    const count = countMap[rarity] || 2;
    const affixes = this.generateAffixes(count);
    return affixes.map(a => `· ${a.display}`).join('\n');
  },

  // ===== 套装生成 =====
  setData: {
    themes: ['龙裔', '暗夜', '圣光', '风暴', '大地', '星辰', '血月', '冰霜', '烈焰', '虚空', '命运', '永恒'],
    setNames: ['之怒', '守护', '意志', '荣耀', '审判', '低语', '誓约', '传承', '觉醒', '回响'],
    setBonuses2: [
      '攻击力提升10%',
      '防御力提升10%',
      '最大生命值提升15%',
      '暴击率提升5%',
      '攻击速度提升8%',
      '所有抗性提升10%'
    ],
    setBonuses3: [
      '技能伤害提升20%',
      '击杀回复8%生命值',
      '受到伤害降低12%',
      '暴击伤害提升30%',
      '每秒回复2%法力值',
      '闪避率提升10%'
    ],
    setBonuses5: [
      '触发专属光环：周围队友攻击力提升15%',
      '解锁套装技能：召唤守护之灵（持续15秒）',
      '进入战斗后逐渐获得力量，每秒攻击力+2%（最高+30%）',
      '生命值低于20%时触发无敌状态3秒（冷却120秒）',
      '所有属性提升20%，且免疫一种随机控制效果'
    ]
  },

  generateEquipmentSet() {
    const d = this.setData;
    const theme = this.pick(d.themes);
    const setName = theme + this.pick(d.setNames);
    const rarity = this.pick(['稀有', '史诗', '传说']);
    const level = this.range(20, 60);
    const rarityMult = { '稀有': 2, '史诗': 3, '传说': 5 };
    const mult = rarityMult[rarity];

    const slots = [
      { slot: '武器', typePick: this.equipData.weaponTypes },
      { slot: '头盔', typePick: ['头盔'] },
      { slot: '胸甲', typePick: ['胸甲'] },
      { slot: '护腿', typePick: ['护腿'] },
      { slot: '战靴', typePick: ['战靴'] }
    ];

    const pieces = slots.map(s => {
      const isWeapon = s.slot === '武器';
      const name = `${setName}·${this.pick(s.typePick)}`;
      const affixes = this.generateAffixText(rarity);
      return {
        name,
        slot: s.slot,
        attack: isWeapon ? Math.round(level * mult * this.range(2, 5)) : 0,
        defense: !isWeapon ? Math.round(level * mult * this.range(1, 4)) : 0,
        hp: Math.round(level * mult * this.range(5, 15)),
        affixes
      };
    });

    const setBonuses = [
      `(2件) ${this.pick(d.setBonuses2)}`,
      `(3件) ${this.pick(d.setBonuses3)}`,
      `(5件) ${this.pick(d.setBonuses5)}`
    ];

    return { setName, rarity, level, pieces, setBonuses };
  },

  // 根据分类生成
  generate(tab) {
    switch (tab) {
      case 'story': return this.generateStory();
      case 'equipment': return this.generateEquipment();
      case 'character': return this.generateCharacter();
      case 'notes': return {
        title: '新笔记',
        category: '灵感',
        content: '',
        priority: '中',
        tags: ''
      };
      default: return {};
    }
  }
};
