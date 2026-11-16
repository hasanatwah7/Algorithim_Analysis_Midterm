/**
 * App-side English translation layer for the Study page and its Anki cards.
 *
 * The source data in `data.ts` and `ai_questions.ts` stays verbatim and
 * untouched; this file only provides English versions used when the Study
 * page is switched to English.
 */

export type StudyLang = "en" | "ar";

export const conceptEn: Record<string, { body: string; note?: string }> = {
  "ch1-t1": {
    body: "Algorithm analysis measures an algorithm's efficiency and compares it with others, both theoretically and practically. The analysis must be machine-independent (it does not depend on the machine or programming language) and must account for resource utilization.",
  },
  "ch1-t2": {
    body: "The core mathematical rules used in complexity analysis: arithmetic and geometric series, the five logarithm laws, and the floor and ceiling functions.",
    note: "On slide page 3 the geometric series is written with denominator (1-1) by mistake; the correct denominator is (1-a).",
  },
  "ch1-t3": {
    body: "Three main proof techniques: by example (an example or counterexample), contrapositives & contradiction, and induction.",
  },
  "ch1-t4": {
    body: "The sample space S and event A, conditional probability, random variables (an indicator random variable takes the value 0 or 1), the expected value E(X), and the linearity of expectation.",
  },
  "ch1-t5": {
    body: "The stack (LIFO: PUSH/POP), the queue (FIFO: ENQUEUE/DEQUEUE using a circular array), the doubly linked list (LIST-INSERT in O(1), and LIST-DELETE in O(1) when you have a pointer or Θ(n) when you only have a key), and representing general trees with left-child, right-sibling in O(n) space.",
    note: "Exam trick: LIST-DELETE is O(1) when you have a pointer to the node, but Θ(n) when you only have the key, because you must first find it with LIST-SEARCH.",
  },
  "ch2-t1": {
    body: "An algorithm is a finite, deterministic, effective sequence of steps. Scalability is the algorithm's ability to handle growing input sizes. The RAM model assumes every primitive operation takes constant time independent of the input size.",
  },
  "ch2-t2": {
    body: "A tool for proving any loop correct in 3 stages: initialization (before the first iteration), maintenance (if it holds before an iteration it still holds after it), and termination (when the loop ends it guarantees the result is correct).",
  },
  "ch2-t3": {
    body: "An inversion is a pair of elements in reverse order. An array is partially sorted when its number of inversions is less than a constant times n. Best case (sorted) = O(n); worst case (reverse sorted) = O(n^2).",
  },
  "ch2-t4": {
    body: "Comparing the chapter's algorithms: Maxsub (O(n^3) → O(n^2) → O(n)), ArrayMax (5n best / 7n-2 worst), BinarySearch (O(lg n)), EuclidGCD (less than log max(a,b)), SimpleTextSearch (O(M(N-M+1))), and both the ordinary matrix product and the naive D&C version (both Θ(n^3)).",
  },
  "ch3-t1": {
    body: "Θ(g(n)) is a tight bound (upper and lower together), O(g(n)) an upper bound (≤), Ω(g(n)) a lower bound (≥), o(g(n)) strictly smaller (limit = 0), and ω(g(n)) strictly larger (limit = ∞). The functions must be asymptotically nonnegative.",
    note: "Trick: huge hidden constants like 10^100 * n are theoretically Θ(n), but in practice 10n log n is faster at practical input sizes.",
  },
  "ch3-t2": {
    body: "Any polynomial of degree k is Θ(n^k). The base of a logarithm does not affect Θ/O/Ω. Important proof: lg(n!) = Θ(n lg n) (the Ω part is proved for n ≥ 4 and lg n > 2 when n > 4).",
  },
  "ch4-t1": {
    body: "Merge Sort uses divide and conquer. Merging two arrays with merge takes O(n) using a sentinel (∞). The Merge-Sort tree has height lg n and each level does O(n) work, so the total is O(n lg n). Its drawback for big data is space complexity (O(n) extra memory).",
  },
  "ch4-t2": {
    body: "1) Iterative substitution: expand the recurrence to expose the pattern. 2) Recursion tree: a visual tree; the maximum number of leaves is n^(log_b a). 3) Guess-and-test: guess and prove by induction (if a smaller term breaks it, subtract that term from the guess). 4) Master Theorem for T(n)=aT(n/b)+f(n).",
  },
  "ch5-t1": {
    body: "Quicksort uses divide and conquer; its biggest advantage is being in-place (it allocates no extra memory) and its average comparison count is O(n lg n) with small constants. PARTITION takes Θ(n) and puts the pivot in its final position.",
  },
  "ch5-t2": {
    body: "Worst case = Θ(n^2) when the array is already sorted (a split of n-1 and 0: T(n) = T(n-1) + O(n)). Best case, or any split with a constant ratio (such as 9:1 or 99:1), = O(n lg n). RANDOMIZED-PARTITION picks a random pivot to avoid the worst case, and the comparison proof relies on each pair of elements being compared with probability 2/(j-i+1).",
  },
  "ch5-t3": {
    body: "Finding the i-th element (such as the median) in expected Θ(n) time. The difference from Quicksort is that the recursion continues on only one side of the partition. Its worst case is still Θ(n^2).",
  },
  "ch6-t1": {
    body: "A heap is an array representing a nearly complete binary tree. It has two attributes: length[A] and heap-size[A]. The height for n nodes is ⌊lg n⌋ (Theorem 6.1). It combines Merge Sort's speed (O(n lg n)) with Insertion Sort's in-place advantage.",
    note: "The max-heap condition is A[PARENT(i)] ≥ A[i] (the largest element is at the root A[1]) and it is used for ascending Heapsort.",
  },
  "ch6-t2": {
    body: "MAX-HEAPIFY(A, i) sinks a violating element downward and takes O(lg n) (with the recurrence T(n) ≤ T(2n/3) + Θ(1)). BUILD-MAX-HEAP loops from ⌊n/2⌋ down to 1 (because the elements from ⌊n/2⌋+1 to n are all leaves) and takes linear time O(n), not O(n lg n)! HEAPSORT builds the heap, then swaps the root with the last element, decreases heap-size, and calls MAX-HEAPIFY(A, 1), for O(n lg n) total.",
  },
};

