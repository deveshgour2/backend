
export const initialEvaluations = [
  {
   
    solution_1: `### Sharded Concurrent LRU with Epoch-based Collection

This solution uses **64-way hash-striped partitioned architecture** combined with Crossbeam epoch reclamation and fine-grained stripe locks.

#### Key Architectural Highlights:
- **Striped Partitioning**: Distributes keys across 64 independent LRU stripes via \`ahash\`, reducing lock contention to near zero on 32+ cores.
- **Lock-free read optimization**: Epoch-based hazard tracking allows safe zero-copy reads without blocking on writes.
- **Deterministic Eviction**: Evictions occur per-stripe, avoiding global cache freezes.

\`\`\`rust
use std::hash::{BuildHasher, Hash, Hasher};
use crossbeam_epoch::{self as epoch, Atomic, Guard, Owned, Shared};
use parking_lot::RwLock;

pub struct ShardedConcurrentLRU<K, V, S = ahash::RandomState> {
    stripes: Box<[LruStripe<K, V>]>,
    mask: usize,
    hasher: S,
}

impl<K: Hash + Eq + Send + Sync, V: Clone + Send + Sync> ShardedConcurrentLRU<K, V> {
    pub fn new(capacity: usize, num_stripes: usize) -> Self {
        let n = num_stripes.next_power_of_two();
        let cap_per_stripe = (capacity + n - 1) / n;
        let stripes = (0..n)
            .map(|_| LruStripe::new(cap_per_stripe))
            .collect::<Vec<_>>()
            .into_boxed_slice();

        Self {
            stripes,
            mask: n - 1,
            hasher: ahash::RandomState::new(),
        }
    }

    pub fn get(&self, key: &K) -> Option<V> {
        let stripe_idx = self.hash_key(key) & self.mask;
        self.stripes[stripe_idx].get_fast(key)
    }

    pub fn put(&self, key: K, value: V) {
        let stripe_idx = self.hash_key(&key) & self.mask;
        self.stripes[stripe_idx].insert(key, value);
    }
}
\`\`\`

#### Benchmarks & Performance
- **Throughput**: 4.8M ops/sec on 16 threads
- **Memory Overhead**: Only +12% metadata overhead
- **Safety**: 100% Miri verified, zero unsafe memory leaks.`,
    solution_2: `### Standard Monolithic Arc<RwLock<...>> LRU Cache

This implementation wraps a standard \`HashMap\` and a doubly-linked list inside an \`Arc<RwLock<Inner>>\` container with raw pointer nodes.

#### Implementation Details:
- Uses a single coarse \`RwLock\` around the entire data structure.
- Double-linked list node tracking with raw pointers for $O(1)$ node promotion.
- Mutates node frequency order during read access.

\`\`\`rust
use std::collections::HashMap;
use std::sync::{Arc, RwLock};

pub struct BasicLRU<K, V> {
    inner: Arc<RwLock<InnerLRU<K, V>>>,
}

struct Node<K, V> {
    key: K,
    val: V,
    prev: *mut Node<K, V>,
    next: *mut Node<K, V>,
}

struct InnerLRU<K, V> {
    map: HashMap<K, *mut Node<K, V>>,
    head: *mut Node<K, V>,
    tail: *mut Node<K, V>,
    capacity: usize,
}

impl<K: Clone + Eq + std::hash::Hash, V: Clone> BasicLRU<K, V> {
    pub fn get(&self, key: &K) -> Option<V> {
        // Warning: Requires write lock because LRU promotion alters pointers!
        let mut lock = self.inner.write().unwrap();
        if let Some(&node_ptr) = lock.map.get(key) {
            unsafe {
                lock.promote(node_ptr);
                Some((*node_ptr).val.clone())
            }
        } else {
            None
        }
    }
}
\`\`\`

#### Limitations & Issues:
- **Lock Contention**: The coarse write lock turns concurrent readers into serialized bottlenecks.
- **Deadlock risk**: Potential lock starvation under write-heavy workloads.
- **Safety**: Unsound raw pointer manipulation without explicit boundary fences.`,
    judge: {
      solution_1_score: 10,
      solution_2_score: 6,
      solution_1_reasoning: "Solution 1 demonstrates exemplary systems engineering. By partitioning into 64 lock-striped shards and decoupling read hits from synchronous LRU updates via epoch-based reclamation, it completely eliminates cache stampedes and scales linearly across CPU cores. The unsafe code is strictly encapsulated and Miri-clean.",
      solution_2_reasoning: "Solution 2 suffers from a fatal concurrency design flaw: it requires an exclusive write lock on get() operations to re-order LRU pointers, destroying read concurrency. Additionally, using raw unmanaged pointers inside a standard RwLock risks data races and memory leaks during abnormal thread panic drops."
    }
  },
  {
    id: 10,
    timestamp: "Today at 15:04:12",
    problem: "Design an in-memory distributed Rate Limiter in Go using the Token Bucket algorithm. It must support high-throughput multi-tenant rate limiting with microsecond latencies and graceful burst handling.",
    tags: ["Go 1.22", "Token Bucket", "Atomics", "Distributed Sync"],
    solution_1: `### Lock-Free Fractional Token Bucket with Atomic CAS

This approach computes token refills on-demand using timestamp delta arithmetic and 64-bit atomic compare-and-swap operations, avoiding background tick timers and mutex serialization.

#### Architecture:
- **Timestamp Arithmetic**: Rather than running active timer routines, available tokens are calculated via $(now - last_refill) \\times fill_rate$.
- **Atomic State Packing**: Packs the 32-bit token count and 32-bit timestamp delta into a single \`uint64\` atomic word.

\`\`\`go
package ratelimit

import (
	"sync/atomic"
	"time"
)

type AtomicBucket struct {
	ratePerSec  uint32
	maxCapacity uint32
	// packed: high 32 bits = timestamp (seconds), low 32 bits = tokens
	state uint64
}

func (b *AtomicBucket) Allow() bool {
	for {
		curr := atomic.LoadUint64(&b.state)
		lastSec := uint32(curr >> 32)
		tokens := uint32(curr & 0xFFFFFFFF)
		nowSec := uint32(time.Now().Unix())

		deltaSec := nowSec - lastSec
		if deltaSec > 0 {
			tokens += deltaSec * b.ratePerSec
			if tokens > b.maxCapacity {
				tokens = b.maxCapacity
			}
			lastSec = nowSec
		}

		if tokens == 0 {
			return false
		}

		nextTokens := tokens - 1
		next := (uint64(lastSec) << 32) | uint64(nextTokens)
		if atomic.CompareAndSwapUint64(&b.state, curr, next) {
			return true
		}
	}
}
\`\`\`

#### Key Advantages:
- Zero allocations on the critical request path.
- Non-blocking lock-free CAS loop achieves over 18 million evaluations per second per core.`,
    solution_2: `### Mutex-Synchronized Ticker-Based Token Bucket

This solution spawns a background goroutine for each bucket with a \`time.Ticker\` that regularly adds tokens under a \`sync.Mutex\` lock.

\`\`\`go
package ratelimit

import (
	"sync"
	"time"
)

type TickerBucket struct {
	mu       sync.Mutex
	tokens   int
	capacity int
	ticker   *time.Ticker
	stopCh   chan struct{}
}

func NewTickerBucket(capacity int, interval time.Duration) *TickerBucket {
	b := &TickerBucket{
		tokens:   capacity,
		capacity: capacity,
		ticker:   time.NewTicker(interval),
		stopCh:   make(chan struct{}),
	}
	go func() {
		for {
			select {
			case <-b.ticker.C:
				b.mu.Lock()
				if b.tokens < b.capacity {
					b.tokens++
				}
				b.mu.Unlock()
			case <-b.stopCh:
				return
			}
		}
	}()
	return b
}

func (b *TickerBucket) Allow() bool {
	b.mu.Lock()
	defer b.mu.Unlock()
	if b.tokens > 0 {
		b.tokens--
		return true
	}
	return false
}
\`\`\`

#### Critical Weaknesses:
- Creating 100,000 multi-tenant buckets spawns 100,000 active tickers and goroutines, inducing severe runtime scheduler overhead.
- Mutex lock contention limits throughput to ~850k ops/sec.`,
    judge: {
      solution_1_score: 9.5,
      solution_2_score: 5,
      solution_1_reasoning: "Solution 1 represents production-grade Go engineering. Packing token count and timestamps into an atomic uint64 allows 100% lock-free access with sub-nanosecond overhead. Mathematical on-demand refill avoids background goroutines entirely.",
      solution_2_reasoning: "Solution 2 is unscalable for multi-tenant systems. Spawning a persistent goroutine and time.Ticker per bucket will exhaust memory and trigger catastrophic timer churn in the Go runtime when tracking thousands of API keys."
    }
  }
];
