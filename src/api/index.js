import { API_BASE } from '../config';

/**
 * Helper to make JSON API requests to the ChatIQ backend
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    let errorMsg = `Server error (${response.status})`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorData.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return await response.json();
}

/**
 * Create a new bot instance
 * POST /api/bots
 * @param {Object} botData { name, businessType, welcomeMessage, whatsappNumber }
 */
export async function createBot(botData) {
  const data = await apiRequest('/api/bots', {
    method: 'POST',
    body: JSON.stringify(botData)
  });
  
  // Extract UUID returned from API (handles id, botId, or bot.id)
  const botId = data.botId || data.id || (data.bot && data.bot.id) || (data.data && data.data.id);
  return { ...data, botId, id: botId };
}

/**
 * Update bot settings (e.g. primaryColor, position)
 * PUT /api/bots/:botId
 * @param {string} botId
 * @param {Object} updateData { primaryColor, position, name, welcomeMessage }
 */
export async function updateBot(botId, updateData) {
  return await apiRequest(`/api/bots/${botId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
}

/**
 * Train bot on a website URL
 * POST /api/train/url
 * @param {string} botId
 * @param {string} url
 */
export async function trainUrl(botId, url) {
  return await apiRequest('/api/train/url', {
    method: 'POST',
    body: JSON.stringify({ botId, url })
  });
}

/**
 * Train bot on an uploaded PDF
 * POST /api/train/pdf
 * @param {string} botId
 * @param {File} file
 */
export async function trainPdf(botId, file) {
  const formData = new FormData();
  formData.append('botId', botId);
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/api/train/pdf`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    let errorMsg = `PDF upload failed (${response.status})`;
    try {
      const err = await response.json();
      errorMsg = err.error || err.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return await response.json();
}

/**
 * Train bot with manual text / FAQs
 * POST /api/train/text
 * @param {string} botId
 * @param {string} text
 * @param {string} title
 */
export async function trainText(botId, text, title = 'Custom FAQs') {
  return await apiRequest('/api/train/text', {
    method: 'POST',
    body: JSON.stringify({ botId, text, title })
  });
}

/**
 * Poll training status for a bot
 * GET /api/train/:botId/status
 * @param {string} botId
 */
export async function getTrainingStatus(botId) {
  return await apiRequest(`/api/train/${botId}/status`, {
    method: 'GET'
  });
}

/**
 * Get bot details
 * GET /api/bots/:botId
 * @param {string} botId
 */
export async function getBot(botId) {
  return await apiRequest(`/api/bots/${botId}`, {
    method: 'GET'
  });
}

/**
 * Get captured leads for a bot
 * GET /api/bots/:botId/leads
 * @param {string} botId
 */
export async function getLeads(botId) {
  return await apiRequest(`/api/bots/${botId}/leads`, {
    method: 'GET'
  });
}

/**
 * Send chat message to real backend AI endpoint
 * POST /api/chat
 * Body: { botId, message, sessionId }
 * @param {string} botId
 * @param {string} message
 * @param {string} sessionId
 */
export async function sendChatMessage(botId, message, sessionId = 'web-session') {
  const data = await apiRequest('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ botId, message, sessionId })
  });

  const reply = data.reply || data.response || data.message || data.text || '';
  return {
    ...data,
    reply
  };
}
