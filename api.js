// api.js — Drop this in the same folder as your HTML
// Replace your existing <script> functions with these

const API = window.location.hostname === "localhost"
  ? "http://localhost:5000/api"
  : "https://collabspace-backend123.onrender.com/api";
// ── Token helpers ──────────────────────────────────────────
const getToken  = () => localStorage.getItem('cs_token');
const setToken  = (t) => localStorage.setItem('cs_token', t);
const clearToken = () => localStorage.removeItem('cs_token');

// ── Base fetch wrapper ─────────────────────────────────────
async function apiFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// ── AUTH ───────────────────────────────────────────────────
async function doLogin() {
  const email    = document.getElementById('login-email').value;
  const password = document.getElementById('login-pass').value;
  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    window._currentUser = data.user;
    document.getElementById('main-nav').style.display = 'flex';
    toast('✅', data.message);
    showPage('dashboard');
    loadDashboard();
    initChat();
  } catch (err) {
    toast('❌', err.message);
  }
}
async function doRegister() {
  const payload = {
    first_name: document.querySelector('#auth-register input[placeholder="John"]').value,
    last_name:  document.querySelector('#auth-register input[placeholder="Doe"]').value,
    email:      document.querySelector('#auth-register input[type="email"]').value,
    department: document.querySelector('#auth-register select').value,
    year:       document.querySelectorAll('#auth-register select')[1].value,
    password:   document.querySelector('#auth-register input[type="password"]').value,
  };
  try {
    await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
    toast('🎉', 'Registered! Please sign in.');
    switchAuthTab('login', document.querySelector('.auth-tab'));
  } catch (err) {
    toast('❌', err.message);
  }
}

function logout() {
  clearToken();
  window._currentUser = null;
  document.getElementById('main-nav').style.display = 'none';
  toast('👋', 'Logged out.');
  showPage('landing');
}

// ── PROJECTS ───────────────────────────────────────────────
async function loadProjects() {
  try {
    const data = await apiFetch('/projects');
    renderProjects(data.data);
  } catch (err) { toast('❌', 'Could not load projects'); }
}

async function createNewProject() {
  const payload = {
    title:       document.querySelector('#create-project-modal input[placeholder*="AI"]').value,
    description: document.querySelector('#create-project-modal textarea').value,
    category:    document.querySelector('#create-project-modal select').value,
    tags:        document.querySelector('#create-project-modal input[placeholder*="Python"]').value,
  };
  try {
    await apiFetch('/projects', { method: 'POST', body: JSON.stringify(payload) });
    closeModal('create-project-modal');
    toast('🎉', 'Project created!');
    loadProjects();
  } catch (err) { toast('❌', err.message); }
}

async function joinProject(projectId) {
  try {
    const data = await apiFetch(`/projects/${projectId}/join`, { method: 'POST' });
    toast('✅', data.message);
    loadProjects();
  } catch (err) { toast('❌', err.message); }
}

// ── STUDY GROUPS ───────────────────────────────────────────
async function loadStudyGroups() {
  try {
    const data = await apiFetch('/study-groups');
    renderStudyGroups(data.data);
  } catch (err) { toast('❌', 'Could not load study groups'); }
}

async function createNewGroup() {
  const payload = {
    name:         document.querySelector('#create-group-modal input[placeholder*="Database"]').value,
    description:  document.querySelector('#create-group-modal textarea').value,
    max_members:  document.querySelector('#create-group-modal input[type="number"]').value,
    meeting_freq: document.querySelector('#create-group-modal select').value,
  };
  try {
    await apiFetch('/study-groups', { method: 'POST', body: JSON.stringify(payload) });
    closeModal('create-group-modal');
    toast('📚', 'Study group created!');
    loadStudyGroups();
  } catch (err) { toast('❌', err.message); }
}

async function joinStudyGroup(groupId) {
  try {
    const data = await apiFetch(`/study-groups/${groupId}/join`, { method: 'POST' });
    toast('📚', data.message);
  } catch (err) { toast('❌', err.message); }
}

// ── RESOURCES ──────────────────────────────────────────────
async function loadResources() {
  try {
    const data = await apiFetch('/resources');
    renderResources(data.data);
  } catch (err) { toast('❌', 'Could not load resources'); }
}

