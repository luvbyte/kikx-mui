import { Client, getClientID } from "./client.js";

const client = new Client();

async function fetchAppsList() {
  const res = await fetch("http://localhost:8000/api/apps/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id: client.clientID
    })
  });

  return await res.json();
}

export { client, fetchAppsList };
