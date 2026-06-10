/* ============================================
   FIFA 2026 Group Predictor — app.js
   ============================================ */

// ── PARSE SERVER INIT ──────────────────────────────────────────────
Parse.initialize(
  "burDaliPLstPolKtA7ozgIUXgvgIAbsEDDRRaall",
  "nlAyYXfDQpZY7cMixJCodO0rGpOrt9iAfjKfvYLd"
);
Parse.serverURL = "https://burda-aaa-01.herokuapp.com/parse";

// ── LOCALE DETECTION ───────────────────────────────────────────────
const userLang = (navigator.language || navigator.userLanguage || "en").toLowerCase();
const isTurkish = userLang.startsWith("tr");
const LANG_KEY  = isTurkish ? "tr" : "en";

// ── TEAM DATA ──────────────────────────────────────────────────────
// Each team: { tr, en, group, flagFile }
// Flag files expected at images/flags/<filename>.png
// Filename derived from English name (lowercase, spaces→underscore)
const TEAMS_RAW = [
  { tr:"Çekya",             en:"Czechia",              group:"A" },
  { tr:"Güney Kore",        en:"Korea Republic",       group:"A" },
  { tr:"Meksika",           en:"Mexico",               group:"A" },
  { tr:"Güney Afrika",      en:"South Africa",         group:"A" },
  { tr:"Bosna",             en:"Bosnia",               group:"B"},
  { tr:"Kanada",            en:"Canada",               group:"B" },
  { tr:"Katar",             en:"Qatar",                group:"B" },
  { tr:"İsviçre",           en:"Switzerland",          group:"B" },
  { tr:"Brezilya",          en:"Brazil",               group:"C" },
  { tr:"Haiti",             en:"Haiti",                group:"C" },
  { tr:"Fas",               en:"Morocco",              group:"C" },
  { tr:"İskoçya",           en:"Scotland",             group:"C" },
  { tr:"Avustralya",        en:"Australia",            group:"D" },
  { tr:"Paraguay",          en:"Paraguay",             group:"D" },
  { tr:"Türkiye",           en:"Turkiye",              group:"D" },
  { tr:"ABD",               en:"USA",                  group:"D" },
  { tr:"Fildişi Sahili",    en:"Ivory Coast",        group:"E" },
  { tr:"Kuraçao",           en:"Curacao",              group:"E" },
  { tr:"Ekvator",           en:"Ecuador",              group:"E" },
  { tr:"Almanya",           en:"Germany",              group:"E" },
  { tr:"Japonya",           en:"Japan",                group:"F" },
  { tr:"Hollanda",          en:"Netherlands",          group:"F" },
  { tr:"İsveç",             en:"Sweden",               group:"F" },
  { tr:"Tunus",             en:"Tunisia",              group:"F" },
  { tr:"Belçika",           en:"Belgium",              group:"G" },
  { tr:"Mısır",             en:"Egypt",                group:"G" },
  { tr:"İran",              en:"Iran",                 group:"G" },
  { tr:"Yeni Zellanda",     en:"New Zealand",          group:"G" },
  { tr:"Cabo Verde",        en:"Cape Verde",           group:"H" },
  { tr:"Sudi Arabistan",    en:"Saudi Arabia",         group:"H" },
  { tr:"İspanya",           en:"Spain",                group:"H" },
  { tr:"Uruguay",           en:"Uruguay",              group:"H" },
  { tr:"Fransa",            en:"France",               group:"I" },
  { tr:"Irak",              en:"Iraq",                 group:"I" },
  { tr:"Norveç",            en:"Norway",               group:"I" },
  { tr:"Senegal",           en:"Senegal",              group:"I" },
  { tr:"Cezayir",           en:"Algeria",              group:"J" },
  { tr:"Arjantin",          en:"Argentina",            group:"J" },
  { tr:"Avusturya",         en:"Austria",              group:"J" },
  { tr:"Ürdün",             en:"Jordan",               group:"J" },
  { tr:"Kolombia",          en:"Colombia",             group:"K" },
  { tr:"Demokratik Kongo",  en:"Congo DR",             group:"K" },
  { tr:"Portekiz",          en:"Portugal",             group:"K" },
  { tr:"Özbekistan",        en:"Uzbekistan",           group:"K" },
  { tr:"Hırvatistan",       en:"Croatia",              group:"L" },
  { tr:"İngiltere",         en:"England",              group:"L" },
  { tr:"Gana",              en:"Ghana",                group:"L" },
  { tr:"Panama",            en:"Panama",               group:"L" },
];

