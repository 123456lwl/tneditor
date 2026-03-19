// 本地存储管理
const Storage = {
  KEY: 'game_editor_data',

  getAll() {
    try {
      const data = localStorage.getItem(this.KEY);
      return data ? JSON.parse(data) : { story: [], equipment: [], character: [], notes: [] };
    } catch {
      return { story: [], equipment: [], character: [], notes: [] };
    }
  },

  save(data) {
    localStorage.setItem(this.KEY, JSON.stringify(data));
  },

  getByTab(tab) {
    return this.getAll()[tab] || [];
  },

  addItem(tab, item) {
    const data = this.getAll();
    item.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    item.createdAt = new Date().toISOString();
    item.updatedAt = item.createdAt;
    data[tab].unshift(item);
    this.save(data);
    return item;
  },

  updateItem(tab, id, updates) {
    const data = this.getAll();
    const idx = data[tab].findIndex(i => i.id === id);
    if (idx !== -1) {
      data[tab][idx] = { ...data[tab][idx], ...updates, updatedAt: new Date().toISOString() };
      this.save(data);
      return data[tab][idx];
    }
    return null;
  },

  deleteItem(tab, id) {
    const data = this.getAll();
    data[tab] = data[tab].filter(i => i.id !== id);
    this.save(data);
  },

  exportAll() {
    const data = this.getAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `game-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importData(jsonStr) {
    try {
      const imported = JSON.parse(jsonStr);
      const data = this.getAll();
      for (const tab of ['story', 'equipment', 'character', 'notes']) {
        if (Array.isArray(imported[tab])) {
          const existingIds = new Set(data[tab].map(i => i.id));
          for (const item of imported[tab]) {
            if (!existingIds.has(item.id)) {
              data[tab].push(item);
            }
          }
        }
      }
      this.save(data);
      return true;
    } catch {
      return false;
    }
  }
};
