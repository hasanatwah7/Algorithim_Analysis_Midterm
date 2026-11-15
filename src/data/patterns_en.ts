/**
 * App-side English translation layer for the Problem-Type Atlas.
 *
 * The source data in `data.ts` and `ai_questions.ts` stays verbatim and
 * untouched; this file only provides English versions used when the Patterns
 * page is switched to English.
 */

export type PatternsLang = "en" | "ar";

export interface PatternTranslation {
  problemType: string;
  steps: string[];
  workedExample: {
    problem: string;
    steps: string[];
    finalAnswer: string;
  };
}

export const chapterSummaryEn: Record<number, string> = {
  1: "A core review of summation and logarithm rules, proof techniques (especially induction), probability and expected value, and elementary data structures.",
  2: "The RAM model, counting primitive operations, proving loop correctness with loop invariants, and analyzing Insertion Sort, Binary Search, Euclid's GCD, and matrix multiplication.",
  3: "Studying algorithm efficiency as n → ∞ with Θ, O, Ω, o, and ω, the ordering of growth rates, the c1/c2/n0 constant proofs, and the potential-function idea.",
  4: "Analyzing Merge Sort and solving recurrences with 4 methods: iterative substitution, recursion trees, guess-and-test, and the Master Theorem (with the z = lg n trick).",
  5: "Quicksort and PARTITION, worst-case analysis, proportional splits, randomized Quicksort, and RANDOMIZED-SELECT for finding the i-th smallest element in linear time.",
  6: "The binary heap structure (max-heap and min-heap), parent/child index rules, MAX-HEAPIFY in O(lg n), BUILD-MAX-HEAP in O(n), and in-place HEAPSORT in O(n lg n).",
};

