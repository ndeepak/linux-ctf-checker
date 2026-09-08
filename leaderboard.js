const leaderboardKey = "ctfLeaderboard";

async function getLeaderboard() {
  let records;
  try {
    const response = await fetch("leaderboard.json", { cache: "no-store" });
    records = response.ok ? await response.json() : {};
  } catch (error) {
    records = JSON.parse(localStorage.getItem(leaderboardKey)) || {};
  }

  return Object.values(records).filter(record => record.solved === record.total).sort((left, right) => {
    if (right.solved !== left.solved) return right.solved - left.solved;
    if (!left.completedAt) return 1;
    if (!right.completedAt) return -1;
    return left.completedAt.localeCompare(right.completedAt);
  });
}

function formatCompletedTime(timestamp) {
  return timestamp ? new Date(timestamp).toLocaleString() : "In progress";
}

async function renderLeaderboard() {
  const body = document.getElementById("leaderboardBody");
  const empty = document.getElementById("emptyLeaderboard");
  const records = await getLeaderboard();

  body.innerHTML = "";
  empty.classList.toggle("hidden", records.length > 0);

  records.forEach((record, index) => {
    const row = document.createElement("tr");
    const values = [index + 1, record.name, `${record.solved}/${record.total}`, formatCompletedTime(record.completedAt)];
    values.forEach((value, valueIndex) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      if (valueIndex === 1) {
        const name = document.createElement("strong");
        name.textContent = value;
        cell.replaceChildren(name);
      }
      row.appendChild(cell);
    });
    body.appendChild(row);
  });
}

renderLeaderboard();