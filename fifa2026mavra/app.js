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

// Nickname and avatar image for each group (A→L)
const GROUP_NICKNAMES = {
  A: 'ROBESON',
  B: 'KARAN',
  C: 'MORRIS',
  D: 'NACAR',
  E: 'WELLEN',
  F: 'MELLING',
  G: 'FEHIME',
  H: 'ALLEN',
  I: 'HALIL',
  J: 'TISCHER',
  K: 'BRUNO',
  L: 'ERSOY',
};

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

  const nick = GROUP_NICKNAMES[key] || '';
  groupHeading.innerHTML = `
    <span class="group-heading-left">GRUP ${key}</span>
    <span class="group-heading-right">
      <img src="images/${nick}.png" alt="${nick}" class="group-nick-img"
           onerror="this.style.display='none'">
      <span class="group-nick-name">${nick}</span>
    </span>`;
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
    const nick  = GROUP_NICKNAMES[key] || '';
    const card  = document.createElement("div");
    card.className = "summary-group-card";
    card.innerHTML = `
      <div class="summary-group-header">
        <span class="summary-group-label">GRUP ${key}</span>
        <span class="summary-nick-block">
          <img src="images/${nick}.png" alt="${nick}" class="summary-nick-img"
               onerror="this.style.display='none'">
          <span class="summary-nick-name">${nick}</span>
        </span>
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
    await fetchWithRetry(() => obj.save());
    regModal.classList.add("hidden");
    document.getElementById("success-message").textContent =
      `Bravo ${name}! Tahminleriniz kaydedildi.`;
    successModal.classList.remove("hidden");
  } catch (err) {
    console.error("Parse error:", err);
    showRegError("Hata. Tekrar Kaydet butona basın");
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

// ── KO SCORING ────────────────────────────────────────────────────
// KO admin record fields: R32_M1_Winner, R16_M1_Winner, QF_M1_Winner,
// SF_M1_Winner, Final_M1_Winner, ThirdPlace_Winner, Champion
// Points: correct winner per round:
//   R32 = 1pt, R16 = 2pts, QF = 4pts, SF = 8pts, Final/3rd = 16pts, Champion = 32pts

const KO_ROUND_PTS = { R32: 1, R16: 2, QF: 4, SF: 8, Final: 16, ThirdPlace: 16 };
const KO_CHAMPION_PTS = 32;
const KO_ROUND_NAMES = ['R32', 'R16', 'QF', 'SF', 'Final'];
const KO_ROUND_MATCH_COUNTS = [16, 8, 4, 2, 1];

function parseKoFromRecord(rec) {
  // Returns { R32: [winner,...], R16: [...], QF: [...], SF: [...], Final: [...],
  //           ThirdPlace: winner|"", Champion: "" }
  const result = { ThirdPlace: "", Champion: rec.get("Champion") || "" };
  KO_ROUND_NAMES.forEach((rn, ri) => {
    result[rn] = [];
    for (let m = 1; m <= KO_ROUND_MATCH_COUNTS[ri]; m++) {
      result[rn].push(rec.get(`${rn}_M${m}_Winner`) || "");
    }
  });
  result.ThirdPlace = rec.get("ThirdPlace_Winner") || "";
  return result;
}

function calcKoScore(userKo, adminKo) {
  let total = 0;
  const breakdown = {};

  KO_ROUND_NAMES.forEach(rn => {
    const userWinners  = userKo[rn]  || [];
    const adminWinners = adminKo[rn] || [];
    let pts = 0;
    adminWinners.forEach((aw, idx) => {
      if (aw && userWinners[idx] && aw === userWinners[idx]) {
        pts += KO_ROUND_PTS[rn];
      }
    });
    total += pts;
    breakdown[rn] = pts;
  });

  // 3rd place
  const tp3 = adminKo.ThirdPlace;
  if (tp3 && userKo.ThirdPlace && tp3 === userKo.ThirdPlace) {
    total += KO_ROUND_PTS.ThirdPlace;
    breakdown.ThirdPlace = KO_ROUND_PTS.ThirdPlace;
  } else {
    breakdown.ThirdPlace = 0;
  }

  // Champion
  if (adminKo.Champion && userKo.Champion && adminKo.Champion === userKo.Champion) {
    total += KO_CHAMPION_PTS;
    breakdown.Champion = KO_CHAMPION_PTS;
  } else {
    breakdown.Champion = 0;
  }

  return { total, breakdown };
}

async function fetchWithRetry(queryFn, maxRetries = 3, delayMs = 2000) {
  // Retries a Parse query up to maxRetries times with a delay between attempts.
  // This handles Heroku dyno cold-starts where the first 1-2 requests time out.
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await queryFn();
    } catch (err) {
      const isLast = attempt === maxRetries;
      const isConnErr = err.code === 100 || (err.message || "").includes("Unable to connect");
      if (isLast || !isConnErr) throw err;
      console.warn(`Parse connection attempt ${attempt} failed — retrying in ${delayMs}ms…`);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}

async function showDashboard() {
  // Hide all other views
  summaryView.classList.add("hidden");
  groupView.classList.add("hidden");
  splash.classList.add("hidden");
  document.getElementById("knockout-view").classList.add("hidden");

  dashboardView.classList.remove("hidden");
  dashboardLoading.classList.remove("hidden");
  dashboardMissing.classList.add("hidden");
  dashboardContent.classList.add("hidden");
  leaderboardList.innerHTML = "";

  window.scrollTo({ top: 0, behavior: "smooth" });

  try {
    // ── Fetch all data with retry (handles Heroku dyno cold-start) ──
    const [adminRec, koAdminRec, userRecs, koUserRecs] = await fetchWithRetry(async () => {
      const FIFA2026Class   = Parse.Object.extend("FIFA2026");
      const FIFA2026KOClass = Parse.Object.extend("FIFA2026_KO");

      const adminQ = new Parse.Query(FIFA2026Class);
      adminQ.equalTo("Name", "FIFA2026ADMIN"); adminQ.limit(1);

      const koAdminQ = new Parse.Query(FIFA2026KOClass);
      koAdminQ.equalTo("Name", "FIFA2026ADMIN"); koAdminQ.limit(1);

      const userQ = new Parse.Query(FIFA2026Class);
      userQ.notEqualTo("Name", "FIFA2026ADMIN");
      userQ.limit(1000); userQ.ascending("createdAt");

      const koUserQ = new Parse.Query(FIFA2026KOClass);
      koUserQ.notEqualTo("Name", "FIFA2026ADMIN"); koUserQ.limit(1000);

      // Run all 4 queries in parallel — one cold-start wake-up covers all
      const [[aRec], [koARec], uRecs, koURecs] = await Promise.all([
        adminQ.find(), koAdminQ.find(), userQ.find(), koUserQ.find()
      ]);
      return [aRec || null, koARec || null, uRecs, koURecs];
    });

    const adminRankings  = adminRec    ? parseRankingsFromRecord(adminRec)  : null;
    const adminHasData   = adminRankings &&
      GROUP_KEYS.some(k => adminRankings[k] && adminRankings[k].length > 0);

    const adminKo        = koAdminRec  ? parseKoFromRecord(koAdminRec)      : null;
    const koAdminHasData = adminKo &&
      (adminKo.Champion || KO_ROUND_NAMES.some(rn => adminKo[rn].some(w => w)));

    // Index KO records by email for quick lookup
    const koByEmail = {};
    koUserRecs.forEach(r => {
      const em = (r.get("Email") || "").toLowerCase();
      if (em) koByEmail[em] = r;
    });

    dashboardLoading.classList.add("hidden");
    if (!adminHasData) dashboardMissing.classList.remove("hidden");

    // ── Score each user ──
    const scored = userRecs.map(rec => {
      const email = (rec.get("Email") || "").toLowerCase();

      // Group score
      const userRanks = parseRankingsFromRecord(rec);
      const { total: gTotal, groupBreakdown } = adminHasData
        ? calcScore(userRanks, adminRankings)
        : { total: 0, groupBreakdown: {} };

      // KO score
      let koTotal = 0;
      let koBreakdown = {};
      const koRec = koByEmail[email];
      if (koRec && koAdminHasData) {
        const userKo = parseKoFromRecord(koRec);
        const res    = calcKoScore(userKo, adminKo);
        koTotal      = res.total;
        koBreakdown  = res.breakdown;
      }

      return {
        name:         rec.get("Name") || "—",
        email:        email,
        groupScore:   gTotal,
        koScore:      koTotal,
        score:        gTotal + koTotal,
        groupBreakdown,
        koBreakdown,
        hasKo:        !!koRec,
        createdAt:    rec.createdAt,
      };
    });

    scored.sort((a, b) => b.score - a.score || a.createdAt - b.createdAt);
    scored.forEach((s, i) => { s.displayRank = i + 1; });

    // Store for combined modal
    window._mavraScored        = scored;
    window._mavraAdminHasData  = adminHasData;
    window._mavraKoAdminHasData = koAdminHasData;

    dashboardContent.classList.remove("hidden");
    renderLeaderboard(scored, adminHasData, koAdminHasData);

  } catch (err) {
    dashboardLoading.classList.add("hidden");
    console.error("Dashboard error:", err);
    dashboardMissing.textContent = "Veri yüklenirken hata oluştu: " + (err.message || err);
    dashboardMissing.classList.remove("hidden");
  }
}

function makeLbRow(entry, i, hasAdmin, hasKoAdmin, listEl, mode) {
  // mode: "combined" | "group" | "ko"
  const medalEmoji = ["🥇","🥈","🥉"][i] || "";
  const isTop3 = i < 3;

  const row = document.createElement("div");
  row.className = "lb-row" + (isTop3 ? " lb-top" : "");

  // Rank
  const rankEl = document.createElement("div");
  rankEl.className = "lb-rank";
  rankEl.innerHTML = medalEmoji
    ? `<span class="lb-medal">${medalEmoji}</span>`
    : `<span class="lb-num">${i + 1}</span>`;

  // Name + email
  const nameEl = document.createElement("div");
  nameEl.className = "lb-name-block";

  let scoreLine = "";
  if (mode === "combined" && (hasAdmin || hasKoAdmin)) {
    scoreLine = `<span class="lb-score-sub">${hasAdmin ? entry.groupScore : "—"} grup + ${hasKoAdmin && entry.hasKo ? entry.koScore : "—"} eleme</span>`;
  }
  nameEl.innerHTML = `<span class="lb-name">${escapeHtml(entry.name)}</span>${scoreLine}`;

  // Main score
  const scoreEl = document.createElement("div");
  scoreEl.className = "lb-score";
  let pts;
  if      (mode === "group")    pts = hasAdmin      ? entry.groupScore : null;
  else if (mode === "ko")       pts = hasKoAdmin && entry.hasKo ? entry.koScore : null;
  else                          pts = (hasAdmin || hasKoAdmin) ? entry.score : null;

  if (pts !== null && pts !== undefined) {
    scoreEl.innerHTML = `<span class="lb-pts">${pts}</span><span class="lb-pts-label">puan</span>`;
  } else {
    scoreEl.innerHTML = `<span class="lb-pts-na">—</span>`;
  }

  // Toggle
  const toggleEl = document.createElement("button");
  toggleEl.className = "lb-toggle";
  toggleEl.title = "Detay";
  toggleEl.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M6 9l6 6 6-6"/></svg>`;

  row.append(rankEl, nameEl, scoreEl, toggleEl);
  listEl.appendChild(row);

  // Detail breakdown
  const detail = document.createElement("div");
  detail.className = "lb-detail hidden";
  let hasDetail = false;

  if ((mode === "combined" || mode === "group") && hasAdmin && entry.groupBreakdown) {
    const sec = document.createElement("div");
    sec.innerHTML = `<div class="detail-section-label">Grup Aşaması</div>`;
    const grid = document.createElement("div");
    grid.className = "lb-detail-grid";
    GROUP_KEYS.forEach(key => {
      const p = entry.groupBreakdown[key] ?? 0;
      const cls = p >= 8 ? "pts-high" : p >= 5 ? "pts-mid" : "pts-low";
      const cell = document.createElement("div");
      cell.className = "lb-detail-cell";
      cell.innerHTML = `<span class="detail-group">G${key}</span><span class="detail-pts ${cls}">${p}</span>`;
      grid.appendChild(cell);
    });
    sec.appendChild(grid);
    detail.appendChild(sec);
    hasDetail = true;
  }

  if ((mode === "combined" || mode === "ko") && hasKoAdmin && entry.hasKo && entry.koBreakdown) {
    const sec = document.createElement("div");
    sec.innerHTML = `<div class="detail-section-label" style="margin-top:0.5rem">Eleme Turu</div>`;
    const grid = document.createElement("div");
    grid.className = "lb-detail-grid";
    const koKeys = [...KO_ROUND_NAMES, "ThirdPlace", "Champion"];
    const koLabels = { R32:"S32", R16:"S16", QF:"ÇF", SF:"YF", Final:"FIN", ThirdPlace:"3.", Champion:"🏆" };
    koKeys.forEach(k => {
      const p = entry.koBreakdown[k] ?? 0;
      const cls = p > 0 ? "pts-high" : "pts-low";
      const cell = document.createElement("div");
      cell.className = "lb-detail-cell";
      cell.innerHTML = `<span class="detail-group">${koLabels[k]||k}</span><span class="detail-pts ${cls}">${p}</span>`;
      grid.appendChild(cell);
    });
    sec.appendChild(grid);
    detail.appendChild(sec);
    hasDetail = true;
  }

  if (hasDetail) {
    listEl.appendChild(detail);
    toggleEl.addEventListener("click", () => {
      const open = !detail.classList.contains("hidden");
      detail.classList.toggle("hidden", open);
      toggleEl.classList.toggle("open", !open);
    });
  } else {
    toggleEl.style.visibility = "hidden";
  }
}

