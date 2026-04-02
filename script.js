const hashes = [
  "55455ecf92410f6843fa7d4dc77e761bce6c71403a2e41fd8f2841aa5877e2b2",
  "b65dc8ca67c97da7eaf76879c2101e4a7d66911cbbe1c8dfad6154be01c20a3e",
  "ed9cf840302c9866bf934355002a40d563ded523ac82aac53ce71743ba92af96",
  "ca63c95525155755c55f56f7996e96a129fb267c2b8f19606ee71592dda97dc0",
  "78b4e1faafb0b0f0f5fa838ebf258c36a4ebaeffe3d68548ebb8d183cbca1d6e",
  "18b9f95a9888482dd4d2ca436d5d5591cf6afe272b5ef58da3c44f7a7b67950b",
  "b10b2b1f3929ad101a33ee8f0ba5193c79d81631984430210b0401facea09687",
  "fdac28e3f63686261a3d401e0abc0f6783d841aeb03d1ad168af6ae319402d4b",
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
  "dc0d99c9842f6ed3ea0b50d1ee12bf99fc3be7a4a7ec3b6b1ffe9843747848d6"
];

const descriptions = [
  "Understanding file permissions in Linux.",
  "Handling files that start with a dash (-).",
  "Handling directories that start with a dash (-).",
  "Working with directories containing spaces.",
  "Dealing with directories containing newlines.",
  "Using wildcards to match files and directories.",
  "Navigating directories with execute-only permissions.",
  "Following symbolic links.",
  "Finding hidden files and directories.",
  "Dealing with setuid permissions.",
  "Following chains of symbolic links.",
  "Extracting compressed files.",
  "Finding files with specific timestamps.",
  "Locating files in system directories like /tmp.",
  "Understanding sticky bit permissions.",
  "Working with hard links.",
  "Files with extended attributes.",
  "Handling sparse files.",
  "Named pipes (FIFOs).",
  "Block device-like permissions."
];

let solved = JSON.parse(localStorage.getItem("ctfSolved")) || new Array(hashes.length).fill(false);
let current = 0; // selected challenge index

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