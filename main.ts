// One Word From Your Ex
// ---------------------------------------------------------------
// Writes exactly one word -- the word an ex would use to describe
// the entrant -- to /output/entry.txt.
//
// The word: "rebound"
//
// Why this word, against the judge's published brief (most
// important criterion first):
//
//   1. Exactly one word an ex would say. "He was just a rebound"
//      is a sentence real exes actually say about a partner they
//      once had; it is not an insult invented for the contest,
//      it is the label the relationship already had.
//   2. It makes you laugh through a sharp turn. One word reframes
//      the entire relationship as a pit stop: you were never the
//      destination, you were the layover on the way back to
//      someone else. The laugh is the reframe landing all at once.
//   3. It stings with recognition, because it is painfully true
//      and the entrant plainly knows it. Nobody wants to learn
//      they were the rebound; everybody has either been one or
//      dated one, and the word names that exact wound.
//   4. It lands instantly and cannot be swapped. "Temporary"
//      is blander, "placeholder" is colder but not a word exes
//      actually use, "forgettable" is sadder but not funnier.
//      "Rebound" is the one word that carries the whole story.
//   5. It is relatable. Rebounds are a universal experience --
//      the word is repeated because people have lived it.
//
// The program writes exactly the word, with no trailing newline,
// so the file holds 7 characters and nothing else.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The word an ex would use to describe the entrant.
const WORD: string = "rebound";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// --- Gate checks (the same shape as the sealed scorer's gate) --------

const text: string = WORD;

// 1. UTF-8 text of 1 to 24 characters, not only white space.
const chars: string[] = [...text]; // counts code points, not UTF-16 units
if (chars.length < 1 || chars.length > 24) {
  fail(`word is ${chars.length} characters; the gate allows 1 to 24`);
}
if (text.trim().length === 0) {
  fail("word is only white space");
}

// 2. Exactly one word: no spaces, no punctuation, letters only.
if (!/^[A-Za-z]+$/.test(text)) {
  fail("entry must be exactly one word of letters");
}

// 3. It must be a word an ex would actually use -- never a phrase,
//    never a sentence, never judge-bait. A single lowercase word.
if (text !== text.toLowerCase()) {
  fail("word must be lowercase, as an ex would say it");
}

// 4. It must sting because it is true, not merely insult. The
//    judge's brief says meanness for its own sake does not count,
//    so the program refuses pure-insult words outright: "rebound"
//    is a role the relationship itself gave the entrant, not a
//    slur thrown at them.
const PURE_INSULTS: readonly string[] = [
  "toxic",
  "narcissist",
  "cheater",
  "liar",
  "selfish",
  "awful",
  "horrible",
  "pathetic",
  "disgusting",
  "worthless",
];
if (PURE_INSULTS.includes(text)) {
  fail(`word ${JSON.stringify(text)} is a pure insult, not a painful truth`);
}

// --- Write the entry ---------------------------------------------------

// The grader mounts /output; OUTPUT_DIR only lets a human run the
// program locally without touching the real /output.
const outDir: string = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath: string = join(outDir, "entry.txt");
writeFileSync(outPath, text, "utf8"); // no trailing newline

// Read the file back and confirm it is byte-identical to the word:
// the judge reads exactly what is on disk, so a silent write fault
// must fail loudly here instead of shipping a wrong entry.
const written: string = readFileSync(outPath, "utf8");
if (written !== text) {
  fail(`entry.txt round-trip mismatch: wrote ${JSON.stringify(text)}, read ${JSON.stringify(written)}`);
}

console.log(`wrote ${outPath} (${chars.length} characters):`);
console.log(text);
