const STORE_KEY = "raiz-school-demo-v1";
const viewTitles = { dashboard: "Visão geral", students: "Alunos", classes: "Turmas", attendance: "Frequência", grades: "Notas", teachers: "Professores" };
const seedData = {
  students: [
    { id: "2026-001", name: "Ana Clara Ribeiro", email: "ana.ribeiro@exemplo.com", classId: "6A", status: "Ativo", phone: "(85) 98812-4102", grade: "6º ano" },
    { id: "2026-002", name: "Bruno Henrique Costa", email: "bruno.costa@exemplo.com", classId: "8B", status: "Ativo", phone: "(85) 98732-1180", grade: "8º ano" },
    { id: "2026-003", name: "Camila Duarte Lima", email: "camila.lima@exemplo.com", classId: "7A", status: "Ativo", phone: "(85) 98871-2435", grade: "7º ano" },
    { id: "2026-004", name: "Daniel Alves Martins", email: "daniel.martins@exemplo.com", classId: "9A", status: "Ativo", phone: "(85) 98902-6571", grade: "9º ano" },
    { id: "2026-005", name: "Eduarda Nunes Rocha", email: "eduarda.rocha@exemplo.com", classId: "6A", status: "Ativo", phone: "(85) 98762-3520", grade: "6º ano" },
    { id: "2026-006", name: "Felipe Moura Santos", email: "felipe.santos@exemplo.com", classId: "8B", status: "Ativo", phone: "(85) 98825-9014", grade: "8º ano" },
    { id: "2026-007", name: "Giovana Pires Oliveira", email: "giovana.oliveira@exemplo.com", classId: "7A", status: "Ativo", phone: "(85) 98915-4208", grade: "7º ano" },
    { id: "2026-008", name: "Heitor Cavalcante Melo", email: "heitor.melo@exemplo.com", classId: "9A", status: "Ativo", phone: "(85) 98751-0368", grade: "9º ano" },
    { id: "2026-009", name: "Isabela Freitas Gomes", email: "isabela.gomes@exemplo.com", classId: "6A", status: "Ativo", phone: "(85) 98835-6241", grade: "6º ano" },
    { id: "2026-010", name: "João Pedro Bezerra", email: "joao.bezerra@exemplo.com", classId: "8B", status: "Ativo", phone: "(85) 98960-1403", grade: "8º ano" },
    { id: "2026-011", name: "Larissa Monteiro Silva", email: "larissa.silva@exemplo.com", classId: "7A", status: "Pendente", phone: "(85) 98740-5690", grade: "7º ano" },
    { id: "2026-012", name: "Miguel Araújo Ferreira", email: "miguel.ferreira@exemplo.com", classId: "9A", status: "Ativo", phone: "(85) 98802-1756", grade: "9º ano" }
  ],
  classes: [
    { id: "6A", title: "6º ano · Turma A", level: "Ensino fundamental II", room: "Sala 04", schedule: "Manhã · 07:30–11:50", teacher: "Marina Lopes", capacity: 30 },
    { id: "7A", title: "7º ano · Turma A", level: "Ensino fundamental II", room: "Sala 07", schedule: "Manhã · 07:30–11:50", teacher: "Rafael Moreira", capacity: 28 },
    { id: "8B", title: "8º ano · Turma B", level: "Ensino fundamental II", room: "Sala 10", schedule: "Tarde · 13:00–17:20", teacher: "Paula Martins", capacity: 32 },
    { id: "9A", title: "9º ano · Turma A", level: "Ensino fundamental II", room: "Sala 12", schedule: "Tarde · 13:00–17:20", teacher: "André Carvalho", capacity: 30 }
  ],
  teachers: [
    { name: "Marina Lopes", subject: "Língua Portuguesa", email: "marina.lopes@exemplo.com", classes: ["6A", "7A"] },
    { name: "Rafael Moreira", subject: "Matemática", email: "rafael.moreira@exemplo.com", classes: ["7A", "8B"] },
    { name: "Paula Martins", subject: "Ciências", email: "paula.martins@exemplo.com", classes: ["6A", "8B"] },
    { name: "André Carvalho", subject: "História", email: "andre.carvalho@exemplo.com", classes: ["8B", "9A"] },
    { name: "Sofia Azevedo", subject: "Geografia", email: "sofia.azevedo@exemplo.com", classes: ["6A", "9A"] }
  ],
  attendance: {},
  grades: { "2026-001": 8.7, "2026-002": 7.4, "2026-003": 9.1, "2026-004": 6.8, "2026-005": 8.2, "2026-006": 5.9, "2026-007": 9.4, "2026-008": 7.8, "2026-009": 8.9, "2026-010": 6.6, "2026-011": 7.2, "2026-012": 8.1 }
};

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function readData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY));
    if (saved && Array.isArray(saved.students) && Array.isArray(saved.classes)) return { ...clone(seedData), ...saved };
  } catch (error) { console.warn("Não foi possível ler os dados salvos da demonstração.", error); }
  return clone(seedData);
}
let db = readData();
let currentView = "dashboard";
let classFilter = "";
let attendanceDate = new Date().toISOString().slice(0, 10);
const content = document.querySelector("#page-content");
const dialog = document.querySelector("#app-dialog");