function renderLeaderboard(entries, hasAdmin, hasKoAdmin = false) {
  leaderboardList.innerHTML = "";
  if (!entries.length) {
    leaderboardList.innerHTML = `<div class="leaderboard-empty">Henüz kayıt yok.</div>`;
    return;
  }
  entries.forEach((entry, i) => {
    makeLbRow(entry, i, hasAdmin, hasKoAdmin, leaderboardList, "combined");
  });
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

dashRefreshBtn.addEventListener("click", () => showDashboard());

// ── COMBINED LEADERBOARD MODAL ─────────────────────────────────────
let _activeTab = "combined";

document.getElementById("combined-lb-btn").addEventListener("click", () => {
  openCombinedModal("combined");
});

document.getElementById("combined-close-btn").addEventListener("click", () => {
  document.getElementById("combined-modal").classList.add("hidden");
});

document.getElementById("combined-modal").addEventListener("click", e => {
  if (e.target === document.getElementById("combined-modal"))
    document.getElementById("combined-modal").classList.add("hidden");
});

document.querySelectorAll(".combined-tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".combined-tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    _activeTab = btn.dataset.tab;
    renderCombinedList(_activeTab);
  });
});

async function openCombinedModal(tab) {
  const modal = document.getElementById("combined-modal");
  modal.classList.remove("hidden");
  _activeTab = tab || "combined";

  document.querySelectorAll(".combined-tab").forEach(b => {
    b.classList.toggle("active", b.dataset.tab === _activeTab);
  });

  if (!window._mavraScored) {
    // Data not yet loaded — fetch first (with retry built in)
    document.getElementById("combined-loading").classList.remove("hidden");
    document.getElementById("combined-content").classList.add("hidden");
    try {
      await showDashboard();   // properly awaited — waits for all Parse queries
    } catch (err) {
      console.error("openCombinedModal fetch error:", err);
    }
    document.getElementById("combined-loading").classList.add("hidden");
    document.getElementById("combined-content").classList.remove("hidden");
  } else {
    document.getElementById("combined-loading").classList.add("hidden");
    document.getElementById("combined-content").classList.remove("hidden");
  }

  renderCombinedList(_activeTab);
}

