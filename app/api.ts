const API_BASE = "http://127.0.0.1:8000";

export async function getDashboard() {
  const response = await fetch(`${API_BASE}/api/dashboard`);
  if (!response.ok) throw new Error("Could not load dashboard data");
  return response.json();
}

export async function getEquipment() {
  const response = await fetch(`${API_BASE}/api/equipment`);
  if (!response.ok) throw new Error("Could not load equipment data");
  return response.json();
}

export async function getProduction() {
  const response = await fetch(`${API_BASE}/api/production`);
  if (!response.ok) throw new Error("Could not load production data");
  return response.json();
}

export async function getRisks() {
  const response = await fetch(`${API_BASE}/api/risks`);
  if (!response.ok) throw new Error("Could not load risks data");
  return response.json();
}

export async function getRecommendations() {
  const response = await fetch(`${API_BASE}/api/recommendations`);
  if (!response.ok) throw new Error("Could not load recommendations");
  return response.json();
}

export async function getBlockDetail(id: string) {
  const response = await fetch(`${API_BASE}/api/blocks/${id}`);
  if (!response.ok) throw new Error("Could not load block detail");
  return response.json();
}

export async function simulateProduction(params: {
  rainfall_change_percent: number;
  equipment_availability_percent: number;
  blasting_delay_hours: number;
  operating_hours_per_day: number;
}) {
  const response = await fetch(`${API_BASE}/api/simulations/production`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!response.ok) throw new Error("Simulation failed");
  return response.json();
}