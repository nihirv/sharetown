/* ---------- user name ---------- */
export function getUserName(): string {
  let name = localStorage.getItem("gc_username");
  if (!name) {
    name = prompt("Enter your name")?.trim() || "Anon";
    localStorage.setItem("gc_username", name);
  }
  return name;
}

export function clearUserName() {
  localStorage.removeItem("gc_username");
}

/* ---------- per-proposal bet locking ---------- */
const KEY = "gc_bets"; // JSON stringified string[]

export function hasBet(proposalId: string): boolean {
  const arr = JSON.parse(localStorage.getItem(KEY) ?? "[]");
  return arr.includes(proposalId);
}

export function recordBet(proposalId: string) {
  const arr = JSON.parse(localStorage.getItem(KEY) ?? "[]");
  if (!arr.includes(proposalId)) {
    arr.push(proposalId);
    localStorage.setItem(KEY, JSON.stringify(arr));
  }
}

export function resetBetHistory() {
  localStorage.removeItem(KEY);
}
