#!/usr/bin/env node
/**
 * Beschreibt alle Video-Keyframes automatisch via Claude API (Haiku).
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... node _reference/describe_keyframes.mjs
 *
 * Output: _reference/video-beschreibungen/<ordnername>.md
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";

const KEYFRAMES_DIR = path.resolve("_reference/video-keyframes");
const OUTPUT_DIR = path.resolve("_reference/video-beschreibungen");
const MODEL = "claude-haiku-4-5-20251001";
const CONCURRENCY = 5; // parallel requests

const PROMPT = `Du bekommst 5 Keyframes aus einem kurzen Mathe-Erklärvideo für Grundschulkinder (Klasse 3–4, Fredo-Schulbuch von Cornelsen).

Beschreibe für jedes Frame kurz und präzise, was didaktisch gezeigt wird.

Antworte EXAKT in diesem Format:

## Frame 1
[Was ist zu sehen? Welches Mathe-Konzept wird eingeführt/erklärt? 1–2 Sätze.]

## Frame 2
...

## Frame 3
...

## Frame 4
...

## Frame 5
...

## Zusammenfassung
**Thema:** [Kernthema in 3–5 Worten]
**Erklärschritt:** [Was wird dem Kind beigebracht, in einem Satz]
**Darstellungsmittel:** [z.B. Dienes-Material, Zahlenstrahl, Stellenwerttafel, Rechenweg, Sachaufgabe mit Skizze]
**Tipp-Essenz:** [Ein kindgerechter Tipp-Satz, max. 15 Wörter, ermutigend]

Wichtig:
- Deutsche Sprache
- Achte auf: Zahlenräume, Darstellungsformen (Blöcke, Strahl, Tabelle), Rechenstrategien
- Wenn ein Frame nur Titelbild oder Überleitung ist, schreib "Titelbild" / "Überleitung"
- Die Tipp-Essenz muss so formuliert sein, dass ein 9-jähriges Kind sie versteht`;

// ─── helpers ───

function loadFramesAsContent(folderPath) {
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".png")).sort();
  return files.map(file => ({
    type: "image",
    source: {
      type: "base64",
      media_type: "image/png",
      data: fs.readFileSync(path.join(folderPath, file)).toString("base64"),
    },
  }));
}

async function describeFolder(client, folderName) {
  const folderPath = path.join(KEYFRAMES_DIR, folderName);
  const outFile = path.join(OUTPUT_DIR, `${folderName}.md`);

  // Skip if already done
  if (fs.existsSync(outFile)) {
    return { folder: folderName, status: "skipped" };
  }

  const images = loadFramesAsContent(folderPath);
  if (images.length === 0) {
    return { folder: folderName, status: "empty" };
  }

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          ...images,
          { type: "text", text: `Video: "${folderName.replace(/_/g, " ")}"\n\n${PROMPT}` },
        ],
      },
    ],
  });

  const text = response.content[0].text;
  const header = `# ${folderName.replace(/_/g, " ")}\n\n`;
  fs.writeFileSync(outFile, header + text, "utf-8");

  return {
    folder: folderName,
    status: "done",
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  };
}

// ─── main ───

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌ Setze ANTHROPIC_API_KEY als Umgebungsvariable:");
    console.error("   ANTHROPIC_API_KEY=sk-ant-... node _reference/describe_keyframes.mjs");
    process.exit(1);
  }

  const client = new Anthropic();
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const folders = fs.readdirSync(KEYFRAMES_DIR)
    .filter(f => fs.statSync(path.join(KEYFRAMES_DIR, f)).isDirectory())
    .sort();

  console.log(`📁 ${folders.length} Video-Ordner gefunden`);
  console.log(`📂 Output: _reference/video-beschreibungen/`);
  console.log(`🤖 Model: ${MODEL}`);
  console.log(`⚡ Concurrency: ${CONCURRENCY}\n`);

  let done = 0;
  let skipped = 0;
  let totalInput = 0;
  let totalOutput = 0;

  // Process in batches of CONCURRENCY
  for (let i = 0; i < folders.length; i += CONCURRENCY) {
    const batch = folders.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map(folder =>
        describeFolder(client, folder).catch(err => ({
          folder,
          status: "error",
          error: err.message,
        }))
      )
    );

    for (const r of results) {
      if (r.status === "done") {
        done++;
        totalInput += r.inputTokens;
        totalOutput += r.outputTokens;
        console.log(`✅ [${done + skipped}/${folders.length}] ${r.folder} (${r.inputTokens}+${r.outputTokens} tokens)`);
      } else if (r.status === "skipped") {
        skipped++;
        console.log(`⏭️  [${done + skipped}/${folders.length}] ${r.folder} (bereits vorhanden)`);
      } else {
        console.error(`❌ ${r.folder}: ${r.error}`);
      }
    }
  }

  const costInput = (totalInput / 1_000_000) * 0.80;
  const costOutput = (totalOutput / 1_000_000) * 4.00;
  console.log(`\n📊 Fertig: ${done} beschrieben, ${skipped} übersprungen`);
  console.log(`💰 Tokens: ${totalInput.toLocaleString("de-DE")} input + ${totalOutput.toLocaleString("de-DE")} output`);
  console.log(`💰 Geschätzte Kosten: ~$${(costInput + costOutput).toFixed(2)}`);
}

main();