function renderCombinedList(mode) {
  const list       = document.getElementById("combined-list");
  const scored     = window._mavraScored || [];
  const hasAdmin   = window._mavraAdminHasData   || false;
  const hasKoAdmin = window._mavraKoAdminHasData  || false;
  list.innerHTML   = "";

  // Sort by the relevant score for the chosen tab
  let sorted;
  if (mode === "group") {
    sorted = [...scored].sort((a,b) => b.groupScore - a.groupScore || a.createdAt - b.createdAt);
  } else if (mode === "ko") {
    sorted = [...scored].sort((a,b) => b.koScore - a.koScore || a.createdAt - b.createdAt);
  } else {
    sorted = [...scored]; // already sorted by combined
  }

  if (!sorted.length) {
    list.innerHTML = `<div class="leaderboard-empty">Henüz kayıt yok.</div>`;
    return;
  }

  sorted.forEach((entry, i) => {
    makeLbRow(entry, i, hasAdmin, hasKoAdmin, list, mode);
  });
}



// ══════════════════════════════════════════════════════════════════
//  KNOCKOUT ROUND — R16 → QF → SF → 3rd Place + Final
// ══════════════════════════════════════════════════════════════════

// ── KNOCKOUT TEAM DATA ────────────────────────────────────────────
// Hard-code actual team names here once group stage is complete.
// slot key → { en, tr, flag }
const KO_TEAMS = {
  "1A": { en: "Mexico", tr: "Meksika", flag: "images/flags/mexico.gif" },
  "2A": { en: "South Africa", tr: "Güney Afrika", flag: "images/flags/south_africa.gif" },
  "3A": { en: "Korea Republic", tr: "Güney Kore", flag: "images/flags/korea_republic.gif" },
  "1B": { en: "Switzerland", tr: "İsviçre", flag: "images/flags/switzerland.gif" },
  "2B": { en: "Canada", tr: "Kanada", flag: "images/flags/canada.gif" },
  "3B": { en: "Bosnia", tr: "Bosna", flag: "images/flags/bosnia.gif" },
  "1C": { en: "Brazil", tr: "Brezilya", flag: "images/flags/brazil.gif" },
  "2C": { en: "Morocco", tr: "Fas", flag: "images/flags/morocco.gif" },
  "3C": { en: "Scotland", tr: "İskoçya", flag: "images/flags/scotland.gif" },
  "1D": { en: "USA", tr: "ABD", flag: "images/flags/usa.gif" },
  "2D": { en: "Australia", tr: "Avustralya", flag: "images/flags/australia.gif" },
  "3D": { en: "Paraguay", tr: "Paraguay", flag: "images/flags/paraguay.gif" },
  "1E": { en: "Germany", tr: "Almanya", flag: "images/flags/germany.gif" },
  "2E": { en: "Ivory Coast", tr: "Fildişi Sahili", flag: "images/flags/ivory_coast.gif" },
  "3E": { en: "Ecuador", tr: "Ekvator", flag: "images/flags/ecuador.gif" },
  "1F": { en: "Netherlands", tr: "Hollanda", flag: "images/flags/netherlands.gif" },
  "2F": { en: "Japan", tr: "Japonya", flag: "images/flags/japan.gif" },
  "3F": { en: "Sweden", tr: "İsveç", flag: "images/flags/sweden.gif" },
  "1G": { en: "Belgium", tr: "Belçika", flag: "images/flags/belgium.gif" },
  "2G": { en: "Egypt", tr: "Mısır", flag: "images/flags/egypt.gif" },
  "3G": { en: "Iran", tr: "İran", flag: "images/flags/iran.gif" },
  "1H": { en: "Spain", tr: "İspanya", flag: "images/flags/spain.gif" },
  "2H": { en: "Cape Verde", tr: "Cabo Verde", flag: "images/flags/cape_verde.gif" },
  "3H": { en: "Uruguay", tr: "Uruguay", flag: "images/flags/uruguay.gif" },
  "1I": { en: "France", tr: "Fransa", flag: "images/flags/france.gif" },
  "2I": { en: "Norway", tr: "Norveç", flag: "images/flags/norway.gif" },
  "3I": { en: "Senegal", tr: "Senegal", flag: "images/flags/senegal.gif" },
  "1J": { en: "Argentina", tr: "Arjantin", flag: "images/flags/argentina.gif" },
  "2J": { en: "Austria", tr: "Avusturya", flag: "images/flags/austria.gif" },
  "3J": { en: "Algeria", tr: "Cezayir", flag: "images/flags/algeria.gif" },
  "1K": { en: "Colombia", tr: "Kolombia", flag: "images/flags/colombia.gif" },
  "2K": { en: "Portugal", tr: "Portekiz", flag: "images/flags/portugal.gif" },
  "3K": { en: "Congo DR", tr: "Demokratik Kongo", flag: "images/flags/congo_dr.gif" },
  "1L": { en: "England", tr: "İngiltere", flag: "images/flags/england.gif" },
  "2L": { en: "Croatia", tr: "Hırvatistan", flag: "images/flags/croatia.gif" },
  "3L": { en: "Ghana", tr: "Gana", flag: "images/flags/ghana.gif" },
};

