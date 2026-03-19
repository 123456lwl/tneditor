// AI 剧情生成模块
const AI = {
  CONFIG_KEY: 'game_editor_ai_config',

  getConfig() {
    try {
      return JSON.parse(localStorage.getItem(this.CONFIG_KEY)) || {};
    } catch { return {}; }
  },

  saveConfig(config) {
    localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
  },

  async generateStory(prompt) {
    const config = this.getConfig();
    const apiKey = config.apiKey;
    const apiUrl = config.apiUrl || 'https://api.openai.com/v1/chat/completions';
    const model = config.model || 'gpt-3.5-turbo';

    if (!apiKey) {
      throw new Error('请先设置 API Key');
    }

    const systemPrompt = `你是一个专业的游戏剧情编剧。请根据用户的描述，生成一段游戏剧情。
要求：
1. 剧情要有起承转合，包含场景描写、对话和冲突
2. 适合游戏使用，有明确的任务目标和奖励暗示
3. 角色对话用【角色名】：对话内容 的格式
4. 控制在300-500字左右
5. 用中文回复`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt || '请随机生成一段奇幻冒险游戏剧情' }
        ],
        temperature: 0.9,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`API 请求失败 (${response.status}): ${err}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
};