// Flag emoji fallbacks (ISO alpha-2 based unicode)
const FLAG_EMOJIS = {
  "Czechia":               "🇨🇿",
  "Korea Republic":        "🇰🇷",
  "Mexico":                "🇲🇽",
  "South Africa":          "🇿🇦",
  "Bosnia and Herzegovina":"🇧🇦",
  "Canada":                "🇨🇦",
  "Qatar":                 "🇶🇦",
  "Switzerland":           "🇨🇭",
  "Brazil":                "🇧🇷",
  "Haiti":                 "🇭🇹",
  "Morocco":               "🇲🇦",
  "Scotland":              "SC",
  "Australia":             "🇦🇺",
  "Paraguay":              "🇵🇾",
  "Türkiye":               "🇹🇷",
  "USA":                   "🇺🇸",
  "Côte d'Ivoire":         "🇨🇮",
  "Curaçao":               "🇨🇼",
  "Ecuador":               "🇪🇨",
  "Germany":               "🇩🇪",
  "Japan":                 "🇯🇵",
  "Netherlands":           "🇳🇱",
  "Sweden":                "🇸🇪",
  "Tunisia":               "🇹🇳",
  "Belgium":               "🇧🇪",
  "Egypt":                 "🇪🇬",
  "Iran":                  "🇮🇷",
  "New Zealand":           "🇳🇿",
  "Cabo Verde":            "🇨🇻",
  "Saudi Arabia":          "🇸🇦",
  "Spain":                 "🇪🇸",
  "Uruguay":               "🇺🇾",
  "France":                "🇫🇷",
  "Iraq":                  "🇮🇶",
  "Norway":                "🇳🇴",
  "Senegal":               "🇸🇳",
  "Algeria":               "🇩🇿",
  "Argentina":             "🇦🇷",
  "Austria":               "🇦🇹",
  "Jordan":                "🇯🇴",
  "Colombia":              "🇨🇴",
  "Congo DR":              "🇨🇩",
  "Portugal":              "🇵🇹",
  "Uzbekistan":            "🇺🇿",
  "Croatia":               "🇭🇷",
  "England":               "UK",
  "Ghana":                 "🇬🇭",
  "Panama":                "🇵🇦",
};

// Build flag file name from english name
function flagFile(enName) {
  return "images/flags/" + enName.toLowerCase()
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "") + ".gif";
}

// Build grouped structure
const GROUPS = {};
TEAMS_RAW.forEach(t => {
  if (!GROUPS[t.group]) GROUPS[t.group] = [];
  GROUPS[t.group].push({ ...t, flagPath: flagFile(t.en) });
});
const GROUP_KEYS = Object.keys(GROUPS).sort(); // A..L

// ── STATE ──────────────────────────────────────────────────────────
let currentGroupIdx = 0;
let editMode = false; // true when jumping to a group from the summary view
// rankings[groupKey] = [team, team, team, team] — saved when user completes a group
// Starts EMPTY for every group; only populated after the user ranks all 4 teams and moves on
const rankings = {};
GROUP_KEYS.forEach(g => { rankings[g] = []; });
// Track which groups the user has already completed at least once
const completedGroups = new Set();

// ── DOM REFS ───────────────────────────────────────────────────────
const splash      = document.getElementById("splash-screen");
const groupView   = document.getElementById("group-view");
const summaryView = document.getElementById("summary-view");
const regModal    = document.getElementById("reg-modal");
const successModal= document.getElementById("success-modal");

const startBtn    = document.getElementById("start-btn");
const prevBtn     = document.getElementById("prev-btn");
const nextBtn     = document.getElementById("next-btn");
const submitBtn   = document.getElementById("submit-btn");
const cancelRegBtn= document.getElementById("cancel-reg-btn");
const confirmBtn  = document.getElementById("confirm-reg-btn");
const doneBtn     = document.getElementById("done-btn");