// ── R16 FIXTURES ──────────────────────────────────────────────────
// 16 matches; winners feed into QF in pairs:
//   R16 matches 0+1 → QF match 0
//   R16 matches 2+3 → QF match 1 … etc.
const R16_FIXTURES = [
  ["2A", "2B"],   // M1  → QF0-A
  ["1F", "2C"],   // M2  → QF0-B
  ["1E", "3D"],   // M3  → QF1-A
  ["1I", "3F"],   // M4  → QF1-B
  ["1G", "3I"],   // M5  → QF2-A
  ["1D", "3B"],   // M6  → QF2-B
  ["1H", "2J"],   // M7  → QF3-A
  ["2K", "2L"],   // M8  → QF3-B
  ["1C", "2F"],   // M9  → QF4-A
  ["2E", "2I"],   // M10 → QF4-B
  ["1A", "3E"],   // M11 → QF5-A
  ["1L", "3K"],   // M12 → QF5-B
  ["1B", "3J"],   // M13 → QF6-A
  ["1K", "3L"],   // M14 → QF6-B
  ["2D", "2G"],   // M15 → QF7-A
  ["1J", "2H"],   // M16 → QF7-B
];

// ── BRACKET STATE ─────────────────────────────────────────────────
// koRounds[0] = R16   — 16 matches
// koRounds[1] = QF    —  8 matches (winners of R16 pairs)
// koRounds[2] = SF    —  4 matches (winners of QF pairs)
// koRounds[3] = Final —  1 match   (winners of SF 0 vs SF 1 AND SF 2 vs SF 3)
// ko3rd        = 3rd place — 1 match (losers of SF 0+1 AND SF 2+3? → losers of SF 0 vs SF 1)
//   Actually FIFA: losers of both semi-finals play 3rd place match.
//   SF[0] and SF[1] feed Final; losers of SF[0] and SF[1] play 3rd place.
//   Wait — FIFA 2026 has 4 SF matches but only 2 feed the final.
//   Structure: QF0+QF1 → SF0; QF2+QF3 → SF1; QF4+QF5 → SF2; QF6+QF7 → SF3
//              SF0 winner vs SF1 winner → Final A-side
//              SF2 winner vs SF3 winner → Final B-side
//              Final A-side winner vs Final B-side winner → Champion
//   3rd place: losers of SF0vsQF… 
//   FIFA 2026 actually has: 4 QF → 2 SF → 1 Final + 1 third-place
//   But with 8 QF matches we have: 8 QF → 4 SF → 2 "semi-final of finals"? 
//   Simplified standard bracket: 16→8→4→2→1 + third place from SF losers
//
// CLEAN STRUCTURE (standard 32-team single-elim + 3rd place):
//   R16: 16 matches  (32 → 16 teams)
//   QF:   8 matches  (16 →  8 teams)
//   SF:   4 matches  ( 8 →  4 teams)
//   Final: 1 match   (top 2 of bracket meet) — but with 4 SF we need 2 final-4 matches
//
// ACTUAL FIFA 2026 structure (48 teams, 12 groups):
//   After group stage: 32 teams advance
//   R32 → R16 → QF → SF → 3rd place + Final
//   Total rounds after group: R32(16 matches) → R16(8) → QF(4) → SF(2) → Final(1)
//   3rd place: SF losers
//
// So koRounds = [R32(16), R16(8), QF(4), SF(2), Final(1)]
// Plus separate ko3rdMatch for 3rd place.