function saveData() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(db)); }
  catch { toast("Este navegador não conseguiu salvar as alterações.", true); }
}
function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
}
function initials(name = "?") { return name.trim().split(/\s+/).slice(0, 2).map(part => part[0] || "").join("").toUpperCase(); }
function className(id) { return db.classes.find(item => item.id === id)?.title || id || "Sem turma"; }
function fmtDate(value, options = { day: "2-digit", month: "short" }) {
  return new Intl.DateTimeFormat("pt-BR", options).format(new Date(`${value}T12:00:00`));
}
function updateDate() {
  document.querySelector("#today-label").textContent = new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "2-digit", month: "short" }).format(new Date());
}
function toast(message, error = false) {
  const item = document.createElement("div"); item.className = `toast${error ? " error" : ""}`; item.textContent = message;
  document.querySelector("#toast-region").append(item); window.setTimeout(() => item.remove(), 3400);
}
function setView(view) {
  if (!viewTitles[view]) return;
  currentView = view;
  document.querySelectorAll(".nav-link[data-view]").forEach(button => button.classList.toggle("active", button.dataset.view === view));
  document.querySelector("#current-section").textContent = viewTitles[view];
  render();
  content.focus({ preventScroll: true });
}
function heading(title, description, actions = "", eyebrow = "ESCOLA HORIZONTE · ANO LETIVO 2026") {
  return `<div class="page-heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${description}</p></div><div class="heading-actions">${actions}</div></div>`;
}
function button(label, action, style = "primary-button", icon = "") {
  return `<button class="${style}" data-action="${action}">${icon ? `<span class="plus" aria-hidden="true">${icon}</span>` : ""}${label}</button>`;
}
function avatar(name, index = 0) {
  const colors = ["", "peach", "blue"];
  return `<span class="person-avatar ${colors[index % colors.length]}" aria-hidden="true">${escapeHtml(initials(name))}</span>`;
}
function studentStatus(status) {
  const style = status === "Ativo" ? "" : status === "Pendente" ? "warning" : "neutral";
  return `<span class="status-pill ${style}">${escapeHtml(status)}</span>`;
}
function studentRows(list, includeActions = true) {
  if (!list.length) return `<tr><td colspan="${includeActions ? 6 : 5}"><div class="empty-state"><strong>Nenhum aluno encontrado</strong>Ajuste sua busca ou cadastre um novo aluno.</div></td></tr>`;
  return list.map((student, index) => `<tr>
    <td><div class="student-cell">${avatar(student.name, index)}<div><strong>${escapeHtml(student.name)}</strong><small>${escapeHtml(student.email)}</small></div></div></td>
    <td>${escapeHtml(student.id)}</td><td>${escapeHtml(className(student.classId))}</td><td>${escapeHtml(student.grade || student.classId)}</td><td>${studentStatus(student.status)}</td>
    ${includeActions ? `<td><div class="row-actions"><button class="row-action" data-action="edit-student" data-id="${escapeHtml(student.id)}" aria-label="Editar ${escapeHtml(student.name)}" title="Editar aluno">✎</button><button class="row-action danger" data-action="delete-student" data-id="${escapeHtml(student.id)}" aria-label="Remover ${escapeHtml(student.name)}" title="Remover aluno">×</button></div></td>` : ""}
  </tr>`).join("");
}
function renderDashboard() {
  const present = db.students.filter(student => attendanceStatus(student.id, attendanceDate) === "Presente").length;
  const active = db.students.filter(student => student.status === "Ativo").length;
  const pending = db.students.filter(student => student.status === "Pendente").length;
  const average = db.students.length ? (db.students.reduce((total, student) => total + Number(db.grades[student.id] || 0), 0) / db.students.length).toFixed(1).replace(".", ",") : "—";
  const nowHour = new Date().getHours(); const greet = nowHour < 12 ? "Bom dia" : nowHour < 18 ? "Boa tarde" : "Boa noite";
  const recent = [...db.students].slice(-4).reverse();
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex"];
  const chart = `<div class="chart-area"><div class="chart-y-axis"><span>100%</span><span>75%</span><span>50%</span><span>25%</span></div><div class="chart">${days.map((day, i) => `<div class="chart-group"><span class="chart-bar" style="height:${[82, 91, 74, 87, 0][i]}%" title="Presenças"></span><span class="chart-bar secondary" style="height:${[12, 7, 18, 10, 0][i]}%" title="Ausências"></span><span class="chart-label">${day}</span></div>`).join("")}</div></div>`;
  content.innerHTML = `${heading(`${greet}, coordenação <span aria-hidden="true">✳</span>`, "Acompanhe a rotina da Escola Horizonte em um só lugar.", button("Ver alunos", "view-students", "primary-button", "→"), "ROTINA ESCOLAR · 3º TRIMESTRE")}
    <section class="overview-grid" aria-label="Resumo da escola">
      <div class="welcome-card"><div class="welcome-copy"><p class="eyebrow">UM BOM DIA COMEÇA COM ORGANIZAÇÃO</p><h2>Pequenos passos,<br>grandes caminhos.</h2><p>Veja como a comunidade escolar está avançando nesta semana.</p>${button("Abrir frequência", "view-attendance", "primary-button", "✓")}</div><div class="welcome-art" aria-hidden="true"><span class="orbit"></span><span class="orbit orbit-two"></span><span class="book-shape">r.</span></div></div>
      <div class="term-summary"><div><div class="term-summary-top"><h3>3º trimestre</h3><span class="term-badge">EM CURSO</span></div><p>O aprendizado floresce no ritmo de cada turma.</p><div class="term-progress-head"><span>Período letivo</span><strong>78%</strong></div><div class="progress-track"><span style="width:78%"></span></div></div><div class="term-footer"><span>01 set – 12 dez</span><span>Faltam 17 dias</span></div></div>
    </section>
    <section class="metrics-grid" aria-label="Indicadores escolares">
      <article class="metric-card"><div class="metric-top"><span>Alunos ativos</span><span class="metric-icon">◉</span></div><div class="metric-number">${active}</div><div class="metric-foot"><b>+2</b><span>neste trimestre</span></div></article>
      <article class="metric-card"><div class="metric-top"><span>Presença hoje</span><span class="metric-icon">✓</span></div><div class="metric-number">${db.students.length ? Math.round((present / db.students.length) * 100) : 0}%</div><div class="metric-foot"><b>${present} presentes</b><span>de ${db.students.length}</span></div></article>
      <article class="metric-card"><div class="metric-top"><span>Média geral</span><span class="metric-icon">⌁</span></div><div class="metric-number">${average}</div><div class="metric-foot"><b>+0,3</b><span>em relação ao período</span></div></article>
      <article class="metric-card"><div class="metric-top"><span>Matrículas pendentes</span><span class="metric-icon">◷</span></div><div class="metric-number">${pending}</div><div class="metric-foot"><b class="down">Acompanhar</b><span>cadastro incompleto</span></div></article>
    </section>
    <section class="dash-panels"><article class="panel attendance-panel"><div class="panel-header"><div><h2>Presença na semana</h2><p>Distribuição de frequência por dia</p></div><select class="period-select" aria-label="Período do gráfico"><option>Esta semana</option><option>Este mês</option></select></div>${chart}<div class="chart-legend"><span><i class="legend-dot"></i>Presenças</span><span><i class="legend-dot secondary"></i>Ausências</span></div></article>
      <article class="panel schedule-panel"><div class="panel-header"><div><h2>Próximas aulas</h2><p>Quarta-feira · turno da manhã</p></div><button class="text-button" data-action="view-classes">Ver turmas ↗</button></div><div class="schedule-list"><div class="schedule-row"><span class="schedule-time">08:00</span><div class="schedule-course"><i class="schedule-mark"></i><strong>Matemática</strong><small>Prof. Rafael · Sala 07</small></div><span class="class-pill">7º A</span></div><div class="schedule-row"><span class="schedule-time">09:40</span><div class="schedule-course"><i class="schedule-mark" style="background:#e99b78"></i><strong>Língua Portuguesa</strong><small>Prof. Marina · Sala 04</small></div><span class="class-pill">6º A</span></div><div class="schedule-row"><span class="schedule-time">10:30</span><div class="schedule-course"><i class="schedule-mark" style="background:#8eaad1"></i><strong>Ciências</strong><small>Prof. Paula · Sala 10</small></div><span class="class-pill">8º B</span></div></div></article></section>
    <section class="panel recent-panel"><div class="panel-header"><div><h2>Alunos em destaque</h2><p>Registros recentes da unidade</p></div><button class="text-button" data-action="view-students">Ver todos ↗</button></div><div class="recent-list">${recent.map((student, i) => `<div class="recent-row">${avatar(student.name, i)}<div class="person-name"><strong>${escapeHtml(student.name)}</strong><small>${escapeHtml(student.id)}</small></div><div class="person-class"><strong>${escapeHtml(className(student.classId))}</strong><small>${escapeHtml(student.grade || "Ensino fundamental")}</small></div>${studentStatus(student.status)}</div>`).join("")}</div></section>`;
}

