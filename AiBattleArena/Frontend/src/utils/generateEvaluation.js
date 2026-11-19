/**
 * Generates an evaluation data object matching the user's required schema:
 * {
 *   "problem": "string",
 *   "solution_1": "md format string",
 *   "solution_2": "md format string",
 *   "judge": {
 *     "solution_1_score": 10,
 *     "solution_2_score": 6,
 *     "solution_1_reasoning": "string",
 *     "solution_2_reasoning": "string"
 *   }
 * }
 */
export function generateMockEvaluation(problemText) {
  const isRust = /rust/i.test(problemText);
  const isGo = /go|golang/i.test(problemText);
  const isPython = /python/i.test(problemText);

  let lang;
  let snippet1;
  let snippet2;

  if (isRust) {
    lang = 'rust';
    snippet1 = `pub fn solve<T: Send + Sync>(data: &[T]) -> Result<Vec<T>, Error> {
    data.par_iter()
        .filter(|item| item.is_valid())
        .cloned()
        .collect()
}`;
    snippet2 = `pub fn solve<T: Clone>(data: &[T]) -> Vec<T> {
    let mut out = Vec::new();
    for item in data {
        if item.is_valid() {
            out.push(item.clone());
        }
    }
    out
}`;
  } else if (isGo) {
    lang = 'go';
    snippet1 = `func Solve(ctx context.Context, req Request) (*Response, error) {
    g, ctx := errgroup.WithContext(ctx)
    // parallel non-blocking execution with bounded pool
    return processBatch(ctx, g, req)
}`;
    snippet2 = `func Solve(req Request) *Response {
    var mu sync.Mutex
    mu.Lock()
    defer mu.Unlock()
    return sequentialProcess(req)
}`;
  } else if (isPython) {
    lang = 'python';
    snippet1 = `async def solve_batch(items: list[Item]) -> list[Result]:
    tasks = [process_item_async(x) for x in items]
    return await asyncio.gather(*tasks, return_exceptions=False)`;
    snippet2 = `def solve_batch(items: list[Item]) -> list[Result]:
    results = []
    for x in items:
        results.append(process_item_sync(x))
    return results`;
  } else {
    lang = 'typescript';
    snippet1 = `export async function solveConcurrent<T>(items: T[]): Promise<Result[]> {
  const limit = pLimit(16); // Bounded concurrent queue
  return Promise.all(items.map(item => limit(() => evaluateItem(item))));
}`;
    snippet2 = `export async function solveSerial<T>(items: T[]): Promise<Result[]> {
  const results: Result[] = [];
  for (const item of items) {
    results.push(await evaluateItem(item));
  }
  return results;
}`;
  }

  const solution_1 = `### Architecture: High-Throughput Concurrent Implementation

This approach leverages parallel execution, asynchronous non-blocking scheduling, and bounded resource isolation to maximize throughput under heavy load.

#### Technical Highlights:
- **Zero-allocation hot paths**: Minimizes memory pressure by reusing buffers and avoiding intermediate copies.
- **Fail-safe isolation**: Wraps concurrent jobs in bounded error boundaries.
- **Backpressure & rate throttling**: Prevents queue exhaustion under burst spikes.

\`\`\`${lang}
${snippet1}
\`\`\`

#### Key Metrics:
- **Estimated Latency**: ~1.2ms (p99)
- **Concurrency Scalability**: Linear up to machine core saturation.`;

  const solution_2 = `### Architecture: Traditional Sequential Baseline

This alternative employs standard synchronous loops and sequential execution with coarse locks.

#### Technical Highlights:
- **Simplicity**: Easy to read with minimal architectural dependencies.
- **Predictable execution order**: Executes elements strictly in input sequence.

\`\`\`${lang}
${snippet2}
\`\`\`

#### Limitations:
- **Throughput bottleneck**: Single-threaded serialization causes latency to scale linearly with workload size $O(N)$.
- **Thread starvation risk**: Under high concurrency, requests wait behind long-running tasks.`;

  return {
    id: `eval-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    problem: problemText,
    tags: [lang.toUpperCase(), 'Concurrent', 'Benchmarked'],
    solution_1,
    solution_2,
    judge: {
      solution_1_score: 9.5,
      solution_2_score: 6.0,
      solution_1_reasoning: `Solution 1 demonstrates superior architectural design. By adopting asynchronous parallelization and bounded resource concurrency in ${lang}, it handles high contention efficiently and minimizes latency variance.`,
      solution_2_reasoning: `Solution 2 is straightforward and easy to understand for small prototypes, but it introduces severe serialization bottlenecks and fails to leverage multi-core hardware.`
    }
  };
}