let koRounds = [];   // [R32, R16, QF, SF, Final] — each is array of matches
let ko3rdMatch = null; // { teamA, teamB, winner }

function initKoBracket() {
  // R32: 16 matches from fixtures
  const r32 = R16_FIXTURES.map(([a, b]) => ({ teamA: a, teamB: b, winner: null }));

  // R16: 8 matches — teams come from R32 winners
  const r16 = Array.from({ length: 8  }, () => ({ teamA: null, teamB: null, winner: null }));

  // QF: 4 matches — teams come from R16 winners
  const qf  = Array.from({ length: 4  }, () => ({ teamA: null, teamB: null, winner: null }));

  // SF: 2 matches — teams come from QF winners
  const sf  = Array.from({ length: 2  }, () => ({ teamA: null, teamB: null, winner: null }));

  // Final: 1 match — SF winners
  const fin = [{ teamA: null, teamB: null, winner: null }];

  koRounds = [r32, r16, qf, sf, fin];

  // 3rd place: SF losers
  ko3rdMatch = { teamA: null, teamB: null, winner: null };
}

// ── HELPERS ───────────────────────────────────────────────────────
function koTeamName(slot) {
  if (!slot) return '?';
  const t = KO_TEAMS[slot];
  return t ? (isTurkish ? t.tr : t.en) : slot;
}
// Always returns English name — used when saving to Parse so scores
// can be compared correctly regardless of user locale.
function koTeamEn(slot) {
  if (!slot) return '';
  const t = KO_TEAMS[slot];
  return t ? t.en : slot;
}
function koTeamFlag(slot) {
  if (!slot) return null;
  const t = KO_TEAMS[slot];
  return (t && t.flag) ? t.flag : null;
}

