// Short topic names keep the snippet narrow enough to read on a phone.
const TOPICS = ["goroutines", "channels", "net/http", "testing"];

export const GO_SNIPPET = `package main

import (
	"fmt"
	"sync"
)

func main() {
	topics := make(chan string)
	var wg sync.WaitGroup

	for id := 1; id <= 3; id++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for t := range topics {
				fmt.Printf("gopher %d learned %s\\n", id, t)
			}
		}()
	}

	for _, t := range []string{${TOPICS.map((t) => `"${t}"`).join(", ")}} {
		topics <- t
	}
	close(topics)
	wg.Wait()
}`;

/** Plausible output: goroutine scheduling decides which gopher gets each topic. */
export function goSnippetOutput(): string[] {
  return TOPICS.map((t) => `gopher ${1 + Math.floor(Math.random() * 3)} learned ${t}`);
}

const KEYWORDS = new Set([
  "package", "import", "func", "var", "for", "range", "go", "defer", "return", "if", "else", "make", "close", "chan", "string", "int",
]);

export type Token = { text: string; kind: "kw" | "str" | "num" | "fn" | "plain" };

/** Minimal Go tokenizer, just enough to colour the snippet above. */
export function tokenizeGo(line: string): Token[] {
  const tokens: Token[] = [];
  const re = /("(?:[^"\\]|\\.)*")|(\b\d+\b)|([A-Za-z_]\w*)(?=\()|([A-Za-z_]\w*)|(\s+|[^\w\s"]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m[1]) tokens.push({ text: m[1], kind: "str" });
    else if (m[2]) tokens.push({ text: m[2], kind: "num" });
    else if (m[3]) tokens.push({ text: m[3], kind: KEYWORDS.has(m[3]) ? "kw" : "fn" });
    else if (m[4]) tokens.push({ text: m[4], kind: KEYWORDS.has(m[4]) ? "kw" : "plain" });
    else tokens.push({ text: m[5], kind: "plain" });
  }
  return tokens;
}