function renderStudents() {
  const filterOptions = db.classes.map(item => `<option value="${escapeHtml(item.id)}" ${classFilter === item.id ? "selected" : ""}>${escapeHtml(item.id)}</option>`).join("");
  content.innerHTML = `${heading("Alunos", "Mantenha os cadastros e vínculos de turma organizados.", `${button("Exportar CSV", "export-students", "secondary-button", "↓")}${button("Novo aluno", "new-student", "primary-button", "+")}`)}
    <div class="callout"><span class="callout-mark">i</span><span>Esta versão é demonstrativa. Os dados são fictícios e ficam salvos apenas neste navegador.</span></div>
    <section class="panel section-panel"><div class="toolbar"><div class="toolbar-left"><label class="search-box"><span aria-hidden="true">⌕</span><input id="student-search" type="search" placeholder="Buscar por nome ou matrícula" aria-label="Buscar alunos" /></label><select class="filter-select" id="class-filter" aria-label="Filtrar por turma"><option value="">Todas as turmas</option>${filterOptions}</select></div><div class="toolbar-right"><span class="class-pill">${db.students.length} registros</span></div></div><div class="data-table-wrap"><table><thead><tr><th>Aluno</th><th>Matrícula</th><th>Turma</th><th>Série</th><th>Status</th><th><span class="sr-only">Ações</span></th></tr></thead><tbody id="student-rows">${studentRows(filterStudents())}</tbody></table></div><div class="table-footer"><span id="student-result-count">Mostrando <strong>${filterStudents().length}</strong> de <strong>${db.students.length}</strong> alunos</span><span>Dados da unidade <strong>Centro</strong></span></div></section>`;
}
function filterStudents(query = "") {
  const q = query.trim().toLocaleLowerCase("pt-BR");
  return db.students.filter(student => (!classFilter || student.classId === classFilter) && (!q || `${student.name} ${student.id} ${student.email}`.toLocaleLowerCase("pt-BR").includes(q)));
}

