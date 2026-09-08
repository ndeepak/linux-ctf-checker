import json
import os
import re
from pathlib import Path

EVENT_PATH = os.environ["GITHUB_EVENT_PATH"]
LEADERBOARD_PATH = Path("leaderboard.json")
NAME_PATTERN = re.compile(r"^\[CTF Completion\] ([a-z0-9_-]{3,24})$")
SCORE_PATTERN = re.compile(r"^Score: 23/23$", re.MULTILINE)
PARTICIPANT_PATTERN = re.compile(r"^Participant: ([a-z0-9_-]{3,24})$", re.MULTILINE)

with open(EVENT_PATH, encoding="utf-8") as event_file:
    event = json.load(event_file)

issue = event["issue"]
title_match = NAME_PATTERN.fullmatch(issue["title"])
participant_match = PARTICIPANT_PATTERN.search(issue.get("body") or "")

if not title_match or not participant_match or title_match.group(1) != participant_match.group(1) or not SCORE_PATTERN.search(issue.get("body") or ""):
    raise SystemExit("Invalid CTF completion issue")

participant = title_match.group(1)
try:
    leaderboard = json.loads(LEADERBOARD_PATH.read_text(encoding="utf-8"))
except FileNotFoundError:
    leaderboard = {}

leaderboard[participant] = {
    "name": participant,
    "github": issue["user"]["login"],
    "solved": 23,
    "total": 23,
    "completedAt": issue["created_at"],
    "issue": issue["html_url"]
}

LEADERBOARD_PATH.write_text(json.dumps(leaderboard, indent=2) + "\n", encoding="utf-8")