// All main rounds complete AND 3rd place complete
function koAllComplete() {
  const mainDone = koRounds.every(round => round.every(m => m.winner !== null));
  const thirdDone = ko3rdMatch.teamA && ko3rdMatch.teamB && ko3rdMatch.winner;
  return mainDone && thirdDone;
}

// ── RENDER ────────────────────────────────────────────────────────
const ROUND_LABELS = ['Son 32', 'Son 16', 'Çeyrek Final', 'Yarı Final', 'Final'];

function renderKoBracket() {
  const bracket = document.getElementById('ko-bracket');
  bracket.innerHTML = '';

  // Render main rounds
  koRounds.forEach((round, roundIdx) => {
    const col = makeRoundCol(ROUND_LABELS[roundIdx], round, roundIdx, false);
    bracket.appendChild(col);
  });

  // 3rd place column — sits beside the Final column
  const thirdCol = document.createElement('div');
  thirdCol.className = 'ko-round-col';
  const thirdLabel = document.createElement('div');
  thirdLabel.className = 'ko-round-label';
  thirdLabel.textContent = 'Üçüncü';
  thirdCol.appendChild(thirdLabel);

  const thirdWrap = document.createElement('div');
  thirdWrap.className = 'ko-matches-wrap';
  thirdWrap.appendChild(makeMatchEl(ko3rdMatch, -1, 0)); // roundIdx -1 = 3rd place
  thirdCol.appendChild(thirdWrap);
  bracket.appendChild(thirdCol);

  // Save button
  document.getElementById('ko-save-btn').classList.toggle('hidden', !koAllComplete());
}

function makeRoundCol(label, round, roundIdx, is3rd) {
  const col = document.createElement('div');
  col.className = 'ko-round-col';

  const lbl = document.createElement('div');
  lbl.className = 'ko-round-label';
  lbl.textContent = label;
  col.appendChild(lbl);

  const wrap = document.createElement('div');
  wrap.className = 'ko-matches-wrap';
  round.forEach((match, matchIdx) => {
    wrap.appendChild(makeMatchEl(match, roundIdx, matchIdx));
  });
  col.appendChild(wrap);
  return col;
}