function renderClasses() {
  content.innerHTML = `${heading("Turmas", "Visão rápida das salas, horários e ocupação.", button("Nova turma", "new-class", "primary-button", "+"))}<div class="callout"><span class="callout-mark">i</span><span>Ao abrir uma turma, você pode ver a lista de alunos vinculados a ela.</span></div><section class="class-grid">${db.classes.map((item, index) => {
    const count = db.students.filter(student => student.classId === item.id).length; const pct = Math.min(100, Math.round((count / item.capacity) * 100));
    return `<article class="class-card"><div class="class-card-top"><span class="class-code">${escapeHtml(item.id)}</span><button class="row-action" data-action="class-students" data-id="${escapeHtml(item.id)}" aria-label="Ver alunos da turma ${escapeHtml(item.id)}" title="Ver alunos">↗</button></div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.level)}</p><div class="class-capacity"><span>Ocupação da sala</span><strong>${count} / ${item.capacity}</strong></div><div class="progress-track"><span style="width:${pct}%;background:${["#88a949", "#e99b78", "#8eaad1", "#bd9cc5"][index % 4]}"></span></div><div class="class-meta"><span>${escapeHtml(item.room)} · ${escapeHtml(item.schedule.split(" · ")[0])}</span><strong>${pct}%</strong></div></article>`;
  }).join("")}</section>`;
}

function attendanceStatus(studentId, date) {
  return db.attendance[date]?.[studentId] || "Presente";
}
function renderAttendance() {
  const statuses = db.students.map(student => attendanceStatus(student.id, attendanceDate));
  const present = statuses.filter(status => status === "Presente").length; const absent = statuses.filter(status => status === "Ausente").length;
  const rows = db.students.map((student, index) => `<tr><td><div class="student-cell">${avatar(student.name, index)}<div><strong>${escapeHtml(student.name)}</strong><small>${escapeHtml(student.id)}</small></div></div></td><td>${escapeHtml(className(student.classId))}</td><td><span class="status-pill ${attendanceStatus(student.id, attendanceDate) === "Presente" ? "" : "warning"}">${attendanceStatus(student.id, attendanceDate)}</span></td><td><div class="row-actions"><button class="small-button" data-action="toggle-attendance" data-id="${escapeHtml(student.id)}">${attendanceStatus(student.id, attendanceDate) === "Presente" ? "Marcar falta" : "Marcar presença"}</button></div></td></tr>`).join("");
  content.innerHTML = `${heading("Frequência", "Registre presenças por turma e acompanhe a rotina diária.", "", "ROTINA ESCOLAR · CHAMADA DIÁRIA")}<section class="panel section-panel"><div class="attendance-toolbar"><div class="attendance-date"><span>Data da chamada</span><input type="date" id="attendance-date" value="${attendanceDate}" aria-label="Data da chamada" /></div><div class="attendance-summary"><span><strong>${present}</strong> presentes</span><span><strong>${absent}</strong> ausentes</span><span><strong>${db.students.length}</strong> alunos</span></div></div><div class="data-table-wrap"><table><thead><tr><th>Aluno</th><th>Turma</th><th>Status de hoje</th><th>Ação</th></tr></thead><tbody>${rows}</tbody></table></div><div class="table-footer"><span>Alterações salvas automaticamente neste navegador</span>${button("Concluir chamada", "finish-attendance", "primary-button")}</div></section>`;
}

function renderGrades() {
  const rows = db.students.map((student, index) => {
    const grade = Number(db.grades[student.id] ?? 0); const low = grade < 6;
    return `<tr><td><div class="student-cell">${avatar(student.name, index)}<div><strong>${escapeHtml(student.name)}</strong><small>${escapeHtml(student.id)}</small></div></div></td><td>${escapeHtml(className(student.classId))}</td><td><span class="grade-score ${low ? "low" : ""}">${grade.toFixed(1).replace(".", ",")}</span></td><td class="grade-bar-cell"><div class="grade-bar"><i class="${low ? "low" : ""}" style="width:${Math.max(0, Math.min(100, grade * 10))}%"></i></div></td><td><button class="small-button" data-action="edit-grade" data-id="${escapeHtml(student.id)}">Editar nota</button></td></tr>`;
  }).join("");
  content.innerHTML = `${heading("Notas", "Acompanhe o desempenho individual neste trimestre.", button("Exportar CSV", "export-grades", "secondary-button", "↓"), "AVALIAÇÃO · 3º TRIMESTRE")}<div class="callout"><span class="callout-mark">i</span><span>Notas e médias exibidas são exemplos fictícios. Edite uma nota para ver a atualização refletida no painel.</span></div><section class="panel section-panel"><div class="toolbar"><div class="toolbar-left"><label class="search-box"><span aria-hidden="true">⌕</span><input id="grade-search" type="search" placeholder="Buscar aluno" aria-label="Buscar aluno nas notas" /></label><span class="class-pill">Escala de 0 a 10</span></div><div class="toolbar-right"><span class="class-pill">${db.students.length} estudantes</span></div></div><div class="data-table-wrap"><table><thead><tr><th>Aluno</th><th>Turma</th><th>Média do período</th><th>Desempenho</th><th>Ação</th></tr></thead><tbody id="grade-rows">${rows}</tbody></table></div><div class="table-footer"><span>Critério demonstrativo de aprovação: média igual ou superior a <strong>6,0</strong></span><span>3º trimestre</span></div></section>`;
}

function renderTeachers() {
  const rows = db.teachers.map((teacher, index) => `<tr><td><div class="student-cell">${avatar(teacher.name, index)}<div><strong>${escapeHtml(teacher.name)}</strong><small>${escapeHtml(teacher.email)}</small></div></div></td><td><span class="teacher-subject">${escapeHtml(teacher.subject)}</span></td><td>${teacher.classes.map(id => `<span class="class-pill">${escapeHtml(id)}</span>`).join(" ")}</td><td><span class="status-pill">Ativo</span></td></tr>`).join("");
  content.innerHTML = `${heading("Professores", "Equipe pedagógica e vínculos de turma.", button("Adicionar professor", "new-teacher", "primary-button", "+"))}<section class="panel section-panel"><div class="toolbar"><div class="toolbar-left"><label class="search-box"><span aria-hidden="true">⌕</span><input id="teacher-search" type="search" placeholder="Buscar professor ou disciplina" aria-label="Buscar professores" /></label></div><div class="toolbar-right"><span class="class-pill">${db.teachers.length} profissionais</span></div></div><div class="data-table-wrap"><table><thead><tr><th>Professor</th><th>Disciplina</th><th>Turmas vinculadas</th><th>Status</th></tr></thead><tbody id="teacher-rows">${rows}</tbody></table></div><div class="table-footer"><span>Equipe pedagógica da unidade <strong>Centro</strong></span><span>${db.teachers.length} professores</span></div></section>`;
}

function render() {
  document.querySelector("#student-nav-count").textContent = db.students.length;
  if (currentView === "dashboard") renderDashboard();
  if (currentView === "students") renderStudents();
  if (currentView === "classes") renderClasses();
  if (currentView === "attendance") renderAttendance();
  if (currentView === "grades") renderGrades();
  if (currentView === "teachers") renderTeachers();
}

function openStudentDialog(student = null) {
  const editing = Boolean(student);
  document.querySelector("#dialog-eyebrow").textContent = editing ? "ATUALIZAR CADASTRO" : "NOVO CADASTRO";
  document.querySelector("#dialog-title").textContent = editing ? "Editar aluno" : "Novo aluno";
  document.querySelector("#dialog-body").innerHTML = `<div class="form-grid"><div class="form-field full"><label for="student-name">Nome completo</label><input id="student-name" name="name" required maxlength="100" value="${escapeHtml(student?.name || "")}" placeholder="Ex.: Maria da Silva" /></div><div class="form-field"><label for="student-id">Matrícula</label><input id="student-id" name="id" required maxlength="24" value="${escapeHtml(student?.id || "")}" placeholder="Ex.: 2026-013" ${editing ? "readonly" : ""} /></div><div class="form-field"><label for="student-status">Status</label><select id="student-status" name="status"><option ${student?.status === "Ativo" || !student ? "selected" : ""}>Ativo</option><option ${student?.status === "Pendente" ? "selected" : ""}>Pendente</option><option ${student?.status === "Inativo" ? "selected" : ""}>Inativo</option></select></div><div class="form-field full"><label for="student-email">E-mail de contato</label><input id="student-email" name="email" type="email" maxlength="120" value="${escapeHtml(student?.email || "")}" placeholder="nome@exemplo.com" /></div><div class="form-field"><label for="student-phone">Telefone</label><input id="student-phone" name="phone" maxlength="24" value="${escapeHtml(student?.phone || "")}" placeholder="(00) 00000-0000" /></div><div class="form-field"><label for="student-class">Turma</label><select id="student-class" name="classId" required>${db.classes.map(item => `<option value="${escapeHtml(item.id)}" ${student?.classId === item.id ? "selected" : ""}>${escapeHtml(item.title)}</option>`).join("")}</select></div></div>`;
  document.querySelector("#dialog-actions").innerHTML = `<button class="secondary-button" type="button" data-action="close-dialog">Cancelar</button><button class="primary-button" type="submit">${editing ? "Salvar alterações" : "Cadastrar aluno"}</button>`;
  dialog.dataset.mode = "student"; dialog.dataset.editId = student?.id || ""; dialog.showModal(); window.setTimeout(() => document.querySelector("#student-name")?.focus(), 30);
}

function openClassDialog() {
  document.querySelector("#dialog-eyebrow").textContent = "NOVA TURMA"; document.querySelector("#dialog-title").textContent = "Cadastrar turma";
  document.querySelector("#dialog-body").innerHTML = `<div class="form-grid"><div class="form-field"><label for="class-id">Identificação</label><input id="class-id" maxlength="8" required placeholder="Ex.: 6B" /></div><div class="form-field"><label for="class-capacity">Vagas</label><input id="class-capacity" type="number" min="1" max="100" required value="30" /></div><div class="form-field full"><label for="class-title">Nome da turma</label><input id="class-title" required maxlength="80" placeholder="Ex.: 6º ano · Turma B" /></div><div class="form-field"><label for="class-room">Sala</label><input id="class-room" required maxlength="40" placeholder="Ex.: Sala 02" /></div><div class="form-field"><label for="class-schedule">Turno e horário</label><input id="class-schedule" required maxlength="60" placeholder="Manhã · 07:30–11:50" /></div><div class="form-field full"><label for="class-teacher">Professor responsável</label><input id="class-teacher" required maxlength="80" placeholder="Nome do professor" /></div></div>`;
  document.querySelector("#dialog-actions").innerHTML = `<button class="secondary-button" type="button" data-action="close-dialog">Cancelar</button><button class="primary-button" type="submit">Cadastrar turma</button>`;
  dialog.dataset.mode = "class"; dialog.showModal(); window.setTimeout(() => document.querySelector("#class-id")?.focus(), 30);
}

function openTeacherDialog() {
  document.querySelector("#dialog-eyebrow").textContent = "EQUIPE PEDAGÓGICA"; document.querySelector("#dialog-title").textContent = "Adicionar professor";
  document.querySelector("#dialog-body").innerHTML = `<div class="form-grid"><div class="form-field full"><label for="teacher-name">Nome completo</label><input id="teacher-name" required maxlength="100" placeholder="Ex.: Ana Souza" /></div><div class="form-field full"><label for="teacher-email">E-mail</label><input id="teacher-email" type="email" maxlength="120" placeholder="nome@exemplo.com" /></div><div class="form-field full"><label for="teacher-subject">Disciplina</label><input id="teacher-subject" required maxlength="80" placeholder="Ex.: Matemática" /></div></div>`;
  document.querySelector("#dialog-actions").innerHTML = `<button class="secondary-button" type="button" data-action="close-dialog">Cancelar</button><button class="primary-button" type="submit">Adicionar professor</button>`;
  dialog.dataset.mode = "teacher"; dialog.showModal(); window.setTimeout(() => document.querySelector("#teacher-name")?.focus(), 30);
}

function openGradeDialog(student) {
  document.querySelector("#dialog-eyebrow").textContent = "AVALIAÇÃO · 2º TRIMESTRE"; document.querySelector("#dialog-title").textContent = "Atualizar nota";
  const grade = Number(db.grades[student.id] || 0);
  document.querySelector("#dialog-body").innerHTML = `<p style="margin:0 0 14px;color:#718078;font-size:10px">${escapeHtml(student.name)} · ${escapeHtml(className(student.classId))}</p><div class="form-field"><label for="grade-value">Média do período (0 a 10)</label><input id="grade-value" type="number" min="0" max="10" step="0.1" required value="${grade}" /></div>`;
  document.querySelector("#dialog-actions").innerHTML = `<button class="secondary-button" type="button" data-action="close-dialog">Cancelar</button><button class="primary-button" type="submit">Salvar nota</button>`;
  dialog.dataset.mode = "grade"; dialog.dataset.editId = student.id; dialog.showModal(); window.setTimeout(() => document.querySelector("#grade-value")?.focus(), 30);
}

function submitDialog(event) {
  event.preventDefault(); const mode = dialog.dataset.mode;
  if (mode === "student") {
    const student = { name: document.querySelector("#student-name").value.trim(), id: document.querySelector("#student-id").value.trim(), status: document.querySelector("#student-status").value, email: document.querySelector("#student-email").value.trim(), phone: document.querySelector("#student-phone").value.trim(), classId: document.querySelector("#student-class").value };
    if (!student.name || !student.id || !student.classId) return toast("Preencha nome, matrícula e turma.", true);
    const current = db.students.find(item => item.id === dialog.dataset.editId);
    if (!current && db.students.some(item => item.id.toLocaleLowerCase() === student.id.toLocaleLowerCase())) return toast("Já existe um aluno com essa matrícula.", true);
    student.grade = db.classes.find(item => item.id === student.classId)?.title.split(" · ")[0] || "Ensino fundamental";
    if (current) Object.assign(current, student); else { db.students.unshift(student); db.grades[student.id] = 0; }
    saveData(); dialog.close(); render(); toast(current ? "Cadastro atualizado." : "Aluno cadastrado."); return;
  }
  if (mode === "class") {
    const item = { id: document.querySelector("#class-id").value.trim().toUpperCase(), title: document.querySelector("#class-title").value.trim(), capacity: Number(document.querySelector("#class-capacity").value), room: document.querySelector("#class-room").value.trim(), schedule: document.querySelector("#class-schedule").value.trim(), teacher: document.querySelector("#class-teacher").value.trim(), level: "Ensino fundamental" };
    if (db.classes.some(existing => existing.id.toLowerCase() === item.id.toLowerCase())) return toast("Já existe uma turma com essa identificação.", true);
    db.classes.push(item); saveData(); dialog.close(); setView("classes"); toast("Turma cadastrada."); return;
  }
  if (mode === "teacher") {
    db.teachers.push({ name: document.querySelector("#teacher-name").value.trim(), email: document.querySelector("#teacher-email").value.trim(), subject: document.querySelector("#teacher-subject").value.trim(), classes: [] });
    saveData(); dialog.close(); setView("teachers"); toast("Professor adicionado à equipe."); return;
  }
  if (mode === "grade") {
    const grade = Number(document.querySelector("#grade-value").value);
    if (!Number.isFinite(grade) || grade < 0 || grade > 10) return toast("Informe uma nota entre 0 e 10.", true);
    db.grades[dialog.dataset.editId] = grade; saveData(); dialog.close(); render(); toast("Nota atualizada.");
  }
}

function exportCsv(kind) {
  let lines;
  if (kind === "grades") lines = [["Aluno", "Matricula", "Turma", "Media"], ...db.students.map(student => [student.name, student.id, className(student.classId), Number(db.grades[student.id] || 0).toFixed(1)])];
  else lines = [["Aluno", "Matricula", "Email", "Turma", "Serie", "Status", "Telefone"], ...db.students.map(student => [student.name, student.id, student.email, className(student.classId), student.grade, student.status, student.phone])];
  const csv = "\uFEFF" + lines.map(row => row.map(value => `"${String(value || "").replaceAll('"', '""')}"`).join(";")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); const link = document.createElement("a"); link.href = url; link.download = kind === "grades" ? "notas-raiz.csv" : "alunos-raiz.csv"; link.click(); URL.revokeObjectURL(url); toast("Arquivo CSV preparado para download.");
}

