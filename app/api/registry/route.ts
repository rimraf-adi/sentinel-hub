import { NextResponse } from "next/server";
import localRegistry from "../../../registry.json";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const GITHUB_RAW_REGISTRY =
  "https://raw.githubusercontent.com/rimraf-adi/sentinel-hub/main/registry.json";
const GITHUB_COMMITS_API =
  "https://api.github.com/repos/rimraf-adi/sentinel-hub/commits?path=registry.json&page=1&per_page=1";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const refresh = searchParams.get("refresh");

    // Fetch live from GitHub raw with cache buster
    const cacheBuster = `?_ts=${Date.now()}`;
    const res = await fetch(`${GITHUB_RAW_REGISTRY}${cacheBuster}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "User-Agent": "Sentinel-Hub-Client/1.0",
      },
    });

    if (res.ok) {
      const data = await res.json();

      // Attempt to get latest commit metadata
      let latestCommit = null;
      try {
        const commitRes = await fetch(GITHUB_COMMITS_API, {
          cache: "no-store",
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "Sentinel-Hub-Client/1.0",
          },
        });
        if (commitRes.ok) {
          const commits = await commitRes.json();
          if (Array.isArray(commits) && commits.length > 0) {
            latestCommit = {
              sha: commits[0].sha.substring(0, 7),
              message: commits[0].commit.message,
              date: commits[0].commit.committer.date,
            };
          }
        }
      } catch (err) {
        // Non-blocking commit error
      }

      return NextResponse.json({
        success: true,
        source: "github",
        repository: "rimraf-adi/sentinel-hub",
        branch: "main",
        latestCommit,
        fetchedAt: new Date().toISOString(),
        totalModules: data.modules?.length || 0,
        modules: data.modules || [],
      });
    }
  } catch (error) {
    console.error("Failed to fetch live registry from GitHub, falling back to local:", error);
  }

  // Graceful fallback to local registry
  return NextResponse.json({
    success: true,
    source: "local_fallback",
    repository: "rimraf-adi/sentinel-hub",
    branch: "main",
    latestCommit: null,
    fetchedAt: new Date().toISOString(),
    totalModules: localRegistry.modules?.length || 0,
    modules: localRegistry.modules || [],
  });
}