export const quizExplanationEn: Record<string, string> = {
  "ex1-q2":
    "Using 1-indexed indices and mid = floor((low+high)/2): step 1 compares A[6]=6, step 2 compares A[9]=9, step 3 compares A[7]=7, step 4 compares A[8]=8.",
  "ex1-q3":
    "Expanding the recurrence gives T(n) = n + (n-1) + ... + 1 = Σi = n(n+1)/2 (using the formulas from Chapters 1 and 4).",
  "ex1-q4":
    "This is Euclid's subtraction algorithm: (49,35) → (35,14) → (14,21) → (14,7) → (7,7), so the result is 7 (which is GCD(49,35)).",
  "ex1-q5":
    "Expanding the recurrence gives the geometric series 2^1 + 2^2 + ... + 2^n = 2(2^n - 1) = O(2^n).",
  "ex1-q6":
    "The inner loop runs i times, so the total is Σ_{i=1}^{n^2} i = n^2(n^2+1)/2 = O(n^4).",
  "ex1-q7":
    "Because the array is sorted, we can use binary search and compare A[mid] with its index to find the missing number in O(lg n).",
  "ex1-q8":
    "The function calls itself once on n-1 and performs a min comparison in constant time O(1).",
  "ex2-q1":
    "By the Master Theorem: a=3, b=6 → n^(log_6 3) ≈ n^0.613, and f(n) = n is larger by an exponent → Case 3 → O(n).",
  "ex2-q2":
    "From the Chapter 3 page 11 proof: 'Since lg n > 2 for n > 4, therefore lg n! = Ω(n lg n).'",
  "ex2-q3":
    "Because Merge Sort is not in-place and allocates auxiliary arrays using O(n) space.",
  "ex2-q4":
    "A sorted array is the best case for Insertion Sort and takes linear time O(n).",
  "ex2-q5":
    "We need 10 lg n < n: at n=30, 49.1 > 30, and at n=60, 59.1 < 60.",
  "ex2-q6":
    "The number of elements is n = 8, and Merge Sort's complexity is n lg n = 8 × lg(8) = 8 × 3 = 24.",
  "ex2-q7":
    "The first branch is n^(log_2 3) ≈ n^1.585 and the second is n^(log_4 5) ≈ n^1.161; both are smaller than n^2, so by Master Theorem Case 3 the total is O(n^2).",
  "ex2-q8":
    "Binary search performs O(lg n) steps, and each string comparison costs O(M) for the length of S.",
  "ex2-q9":
    "BubbleSort on n=8 elements needs at most n(n-1)/2 = 8×7/2 = 28 comparisons, and 28 is less than 64 (lessthan64).",
  "ex2-q10":
    "Expanding the recurrence gives the sum of squares Σ_{i=1}^n i^2 = O(n^3).",
  "ex3-q1":
    "Setting z = lg n transforms it into S(z) = 2S(z/2) + O(1), and Master Theorem Case 1 gives Θ(z) = O(lg n).",
  "ex3-q2":
    "The exponential function O(2^n) has the highest growth rate compared with linear and quadratic functions.",
  "ex3-q3":
    "The height of a balanced/complete binary tree with n elements is lg n (also confirmed by Theorem 6.1 in Chapter 6).",
  "ex3-q4":
    "In a recursion tree with depth log_b n and branching factor a, the number of leaves is a^(log_b n) = n^(log_b a).",
  "ex3-q5":
    "Quicksort combines being in-place (no large extra memory) with an average comparison count of O(n lg n) using small constants.",
  "ex3-q6":
    "Merge Sort splits the array in half and then merges the halves (divide and conquer).",
  "ex3-q7":
    "Each call runs a for-loop costing O(n) in the worst case, then calls itself on the remaining problem (n-1).",
  "ex3-q8":
    "The function computes combinations C(n, r): C(6, 2) = (6 × 5) / 2 = 15.",
  "ex3-q9":
    "In the worst case (a split of n-1 and 0), the recurrence is T(n) = T(n - 1) + O(n) and its complexity is Θ(n^2).",
  "ex3-q10":
    "The sorted array drives Quicksort into its worst case O(n^2), while the unsorted one is closer to the average O(n lg n), so t1 > t2.",
};