document.addEventListener("click", event => {
  const nav = event.target.closest("[data-view]");
  if (nav) { classFilter = ""; setView(nav.dataset.view); return; }
  const actionButton = event.target.closest("[data-action]"); if (!actionButton) return;
  const { action, id } = actionButton.dataset;
  if (action === "view-students") { classFilter = ""; setView("students"); }
  if (action === "view-attendance") setView("attendance");
  if (action === "view-classes") setView("classes");
  if (action === "new-student") openStudentDialog();
  if (action === "edit-student") openStudentDialog(db.students.find(student => student.id === id));
  if (action === "delete-student") {
    const student = db.students.find(item => item.id === id); if (!student) return;
    if (window.confirm(`Remover o cadastro de ${student.name}?`)) { db.students = db.students.filter(item => item.id !== id); delete db.grades[id]; Object.values(db.attendance).forEach(day => delete day[id]); saveData(); render(); toast("Cadastro removido."); }
  }
  if (action === "class-students") { classFilter = id; setView("students"); }
  if (action === "new-class") openClassDialog();
  if (action === "new-teacher") openTeacherDialog();
  if (action === "edit-grade") { const student = db.students.find(item => item.id === id); if (student) openGradeDialog(student); }
  if (action === "export-students") exportCsv("students");
  if (action === "export-grades") exportCsv("grades");
  if (action === "toggle-attendance") {
    if (!db.attendance[attendanceDate]) db.attendance[attendanceDate] = {};
    db.attendance[attendanceDate][id] = attendanceStatus(id, attendanceDate) === "Presente" ? "Ausente" : "Presente";
    saveData(); render();
  }
  if (action === "finish-attendance") toast("Chamada registrada para " + fmtDate(attendanceDate, { day: "2-digit", month: "long", year: "numeric" }) + ".");
  if (action === "close-dialog") dialog.close();
});

