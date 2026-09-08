const flagParts = [
  "permission_flag", "hidden_file_flag", "dash_file_flag", "dash_folder_flag",
  "space_in_folder", "newline_folder_flag", "wildcard_folder_flag", "symlink_flag",
  "hardlink_flag", "execute_only_folder", "hidden_file_flag", "setuid_flag",
  "nested_symlink_flag", "compressed_flag", "timestamp_flag", "tmp_flag",
  "sticky_flag", "hardlink_flag", "xattr_flag", "sparse_flag", "fifo_flag",
  "block_flag", "sgid_flag"
];

const descriptions = [
  "Permission-based file",
  "Hidden file",
  "Dash-named file",
  "Dash-named folder",
  "Folder with trailing space",
  "Folder with newline",
  "Wildcard folder (*)",
  "Symbolic link challenge",
  "Hard link challenge",
  "Execute-only folder",
  "Hidden file in hidden folder",
  "Setuid binary trick",
  "Nested symlinks",
  "Compressed file",
  "File with future timestamp",
  "File in /tmp with specific name",
  "Sticky bit directory",
  "Hard link challenge",
  "File with extended attributes",
  "Sparse file",
  "FIFO pipe",
  "Block device simulation",
  "SGID directory"
];

let participant = localStorage.getItem("ctfParticipant");
let hashes = [];
let solved = new Array(flagParts.length).fill(false);
let current = 0; // selected challenge index
let autoAdvance = false;
const leaderboardKey = "ctfLeaderboard";
let completionRedirectScheduled = false;
const githubSubmissionUrl = "https://github.com/ndeepak/linux-ctf-checker/issues/new";

function normalizeParticipant(name) {
  return name.trim().toLowerCase();
}

function loadParticipant(name) {
  participant = normalizeParticipant(name);
  localStorage.setItem("ctfParticipant", participant);
  hashes = flagParts.map(part => hashString(`d33p{${part}_${participant}}`));
  solved = JSON.parse(localStorage.getItem(`ctfSolved:${participant}`)) || new Array(flagParts.length).fill(false);
  document.getElementById("signup").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  document.getElementById("participantLabel").textContent = participant;
  updateLeaderboard();
  updateUI();
}

function updateLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || {};
  const existing = leaderboard[participant] || {};
  const solvedCount = solved.filter(Boolean).length;
  leaderboard[participant] = {
    name: participant,
    solved: solvedCount,
    total: flagParts.length,
    completedAt: solvedCount === flagParts.length ? (existing.completedAt || new Date().toISOString()) : null
  };
  localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));
}

document.getElementById("signupForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = normalizeParticipant(document.getElementById("participantName").value);
  if (!/^[a-z0-9_-]{3,24}$/.test(name)) {
    document.getElementById("signupMessage").textContent = "Please enter a valid participant name.";
    return;
  }
  loadParticipant(name);
});

function toggleAutoAdvance() {
  autoAdvance = document.getElementById("autoAdvance").checked;
}

function gotoNextChallenge() {
  const nextIndex = findNextUnsolved(current);
  if (nextIndex >= 0) {
    current = nextIndex;
    updateUI();
  }
}

function findNextUnsolved(index) {
  for (let i = index + 1; i < hashes.length; i++) {
    if (!solved[i]) return i;
  }
  for (let i = 0; i <= index; i++) {
    if (!solved[i]) return i;
  }
  return -1;
}

if (participant) loadParticipant(participant);

async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function selectChallenge(index) {
  current = index;
  updateUI();
}

async function submitFlag() {
  const input = document.getElementById("flagInput").value.trim();
  const message = document.getElementById("message");

  const inputHash = await hashString(input);

  if (inputHash === await hashes[current]) {
    if (!solved[current]) {
      solved[current] = true;
      localStorage.setItem(`ctfSolved:${participant}`, JSON.stringify(solved));
      updateLeaderboard();
    }
    message.style.color = "lightgreen";
    message.textContent = "✅ Correct flag!";
    document.getElementById("flagInput").value = "";
    updateUI();

    if (solved.every(Boolean) && !completionRedirectScheduled) {
      completionRedirectScheduled = true;
      setTimeout(() => {
        submitCompletionToGitHub();
      }, 1200);
    }

    const next = findNextUnsolved(current);
    if (autoAdvance && next >= 0) {
      setTimeout(() => {
        current = next;
        updateUI();
      }, 700);
    }
  } else {
    message.style.color = "#f87171";
    message.textContent = "❌ Incorrect flag";
  }
}

function updateUI() {
  const title = document.getElementById("challenge-title");
  const description = document.getElementById("challenge-description");
  const progress = document.getElementById("progress");
  const challengeGrid = document.getElementById("challenge-grid");

  // Update selected challenge
  title.textContent = `Challenge ${current + 1}`;
  description.textContent = descriptions[current];

  // Update progress
  const completed = solved.filter(s => s).length;
  progress.textContent = `Progress: ${completed}/${hashes.length}`;

  const congrats = document.getElementById("congrats");
  if (completed === hashes.length) {
    congrats.classList.remove("hidden");
    document.getElementById("message").style.color = "#ff9c00";
    document.getElementById("message").textContent = "✨ All set! Amazing work!";
  } else {
    congrats.classList.add("hidden");
  }

  // Populate challenge grid
  challengeGrid.innerHTML = "";
  hashes.forEach((_, index) => {
    const button = document.createElement("button");
    button.textContent = `${index + 1}`;
    button.className = solved[index] ? "solved" : "unsolved";
    if (index === current) button.classList.add("selected");
    button.onclick = () => selectChallenge(index);
    challengeGrid.appendChild(button);
  });
}

function resetProgress() {
  localStorage.removeItem(`ctfSolved:${participant}`);
  solved = new Array(hashes.length).fill(false);
  updateLeaderboard();
  updateUI();
  document.getElementById("message").textContent = "";
}

function changeParticipant() {
  localStorage.removeItem("ctfParticipant");
  participant = null;
  document.getElementById("game").classList.add("hidden");
  document.getElementById("signup").classList.remove("hidden");
  document.getElementById("participantName").value = "";
}

function submitCompletionToGitHub() {
  const title = encodeURIComponent(`[CTF Completion] ${participant}`);
  const body = encodeURIComponent([
    `Participant: ${participant}`,
    `Score: ${flagParts.length}/${flagParts.length}`,
    `Completed locally: ${new Date().toISOString()}`,
    "",
    "This completion was generated by the Linux CTF checker."
  ].join("\n"));
  window.location.href = `${githubSubmissionUrl}?title=${title}&body=${body}`;
}