const groupHeading= document.getElementById("group-heading");
const teamList    = document.getElementById("team-list");
const progressFill= document.getElementById("progress-fill");
const progressLbl = document.getElementById("progress-label");
const summaryGrid = document.getElementById("summary-grid");

const userNameInput = document.getElementById("user-name");
const userEmailInput= document.getElementById("user-email");
const regError    = document.getElementById("reg-error");

// ── HELPERS ────────────────────────────────────────────────────────
function teamDisplayName(team) {
  return isTurkish ? team.tr : team.en;
}

function makeFlagEl(team, cls = "team-flag", emojiCls = "team-flag-emoji") {
  const img = document.createElement("img");
  img.className = cls;
  img.alt = team.en;
  img.src = team.flagPath;
  img.onerror = () => {
    // fallback to emoji
    const span = document.createElement("span");
    span.className = emojiCls;
    span.textContent = FLAG_EMOJIS[team.en] || "🏳️";
    img.replaceWith(span);
  };
  return img;
}

function rankClass(idx) {
  return ["rank-1","rank-2","rank-3","rank-4"][idx] || "rank-4";
}

function updateProgress() {
  const pct = ((currentGroupIdx) / GROUP_KEYS.length) * 100;
  progressFill.style.width = pct + "%";
  progressLbl.textContent  = `Group ${currentGroupIdx + 1} / ${GROUP_KEYS.length}`;
}

// ── RENDER GROUP ───────────────────────────────────────────────────
// Each group card has:
//   - a "pool" at the top: all 4 teams not yet ranked (click to add to ranking)
//   - a "ranking list" below: ranked slots 1-4, click a ranked team to remove it back to pool
//
// groupRankings[key] = array of team objects in ranked order (starts empty per session open)
// groupPool[key]     = array of team objects not yet ranked
const groupRankings = {}; // ranked teams per group (in-progress state)
const groupPool     = {}; // unranked pool per group (in-progress state)

GROUP_KEYS.forEach(key => {
  groupRankings[key] = []; // always start empty
  groupPool[key]     = [...GROUPS[key]]; // all 4 teams in pool initially
});

