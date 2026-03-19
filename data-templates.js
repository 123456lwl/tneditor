// 数据模板定义 - 每个分类的字段结构
const DATA_TEMPLATES = {
  story: {
    name: '剧情',
    icon: '📖',
    fields: [
      { key: 'title', label: '标题', type: 'text', required: true },
      { key: 'chapter', label: '章节', type: 'text' },
      { key: 'scene', label: '场景', type: 'text' },
      { key: 'characters', label: '涉及角色', type: 'text' },
      { key: 'content', label: '剧情内容', type: 'textarea' },
      { key: 'notes', label: '备注', type: 'textarea' },
      { key: 'tags', label: '标签（逗号分隔）', type: 'text' }
    ]
  },
  equipment: {
    name: '装备',
    icon: '⚔️',
    fields: [
      { key: 'name', label: '装备名称', type: 'text', required: true },
      { key: 'type', label: '类型', type: 'select', options: ['武器', '防具', '饰品', '消耗品', '材料', '特殊'] },
      { key: 'rarity', label: '稀有度', type: 'select', options: ['普通', '优秀', '稀有', '史诗', '传说'] },
      { key: 'level', label: '等级要求', type: 'number' },
      { key: 'attack', label: '攻击力', type: 'number' },
      { key: 'defense', label: '防御力', type: 'number' },
      { key: 'hp', label: '生命值', type: 'number' },
      { key: 'special', label: '特殊效果', type: 'textarea' },
      { key: 'affixes', label: '词条', type: 'textarea' },
      { key: 'description', label: '描述', type: 'textarea' },
      { key: 'tags', label: '标签（逗号分隔）', type: 'text' }
    ]
  },
  character: {
    name: '角色',
    icon: '👤',
    fields: [
      { key: 'name', label: '角色名', type: 'text', required: true },
      { key: 'role', label: '职业/定位', type: 'text' },
      { key: 'faction', label: '阵营/势力', type: 'text' },
      { key: 'level', label: '等级', type: 'number' },
      { key: 'hp', label: '生命值', type: 'number' },
      { key: 'attack', label: '攻击力', type: 'number' },
      { key: 'defense', label: '防御力', type: 'number' },
      { key: 'skills', label: '技能', type: 'textarea' },
      { key: 'backstory', label: '背景故事', type: 'textarea' },
      { key: 'personality', label: '性格特点', type: 'text' },
      { key: 'tags', label: '标签（逗号分隔）', type: 'text' }
    ]
  },
  notes: {
    name: '笔记',
    icon: '📝',
    fields: [
      { key: 'title', label: '标题', type: 'text', required: true },
      { key: 'category', label: '分类', type: 'select', options: ['游戏机制', '数值平衡', '关卡设计', 'UI设计', 'Bug记录', '灵感', '其他'] },
      { key: 'content', label: '内容', type: 'textarea' },
      { key: 'priority', label: '优先级', type: 'select', options: ['低', '中', '高', '紧急'] },
      { key: 'tags', label: '标签（逗号分隔）', type: 'text' }
    ]
  }
};