function makeMatchEl(match, roundIdx, matchIdx) {
  const matchEl = document.createElement('div');
  matchEl.className = 'ko-match';

  [match.teamA, match.teamB].forEach((slot) => {
    matchEl.appendChild(makeTeamEl(slot, match, roundIdx, matchIdx));
  });
  return matchEl;
}

function makeTeamEl(slot, match, roundIdx, matchIdx) {
  const el = document.createElement('div');
  const isEmpty  = !slot;
  const isWinner = slot && slot === match.winner;
  const isLoser  = slot && match.winner && slot !== match.winner;

  el.className = 'ko-team' +
    (isEmpty  ? ' ko-team-empty'  : '') +
    (isWinner ? ' ko-team-winner' : '') +
    (isLoser  ? ' ko-team-loser'  : '');

  if (!isEmpty) {
    const flagPath = koTeamFlag(slot);
    if (flagPath) {
      const img = document.createElement('img');
      img.src = flagPath; img.alt = koTeamName(slot);
      img.className = 'ko-flag';
      img.onerror = () => img.style.display = 'none';
      el.appendChild(img);
    } else {
      const ph = document.createElement('span');
      ph.className = 'ko-flag-placeholder';
      el.appendChild(ph);
    }

    const name = document.createElement('span');
    name.className = 'ko-team-name';
    name.textContent = koTeamName(slot);
    el.appendChild(name);

    if (isWinner) {
      const tick = document.createElement('span');
      tick.className = 'ko-tick'; tick.textContent = '✓';
      el.appendChild(tick);
    }

    if (match.teamA && match.teamB) {
      el.addEventListener('click', () => selectKoWinner(roundIdx, matchIdx, slot));
    }
  } else {
    const name = document.createElement('span');
    name.className = 'ko-team-name ko-tbd';
    name.textContent = 'Bekleniyor...';
    el.appendChild(name);
  }
  return el;
}

// ── SELECT WINNER ─────────────────────────────────────────────────
function selectKoWinner(roundIdx, matchIdx, slot) {
  // roundIdx === -1 means 3rd place match
  if (roundIdx === -1) {
    if (!ko3rdMatch.teamA || !ko3rdMatch.teamB) return;
    ko3rdMatch.winner = (ko3rdMatch.winner === slot) ? null : slot;
    renderKoBracket();
    return;
  }

  const match = koRounds[roundIdx][matchIdx];
  if (!match.teamA || !match.teamB) return;

  if (match.winner === slot) {
    // Deselect — clear this and everything downstream
    match.winner = null;
    clearDownstream(roundIdx, matchIdx);
  } else {
    const prevWinner = match.winner;
    match.winner = slot;
    if (prevWinner) clearDownstream(roundIdx, matchIdx);
    propagateWinner(roundIdx, matchIdx, slot);
  }
  renderKoBracket();
}

// Propagate winner into next round's match slot
function propagateWinner(roundIdx, matchIdx, winnerSlot) {
  const nextRoundIdx = roundIdx + 1;
  if (nextRoundIdx >= koRounds.length) return; // Final — no next round

  const nextMatchIdx = Math.floor(matchIdx / 2);
  const nextSide     = matchIdx % 2; // 0=teamA, 1=teamB
  const nextMatch    = koRounds[nextRoundIdx][nextMatchIdx];

  if (nextSide === 0) nextMatch.teamA = winnerSlot;
  else                nextMatch.teamB = winnerSlot;

  // Also handle SF losers → 3rd place match
  // SF is koRounds[3] (index 3). When both SF matches have winners,
  // populate 3rd place with the losers.
  const SF_IDX = koRounds.length - 2; // index of SF round
  if (roundIdx === SF_IDX) {
    updateThirdPlaceMatch();
  }
}

function updateThirdPlaceMatch() {
  const SF_IDX = koRounds.length - 2;
  const sfRound = koRounds[SF_IDX];
  // SF has 2 matches; losers play 3rd place
  const sf0 = sfRound[0];
  const sf1 = sfRound[1];

  const loser0 = sf0.winner
    ? (sf0.teamA === sf0.winner ? sf0.teamB : sf0.teamA)
    : null;
  const loser1 = sf1.winner
    ? (sf1.teamA === sf1.winner ? sf1.teamB : sf1.teamA)
    : null;

  const prevA = ko3rdMatch.teamA;
  const prevB = ko3rdMatch.teamB;

  ko3rdMatch.teamA = loser0;
  ko3rdMatch.teamB = loser1;

  // Reset 3rd place winner if teams changed
  if (ko3rdMatch.teamA !== prevA || ko3rdMatch.teamB !== prevB) {
    ko3rdMatch.winner = null;
  }
}

