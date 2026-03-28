/** Một số API trả `Category` (PascalCase) hoặc chuỗi không đúng hoa thường. */
function normalizeCategory(item: any): string {
  const raw = item.category ?? item.Category;
  return String(raw ?? "").trim().toLowerCase();
}

/** Thu nhập (nạp tiền / lương…) vs chi tiêu — đồng bộ với wallet-detail. */
export function isIncomeTransaction(item: any): boolean {
  const cat = normalizeCategory(item);
  if (cat === "income") return true;

  const isKnownExpense =
    cat === "outcome" ||
    ["food", "shopping", "bills", "transport"].includes(cat);

  const n = Number(item.amount);
  if (n < 0) return false;
  if (isKnownExpense) return false;
  if (cat === "") return false;
  return n > 0;
}
