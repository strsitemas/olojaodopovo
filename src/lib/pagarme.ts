const BASE_URL = "https://api.pagar.me/core/v5"

function authHeader() {
  const key = process.env.PAGARME_API_KEY
  if (!key) throw new Error("PAGARME_API_KEY nao configurada.")
  return "Basic " + Buffer.from(key + ":").toString("base64")
}

export async function pagarmePost(path: string, body: object) {
  const res = await fetch(BASE_URL + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  return data
}

export async function pagarmeGet(path: string) {
  const res = await fetch(BASE_URL + path, {
    headers: { Authorization: authHeader() },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  return data
}