function clearDownstream(fromRoundIdx, fromMatchIdx) {
  const match = koRounds[fromRoundIdx][fromMatchIdx];
  const oldWinner = match.winner;
  match.winner = null;

  const nextRoundIdx = fromRoundIdx + 1;
  if (nextRoundIdx >= koRounds.length) return;

  const nextMatchIdx = Math.floor(fromMatchIdx / 2);
  const nextSide     = fromMatchIdx % 2;
  const nextMatch    = koRounds[nextRoundIdx][nextMatchIdx];

  // Clear the slot this match fed into next round
  if (nextSide === 0) { nextMatch.teamA = null; }
  else                { nextMatch.teamB = null; }

  // Recursively clear downstream
  if (nextMatch.winner) clearDownstream(nextRoundIdx, nextMatchIdx);
  nextMatch.winner = null;

  // Keep 3rd place in sync whenever SF changes
  const SF_IDX = koRounds.length - 2;
  if (fromRoundIdx === SF_IDX || nextRoundIdx === SF_IDX) {
    updateThirdPlaceMatch();
  }
}

// ── SHOW KNOCKOUT VIEW ────────────────────────────────────────────
function showKnockoutView() {
  ['splash-screen','group-view','summary-view','dashboard-view'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById('knockout-view').classList.remove('hidden');
  initKoBracket();
  renderKoBracket();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── BUILD SAVE DATA ───────────────────────────────────────────────
function buildKoSaveData() {
  const data = {};
  const roundNames = ['R32', 'R16', 'QF', 'SF', 'Final'];
  koRounds.forEach((round, ri) => {
    round.forEach((match, mi) => {
      const key = `${roundNames[ri]}_M${mi + 1}`;
      data[`${key}_A`]      = koTeamEn(match.teamA);   // always English
      data[`${key}_B`]      = koTeamEn(match.teamB);
      data[`${key}_Winner`] = koTeamEn(match.winner);
    });
  });
  // 3rd place
  data['ThirdPlace_A']      = koTeamEn(ko3rdMatch.teamA);
  data['ThirdPlace_B']      = koTeamEn(ko3rdMatch.teamB);
  data['ThirdPlace_Winner'] = koTeamEn(ko3rdMatch.winner);
  // Champion
  const finalMatch = koRounds[koRounds.length - 1][0];
  data['Champion'] = koTeamEn(finalMatch.winner);
  return data;
}

// ── EVENT LISTENERS ───────────────────────────────────────────────
document.getElementById('goto-knockout-btn').addEventListener('click', showKnockoutView);

document.getElementById('ko-save-btn').addEventListener('click', () => {
  document.getElementById('ko-reg-modal').classList.remove('hidden');
});

document.getElementById('ko-cancel-btn').addEventListener('click', () => {
  document.getElementById('ko-reg-modal').classList.add('hidden');
  document.getElementById('ko-reg-error').classList.add('hidden');
});

document.getElementById('ko-reg-modal').addEventListener('click', e => {
  if (e.target === document.getElementById('ko-reg-modal')) {
    document.getElementById('ko-reg-modal').classList.add('hidden');
  }
});

document.getElementById('ko-confirm-btn').addEventListener('click', async () => {
  const name  = document.getElementById('ko-user-name').value.trim();
  const email = document.getElementById('ko-user-email').value.trim();
  const errEl = document.getElementById('ko-reg-error');
  const label = document.getElementById('ko-confirm-label');
  const spin  = document.getElementById('ko-confirm-spinner');
  const btn   = document.getElementById('ko-confirm-btn');

  errEl.classList.add('hidden');
  if (!name)  { errEl.textContent = 'Lütfen isim girin';          errEl.classList.remove('hidden'); return; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errEl.textContent = 'Lütfen geçerli eposta girin';
    errEl.classList.remove('hidden'); return;
  }

  btn.disabled = true; label.textContent = 'Kaydediyor…'; spin.classList.remove('hidden');

  try {
    await fetchWithRetry(async () => {
      const KOClass = Parse.Object.extend('FIFA2026_KO');
      const obj = new KOClass();
      obj.set('Name', name);
      obj.set('Email', email);
      const koData = buildKoSaveData();
      Object.entries(koData).forEach(([k, v]) => obj.set(k, v));
      obj.set('BracketJSON', JSON.stringify(koData));
      await obj.save();
    });

    document.getElementById('ko-reg-modal').classList.add('hidden');
    document.getElementById('ko-success-message').textContent =
      `Bravo ${name}! Eleme turu tahminleriniz kaydedildi.`;
    document.getElementById('ko-success-modal').classList.remove('hidden');
  } catch (err) {
    console.error('KO save error:', err);
    errEl.textContent = 'Hata. Tekrar Kaydet butona basın';
    errEl.classList.remove('hidden');
  } finally {
    btn.disabled = false; label.textContent = 'Kaydet'; spin.classList.add('hidden');
  }
});

document.getElementById('ko-done-btn').addEventListener('click', () => {
  document.getElementById('ko-success-modal').classList.add('hidden');
  showDashboard();
});