export const aiTheoryExplanationEn: Record<string, string> = {
  "ai-th-1":
    "LIST-DELETE itself takes O(1) if you have a pointer to the element, but with only the key you must call LIST-SEARCH first, which takes Θ(n) in the worst case.",
  "ai-th-2":
    "Each node needs only two pointers (left-child and right-sibling) plus p, so the total space stays O(n) regardless of the number of children.",
  "ai-th-3":
    "Linearity of expectation always holds for any two random variables, independent or not, unlike the product rule E(XY), which requires independence.",
  "ai-th-4":
    "When we try to POP from an empty stack (top[S] = 0), the algorithm returns an 'underflow' error.",
  "ai-th-5":
    "If node x has no children then left-child[x] = NIL, while if it is the rightmost child of its parent then right-sibling[x] = NIL.",
  "ai-th-6":
    "An indicator random variable takes the value 1 if the event occurs and 0 otherwise, i.e. the set {0, 1}.",
  "ai-th-7":
    "The RAM model assumes the CPU executes any primitive operation in a constant number of steps that does not depend on the input size n.",
  "ai-th-8":
    "Proving a loop correct with a loop invariant consists of initialization (before the start), maintenance (during iterations), and termination (after the loop ends).",
  "ai-th-9":
    "An array is partially sorted when its number of inversions is less than a constant times the array size n; Insertion Sort then runs in O(n).",
  "ai-th-10":
    "Its recurrence is C_n = 8 C_{n/2} + n^2 and its solution is Θ(n^3), meaning it does not improve on the ordinary iterative method.",
  "ai-th-11":
    "MaxsubFaster used prefix sums to reach O(n^2), while MaxsubFastest used the maximum suffix sum M_t = max{0, M_{t-1} + A[t]} to reach O(n).",
  "ai-th-12":
    "Every two successive calls reduce the first argument to less than half (a_{i+2} < a_i / 2), so the number of arithmetic operations is less than O(log max(a,b)).",
  "ai-th-13":
    "By the fundamental theorem in Chapter 3: f(n) = Θ(g(n)) if and only if it is bounded above by O(g(n)) and below by Ω(g(n)).",
  "ai-th-14":
    "The little-oh symbol o(g(n)) means f(n) is strictly smaller than g(n) at infinity, i.e. the ratio's limit equals zero.",
  "ai-th-15":
    "By the change-of-base rule: log_b(n) = log_a(n) / log_a(b); the denominator is just a constant and is ignored in asymptotic notation.",
  "ai-th-16":
    "The standard ordering from the Chapter 3 table: log n ≺ log^2 n ≺ √n ≺ n ≺ n log n ≺ n^2 ≺ n^3 ≺ 2^n.",
  "ai-th-17":
    "The amortized cost of operation i is the actual time plus the change in potential: t̂_i = t_i + Φ_i - Φ_{i-1}; as long as Φ_n ≥ Φ_0, the total actual time T ≤ T̂.",
  "ai-th-18":
    "Big-Oh only requires one constant c > 0 to exist, while little-oh requires the inequality to hold for every constant c > 0, however small (by choosing a suitable n0).",
  "ai-th-19":
    "The sentinel (∞) makes it easy to copy the rest of the other array automatically once the first array is exhausted.",
  "ai-th-20":
    "Case 2 occurs when f(n) equals n^(log_b a) (or is multiplied by log^k n); the result then increases the logarithm's power by one.",
  "ai-th-21":
    "Case 3 (when f(n) is larger than n^(log_b a) by an exponent) is the only one that requires the regularity condition af(n/b) ≤ δf(n) with δ < 1.",
  "ai-th-22":
    "Its main drawback is the logical jump when inferring the general form after i steps; to be 100% certain it needs an induction proof.",
  "ai-th-23":
    "At level i there are 2^i subarrays, each of length n/2^i, so the total work at one level = 2^i × (n/2^i) = O(n).",
  "ai-th-24":
    "When the simple guess fails because of a small extra term such as + log n, we strengthen the hypothesis by subtracting the small term: T(n) ≤ c(n - log n).",
  "ai-th-25":
    "A sorted array is the worst case for ordinary Quicksort (Θ(n^2)) because the split is n-1 and 0, while it is the best case for Insertion Sort (O(n)).",
  "ai-th-26":
    "Any split with a constant ratio (even 99-to-1) produces a tree of depth Θ(lg n) with O(n) cost per level, so the total stays O(n lg n).",
  "ai-th-27":
    "Unlike Quicksort, which recurses into both sides, RANDOMIZED-SELECT discards one side and recurses into only one, which makes the series sum to Θ(n).",
  "ai-th-28":
    "In Quicksort all the work happens in the divide step (PARTITION); since the sort is in-place, the combine step does no work.",
  "ai-th-29":
    "The two elements z_i and z_j are compared if and only if the first pivot chosen from the set Z_{ij} (which has j - i + 1 elements) is either z_i or z_j, so their probability is 2 / (j - i + 1).",
  "ai-th-30":
    "In the worst case (very bad luck, always choosing the largest element as pivot), RANDOMIZED-SELECT takes Θ(n^2), while its expected time is Θ(n).",
  "ai-th-31":
    "Although the call happens O(n) times and each MAX-HEAPIFY costs at most O(lg n), most nodes have small height, so the mathematical sum closes at O(n) (linear time).",
  "ai-th-32":
    "The elements from index floor(n/2)+1 to n have no children (2i > n), which is why BUILD-MAX-HEAP starts its loop at floor(n/2) and goes down.",
  "ai-th-33":
    "Heapsort runs in O(n lg n) in all cases like Merge Sort, and it uses no extra space (in-place) like Insertion Sort.",
  "ai-th-34":
    "The largest possible size of a child subtree in a heap is 2n/3 (when the last row is exactly half full), and the comparison-and-swap step costs Θ(1).",
  "ai-th-35":
    "In the linearity proof for BUILD-MAX-HEAP (page 95): the number of nodes of height h is at most ⌈n / 2^(h+1)⌉, and each costs O(h).",
  "ai-th-36":
    "LEFT(i) is computed with a left shift by 1 bit, RIGHT(i) with a left shift plus adding 1 in the first bit, and PARENT(i) with a right shift by 1 bit.",
};
