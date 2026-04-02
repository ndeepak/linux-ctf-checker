const hashes = [
  "55455ecf92410f6843fa7d4dc77e761bce6c71403a2e41fd8f2841aa5877e2b2",
  "0edde84c1e1e0b28d54c1ca9d306561f2d5250c24e28d5a3507e0e5034db8cd6",
  "b65dc8ca67c97da7eaf76879c2101e4a7d66911cbbe1c8dfad6154be01c20a3e",
  "ed9cf840302c9866bf934355002a40d563ded523ac82aac53ce71743ba92af96",
  "ca63c95525155755c55f56f7996e96a129fb267c2b8f19606ee71592dda97dc0",
  "78b4e1faafb0b0f0f5fa838ebf258c36a4ebaeffe3d68548ebb8d183cbca1d6e",
  "18b9f95a9888482dd4d2ca436d5d5591cf6afe272b5ef58da3c44f7a7b67950b",
  "fdac28e3f63686261a3d401e0abc0f6783d841aeb03d1ad168af6ae319402d4b",
  "279ba0eec4f6cfded5e669926737823418b87529cf2232d47606d766ecb93ac3",
  "b10b2b1f3929ad101a33ee8f0ba5193c79d81631984430210b0401facea09687",
  "0edde84c1e1e0b28d54c1ca9d306561f2d5250c24e28d5a3507e0e5034db8cd6",
  "bc6ad932652d8bb4453179606315342cb649828769f2e90f914ff020bff6ccd1",
  "5b9e0b9902f3a86023da6a0d9122cd3e45a337a8826f8f5372bf1f7acaac6a4b",
  "aa93f57de39ec60c705f409c61ce51677ffc1a5e3fe115ad093607c9bce21e8d",
  "e21d6961423facd633a52d3cecea6d56d39a266419a1d38d6aa322c9dd680447",
  "62487ecea780673c74ea8c441331093a44f5329cbd41291b63efc46c648cfd42",
  "69a649516ee45d912f13b9e94fffada18b0660a1c01ef90ea9df3dbf24e61335",
  "279ba0eec4f6cfded5e669926737823418b87529cf2232d47606d766ecb93ac3",
  "7ffd51042762e6b2bf6a6a4f4e5627aad755e89df5b410bbd102c5c356e7c15e",
  "d7c9379599e1ff75086da4dfd66f03f9366f246d6f62a6486eab69c2f8bb0912",
  "c387c51128adabfb9cd7fab58db402fb50c5693bbfa53c64392a0af44923efec",
  "dc0d99c9842f6ed3ea0b50d1ee12bf99fc3be7a4a7ec3b6b1ffe9843747848d6",
  "72153b584354350b73ef21799571e3170ac00dc867a7cb8869a22b2c8121cb4e"
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

let solved = JSON.parse(localStorage.getItem("ctfSolved")) || new Array(hashes.length).fill(false);
let current = 0; // selected challenge index
let autoAdvance = false;

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

updateUI();

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

  if (inputHash === hashes[current]) {
    if (!solved[current]) {
      solved[current] = true;
      localStorage.setItem("ctfSolved", JSON.stringify(solved));
    }
    message.style.color = "lightgreen";
    message.textContent = "✅ Correct flag!";
    document.getElementById("flagInput").value = "";
    updateUI();

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
    message.style.color = "#ff9c00";
    message.textContent = "✨ All set! Amazing work!";
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
  localStorage.removeItem("ctfSolved");
  solved = new Array(hashes.length).fill(false);
  updateUI();
  document.getElementById("message").textContent = "";
}