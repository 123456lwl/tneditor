// 主应用逻辑
const App = {
  currentTab: 'story',
  currentItem: null,

  init() {
    this.bindTabs();
    this.bindToolbar();
    this.bindEditActions();
    this.bindImportExport();
    this.bindSetView();
    this.bindAI();
    this.updateToolbarButtons();
    this.renderList();
  },

  // 标签切换
  bindTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelector('.tab.active').classList.remove('active');
        tab.classList.add('active');
        this.currentTab = tab.dataset.tab;
        this.showListView();
        this.updateToolbarButtons();
        this.renderList();
      });
    });
  },

  // 工具栏
  bindToolbar() {
    document.getElementById('btn-add').addEventListener('click', () => {
      this.currentItem = null;
      this.showEditView();
    });

    document.getElementById('btn-random').addEventListener('click', () => {
      const generated = Generator.generate(this.currentTab);
      const item = Storage.addItem(this.currentTab, generated);
      this.toast(`已随机生成一条${DATA_TEMPLATES[this.currentTab].name}数据`);
      this.renderList();
    });

    document.getElementById('search-input').addEventListener('input', (e) => {
      this.renderList(e.target.value);
    });

    // 随机词条按钮
    document.getElementById('btn-random-affix').addEventListener('click', () => {
      const rarity = Generator.pick(['优秀', '稀有', '史诗', '传说']);
      const affixes = Generator.generateAffixText(rarity);
      const item = Storage.addItem('equipment', {
        name: Generator.pick(Generator.equipData.prefixes) + '词条卷轴',
        type: '材料',
        rarity,
        level: Generator.range(1, 60).toString(),
        attack: '0', defense: '0', hp: '0',
        special: '',
        affixes,
        description: `一张${rarity}品质的词条卷轴，可用于附魔装备。\n\n包含词条：\n${affixes}`,
        tags: `随机词条,${rarity}`
      });
      this.toast(`已生成${rarity}品质随机词条`);
      this.renderList();
    });

    // 随机套装按钮
    document.getElementById('btn-random-set').addEventListener('click', () => {
      const set = Generator.generateEquipmentSet();
      this.currentSet = set;
      this.showSetView(set);
    });
  },

  // 编辑操作
  bindEditActions() {
    document.getElementById('btn-back').addEventListener('click', () => this.showListView());

    document.getElementById('btn-save').addEventListener('click', () => {
      const formData = this.getFormData();
      if (!formData) return;

      if (this.currentItem) {
        Storage.updateItem(this.currentTab, this.currentItem.id, formData);
        this.toast('已保存');
      } else {
        Storage.addItem(this.currentTab, formData);
        this.toast('已创建');
      }
      this.showListView();
      this.renderList();
    });

    document.getElementById('btn-delete').addEventListener('click', () => {
      if (this.currentItem && confirm('确定要删除吗？')) {
        Storage.deleteItem(this.currentTab, this.currentItem.id);
        this.toast('已删除');
        this.showListView();
        this.renderList();
      }
    });
  },

  // 导入导出
  bindImportExport() {
    document.getElementById('btn-export').addEventListener('click', () => {
      Storage.exportAll();
      this.toast('数据已导出');
    });

    document.getElementById('btn-import').addEventListener('click', () => {
      document.getElementById('file-import').click();
    });

    document.getElementById('file-import').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (Storage.importData(ev.target.result)) {
          this.toast('数据导入成功');
          this.renderList();
        } else {
          this.toast('导入失败，文件格式不正确');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    });
  },

  // 渲染列表
  renderList(keyword = '') {
    const container = document.getElementById('list-view');
    let items = Storage.getByTab(this.currentTab);
    const template = DATA_TEMPLATES[this.currentTab];

    if (keyword) {
      const kw = keyword.toLowerCase();
      items = items.filter(item =>
        Object.values(item).some(v => String(v).toLowerCase().includes(kw))
      );
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="icon">${template.icon}</div>
          <p>${keyword ? '没有找到匹配的内容' : `还没有${template.name}数据`}</p>
          <p style="margin-top:8px;font-size:12px">点击"新建"或"🎲 随机生成"开始</p>
        </div>`;
      return;
    }

    container.innerHTML = items.map(item => {
      const titleField = template.fields[0].key;
      const title = item[titleField] || '未命名';
      const date = new Date(item.updatedAt || item.createdAt).toLocaleDateString('zh-CN');
      const preview = item.content || item.description || item.backstory || item.special || '';
      const tags = (item.tags || '').split(',').filter(t => t.trim());

      return `
        <div class="card" data-id="${item.id}">
          <div class="card-title">${this.escapeHtml(title)}</div>
          <div class="card-meta">${date}</div>
          ${preview ? `<div class="card-preview">${this.escapeHtml(preview)}</div>` : ''}
          ${tags.length ? `<div class="card-tags">${tags.map(t => `<span class="tag">${this.escapeHtml(t.trim())}</span>`).join('')}</div>` : ''}
        </div>`;
    }).join('');

    container.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        this.currentItem = items.find(i => i.id === id);
        this.showEditView(this.currentItem);
      });
    });
  },

  // 显示编辑视图
  showEditView(item = null) {
    document.getElementById('list-view').classList.add('hidden');
    document.querySelector('.toolbar').classList.add('hidden');
    const editView = document.getElementById('edit-view');
    editView.classList.remove('hidden');

    document.getElementById('btn-delete').style.display = item ? '' : 'none';

    const template = DATA_TEMPLATES[this.currentTab];
    const form = document.getElementById('edit-form');

    form.innerHTML = template.fields.map(field => {
      const value = item ? (item[field.key] || '') : '';
      let input;

      switch (field.type) {
        case 'textarea':
          input = `<textarea name="${field.key}" placeholder="请输入${field.label}...">${this.escapeHtml(value)}</textarea>`;
          break;
        case 'select':
          input = `<select name="${field.key}">
            ${field.options.map(opt => `<option value="${opt}" ${value === opt ? 'selected' : ''}>${opt}</option>`).join('')}
          </select>`;
          break;
        case 'number':
          input = `<input type="number" name="${field.key}" value="${this.escapeHtml(value)}" placeholder="0">`;
          break;
        default:
          input = `<input type="text" name="${field.key}" value="${this.escapeHtml(value)}" placeholder="请输入${field.label}..." ${field.required ? 'required' : ''}>`;
      }

      return `<div class="form-group"><label>${field.label}${field.required ? ' *' : ''}</label>${input}</div>`;
    }).join('');
  },

  // 获取表单数据
  getFormData() {
    const template = DATA_TEMPLATES[this.currentTab];
    const data = {};
    for (const field of template.fields) {
      const el = document.querySelector(`[name="${field.key}"]`);
      if (el) data[field.key] = el.value;
    }
    const requiredField = template.fields.find(f => f.required);
    if (requiredField && !data[requiredField.key].trim()) {
      this.toast(`请填写${requiredField.label}`);
      return null;
    }
    return data;
  },

  // 返回列表
  showListView() {
    document.getElementById('edit-view').classList.add('hidden');
    document.getElementById('list-view').classList.remove('hidden');
    document.querySelector('.toolbar').classList.remove('hidden');
    this.currentItem = null;
  },

  // 提示
  toast(msg) {
    let el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2000);
  },

  // 根据当前 tab 显示/隐藏特殊按钮
  updateToolbarButtons() {
    const affixBtn = document.getElementById('btn-random-affix');
    const setBtn = document.getElementById('btn-random-set');
    const aiBtn = document.getElementById('btn-ai-story');

    affixBtn.classList.toggle('hidden', this.currentTab !== 'equipment');
    setBtn.classList.toggle('hidden', this.currentTab !== 'equipment');
    aiBtn.classList.toggle('hidden', this.currentTab !== 'story');
  },

  // 套装视图
  currentSet: null,

  bindSetView() {
    document.getElementById('btn-set-back').addEventListener('click', () => {
      document.getElementById('set-view').classList.add('hidden');
      document.getElementById('list-view').classList.remove('hidden');
      document.querySelector('.toolbar').classList.remove('hidden');
    });

    document.getElementById('btn-set-save').addEventListener('click', () => {
      if (!this.currentSet) return;
      const set = this.currentSet;
      for (const piece of set.pieces) {
        Storage.addItem('equipment', {
          name: piece.name,
          type: piece.slot === '武器' ? '武器' : '防具',
          rarity: set.rarity,
          level: set.level.toString(),
          attack: piece.attack.toString(),
          defense: piece.defense.toString(),
          hp: piece.hp.toString(),
          special: set.setBonuses.join('\n'),
          affixes: piece.affixes,
          description: `【${set.setName}】套装部件 - ${piece.slot}\n\n套装效果：\n${set.setBonuses.join('\n')}`,
          tags: `套装,${set.setName},${set.rarity}`
        });
      }
      this.toast(`已保存套装「${set.setName}」的 ${set.pieces.length} 件装备`);
      document.getElementById('set-view').classList.add('hidden');
      document.getElementById('list-view').classList.remove('hidden');
      document.querySelector('.toolbar').classList.remove('hidden');
      this.renderList();
    });
  },

  showSetView(set) {
    document.getElementById('list-view').classList.add('hidden');
    document.querySelector('.toolbar').classList.add('hidden');
    document.getElementById('edit-view').classList.add('hidden');
    const setView = document.getElementById('set-view');
    setView.classList.remove('hidden');

    const rarityColors = { '稀有': '#4fc3f7', '史诗': '#ce93d8', '传说': '#ffb74d' };
    const color = rarityColors[set.rarity] || '#eee';

    document.getElementById('set-content').innerHTML = `
      <div class="set-header-info" style="text-align:center;padding:16px 0">
        <div style="font-size:20px;font-weight:700;color:${color}">🛡️ ${this.escapeHtml(set.setName)}</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-top:4px">${set.rarity} · 等级 ${set.level} · ${set.pieces.length}件套</div>
      </div>
      <div style="margin-bottom:12px;padding:12px;background:var(--bg-card);border-radius:var(--radius)">
        <div style="font-size:13px;font-weight:600;margin-bottom:8px;color:${color}">套装效果</div>
        ${set.setBonuses.map(b => `<div style="font-size:13px;color:var(--text-secondary);margin:4px 0">${this.escapeHtml(b)}</div>`).join('')}
      </div>
      ${set.pieces.map(p => `
        <div class="card" style="border-left:3px solid ${color}">
          <div class="card-title" style="color:${color}">${this.escapeHtml(p.name)}</div>
          <div class="card-meta">${p.slot} · 攻击 ${p.attack} · 防御 ${p.defense} · 生命 ${p.hp}</div>
          <div class="card-preview" style="-webkit-line-clamp:unset;white-space:pre-line">${this.escapeHtml(p.affixes)}</div>
        </div>
      `).join('')}
    `;
  },

  // AI 剧情
  bindAI() {
    const modal = document.getElementById('ai-modal');
    const config = AI.getConfig();

    // 恢复保存的配置
    if (config.apiKey) document.getElementById('ai-api-key').value = config.apiKey;
    if (config.apiUrl) document.getElementById('ai-api-url').value = config.apiUrl;
    if (config.model) document.getElementById('ai-model').value = config.model;

    document.getElementById('btn-ai-story').addEventListener('click', () => {
      modal.classList.remove('hidden');
    });

    document.getElementById('btn-ai-close').addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    document.getElementById('btn-ai-generate').addEventListener('click', async () => {
      // 保存配置
      const apiKey = document.getElementById('ai-api-key').value.trim();
      const apiUrl = document.getElementById('ai-api-url').value.trim();
      const model = document.getElementById('ai-model').value.trim();
      AI.saveConfig({ apiKey, apiUrl, model });

      const prompt = document.getElementById('ai-prompt').value.trim();
      const loading = document.getElementById('ai-loading');
      const result = document.getElementById('ai-result');
      const btn = document.getElementById('btn-ai-generate');

      btn.disabled = true;
      loading.classList.remove('hidden');
      result.classList.add('hidden');

      try {
        const text = await AI.generateStory(prompt);
        document.getElementById('ai-result-text').value = text;
        result.classList.remove('hidden');
      } catch (err) {
        this.toast('生成失败: ' + err.message);
      } finally {
        loading.classList.add('hidden');
        btn.disabled = false;
      }
    });

    document.getElementById('btn-ai-save').addEventListener('click', () => {
      const text = document.getElementById('ai-result-text').value;
      if (!text) return;

      const lines = text.split('\n').filter(l => l.trim());
      const title = lines[0]?.replace(/^[#\s*]+/, '').slice(0, 30) || 'AI生成剧情';

      Storage.addItem('story', {
        title,
        chapter: '',
        scene: '',
        characters: '',
        content: text,
        notes: 'AI 生成',
        tags: 'AI生成'
      });

      this.toast('剧情已保存');
      modal.classList.add('hidden');
      this.renderList();
    });
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

// 启动
document.addEventListener('DOMContentLoaded', () => App.init());
