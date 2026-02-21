export async function getPrediction(expenses, savings) {
  console.log("➡ ML INPUT:", expenses, savings);

  const response = await fetch("http://localhost:8000/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      expenses: expenses.map(Number),
      savings: savings.map(Number),
    }),
  });

  const raw = await response.text();
  console.log("⬅ ML RAW RESPONSE:", raw);

  if (!response.ok) {
    throw new Error("ML server error");
  }

  return JSON.parse(raw);
}