function renderGroup(idx) {
  const key = GROUP_KEYS[idx];

  // On first visit: empty ranking, all teams in pool.
  // On revisit (edit from summary, or navigating back): restore what the user had selected.
  if (completedGroups.has(key)) {
    // Restore saved ranking and derive pool from what's not yet ranked
    groupRankings[key] = [...rankings[key]];
    groupPool[key] = GROUPS[key].filter(t => !groupRankings[key].find(r => r.en === t.en));
  } else {
    // Fresh visit — empty list, full pool
    groupRankings[key] = [];
    groupPool[key] = [...GROUPS[key]];
  }

  groupHeading.textContent = `GRUP ${key}`;
  renderGroupUI(key);

  updateProgress();
  prevBtn.disabled = editMode || idx === 0;
  const isLast = idx === GROUP_KEYS.length - 1;
  const nextLabel = editMode ? "Özete dön" : (isLast ? "Özet görüntüle" : "Sonraki grup");
  nextBtn.innerHTML = `${nextLabel} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
  updateNextBtn(key);
}

function updateNextBtn(key) {
  // Disable next if ranking is incomplete (less than 4 teams ranked)
  const allRanked = groupRankings[key].length === 4;
  nextBtn.disabled = !allRanked;
  nextBtn.style.opacity = allRanked ? "" : "0.4";
}

function renderGroupUI(key) {
  teamList.innerHTML = "";

  // ── POOL (top section) ──
  const poolSection = document.createElement("div");
  poolSection.className = "pool-section";

  const poolLabel = document.createElement("div");
  poolLabel.className = "pool-label";
  poolLabel.textContent = "Sıralamak için tıklayın";
  poolSection.appendChild(poolLabel);

  const poolGrid = document.createElement("div");
  poolGrid.className = "pool-grid";

  groupPool[key].forEach(team => {
    const chip = makePoolChip(team, key);
    poolGrid.appendChild(chip);
  });

  // Empty state for pool when all ranked
  if (groupPool[key].length === 0) {
    const done = document.createElement("div");
    done.className = "pool-done";
    done.textContent = "✓ Tüm takımlar sıralandı";
    poolGrid.appendChild(done);
  }

  poolSection.appendChild(poolGrid);
  teamList.appendChild(poolSection);

  // ── DIVIDER ──
  const divider = document.createElement("div");
  divider.className = "rank-section-divider";
  divider.innerHTML = `<span>Sıralamanız</span>`;
  teamList.appendChild(divider);

  // ── RANKING SLOTS ──
  const rankSection = document.createElement("div");
  rankSection.className = "rank-section";

  for (let i = 0; i < 4; i++) {
    const slot = document.createElement("div");
    const team = groupRankings[key][i];

    if (team) {
      // Filled slot — click to remove back to pool
      slot.className = "rank-slot rank-slot-filled";
      slot.dataset.en = team.en;

      const badge = document.createElement("div");
      badge.className = `rank-badge ${rankClass(i)}`;
      badge.textContent = i + 1;

      const flag = makeFlagEl(team);

      const name = document.createElement("span");
      name.className = "team-name";
      name.textContent = teamDisplayName(team);

      const removeBtn = document.createElement("span");
      removeBtn.className = "remove-btn";
      removeBtn.title = "Kaldır";
      removeBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        removeFromRanking(key, team.en);
      });

      slot.append(badge, flag, name, removeBtn);
    } else {
      // Empty slot
      slot.className = "rank-slot rank-slot-empty";
      slot.innerHTML = `
        <div class="rank-badge ${rankClass(i)}" style="opacity:0.3">${i + 1}</div>
        <span class="empty-slot-text">—</span>`;
    }

    rankSection.appendChild(slot);
  }

  teamList.appendChild(rankSection);
}

function makePoolChip(team, key) {
  const chip = document.createElement("div");
  chip.className = "pool-chip";
  chip.dataset.en = team.en;

  const flag = makeFlagEl(team, "pool-flag", "pool-flag-emoji");

  const name = document.createElement("span");
  name.className = "pool-name";
  name.textContent = teamDisplayName(team);

  chip.append(flag, name);

  chip.addEventListener("click", () => {
    addToRanking(key, team.en);
  });

  return chip;
}

function addToRanking(key, enName) {
  if (groupRankings[key].length >= 4) return;
  const team = GROUPS[key].find(t => t.en === enName);
  if (!team) return;

  groupRankings[key].push(team);
  groupPool[key] = groupPool[key].filter(t => t.en !== enName);

  // After 3rd selection, auto-place the last remaining team in 4th
  if (groupRankings[key].length === 3 && groupPool[key].length === 1) {
    groupRankings[key].push(groupPool[key][0]);
    groupPool[key] = [];
  }

  rankings[key] = [...groupRankings[key]];

  renderGroupUI(key);
  updateNextBtn(key);
}

function removeFromRanking(key, enName) {
  const team = GROUPS[key].find(t => t.en === enName);
  if (!team) return;

  groupRankings[key] = groupRankings[key].filter(t => t.en !== enName);
  groupPool[key].push(team);
  rankings[key] = [...groupRankings[key]]; // keep rankings in sync (may be incomplete)

  renderGroupUI(key);
  updateNextBtn(key);
}

// ── RENDER SUMMARY ─────────────────────────────────────────────────
function renderSummary() {
  summaryGrid.innerHTML = "";
  GROUP_KEYS.forEach(key => {
    const teams = rankings[key];
    const card  = document.createElement("div");
    card.className = "summary-group-card";
    card.innerHTML = `
      <div class="summary-group-header">
        <span class="summary-group-label">GRUP ${key}</span>
        <span class="edit-hint">✏ Edit</span>
      </div>`;

    teams.forEach((team, i) => {
      const row = document.createElement("div");
      row.className = "summary-team-row" + (i === 3 ? " summary-out" : "");

      const badge = document.createElement("div");
      badge.className = `summary-rank r${i+1}`;
      badge.textContent = i + 1;

      const flag = makeFlagEl(team, "summary-flag", "summary-flag-emoji");

      const name = document.createElement("span");
      name.className = "summary-team-name";
      name.textContent = teamDisplayName(team);

      row.append(badge, flag, name);
      card.appendChild(row);
    });

    card.addEventListener("click", () => {
      currentGroupIdx = GROUP_KEYS.indexOf(key);
      editMode = true;
      showGroupView();
    });

    summaryGrid.appendChild(card);
  });
}

// ── NAVIGATION ─────────────────────────────────────────────────────
function showGroupView() {
  splash.classList.add("hidden");
  summaryView.classList.add("hidden");
  groupView.classList.remove("hidden");
  renderGroup(currentGroupIdx);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showSummaryView() {
  groupView.classList.add("hidden");
  summaryView.classList.remove("hidden");
  renderSummary();
  progressFill.style.width = "100%";
  progressLbl.textContent  = "All groups done!";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("goto-dashboard-btn").addEventListener("click", () => {
  splash.classList.add("hidden");
  showDashboard();
});

startBtn.addEventListener("click", () => {
  editMode = false;
  completedGroups.clear();
  GROUP_KEYS.forEach(key => {
    rankings[key] = [];
    groupRankings[key] = [];
    groupPool[key] = [...GROUPS[key]];
  });
  splash.classList.add("hidden");
  showGroupView();
});

prevBtn.addEventListener("click", () => {
  if (currentGroupIdx > 0) {
    currentGroupIdx--;
    renderGroup(currentGroupIdx);
  }
});

nextBtn.addEventListener("click", () => {
  // Save and mark current group as completed before leaving
  const key = GROUP_KEYS[currentGroupIdx];
  rankings[key] = [...groupRankings[key]];
  completedGroups.add(key);

  if (editMode) {
    editMode = false;
    showSummaryView();
  } else if (currentGroupIdx < GROUP_KEYS.length - 1) {
    currentGroupIdx++;
    renderGroup(currentGroupIdx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    showSummaryView();
  }
});

submitBtn.addEventListener("click", () => {
  regModal.classList.remove("hidden");
});

cancelRegBtn.addEventListener("click", () => {
  regModal.classList.add("hidden");
  regError.classList.add("hidden");
});

// Close modal on overlay click
regModal.addEventListener("click", (e) => {
  if (e.target === regModal) {
    regModal.classList.add("hidden");
    regError.classList.add("hidden");
  }
});

doneBtn.addEventListener("click", () => {
  successModal.classList.add("hidden");
  showDashboard();
});

// ── SUBMISSION ─────────────────────────────────────────────────────
confirmBtn.addEventListener("click", async () => {
  const name  = userNameInput.value.trim();
  const email = userEmailInput.value.trim();

  regError.classList.add("hidden");

  if (!name) {
    showRegError("Lütfen isim girin");
    return;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showRegError("Lütfen eposta girin");
    return;
  }

  // Build Parse object
  const FIFA2026 = Parse.Object.extend("FIFA2026");
  const obj = new FIFA2026();

  obj.set("Name", name);
  obj.set("Email", email);

  GROUP_KEYS.forEach(key => {
    const teams = rankings[key];
    obj.set(`Group_${key}_1st`, teams[0].en);
    obj.set(`Group_${key}_2nd`, teams[1].en);
    obj.set(`Group_${key}_3rd`, teams[2].en);
    obj.set(`Group_${key}_4th`, teams[3].en);
  });

  // Build a full rankings summary JSON too
  const rankSnapshot = {};
  GROUP_KEYS.forEach(key => {
    rankSnapshot[`Group ${key}`] = {
      "1st": rankings[key][0].en,
      "2nd": rankings[key][1].en,
      "3rd": rankings[key][2].en,
      "4th": rankings[key][3].en,
    };
  });
  obj.set("Rankings", rankSnapshot);

  // Show spinner
  setConfirmLoading(true);

  try {
    await obj.save();
    regModal.classList.add("hidden");
    document.getElementById("success-message").textContent =
      `Bravo ${name}! Tahminleriniz kaydedildi. 🎉`;
    successModal.classList.remove("hidden");
  } catch (err) {
    console.error("Parse error:", err);
    showRegError("Kayıt hatası: " + (err.message || "Hata. Tekrar deneyin"));
  } finally {
    setConfirmLoading(false);
  }
});

function showRegError(msg) {
  regError.textContent = msg;
  regError.classList.remove("hidden");
}

function setConfirmLoading(loading) {
  const label   = document.getElementById("confirm-label");
  const spinner = document.getElementById("confirm-spinner");
  confirmBtn.disabled = loading;
  if (loading) {
    label.textContent = "Kaydediyor…";
    spinner.classList.remove("hidden");
  } else {
    label.textContent = "Kaydet";
    spinner.classList.add("hidden");
  }
}


// ── DASHBOARD ──────────────────────────────────────────────────────
const dashboardView     = document.getElementById("dashboard-view");
const dashboardLoading  = document.getElementById("dashboard-loading");
const dashboardMissing  = document.getElementById("dashboard-admin-missing");
const dashboardContent  = document.getElementById("dashboard-content");
const leaderboardList   = document.getElementById("leaderboard-list");
const dashRefreshBtn    = document.getElementById("dashboard-refresh-btn");

// Points awarded per position match (user rank == actual rank)
// User gets points for each team based on how close their guess was:
//   Exact position match bonus + position-based base points
// 
// Scoring: for each group, compare user's ranking vs ADMIN's actual ranking.
// For each team: points awarded = (5 - |user_pos - actual_pos|) if within 2 places, else 0
// Exact match = 4 pts, off-by-1 = 3 pts, off-by-2 = 2 pts, off-by-3 = 1 pt, off-by-4 = 0 pts
// Max score per group = 4+3+2+1 = 10 pts (all 4 exact) → max total = 120 pts across 12 groups

function calcScore(userRankings, adminRankings) {
  let total = 0;
  const groupBreakdown = {};

  GROUP_KEYS.forEach(key => {
    const userOrder  = userRankings[key]  || []; // array of en names in user order
    const adminOrder = adminRankings[key] || []; // array of en names in admin order
    if (!adminOrder.length) return;

    let groupScore = 0;
    userOrder.forEach((team, userIdx) => {
      const adminIdx = adminOrder.indexOf(team);
      if (adminIdx === -1) return;
      const diff = Math.abs(userIdx - adminIdx);
      const pts  = Math.max(0, 4 - diff); // 4,3,2,1,0
      groupScore += pts;
    });
    total += groupScore;
    groupBreakdown[key] = groupScore;
  });

  return { total, groupBreakdown };
}

// Parse admin record into same rankings shape as user rankings
// Admin record fields: Group_A_1st, Group_A_2nd, etc. (same schema as users)
function parseRankingsFromRecord(record) {
  const result = {};
  GROUP_KEYS.forEach(key => {
    result[key] = [
      record.get(`Group_${key}_1st`) || "",
      record.get(`Group_${key}_2nd`) || "",
      record.get(`Group_${key}_3rd`) || "",
      record.get(`Group_${key}_4th`) || "",
    ].filter(Boolean);
  });
  return result;
}

async function showDashboard() {
  // Hide all other views
  summaryView.classList.add("hidden");
  groupView.classList.add("hidden");
  splash.classList.add("hidden");

  dashboardView.classList.remove("hidden");
  dashboardLoading.classList.remove("hidden");
  dashboardMissing.classList.add("hidden");
  dashboardContent.classList.add("hidden");
  leaderboardList.innerHTML = "";

  window.scrollTo({ top: 0, behavior: "smooth" });

  try {
    const FIFA2026Class = Parse.Object.extend("FIFA2026");

    // 1. Fetch ADMIN record (actual standings)
    const adminQuery = new Parse.Query(FIFA2026Class);
    adminQuery.equalTo("Name", "FIFA2026ADMIN");
    adminQuery.limit(1);
    const adminResults = await adminQuery.find();

    const adminRecord = adminResults[0] || null;
    const adminRankings = adminRecord ? parseRankingsFromRecord(adminRecord) : null;

    // Check if admin has filled in any groups yet
    const adminHasData = adminRankings &&
      GROUP_KEYS.some(k => adminRankings[k] && adminRankings[k].length > 0);

    // 2. Fetch all user records (exclude ADMIN)
    const userQuery = new Parse.Query(FIFA2026Class);
    userQuery.notEqualTo("Name", "FIFA2026ADMIN");
    userQuery.limit(1000);
    userQuery.ascending("createdAt");
    const userResults = await userQuery.find();

    dashboardLoading.classList.add("hidden");

    if (!adminHasData) {
      dashboardMissing.classList.remove("hidden");
    }

    // 3. Score each user
    const scored = userResults.map((rec, idx) => {
      const userRanks = parseRankingsFromRecord(rec);
      const { total, groupBreakdown } = adminHasData
        ? calcScore(userRanks, adminRankings)
        : { total: 0, groupBreakdown: {} };

      return {
        rank:       idx + 1,
        name:       rec.get("Name") || "—",
        email:      rec.get("Email") || "",
        score:      total,
        breakdown:  groupBreakdown,
        createdAt:  rec.createdAt,
      };
    });

    // Sort by score descending, then by submission time ascending (earlier = better tiebreak)
    scored.sort((a, b) => b.score - a.score || a.createdAt - b.createdAt);

    // Re-assign display rank after sorting
    scored.forEach((s, i) => { s.displayRank = i + 1; });

    dashboardContent.classList.remove("hidden");
    renderLeaderboard(scored, adminHasData);

  } catch (err) {
    dashboardLoading.classList.add("hidden");
    console.error("Dashboard error:", err);
    dashboardMissing.textContent = "Veri yüklenirken hata oluştu: " + (err.message || err);
    dashboardMissing.classList.remove("hidden");
  }
}

function renderLeaderboard(entries, hasAdmin) {
  leaderboardList.innerHTML = "";

  if (!entries.length) {
    leaderboardList.innerHTML = `<div class="leaderboard-empty">Henüz kayıt yok.</div>`;
    return;
  }

  entries.forEach((entry, i) => {
    const isTop3 = i < 3;
    const medalEmoji = ["🥇","🥈","🥉"][i] || "";

    const row = document.createElement("div");
    row.className = "lb-row" + (isTop3 ? " lb-top" : "");

    // Rank number / medal
    const rankEl = document.createElement("div");
    rankEl.className = "lb-rank";
    rankEl.innerHTML = medalEmoji
      ? `<span class="lb-medal">${medalEmoji}</span>`
      : `<span class="lb-num">${entry.displayRank}</span>`;

    // Name + email
    const nameEl = document.createElement("div");
    nameEl.className = "lb-name-block";
    nameEl.innerHTML = `
      <span class="lb-name">${escapeHtml(entry.name)}</span>
      <span class="lb-email">${escapeHtml(entry.email)}</span>`;

    // Score
    const scoreEl = document.createElement("div");
    scoreEl.className = "lb-score";
    if (hasAdmin) {
      scoreEl.innerHTML = `<span class="lb-pts">${entry.score}</span><span class="lb-pts-label">puan</span>`;
    } else {
      scoreEl.innerHTML = `<span class="lb-pts-na">—</span>`;
    }

    // Expand toggle for group breakdown
    const toggleEl = document.createElement("button");
    toggleEl.className = "lb-toggle";
    toggleEl.title = "Grup detayı";
    toggleEl.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M6 9l6 6 6-6"/></svg>`;

    row.append(rankEl, nameEl, scoreEl, toggleEl);
    leaderboardList.appendChild(row);

    // Breakdown detail row (hidden by default)
    if (hasAdmin && Object.keys(entry.breakdown).length) {
      const detail = document.createElement("div");
      detail.className = "lb-detail hidden";

      const grid = document.createElement("div");
      grid.className = "lb-detail-grid";

      GROUP_KEYS.forEach(key => {
        const pts = entry.breakdown[key] ?? 0;
        const cell = document.createElement("div");
        cell.className = "lb-detail-cell";
        // colour code: max=10, good=7+, mid=4+, low<4
        const cls = pts >= 8 ? "pts-high" : pts >= 5 ? "pts-mid" : "pts-low";
        cell.innerHTML = `<span class="detail-group">G${key}</span><span class="detail-pts ${cls}">${pts}</span>`;
        grid.appendChild(cell);
      });

      detail.appendChild(grid);
      leaderboardList.appendChild(detail);

      toggleEl.addEventListener("click", () => {
        const open = !detail.classList.contains("hidden");
        detail.classList.toggle("hidden", open);
        toggleEl.classList.toggle("open", !open);
      });
    } else {
      toggleEl.style.visibility = "hidden";
    }
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;");
}

dashRefreshBtn.addEventListener("click", () => showDashboard());