export const patternEn: Record<string, PatternTranslation> = {
  "ch1-p1": {
    problemType: "Proof by Induction",
    steps: [
      "Step 1 (Basis): substitute the smallest allowed value of n and check that the inequality or equation holds.",
      "Step 2 (Inductive Hypothesis): state the assumption clearly — \"Assume the claim holds for n\" (or for every i < n when the step depends on the previous two values).",
      "Step 3 (Inductive Step): write the target for n+1 (or n), split it into a part you replace with the hypothesis plus the remainder, then simplify algebraically.",
    ],
    workedExample: {
      problem:
        "Prove by induction that the Fibonacci sequence F(1)=1, F(2)=2, F(n)=F(n-1)+F(n-2) satisfies F(n) < 2^n for every n ≥ 1.",
      steps: [
        "Basis: for n=1: F(1) = 1 < 2^1 = 2 (true). For n=2: F(2) = 2 < 2^2 = 4 (true).",
        "Inductive Hypothesis: assume F(i) < 2^i holds for every i < n (where n > 2).",
        "Inductive Step: for n > 2, F(n) = F(n-1) + F(n-2) < 2^{n-1} + 2^{n-2} < 2^{n-1} + 2^{n-1} = 2 × 2^{n-1} = 2^n.",
      ],
      finalAnswer: "Proved: F(n) < 2^n for every n ≥ 1.",
    },
  },
  "ch1-p2": {
    problemType: "Conditional Probability (quick method)",
    steps: [
      "Step 1: count the outcomes in the conditioning event B on its own.",
      "Step 2: count how many of B's outcomes also satisfy A at the same time (A ∩ B).",
      "Step 3: divide the number of outcomes in (A ∩ B) by the number of outcomes in B.",
    ],
    workedExample: {
      problem:
        "Two dice are rolled. What is the probability that their sum is 10 (event A), given that the first die shows 6 (event B)?",
      steps: [
        "Outcomes of B (first die = 6): only 6 outcomes — (6,1), (6,2), (6,3), (6,4), (6,5), (6,6) — so Pr(B) = 1/6.",
        "Outcomes of (A ∩ B) (sum = 10 and first die = 6): only one outcome, (6,4), so Pr(A ∩ B) = 1/36.",
        "Divide: Pr(A|B) = (1/36) / (1/6) = 1/6.",
      ],
      finalAnswer: "1/6",
    },
  },
  "ch2-p1": {
    problemType: "Counting Primitive Operations in Loops (Insertion Sort / ArrayMax style)",
    steps: [
      "Step 1: count each statement outside the loop once.",
      "Step 2: the for-loop header runs n times, and its body runs (n-1) times.",
      "Step 3: if there is an inner while-loop, let t_j be its iteration count. Use t_j = 1 for the best case and t_j = j for the worst case, then apply the summation formula.",
    ],
    workedExample: {
      problem: "Find the complexity of INSERTION-SORT in the best and worst cases.",
      steps: [
        "General cost equation: T(n) = c1*n + c2*(n-1) + c3*(n-1) + c4*Σt_j + c5*Σ(t_j-1) + c6*Σ(t_j-1) + c7*(n-1).",
        "Best case (sorted array): the test A[i] > key fails immediately, so t_j = 1 for every j. Hence Σt_j = n-1 and Σ(t_j-1) = 0, leaving a linear expression an + b = O(n).",
        "Worst case (reverse sorted): t_j = j, so Σt_j = n(n+1)/2 - 1 and Σ(t_j-1) = n(n-1)/2, leaving a quadratic expression an^2 + bn + c = O(n^2).",
      ],
      finalAnswer: "Best Case = O(n), Worst Case = O(n^2)",
    },
  },
  "ch2-p2": {
    problemType: "Tracing Binary Search (1-indexed)",
    steps: [
      "Step 1: start with low = 1 and high = n.",
      "Step 2: compute mid = floor((low + high) / 2) and compare A[mid] with the target.",
      "Step 3: if the target is larger, set low = mid + 1; if it is smaller, set high = mid - 1. Record A[mid] on every iteration.",
    ],
    workedExample: {
      problem:
        "In the array A = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], which elements are compared with the value 8?",
      steps: [
        "Iteration 1: low=1, high=12 → mid = floor(13/2) = 6 → compare with A[6] = 6 (8 > 6, so low = 7).",
        "Iteration 2: low=7, high=12 → mid = floor(19/2) = 9 → compare with A[9] = 9 (8 < 9, so high = 8).",
        "Iteration 3: low=7, high=8 → mid = floor(15/2) = 7 → compare with A[7] = 7 (8 > 7, so low = 8).",
        "Iteration 4: low=8, high=8 → mid = 8 → compare with A[8] = 8 (found).",
      ],
      finalAnswer: "{6, 9, 7, 8}",
    },
  },
  "ch2-p3": {
    problemType: "Deriving a Recurrence Relation from Recursive Code",
    steps: [
      "Step 1: count how many times the code calls itself (that is the coefficient a).",
      "Step 2: see how the input size shrinks in the call (n-1 or n/2).",
      "Step 3: count the cost of the non-recursive work outside the call (O(1) or O(n)).",
    ],
    workedExample: {
      problem:
        "Derive the recurrence for recursiveMax(A, n), which compares max(recursiveMax(A, n-1), A[n-1]).",
      steps: [
        "The return statement makes one recursive call (a = 1).",
        "The problem size drops by 1 ← T(n-1).",
        "Comparing two numbers takes constant time, O(1).",
      ],
      finalAnswer: "T(n) = T(n - 1) + O(1)",
    },
  },
  "ch3-p1": {
    problemType: "Finding the Constants c1, c2, n0 to Prove Θ(g(n))",
    steps: [
      "Step 1: write the inequality c1*g(n) ≤ f(n) ≤ c2*g(n).",
      "Step 2: divide every side by g(n).",
      "Step 3: choose c2 ≥ the coefficient of the highest-degree term, then test values of n until the middle expression is positive so you can pick c1 and n0.",
    ],
    workedExample: {
      problem: "Prove by the formal definition that (1/2)n^2 - 3n = Θ(n^2).",
      steps: [
        "Write: c1*n^2 ≤ (1/2)n^2 - 3n ≤ c2*n^2.",
        "Divide by n^2: c1 ≤ 1/2 - 3/n ≤ c2.",
        "Right side: 1/2 - 3/n ≤ 1/2 for every n ≥ 1 ← choose c2 = 1/2.",
        "Left side: try n = 7 ← 1/2 - 3/7 = 1/14 > 0 ← choose c1 = 1/14 and n0 = 7.",
      ],
      finalAnswer: "c1 = 1/14, c2 = 1/2, n0 = 7",
    },
  },
  "ch3-p2": {
    problemType: "Finding the Crossing Point n0 to Compare Two Algorithms",
    steps: [
      "Step 1: write the inequality T_A(n) < T_B(n).",
      "Step 2: simplify the inequality (divide by n if it is a common factor).",
      "Step 3: substitute the answer choices to find the smallest n that satisfies the inequality.",
    ],
    workedExample: {
      problem:
        "Algorithm A needs 10 n lg n operations and algorithm B needs n^2 operations. Find n0 such that A beats B for every n ≥ n0 (choices: 10, 20, 30, 60).",
      steps: [
        "Write: 10 n lg n < n^2 ← divide by n ← 10 lg n < n.",
        "Try n = 30: 10 * lg(30) ≈ 10 * 4.91 = 49.1 > 30 (false).",
        "Try n = 60: 10 * lg(60) ≈ 10 * 5.91 = 59.1 < 60 (true).",
      ],
      finalAnswer: "n0 = 60",
    },
  },
  "ch4-p1": {
    problemType: "Solving a Recurrence with the Master Theorem (and the z = lg n trick)",
    steps: [
      "Step 1: extract a, b, and f(n).",
      "Step 2: compute the critical term n^(log_b a).",
      "Step 3: compare the exponent of f(n) with log_b a to decide Case 1, 2, or 3.",
      "Step 4 (if √n appears): substitute z = lg n ← n = 2^z, solve S(z) with the Master Theorem, then switch back to z.",
    ],
    workedExample: {
      problem: "Solve T(n) = 2T(√n) + O(1) using the substitution z = lg n.",
      steps: [
        "Let z = lg n, so n = 2^z and √n = 2^(z/2).",
        "Set S(z) = T(2^z) ← the recurrence becomes S(z) = 2S(z/2) + O(1).",
        "Apply the Master Theorem: a=2, b=2 ← z^(log_2 2) = z^1. Since f(z)=O(1) is smaller by an exponent ← Case 1 ← S(z) = Θ(z).",
        "Switch back with z = lg n ← T(n) = O(lg n).",
      ],
      finalAnswer: "O(lg n)",
    },
  },
  "ch4-p2": {
    problemType: "Solving T(n-1) by Iterative Substitution",
    steps: [
      "Step 1: expand the recurrence 3 times to expose the pattern.",
      "Step 2: collect the leftover terms as a summation Σ.",
      "Step 3: apply the matching summation formula (constant ← n, i ← n^2, i^2 ← n^3, 2^i ← 2^n).",
    ],
    workedExample: {
      problem: "Solve T(n) = T(n - 1) + 2^n where n > 0.",
      steps: [
        "T(n) = T(n-1) + 2^n = T(n-2) + 2^{n-1} + 2^n = ... = T(0) + Σ_{i=1..n} 2^i.",
        "The geometric series sums to 2(2^n - 1) = 2^{n+1} - 2.",
        "The dominant term is 2^n.",
      ],
      finalAnswer: "O(2^n)",
    },
  },
  "ch5-p1": {
    problemType: "Tracing PARTITION(A, p, r) (Lomuto)",
    steps: [
      "Step 1: set the pivot x = A[r], i = p - 1, and let j walk from p to r - 1.",
      "Step 2: if A[j] > x, just advance j. If A[j] ≤ x, increment i and swap A[i] with A[j].",
      "Step 3: at the end, swap A[r] with A[i + 1] and return i + 1.",
    ],
    workedExample: {
      problem: "Run PARTITION on the array A = [2, 8, 7, 1, 3, 5, 6, 4].",
      steps: [
        "x = 4, i = 0.",
        "j=1 (2≤4) → i=1, swap(2,2). j=2,3 (8,7>4) → skip.",
        "j=4 (1≤4) → i=2, swap(8,1) → [2,1,7,8,3,5,6,4].",
        "j=5 (3≤4) → i=3, swap(7,3) → [2,1,3,8,7,5,6,4]. j=6,7 (5,6>4) → skip.",
        "Finally swap A[4]=8 with the pivot 4 → [2, 1, 3, 4, 7, 5, 6, 8].",
      ],
      finalAnswer: "[2, 1, 3, 4, 7, 5, 6, 8] (q = 4)",
    },
  },
  "ch5-p2": {
    problemType: "Tracing RANDOMIZED-SELECT(A, p, r, i)",
    steps: [
      "Step 1: run PARTITION to get the pivot position q.",
      "Step 2: compute k = q - p + 1.",
      "Step 3: if i == k return A[q]; if i < k recurse left with i; if i > k recurse right with (i - k).",
    ],
    workedExample: {
      problem:
        "Find the 3rd smallest element (i=3) in A = [2, 1, 3, 4, 7, 5, 6, 8] after the first partition (q=4, p=1, r=8).",
      steps: [
        "k = 4 - 1 + 1 = 4.",
        "Since i=3 < k=4 → go into the left part A[1..3] = [2, 1, 3] and ask for i = 3.",
        "Partition [2, 1, 3] around pivot 3 → q = 3 ← k = 3.",
        "Now i == k (3 == 3) ← return A[3] = 3.",
      ],
      finalAnswer: "3",
    },
  },
  "ch6-p1": {
    problemType: "Tracing MAX-HEAPIFY(A, i)",
    steps: [
      "Step 1: compute l = 2i and r = 2i + 1 (only while they are ≤ heap-size).",
      "Step 2: pick the largest value among A[i], A[l], and A[r], and call its index largest.",
      "Step 3: if largest ≠ i, swap A[i] with A[largest] and repeat the same steps at index largest.",
    ],
    workedExample: {
      problem:
        "Trace MAX-HEAPIFY(A, 2) on the array A = [16, 4, 10, 14, 7, 9, 3, 2, 8, 1] (1-indexed, heap-size=10).",
      steps: [
        "At i=2 (value 4): children are l=4 (14) and r=5 (7). The largest is A[4]=14 ← swap A[2] and A[4], giving A[2]=14, A[4]=4.",
        "Descend to i=4 (value 4): children are l=8 (2) and r=9 (8). The largest is A[9]=8 ← swap A[4] and A[9], giving A[4]=8, A[9]=4.",
        "Descend to i=9 (value 4): no children within heap-size=10 ← stop.",
      ],
      finalAnswer: "[16, 14, 10, 8, 7, 9, 3, 2, 4, 1]",
    },
  },
  "ch6-p2": {
    problemType: "Applying BUILD-MAX-HEAP and HEAPSORT",
    steps: [
      "Step 1: start at i = floor(n/2) and walk down to 1, calling MAX-HEAPIFY(A, i) to build the max-heap.",
      "Step 2 (for sorting): swap the root A[1] with the last element A[heap-size].",
      "Step 3: decrease heap-size by one, call MAX-HEAPIFY(A, 1), and repeat until heap-size = 1.",
    ],
    workedExample: {
      problem: "Build a max-heap for the array A = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7] (n=10).",
      steps: [
        "Start at i = floor(10/2) = 5 and walk down to 1 (elements 6..10 are leaves).",
        "i=5 (16): its child is A[10]=7 ← already valid.",
        "i=4 (2): children 14, 8 ← swap with 14 ← becomes [..., 14, ..., 2].",
        "i=3 (3): children 9, 10 ← swap with 10.",
        "i=2 (1): sinks past 16 then 7.",
        "i=1 (4): sinks past 16, then 14, then 8 until the heap settles.",
      ],
      finalAnswer: "[16, 14, 10, 8, 7, 9, 3, 2, 4, 1]",
    },
  },
};