document.addEventListener("input", event => {
  if (event.target.id === "student-search") {
    const filtered = filterStudents(event.target.value); document.querySelector("#student-rows").innerHTML = studentRows(filtered);
    document.querySelector("#student-result-count").innerHTML = `Mostrando <strong>${filtered.length}</strong> de <strong>${db.students.length}</strong> alunos`;
  }
  if (event.target.id === "grade-search") {
    const q = event.target.value.trim().toLocaleLowerCase("pt-BR");
    document.querySelectorAll("#grade-rows tr").forEach(row => { row.hidden = !row.textContent.toLocaleLowerCase("pt-BR").includes(q); });
  }
  if (event.target.id === "teacher-search") {
    const q = event.target.value.trim().toLocaleLowerCase("pt-BR");
    document.querySelectorAll("#teacher-rows tr").forEach(row => { row.hidden = !row.textContent.toLocaleLowerCase("pt-BR").includes(q); });
  }
});
document.addEventListener("change", event => {
  if (event.target.id === "class-filter") { classFilter = event.target.value; const filtered = filterStudents(document.querySelector("#student-search")?.value || ""); document.querySelector("#student-rows").innerHTML = studentRows(filtered); document.querySelector("#student-result-count").innerHTML = `Mostrando <strong>${filtered.length}</strong> de <strong>${db.students.length}</strong> alunos`; }
  if (event.target.id === "attendance-date") { attendanceDate = event.target.value || new Date().toISOString().slice(0, 10); render(); }
});
document.querySelector("#dialog-form").addEventListener("submit", submitDialog);
document.querySelector("#notification-button").addEventListener("click", () => toast("Nenhuma notificação nova nesta demonstração."));
document.querySelector("#reset-button").addEventListener("click", () => {
  if (window.confirm("Restaurar os dados fictícios iniciais? As alterações desta demonstração serão apagadas.")) { db = clone(seedData); saveData(); classFilter = ""; setView("dashboard"); toast("Dados iniciais restaurados."); }
});
document.querySelector("#help-button").addEventListener("click", () => {
  document.querySelector("#dialog-eyebrow").textContent = "SOBRE O PROJETO"; document.querySelector("#dialog-title").textContent = "Uma demonstração navegável";
  document.querySelector("#dialog-body").innerHTML = `<p style="margin:0;color:#718078;font-size:11px;line-height:1.7">O Raiz é um protótipo de gestão escolar. Você pode navegar pelas áreas, cadastrar alunos e turmas, registrar frequência e atualizar notas. Os dados iniciais são fictícios e qualquer alteração fica salva no armazenamento local deste navegador. Este protótipo não possui contas de acesso, banco de dados compartilhado nem serviço de produção.</p>`;
  document.querySelector("#dialog-actions").innerHTML = `<button class="primary-button" type="button" data-action="close-dialog">Entendi</button>`; dialog.dataset.mode = "info"; dialog.showModal();
});

updateDate(); render();