async function uploadResource() {
  const modal      = document.getElementById('upload-resource-modal');
  const inputs     = modal.querySelectorAll('input:not([type="file"])');
  const select     = modal.querySelector('select');
  const fileInput  = document.getElementById('file-input');

  const title       = inputs[0].value.trim();
  const type        = select.value;
  const course_code = inputs[1] ? inputs[1].value.trim() : '';
  const file        = fileInput ? fileInput.files[0] : null;

  if (!title) { toast('⚠️', 'Please enter a title'); return; }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('type', type);
  formData.append('course_code', course_code);
  if (file) formData.append('file', file);

  try {
    const token = getToken();
    const res   = await fetch('http://localhost:5000/api/resources', {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}` },
      body:    formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    closeModal('upload-resource-modal');
    toast('📤', 'Resource uploaded!');
    loadResources();
  } catch (err) {
    toast('❌', err.message);
  }
}
// ── DASHBOARD ──────────────────────────────────────────────
async function loadDashboard() {
  try {
    const [user, projects, groups] = await Promise.all([
      apiFetch('/auth/me'),
      apiFetch('/projects?limit=3'),
      apiFetch('/study-groups?limit=2'),
    ]);
    const u = user.user;
    // Update greeting
    document.querySelector('#dashboard .section-title').textContent = `Welcome back, ${u.first_name}! 👋`;
    // Update stats
    const statVals = document.querySelectorAll('#dashboard .stat-value');
    if (statVals[3]) statVals[3].textContent = u.points;
  } catch (err) { /* user not logged in, skip */ }
}

// ── RENDER HELPERS ─────────────────────────────────────────
function renderProjects(projects) {
  const container = document.querySelector('#projects-page .grid-3');
  if (!container || !projects.length) return;
  container.innerHTML = projects.map(p => `
    <div class="project-card">
      <div class="project-header">
        <div class="project-icon">${p.icon}</div>
        <span class="badge badge-blue">${p.category}</span>
      </div>
      <div class="project-body">
        <div class="project-title">${p.title}</div>
        <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.5rem">${p.description}</div>
        <div class="project-meta">
          <span>👥 ${p.member_count} members</span>
          <span class="badge badge-${statusColor(p.status)}">${p.status}</span>
        </div>
        <div class="project-tags">${tagsHtml(p.tags)}</div>
      </div>
      <div class="project-footer">
        <span style="font-size:0.75rem;color:var(--text-muted)">by ${p.first_name} ${p.last_name}</span>
        <button class="btn btn-primary btn-sm" onclick="joinProject(${p.id})">Join</button>
      </div>
    </div>`
  ).join('');
}

function renderStudyGroups(groups) {
  const container = document.querySelector('#study-groups-page .grid-3');
  if (!container || !groups.length) return;
  container.innerHTML = groups.map(g => `
    <div class="group-card">
      <div class="group-header">
        <div class="group-avatar">${g.icon}</div>
        <div>
          <div style="font-weight:700">${g.name}</div>
          <div style="font-size:0.75rem;color:var(--text-muted)">${g.course_code} · ${g.member_count} members</div>
        </div>
      </div>
      <div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:1rem">${tagsHtml(g.tags)}</div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="font-size:0.8rem;color:var(--text-muted)">${g.meeting_freq}</div>
        <button class="btn btn-primary btn-sm" onclick="joinStudyGroup(${g.id})">Join</button>
<button class="btn btn-secondary btn-sm" onclick="joinChatRoom('group-${g.id}')">💬 Chat</button>
      </div>
    </div>`
  ).join('');
}

function renderResources(resources) {
  const container = document.querySelector('#resources-page .grid-3');
  if (!container || !resources.length) return;
  container.innerHTML = resources.map(r => `
    <div class="resource-card">
      <div class="resource-icon">${typeIcon(r.type)}</div>
      <div style="flex:1">
        <div style="font-weight:600">${r.title}</div>
        <div style="font-size:0.75rem;color:var(--text-muted)">by ${r.first_name} · ${r.downloads} downloads</div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="downloadResource(${r.id})">↓</button>
    </div>`
  ).join('');
}

async function createNewProject() {
  const modal    = document.getElementById('create-project-modal');
  const inputs   = modal.querySelectorAll('input');
  const textarea = modal.querySelector('textarea');
  const select   = modal.querySelector('select');

  const title       = inputs[0].value.trim();
  const description = textarea.value.trim();
  const category    = select.value;
  const tags        = inputs[1] ? inputs[1].value.trim() : '';

  if (!title)       { toast('⚠️', 'Please enter a project title'); return; }
  if (!description) { toast('⚠️', 'Please enter a description');   return; }

  try {
    await apiFetch('/projects', {
      method: 'POST',
      body: JSON.stringify({ title, description, category, tags }),
    });
    closeModal('create-project-modal');
    toast('🎉', 'Project created successfully!');
    loadProjects();
  } catch (err) {
    toast('❌', err.message);
  }
}
// ── Utility ────────────────────────────────────────────────
function tagsHtml(tags) {
  if (!tags) return '';
  return tags.split(',').map(t => `<span class="badge badge-blue">${t.trim()}</span>`).join('');
}

function statusColor(s) {
  return { 'Planning': 'blue', 'In Progress': 'green', 'Review': 'purple', 'Completed': 'orange' }[s] || 'blue';
}

function typeIcon(t) {
  return { 'Notes': '📘', 'Video': '📺', 'Previous Paper': '📄', 'Assignment': '📝' }[t] || '📄';
}
async function downloadResource(id) {
  try {
    const data = await apiFetch(`/resources/${id}/download`, { method: 'POST' });
    if (data.url) window.open(`http://localhost:5000${data.url}`, '_blank');
  } catch (err) {
    toast('❌', err.message);
  }
}
// ── Hook into page navigation ──────────────────────────────


// ── SOCKET.IO CHAT ─────────────────────────────────────────
let socket = null;
let currentRoom = null;
let currentUsername = null;

function initChat() {
  const user = window._currentUser;
  if (!user) return;
  currentUsername = `${user.first_name} ${user.last_name}`;
  socket = io(
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://collabspace-backend123.onrender.com"
  );

  socket.on('receive_message', (data) => {
    const type = data.username === currentUsername ? 'user' : 'bot';
    
    // Update StudyBot window
    const studyBot = document.getElementById('chat-messages');
    if (studyBot) {
      const el = document.createElement('div');
      el.className = `chat-msg ${type}`;
      el.style.maxWidth = '80%';
      el.style.padding = '0.5rem 0.8rem';
      el.style.borderRadius = '12px';
      el.style.fontSize = '0.82rem';
      el.style.background = type === 'bot' ? 'var(--surface2)' : 'var(--grad)';
      el.style.color = type === 'bot' ? 'var(--text)' : '#fff';
      el.style.alignSelf = type === 'bot' ? 'flex-start' : 'flex-end';
      el.textContent = data.username === currentUsername ? data.message : `${data.username}: ${data.message}`;
      studyBot.appendChild(el);
      studyBot.scrollTop = studyBot.scrollHeight;
    }

    // Update chat panel window
    const panel = document.getElementById('chat-panel-messages');
    if (panel) {
      const el2 = document.createElement('div');
      el2.className = `chat-msg ${type}`;
      el2.style.maxWidth = '80%';
      el2.style.padding = '0.5rem 0.8rem';
      el2.style.borderRadius = '12px';
      el2.style.fontSize = '0.82rem';
      el2.style.background = type === 'bot' ? 'var(--surface2)' : 'var(--grad)';
      el2.style.color = type === 'bot' ? 'var(--text)' : '#fff';
      el2.style.alignSelf = type === 'bot' ? 'flex-start' : 'flex-end';
      el2.textContent = data.username === currentUsername ? data.message : `${data.username}: ${data.message}`;
      panel.appendChild(el2);
      panel.scrollTop = panel.scrollHeight;
    }
  });
  document.getElementById('chat-room-name').textContent = room;
  document.getElementById('chat-messages').innerHTML = '';
  document.getElementById('chat-panel').style.display = 'flex';
}

function sendChat() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  addChatMsg(msg, 'user');
  input.value = '';

  if (!socket) initChat();
  if (!currentRoom) {
    currentRoom = 'studybot-general';
    socket.emit('join_room', { room: currentRoom, username: currentUsername || 'Student' });
  }
  socket.emit('send_message', { 
    room: currentRoom, 
    username: currentUsername || 'Student', 
    message: msg 
  });
}
function appendChatMessage(username, message, type) {
  const msgs = document.getElementById("chat-panel-messages");;
  if (!msgs) return;
  const div = document.createElement('div');
  div.style.cssText = `margin-bottom:0.75rem; display:flex; flex-direction:column; align-items:${type === 'user' ? 'flex-end' : 'flex-start'}`;
  div.innerHTML = `
    <div style="font-size:0.7rem; color:var(--text-muted); margin-bottom:0.2rem">${username}</div>
    <div style="background:${type === 'user' ? 'var(--accent)' : type === 'system' ? 'transparent' : 'var(--surface2)'}; 
                color:${type === 'user' ? '#fff' : type === 'system' ? 'var(--text-muted)' : 'var(--text)'};
                padding:0.5rem 0.75rem; border-radius:12px; font-size:0.85rem; max-width:80%;
                ${type === 'system' ? 'font-style:italic; font-size:0.75rem;' : ''}">
      ${message}
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}
function sendChatMessage() { sendChat(); }
