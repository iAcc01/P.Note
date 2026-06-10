#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""抓取 clawhub.ai 推荐榜前 50 个 skill，含作者，生成 TS 数据文件。"""
import json, urllib.request, time

BASE = "https://clawhub.ai/api/v1"
PRESETS = 8  # ICON_PRESETS 数量

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def slug_hash(s):
    h = 0
    for ch in s:
        h = (h * 31 + ord(ch)) & 0xFFFFFFFF
    return h % PRESETS

def esc(s):
    if s is None:
        return ""
    return s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n").replace("\r", "")

lst = get(f"{BASE}/skills?limit=50&sort=recommended")
items = lst["items"]
print(f"got {len(items)} items")

out = []
for i, it in enumerate(items):
    slug = it["slug"]
    author = ""
    author_img = ""
    license = ""
    changelog = ""
    try:
        d = get(f"{BASE}/skills/{slug}")
        owner = d.get("owner") or {}
        author = owner.get("displayName") or owner.get("handle") or ""
        author_img = owner.get("image") or ""
        lv = d.get("latestVersion") or {}
        license = lv.get("license") or ""
        changelog = lv.get("changelog") or ""
    except Exception as e:
        print(f"  detail fail {slug}: {e}")
    stats = it.get("stats") or {}
    lv = it.get("latestVersion") or {}
    rec = {
        "slug": slug,
        "title": it.get("displayName") or slug,
        "description": (it.get("summary") or "").strip(),
        "author": author,
        "authorImage": author_img,
        "downloads": stats.get("downloads", 0),
        "stars": stats.get("stars", 0),
        "version": lv.get("version") or (it.get("tags") or {}).get("latest") or "",
        "license": license,
        "changelog": changelog,
        "updatedAt": it.get("updatedAt", 0),
        "presetIndex": slug_hash(slug),
    }
    out.append(rec)
    print(f"  [{i+1}/50] {slug} -> {author}")
    time.sleep(0.05)

# 生成 TS 文件
lines = []
lines.append("/* 自动生成：clawhub.ai 推荐榜前 50 个 skill。请勿手改。 */")
lines.append("import type { Skill } from '@/pages/SkillsMarket'")
lines.append("")
lines.append("export const clawhubSkills: Skill[] = [")
for r in out:
    lines.append("  {")
    lines.append(f"    id: '{esc(r['slug'])}',")
    lines.append(f"    slug: '{esc(r['slug'])}',")
    lines.append(f"    title: '{esc(r['title'])}',")
    lines.append(f"    description: '{esc(r['description'])}',")
    lines.append(f"    author: '{esc(r['author'])}',")
    lines.append(f"    authorImage: '{esc(r['authorImage'])}',")
    lines.append(f"    presetIndex: {r['presetIndex']},")
    lines.append(f"    rating: {r['stars']},")
    lines.append(f"    downloads: {r['downloads']},")
    lines.append(f"    version: '{esc(r['version'])}',")
    lines.append(f"    license: '{esc(r['license'])}',")
    lines.append(f"    changelog: '{esc(r['changelog'])}',")
    lines.append(f"    updatedAt: {r['updatedAt']},")
    lines.append("  },")
lines.append("]")
lines.append("")

with open("src/data/clawhubSkills.ts", "w", encoding="utf-8") as f:
    f.write("\n".join(lines))
print("written src/data/clawhubSkills.ts")