/** English solution steps for the AI practical drills shown on this page. */
export const drillStepsEn: Record<string, string[]> = {
  "ai-pr-1": [
    "1) Compute the arithmetic series: ∑_{i=1}^{10} i = n(n+1)/2 = 10 × 11 / 2 = 55.",
    "2) Compute the geometric series: ∑_{i=0}^{4} 2^i = 2^{4+1} - 1 = 32 - 1 = 31.",
    "3) Add the two results: 55 + 31 = 86.",
  ],
  "ai-pr-2": [
    "1) The probability of event B (first die = 5) is Pr(B) = 1/6.",
    "2) The event (A ∩ B) means the first die is 5 and the sum is 9, which happens in only one case when the second die is 4: (5,4), so Pr(A ∩ B) = 1/36.",
    "3) Divide: Pr(A | B) = (1/36) / (1/6) = 1/6.",
  ],
  "ai-pr-3": [
    "1) The total sample space for 4 flips = 2^4 = 16 outcomes.",
    "2) Outcomes in B (first flip is a head) = 2^3 = 8 outcomes.",
    "3) Outcomes in A ∩ B (first flip is a head and exactly 2 heads among the remaining 3 flips) = 3 outcomes: (HHHT, HHTH, HTHH).",
    "4) Therefore Pr(A | B) = 3 / 8.",
  ],
  "ai-pr-4": [
    "1) Use swap identity 5 from Chapter 1: b^(log_c a) = a^(log_c b).",
    "2) Therefore 4^(log_2 n) = n^(log_2 4).",
    "3) Since log_2(4) = 2, the result is n^2.",
  ],
  "ai-pr-5": [
    "1) Outside the loop: cMax <- A[0] (2 operations) + initialize i=1 (1 operation) + return cMax (1 operation) = 4 operations.",
    "2) The loop test (i ≤ n-1) runs n times.",
    "3) The loop body runs (n-1) times: in the best case (A[0] is the maximum) it costs 4 operations, and in the worst case (ascending array) it costs 6 operations.",
    "4) So Best Case = 4 + n + 4(n-1) = 5n, and Worst Case = 4 + n + 6(n-1) = 7n - 2.",
  ],
  "ai-pr-6": [
    "1) Iteration 1: low=1, high=16 → mid = ⌊17/2⌋ = 8 → element A[8] = 14 (22 > 14, so low = 9).",
    "2) Iteration 2: low=9, high=16 → mid = ⌊25/2⌋ = 12 → element A[12] = 25 (22 < 25, so high = 11).",
    "3) Iteration 3: low=9, high=11 → mid = ⌊20/2⌋ = 10 → element A[10] = 19 (22 > 19, so low = 11).",
    "4) Iteration 4: low=11, high=11 → mid = 11 → element A[11] = 22 (found).",
  ],
  "ai-pr-7": [
    "1) Call 1: (412, 260) → 412 mod 260 = 152.",
    "2) Call 2: (260, 152) → 260 mod 152 = 108.",
    "3) Call 3: (152, 108) → 152 mod 108 = 44.",
    "4) Call 4: (108, 44) (then it continues to (44,20) → (20,4) → (4,0), and the result is 4).",
  ],
  "ai-pr-8": [
    "1) M_0 = 0.",
    "2) M_1 = max{0, 0 + (-2)} = 0.",
    "3) M_2 = max{0, 0 + 5} = 5.",
    "4) M_3 = max{0, 5 + (-1)} = 4.",
    "5) M_4 = max{0, 4 + 4} = 8 ← the largest value in M is 8.",
  ],
  "ai-pr-9": [
    "1) Dividing the inequality by n^2 gives: c1 ≤ 1/2 - 3/n ≤ c2.",
    "2) The right side holds for every n ≥ 1 by choosing c2 = 1/2.",
    "3) The left side becomes positive at n ≥ 7, where 1/2 - 3/7 = 1/14, so we choose c1 = 1/14 and n0 = 7.",
  ],
  "ai-pr-10": [
    "1) The outer loop (i from 1 to n) runs n times.",
    "2) The inner while-loop doubles j on every iteration (j = j * 2) until it reaches n, so it runs lg n times.",
    "3) Since the loops are independent, multiply: n × lg n = O(n lg n).",
  ],
  "ai-pr-11": [
    "1) Write the inequality: 64n lg n < 8n^2 ← divide both sides by 8n ← 8 lg n < n.",
    "2) Try n = 16: 8 × lg(16) = 8 × 4 = 32 > 16 (false).",
    "3) Try n = 32: 8 × lg(32) = 8 × 5 = 40 > 32 (false).",
    "4) Try n = 64: 8 × lg(64) = 8 × 6 = 48 < 64 (true!).",
  ],
  "ai-pr-12": [
    "1) The first bracket (1 + 2 + ... + m) = m(m+1)/2 = O(m^2).",
    "2) The second bracket (1 + 2 + ... + n) = n(n+1)/2 = O(n^2).",
    "3) Their product = O(m^2 * n^2).",
  ],
  "ai-pr-13": [
    "1) Identify the parameters: a = 4, b = 2, f(n) = n.",
    "2) Compute the critical term: n^(log_b a) = n^(log_2 4) = n^2.",
    "3) Compare f(n) = n^1 with n^2: since n^1 is smaller by an exponent (ε = 1) ← Case 1 ← T(n) = Θ(n^2).",
  ],
  "ai-pr-14": [
    "1) a = 2, b = 2, f(n) = n log^1 n.",
    "2) Critical term: n^(log_2 2) = n^1.",
    "3) Since f(n) = Θ(n^(log_b a) * log^k n) with k = 1 ← Case 2 ← increase the logarithm's power by 1 to get Θ(n log^2 n).",
  ],
  "ai-pr-15": [
    "1) a = 9, b = 3, f(n) = n^2.5.",
    "2) Critical term: n^(log_3 9) = n^2.",
    "3) Since f(n) = n^2.5 is larger than n^2 by an exponent (ε = 0.5) and the regularity condition holds: 9(n/3)^2.5 = (9/3^2.5)n^2.5 ≤ δ n^2.5 (δ < 1) ← Case 3 ← Θ(n^2.5).",
  ],
  "ai-pr-16": [
    "1) Let z = lg n ← so n = 2^z and n^(1/2) = 2^(z/2).",
    "2) Define S(z) = T(2^z), so the recurrence becomes: S(z) = 2S(z/2) + z.",
    "3) By the Master Theorem on S(z): a=2, b=2 ← z^(log_2 2) = z^1, and f(z) = z ← Case 2 (k=0) ← S(z) = Θ(z lg z).",
    "4) Switch back with z = lg n ← T(n) = O(lg n * lg(lg n)).",
  ],
  "ai-pr-17": [
    "1) The root (depth 0) has 3 children at depth 1.",
    "2) The problem size at each child is n/4, so one child costs c(n/4)^2 = (1/16)cn^2.",
    "3) The total cost of the 3 children at depth 1 = 3 × (1/16)cn^2 = (3/16)cn^2.",
  ],
  "ai-pr-18": [
    "1) The pivot is the last element x = 4, and the pointer i keeps the elements ≤ 4 in order: 2, then 1, then 3.",
    "2) Before the final pivot swap the array is: [2, 1, 3, 8, 7, 5, 6, 4] with i = 3.",
    "3) Swap A[i+1] (which is A[4] = 8) with the pivot (A[8] = 4) to get [2, 1, 3, 4, 7, 5, 6, 8].",
  ],
  "ai-pr-19": [
    "1) Count the elements in the left part including the pivot: k = q - p + 1 = 4 - 1 + 1 = 4.",
    "2) Compare the target i = 7 with k = 4: since i > k, go into the right part from q + 1 = 5 to r = 10.",
    "3) The new rank needed inside the right part is i - k = 7 - 4 = 3 ← the call is RANDOMIZED-SELECT(A, 5, 10, 3).",
  ],
  "ai-pr-20": [
    "1) The faster branch divides by 10 at every step (n / 10^i = 1), so it reaches a leaf at depth i = log_10(n).",
    "2) The longer branch multiplies by 9/10 at every step (n * (9/10)^i = 1), so it reaches a leaf at depth i = log_{10/9}(n).",
    "3) Both depths are Θ(lg n), so the total cost stays O(n lg n).",
  ],
  "ai-pr-21": [
    "1) PARENT(5) = ⌊5 / 2⌋ = 2.",
    "2) LEFT(5) = 2 × 5 = 10.",
    "3) RIGHT(5) = 2 × 5 + 1 = 11.",
  ],
  "ai-pr-22": [
    "1) Apply the direct formula from Theorem 6.1: h = ⌊lg n⌋.",
    "2) Since 2^3 = 8 and 2^4 = 16, lg(14) ≈ 3.8.",
    "3) Therefore ⌊3.8⌋ = 3.",
  ],
  "ai-pr-23": [
    "1) At i = 2 (value 4): the children are A[4]=14 and A[5]=7 ← swap 4 with the larger 14.",
    "2) Descend to i = 4 (value 4): the children are A[8]=2 and A[9]=8 ← swap 4 with the larger 8.",
    "3) Descend to i = 9 (value 4): it has no children (2×9 = 18 > 10), so the algorithm stops and the array becomes [16, 14, 10, 8, 7, 9, 3, 2, 4, 1].",
  ],
  "ai-pr-24": [
    "1) Start at i = ⌊6/2⌋ = 3 and walk down to 1.",
    "2) At i = 3 (A[3]=9): its only child l=6 (A[6]=20) is larger ← swap 9 with 20 ← [3, 5, 20, 6, 8, 9].",
    "3) At i = 2 (A[2]=5): children l=4 (6) and r=5 (8) ← largest is 8 ← swap 5 with 8 ← [3, 8, 20, 6, 5, 9].",
    "4) At i = 1 (A[1]=3): children l=2 (8) and r=3 (20) ← largest is 20 ← swap 3 with 20, then at i=3 its child A[6]=9 is larger than 3 ← swap 3 with 9 ← [20, 8, 9, 6, 5, 3].",
  ],
};
