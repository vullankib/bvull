#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const requiredEnvVars = ["STRAVA_CLIENT_ID", "STRAVA_CLIENT_SECRET", "STRAVA_REFRESH_TOKEN"];
const missing = requiredEnvVars.filter((name) => !process.env[name]);

if (missing.length) {
  console.error(`[strava] Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const stravaClientId = process.env.STRAVA_CLIENT_ID;
const stravaClientSecret = process.env.STRAVA_CLIENT_SECRET;
const stravaRefreshToken = process.env.STRAVA_REFRESH_TOKEN;

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();

  let payload;
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }

  if (!response.ok) {
    throw new Error(
      `[strava] ${response.status} ${response.statusText} for ${url} - ${JSON.stringify(payload)}`
    );
  }

  return payload;
}

async function getAccessToken() {
  const body = new URLSearchParams({
    client_id: stravaClientId,
    client_secret: stravaClientSecret,
    grant_type: "refresh_token",
    refresh_token: stravaRefreshToken
  });

  const tokenResponse = await fetchJson("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  if (!tokenResponse.access_token) {
    throw new Error("[strava] OAuth response did not include access_token");
  }

  if (tokenResponse.refresh_token && tokenResponse.refresh_token !== stravaRefreshToken) {
    console.warn("[strava] Strava issued a new refresh token. Update STRAVA_REFRESH_TOKEN in secrets.");
  }

  return tokenResponse.access_token;
}

async function resolveAthleteId(accessToken) {
  if (process.env.STRAVA_ATHLETE_ID) {
    return String(process.env.STRAVA_ATHLETE_ID);
  }

  const athleteProfile = await fetchJson("https://www.strava.com/api/v3/athlete", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!athleteProfile.id) {
    throw new Error("[strava] Could not determine athlete id from /api/v3/athlete");
  }

  return String(athleteProfile.id);
}

async function main() {
  const accessToken = await getAccessToken();
  const athleteId = await resolveAthleteId(accessToken);

  const stats = await fetchJson(`https://www.strava.com/api/v3/athletes/${athleteId}/stats`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const ytdRunTotals = stats.ytd_run_totals || {};
  const distanceMeters = Number(ytdRunTotals.distance || 0);

  const output = {
    source: "strava",
    status: "ok",
    updated_at: new Date().toISOString(),
    year: new Date().getUTCFullYear(),
    athlete_id: athleteId,
    ytd_run: {
      count: Number(ytdRunTotals.count || 0),
      distance_meters: Math.round(distanceMeters),
      distance_miles: Number((distanceMeters / 1609.344).toFixed(1)),
      moving_time_seconds: Number(ytdRunTotals.moving_time || 0),
      elevation_gain_meters: Number(ytdRunTotals.elevation_gain || 0)
    }
  };

  const thisFile = fileURLToPath(import.meta.url);
  const projectRoot = path.resolve(path.dirname(thisFile), "..");
  const outputPath = path.join(projectRoot, "assets", "data", "strava-ytd.json");

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(output, null, 2) + "\n", "utf8");

  console.log(`[strava] Updated ${outputPath}`);
  console.log(
    `[strava] ${output.ytd_run.distance_miles} miles across ${output.ytd_run.count} runs in ${output.year}`
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
