export interface AITheoryQuestion {
  id: string;
  chapterNumber: number;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: string[];
  correctIndex: number;
  correctAnswer: string;
  explanationAr: string;
}

export interface AIPracticalProblem {
  id: string;
  chapterNumber: number;
  problemType: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  codeOrFormula?: string;
  options: string[];
  correctIndex: number;
  correctAnswer: string;
  solutionStepsAr: string[];
}

/**
 * القسم الأول: 36 سؤال نظري (MCQ) مبنية بالـ AI تغطي كل تفاصيل وتريكات الـ 6 شابترات
 */
export const aiTheoryQuestions: AITheoryQuestion[] = [
  // ==================== Chapter 1 (6 Questions) ====================
  {
    id: "ai-th-1",
    chapterNumber: 1,
    topic: "Linked Lists Complexity",
    difficulty: "Medium",
    question:
      "What is the worst-case running time to delete an element from a doubly linked list L when given ONLY its key k (not a pointer to the node)?",
    options: ["O(1)", "O(lg n)", "Θ(n)", "O(n lg n)"],
    correctIndex: 2,
    correctAnswer: "Θ(n)",
    explanationAr:
      "دالة LIST-DELETE نفسها بتاخد O(1) لو معاك pointer للعنصر، لكن لو معاك الـ key بس لازم تنادي LIST-SEARCH الأول ودي بتاخد Θ(n) في أسوأ حالة.",
  },
  {
    id: "ai-th-2",
    chapterNumber: 1,
    topic: "Unbounded Rooted Trees",
    difficulty: "Easy",
    question:
      "How much space does the left-child, right-sibling representation require for an n-node rooted tree with arbitrary (unbounded) branching?",
    options: ["O(n^2)", "O(n lg n)", "O(n)", "O(k * n)"],
    correctIndex: 2,
    correctAnswer: "O(n)",
    explanationAr:
      "كل عقدة بتحتاج مؤشرين فقط (left-child و right-sibling) بالإضافة لـ p، فإجمالي المساحة بيفضل O(n) مهما كان عدد الأبناء.",
  },
  {
    id: "ai-th-3",
    chapterNumber: 1,
    topic: "Probability & Expectation",
    difficulty: "Medium",
    question:
      "Which of the following statements about Expectation E(X) is ALWAYS true for any two arbitrary random variables X and Y (even if they are NOT independent)?",
    options: [
      "E(XY) = E(X)E(Y)",
      "E(X + Y) = E(X) + E(Y)",
      "Pr(X ∩ Y) = Pr(X)Pr(Y)",
      "E(X/Y) = E(X)/E(Y)",
    ],
    correctIndex: 1,
    correctAnswer: "E(X + Y) = E(X) + E(Y)",
    explanationAr:
      "خاصية Linearity of Expectation بتتحقق دايماً لأي متغيرين عشوائيين سواء مستقلين أو لأ، عكس الضرب E(XY) اللي بيشترط الاستقلال.",
  },
  {
    id: "ai-th-4",
    chapterNumber: 1,
    topic: "Stacks and Queues",
    difficulty: "Easy",
    question:
      "What error occurs when POP(S) is called on an empty stack S (where STACK-EMPTY(S) returns TRUE)?",
    options: ["Stack Overflow", "Stack Underflow", "Segmentation Fault", "Null Pointer Error"],
    correctIndex: 1,
    correctAnswer: "Stack Underflow",
    explanationAr:
      "لما نحاول نعمل POP من Stack فاضي (top[S] = 0)، الخوارزمية بترجع خطأ 'underflow'.",
  },
  {
    id: "ai-th-5",
    chapterNumber: 1,
    topic: "Left-Child Right-Sibling Pointers",
    difficulty: "Medium",
    question:
      "In the left-child, right-sibling representation of a rooted tree, when is right-sibling[x] equal to NIL?",
    options: [
      "When node x is the root of the tree",
      "When node x has no children",
      "When node x is the rightmost child of its parent",
      "When node x is a leaf node",
    ],
    correctIndex: 2,
    correctAnswer: "When node x is the rightmost child of its parent",
    explanationAr:
      "لو العقدة x ملهاش أبناء بيكون left-child[x] = NIL، أما لو هي آخر ابن على اليمين لأبوها بيكون right-sibling[x] = NIL.",
  },
  {
    id: "ai-th-6",
    chapterNumber: 1,
    topic: "Indicator Random Variables",
    difficulty: "Easy",
    question:
      "An indicator random variable maps outcomes of a sample space S to which set of values?",
    options: ["[-1, 1]", "[0, ∞)", "{0, 1}", "All real numbers R"],
    correctIndex: 2,
    correctAnswer: "{0, 1}",
    explanationAr:
      "الـ Indicator random variable بياخد قيمة 1 لو الحدث حصل و 0 لو محصلش، أي المجموعة {0, 1}.",
  },

  // ==================== Chapter 2 (6 Questions) ====================
  {
    id: "ai-th-7",
    chapterNumber: 2,
    topic: "RAM Model",
    difficulty: "Easy",
    question:
      "In the Random-Access Machine (RAM) computational model, how long does a single primitive operation (like array indexing or variable assignment) take?",
    options: [
      "O(lg n) steps",
      "A constant number of steps independent of input size n",
      "O(n) steps",
      "Depends on the CPU clock speed",
    ],
    correctIndex: 1,
    correctAnswer: "A constant number of steps independent of input size n",
    explanationAr:
      "نموذج RAM بيفترض إن الـ CPU بتنفذ أي primitive operation في عدد ثابت من الخطوات ميعتمدش على حجم الـ input n.",
  },
  {
    id: "ai-th-8",
    chapterNumber: 2,
    topic: "Loop Invariant",
    difficulty: "Easy",
    question:
      "Which three properties must be shown to prove the correctness of an algorithm using a Loop Invariant?",
    options: [
      "Divide, Conquer, Combine",
      "Basis, Hypothesis, Step",
      "Initialization, Maintenance, Termination",
      "Best-case, Average-case, Worst-case",
    ],
    correctIndex: 2,
    correctAnswer: "Initialization, Maintenance, Termination",
    explanationAr:
      "إثبات صحة الـ Loop بالـ Loop Invariant يتكون من: Initialization (قبل البداية)، Maintenance (أثناء اللفات)، و Termination (بعد انتهاء الـ Loop).",
  },
  {
    id: "ai-th-9",
    chapterNumber: 2,
    topic: "Insertion Sort & Inversions",
    difficulty: "Medium",
    question:
      "When is an array considered 'partially sorted' in the context of Insertion Sort analysis?",
    options: [
      "When it has zero inversions",
      "When it is sorted in reverse order",
      "When it contains less than a constant times n inversions",
      "When its length is a power of 2",
    ],
    correctIndex: 2,
    correctAnswer: "When it contains less than a constant times n inversions",
    explanationAr:
      "الـ array بتعتبر partially sorted لما يكون عدد الـ inversions فيها أقل من ثابت في حجم المصفوفة n، وساعتها Insertion Sort بتشتغل في O(n).",
  },
  {
    id: "ai-th-10",
    chapterNumber: 2,
    topic: "Matrix Multiplication (Divide & Conquer)",
    difficulty: "Medium",
    question:
      "What is the time complexity of the naive Divide-and-Conquer matrix multiplication algorithm (using 8 recursive calls on n/2 × n/2 submatrices)?",
    options: ["Θ(n^2)", "Θ(n^2 lg n)", "Θ(n^2.81)", "Θ(n^3)"],
    correctIndex: 3,
    correctAnswer: "Θ(n^3)",
    explanationAr:
      "معادلتها C_n = 8 C_{n/2} + n^2 وحلها Θ(n^3)، يعني لم تحسن التعقيد عن الطريقة التكرارية العادية.",
  },
  {
    id: "ai-th-11",
    chapterNumber: 2,
    topic: "Maximum Subarray Problem",
    difficulty: "Medium",
    question:
      "How does the MaxsubFastest algorithm reduce the running time of the Maximum Subarray Problem from O(n^3) and O(n^2) down to O(n)?",
    options: [
      "By sorting the array first using Merge Sort",
      "By computing maximum suffix sums M_t = max{0, M_{t-1} + A[t]} in a single pass",
      "By using Binary Search on prefix sums",
      "By dividing the array into 8 subarrays",
    ],
    correctIndex: 1,
    correctAnswer:
      "By computing maximum suffix sums M_t = max{0, M_{t-1} + A[t]} in a single pass",
    explanationAr:
      "MaxsubFaster استخدمت Prefix Sums فخلتها O(n^2)، بينما MaxsubFastest استخدمت Maximum Suffix Sum M_t = max{0, M_{t-1} + A[t]} فخلتها O(n).",
  },
  {
    id: "ai-th-12",
    chapterNumber: 2,
    topic: "Euclid's GCD Algorithm",
    difficulty: "Hard",
    question:
      "In Euclid's recursive GCD algorithm EuclidGCD(a, b), how fast does the first argument a_i decrease?",
    options: [
      "It decreases by 1 in each call",
      "It decreases by at least half with every OTHER recursive call (a_{i+2} < 1/2 a_i)",
      "It decreases by a factor of 10 in each call",
      "It remains constant until the last step",
    ],
    correctIndex: 1,
    correctAnswer:
      "It decreases by at least half with every OTHER recursive call (a_{i+2} < 1/2 a_i)",
    explanationAr:
      "في كل استدعاءين متتاليين، المعامل الأول بيقل لأقل من النص (a_{i+2} < a_i / 2)، وعشان كده عدد العمليات الحسابية أقل من O(log max(a,b)).",
  },

  // ==================== Chapter 3 (6 Questions) ====================
  {
    id: "ai-th-13",
    chapterNumber: 3,
    topic: "Asymptotic Notations Relationship",
    difficulty: "Medium",
    question: "Which of the following is TRUE if f(n) = Θ(g(n))?",
    options: [
      "f(n) = o(g(n))",
      "f(n) = O(g(n)) and f(n) = Ω(g(n))",
      "f(n) = ω(g(n))",
      "lim_{n→∞} f(n)/g(n) = 0",
    ],
    correctIndex: 1,
    correctAnswer: "f(n) = O(g(n)) and f(n) = Ω(g(n))",
    explanationAr:
      "حسب النظرية الأساسية في شابتر 3: f(n) = Θ(g(n)) إذا وفقط إذا كانت محصورة من فوق بـ O(g(n)) ومن تحت بـ Ω(g(n)).",
  },
  {
    id: "ai-th-14",
    chapterNumber: 3,
    topic: "Little-oh vs Big-Oh",
    difficulty: "Hard",
    question: "Which asymptotic notation corresponds to lim_{n→∞} f(n)/g(n) = 0?",
    options: ["f(n) = Θ(g(n))", "f(n) = Ω(g(n))", "f(n) = o(g(n))", "f(n) = ω(g(n))"],
    correctIndex: 2,
    correctAnswer: "f(n) = o(g(n))",
    explanationAr:
      "رمز o(g(n)) (Little-oh) معناه إن f(n) أصغر قطعياً من g(n) عند اللانهاية، يعني نهاية القسمة بتساوي صفر.",
  },
  {
    id: "ai-th-15",
    chapterNumber: 3,
    topic: "Logarithm Base Independence",
    difficulty: "Easy",
    question:
      "Why do we usually omit the base of logarithms inside Θ, O, and Ω notations (assuming base > 1)?",
    options: [
      "Because all logarithms equal 1 for large n",
      "Because log_b(n) = Θ(log_a(n)) since changing the base only multiplies by a constant",
      "Because log_2(n) is always larger than n",
      "Because computer scientists only use base 10",
    ],
    correctIndex: 1,
    correctAnswer:
      "Because log_b(n) = Θ(log_a(n)) since changing the base only multiplies by a constant",
    explanationAr:
      "من قانون تغيير الأساس: log_b(n) = log_a(n) / log_a(b)، والمقام ده مجرد ثابت بيتم تجاهله في الـ Asymptotic Notations.",
  },
  {
    id: "ai-th-16",
    chapterNumber: 3,
    topic: "Growth Rate Ordering",
    difficulty: "Medium",
    question:
      "Which of the following lists the functions in strictly INCREASING order of asymptotic growth rate?",
    options: [
      "√n, log^2 n, n, n log n",
      "log n, log^2 n, √n, n, n log n",
      "log^2 n, √n, log n, n",
      "n, √n, log^2 n, 2^n",
    ],
    correctIndex: 1,
    correctAnswer: "log n, log^2 n, √n, n, n log n",
    explanationAr:
      "ترتيب الجدول القياسي في شابتر 3: log n ≺ log^2 n ≺ √n ≺ n ≺ n log n ≺ n^2 ≺ n^3 ≺ 2^n.",
  },
  {
    id: "ai-th-17",
    chapterNumber: 3,
    topic: "Amortized Analysis (Potential Method)",
    difficulty: "Hard",
    question:
      "In the potential method of amortized analysis, if t_i is the actual time of the i-th operation and Φ_i is the potential after the i-th operation, how is the amortized time t̂_i defined?",
    options: [
      "t̂_i = t_i - Φ_i + Φ_{i-1}",
      "t̂_i = t_i + Φ_i - Φ_{i-1}",
      "t̂_i = t_i * (Φ_i / Φ_{i-1})",
      "t̂_i = Φ_n - Φ_0",
    ],
    correctIndex: 1,
    correctAnswer: "t̂_i = t_i + Φ_i - Φ_{i-1}",
    explanationAr:
      "التكلفة الـ Amortized للعملية i هي الوقت الفعلي زائد التغير في الجهد: t̂_i = t_i + Φ_i - Φ_{i-1}، وطالما Φ_n ≥ Φ_0 يبقى الوقت الفعلي الكلي T ≤ T̂.",
  },
  {
    id: "ai-th-18",
    chapterNumber: 3,
    topic: "Quantifier Difference (O vs o)",
    difficulty: "Hard",
    question:
      "What is the formal logical difference between Big-Oh O(g(n)) and Little-oh o(g(n)) regarding the constant c > 0?",
    options: [
      "Big-Oh requires the inequality to hold for ALL c > 0, while Little-oh requires SOME c > 0",
      "Big-Oh requires SOME constant c > 0 to exist, while Little-oh requires the inequality to hold for ANY (all) constant c > 0",
      "There is no difference in the constant c",
      "Little-oh allows c to be negative",
    ],
    correctIndex: 1,
    correctAnswer:
      "Big-Oh requires SOME constant c > 0 to exist, while Little-oh requires the inequality to hold for ANY (all) constant c > 0",
    explanationAr:
      "في Big-Oh يكفي وجود ثابت واحد c > 0، بينما في Little-oh لازم المتباينة تتحقق لأي ثابت c > 0 مهما كان صغير (باختيار n0 مناسب).",
  },

  // ==================== Chapter 4 (6 Questions) ====================
  {
    id: "ai-th-19",
    chapterNumber: 4,
    topic: "Merge Sort Sentinel",
    difficulty: "Easy",
    question:
      "Why is a 'sentinel' value (∞) placed at the end of the two auxiliary arrays S1 and S2 in the MERGE procedure?",
    options: [
      "To reduce the time complexity from O(n lg n) to O(n)",
      "To avoid checking whether either auxiliary array is empty in each step",
      "To make Merge Sort an in-place algorithm",
      "To sort negative numbers",
    ],
    correctIndex: 1,
    correctAnswer:
      "To avoid checking whether either auxiliary array is empty in each step",
    explanationAr:
      "الـ Sentinel (∞) بتسهل نقل باقي عناصر المصفوفة التانية تلقائياً بمجرد ما المصفوفة الأولى تخلص.",
  },
  {
    id: "ai-th-20",
    chapterNumber: 4,
    topic: "Master Theorem Cases",
    difficulty: "Medium",
    question:
      "In the Master Theorem for T(n) = aT(n/b) + f(n), what is the condition for Case 2?",
    options: [
      "f(n) is polynomially smaller than n^(log_b a)",
      "f(n) = Θ(n^(log_b a) * log^k n) for some k ≥ 0",
      "f(n) is polynomially larger than n^(log_b a)",
      "a < 1 and b < 1",
    ],
    correctIndex: 1,
    correctAnswer: "f(n) = Θ(n^(log_b a) * log^k n) for some k ≥ 0",
    explanationAr:
      "Case 2 بتحصل لما f(n) تكون مساوية لـ n^(log_b a) (أو مضروبة في log^k n)، وساعتها بنزود أس الـ log واحد في الناتج.",
  },
  {
    id: "ai-th-21",
    chapterNumber: 4,
    topic: "Master Theorem Regularity Condition",
    difficulty: "Hard",
    question:
      "Which case of the Master Theorem requires the additional regularity condition a * f(n/b) ≤ δ * f(n) for some constant δ < 1?",
    options: ["Case 1 only", "Case 2 only", "Case 3 only", "All three cases"],
    correctIndex: 2,
    correctAnswer: "Case 3 only",
    explanationAr:
      "Case 3 (لما تكون f(n) أكبر بأس من n^(log_b a)) هي الوحيدة اللي بتشترط شرط الانتظام af(n/b) ≤ δf(n) مع δ < 1.",
  },
  {
    id: "ai-th-22",
    chapterNumber: 4,
    topic: "Iterative Substitution Disadvantage",
    difficulty: "Medium",
    question:
      "What is the main disadvantage of the Iterative Substitution ('plug-and-chug') method mentioned in Chapter 4?",
    options: [
      "It cannot solve linear recurrences",
      "It involves a logical 'jump' when inferring the general pattern, which strictly requires induction to justify",
      "It always gives O(n^2) complexity",
      "It only works when a = 1",
    ],
    correctIndex: 1,
    correctAnswer:
      "It involves a logical 'jump' when inferring the general pattern, which strictly requires induction to justify",
    explanationAr:
      "عيبها الأساسي هو القفزة المنطقية (logical jump) لما بنستنتج الشكل العام بعد i خطوات، وعشان نكون متأكدين 100% بتحتاج إثبات بالـ Induction.",
  },
  {
    id: "ai-th-23",
    chapterNumber: 4,
    topic: "Merge-Sort Tree Depth & Work",
    difficulty: "Easy",
    question:
      "In the Merge-Sort recursion tree for an array of size n (power of 2), how many sequences exist at depth i, and what is the total work done at depth i?",
    options: [
      "i sequences of size n/i, total work O(n^2)",
      "2^i sequences of size n/2^i, total work O(n)",
      "n sequences of size 1, total work O(lg n)",
      "2 sequences of size n/2, total work O(1)",
    ],
    correctIndex: 1,
    correctAnswer: "2^i sequences of size n/2^i, total work O(n)",
    explanationAr:
      "عند المستوى i بيكون عندنا 2^i مصفوفة فرعية طول كل واحدة n/2^i، فمجموع الشغل في المستوى الواحد = 2^i × (n/2^i) = O(n).",
  },
  {
    id: "ai-th-24",
    chapterNumber: 4,
    topic: "Guess-and-Test Strategy",
    difficulty: "Medium",
    question:
      "In the Guess-and-Test (Substitution) method, if proving T(n) ≤ cn fails because we get T(n) ≤ cn + log n, what is the standard technique to fix the inductive hypothesis?",
    options: [
      "Multiply cn by n to make it cn^2",
      "Subtract a lower-order term from the guess, e.g., T(n) ≤ c(n - log n)",
      "Set c = 0",
      "Ignore the + log n term without changing the guess",
    ],
    correctIndex: 1,
    correctAnswer:
      "Subtract a lower-order term from the guess, e.g., T(n) ≤ c(n - log n)",
    explanationAr:
      "لما الفرض البسيط يفشل بسبب حد صغير زيادة زي + log n، بنقوي الفرضية بطرح الحد الصغير: T(n) ≤ c(n - log n).",
  },

  // ==================== Chapter 5 (6 Questions) ====================
  {
    id: "ai-th-25",
    chapterNumber: 5,
    topic: "Quicksort Worst-Case Input",
    difficulty: "Medium",
    question:
      "On an already sorted array of n distinct elements, what are the running times of deterministic Quicksort vs. Insertion Sort?",
    options: [
      "Quicksort: O(n lg n), Insertion Sort: O(n^2)",
      "Quicksort: Θ(n^2), Insertion Sort: O(n)",
      "Both take O(n lg n)",
      "Both take Θ(n^2)",
    ],
    correctIndex: 1,
    correctAnswer: "Quicksort: Θ(n^2), Insertion Sort: O(n)",
    explanationAr:
      "المصفوفة المرتبة هي أسوأ حالة لـ Quicksort العادي (Θ(n^2)) لأن التقسيم بيكون n-1 و 0، بينما هي أحسن حالة لـ Insertion Sort (O(n)).",
  },
  {
    id: "ai-th-26",
    chapterNumber: 5,
    topic: "Proportional Partitioning in Quicksort",
    difficulty: "Hard",
    question:
      "If PARTITION in Quicksort always produces a 99-to-1 proportional split at every level, what is the resulting running time?",
    options: ["Θ(n^2)", "O(n^1.5)", "O(n lg n)", "O(n)"],
    correctIndex: 2,
    correctAnswer: "O(n lg n)",
    explanationAr:
      "أي تقسيم بنسبة ثابتة (حتى 99-to-1) بينتج شجرة عمقها Θ(lg n) وتكلفة كل مستوى O(n)، فالإجمالي بيفضل O(n lg n).",
  },
  {
    id: "ai-th-27",
    chapterNumber: 5,
    topic: "RANDOMIZED-SELECT vs Quicksort",
    difficulty: "Medium",
    question:
      "Why does RANDOMIZED-SELECT run in expected Θ(n) time while RANDOMIZED-QUICKSORT runs in expected Θ(n lg n) time?",
    options: [
      "RANDOMIZED-SELECT does not use PARTITION",
      "RANDOMIZED-SELECT only recurses on ONE side of the partition instead of both sides",
      "RANDOMIZED-SELECT uses a heap internally",
      "RANDOMIZED-SELECT always picks the exact median as pivot",
    ],
    correctIndex: 1,
    correctAnswer:
      "RANDOMIZED-SELECT only recurses on ONE side of the partition instead of both sides",
    explanationAr:
      "عكس Quicksort اللي بيدخل الناحيتين، RANDOMIZED-SELECT بتستبعد نص وتكمل Recursion في ناحية واحدة فقط، وده بيخلي المتسلسلة تتجمع لـ Θ(n).",
  },
  {
    id: "ai-th-28",
    chapterNumber: 5,
    topic: "Combine Step in Quicksort",
    difficulty: "Easy",
    question:
      "How much work is required in the 'Combine' step of the Divide-and-Conquer paradigm for Quicksort?",
    options: [
      "Θ(n) time to merge two arrays",
      "Θ(n lg n) time",
      "No work is needed (O(1)) because the subarrays are sorted in-place",
      "Θ(lg n) time",
    ],
    correctIndex: 2,
    correctAnswer:
      "No work is needed (O(1)) because the subarrays are sorted in-place",
    explanationAr:
      "في Quicksort الشغل كله بيحصل في خطوة الـ Divide (PARTITION)، وبما إن الترتيب In-place فمفيش أي شغل في خطوة الـ Combine.",
  },
  {
    id: "ai-th-29",
    chapterNumber: 5,
    topic: "Probability of Comparing Two Elements in Quicksort",
    difficulty: "Hard",
    question:
      "In the expected running time analysis of Randomized Quicksort, if z_i is the i-th smallest element and z_j is the j-th smallest element (i < j), what is the probability that z_i and z_j are compared?",
    options: [
      "1 / n",
      "2 / (j - i + 1)",
      "1 / (j - i)",
      "2 / n^2",
    ],
    correctIndex: 1,
    correctAnswer: "2 / (j - i + 1)",
    explanationAr:
      "العنصرين z_i و z_j بيتقارنوا لو وفقط لو أول pivot يتاخد من المجموعة Z_{ij} (اللي عدد عناصرها j - i + 1) هو إما z_i أو z_j، فاحتمالهم = 2 / (j - i + 1).",
  },
  {
    id: "ai-th-30",
    chapterNumber: 5,
    topic: "Worst-Case of RANDOMIZED-SELECT",
    difficulty: "Medium",
    question:
      "What is the worst-case running time of RANDOMIZED-SELECT(A, p, r, i), even when just finding the minimum element?",
    options: ["Θ(1)", "Θ(lg n)", "Θ(n)", "Θ(n^2)"],
    correctIndex: 3,
    correctAnswer: "Θ(n^2)",
    explanationAr:
      "في أسوأ حالة (لو الحظ سيئ جداً وفي كل مرة بنختار أكبر عنصر كـ pivot)، RANDOMIZED-SELECT بتاخد Θ(n^2)، بينما الـ Expected time هو Θ(n).",
  },

  // ==================== Chapter 6 (6 Questions) ====================
  {
    id: "ai-th-31",
    chapterNumber: 6,
    topic: "BUILD-MAX-HEAP Complexity",
    difficulty: "Medium",
    question:
      "What is the asymptotically tight running time of BUILD-MAX-HEAP on an unordered array of n elements?",
    options: ["O(lg n)", "O(n)", "O(n lg n)", "O(n^2)"],
    correctIndex: 1,
    correctAnswer: "O(n)",
    explanationAr:
      "رغم إن النداء بيحصل O(n) مرة وكل MAX-HEAPIFY أقصاه O(lg n)، لكن معظم العقد ارتفاعها صغير فالمجموع الرياضي بيقفل عند O(n) (وقت خطي).",
  },
  {
    id: "ai-th-32",
    chapterNumber: 6,
    topic: "Leaves in a Binary Heap",
    difficulty: "Easy",
    question:
      "In a 1-indexed binary heap stored in array A[1..n], which subarray contains ONLY leaf nodes?",
    options: [
      "A[1 ... floor(n/2)]",
      "A[floor(n/2) + 1 ... n]",
      "A[1 ... lg n]",
      "A[n/4 ... n]",
    ],
    correctIndex: 1,
    correctAnswer: "A[floor(n/2) + 1 ... n]",
    explanationAr:
      "العناصر من index floor(n/2)+1 لحد n ملهاش أبناء (2i > n)، فعشان كده BUILD-MAX-HEAP بتبدأ الـ loop من floor(n/2) نزولاً.",
  },
  {
    id: "ai-th-33",
    chapterNumber: 6,
    topic: "Heapsort Properties",
    difficulty: "Easy",
    question:
      "How does Heapsort combine the best attributes of Merge Sort and Insertion Sort?",
    options: [
      "It runs in O(n) like Insertion Sort best-case and uses O(n) space like Merge Sort",
      "It runs in O(n lg n) worst-case like Merge Sort and sorts in-place like Insertion Sort",
      "It is stable and recursive",
      "It has O(1) worst-case time",
    ],
    correctIndex: 1,
    correctAnswer:
      "It runs in O(n lg n) worst-case like Merge Sort and sorts in-place like Insertion Sort",
    explanationAr:
      "Heapsort وقتها O(n lg n) في كل الحالات زي Merge Sort، ومبتاخدش مساحة إضافية (In-place) زي Insertion Sort.",
  },
  {
    id: "ai-th-34",
    chapterNumber: 6,
    topic: "MAX-HEAPIFY Recurrence",
    difficulty: "Hard",
    question:
      "What is the recurrence relation that describes the worst-case running time of MAX-HEAPIFY on a subtree of size n?",
    options: [
      "T(n) ≤ T(n/2) + Θ(n)",
      "T(n) ≤ T(2n/3) + Θ(1)",
      "T(n) = 2T(n/2) + Θ(1)",
      "T(n) = T(n - 1) + Θ(1)",
    ],
    correctIndex: 1,
    correctAnswer: "T(n) ≤ T(2n/3) + Θ(1)",
    explanationAr:
      "أكبر حجم ممكن لشجرة فرعية لابن في Heap هو 2n/3 (لما يكون آخر صف في الشجرة مليان للنص بالظبط)، وخطوة المقارنة والتبديل بتاخد Θ(1).",
  },
  {
    id: "ai-th-35",
    chapterNumber: 6,
    topic: "Nodes of Height h in a Heap",
    difficulty: "Hard",
    question:
      "An n-element binary heap has height ⌊lg n⌋ and at most how many nodes of any given height h?",
    options: [
      "n / 2^h",
      "⌈ n / 2^(h+1) ⌉",
      "2^h",
      "⌊ lg(n/h) ⌋",
    ],
    correctIndex: 1,
    correctAnswer: "⌈ n / 2^(h+1) ⌉",
    explanationAr:
      "في إثبات خطية BUILD-MAX-HEAP (ص 95): عدد العقد التي ارتفاعها h لا يتجاوز ⌈n / 2^(h+1)⌉، وتكلفة كل واحدة O(h).",
  },
  {
    id: "ai-th-36",
    chapterNumber: 6,
    topic: "Bit-Shift Operations in Heap",
    difficulty: "Easy",
    question:
      "How can a computer compute LEFT(i) = 2i, RIGHT(i) = 2i + 1, and PARENT(i) = ⌊i/2⌋ in a single hardware instruction?",
    options: [
      "Using floating-point division",
      "By shifting the binary representation of i left or right by 1 bit position",
      "By using a hash table",
      "Using recursion",
    ],
    correctIndex: 1,
    correctAnswer:
      "By shifting the binary representation of i left or right by 1 bit position",
    explanationAr:
      "LEFT(i) بتتحسب بـ left shift بمقدار 1 بت، و RIGHT(i) بـ left shift مع إضافة 1 في أول بت، و PARENT(i) بـ right shift بمقدار 1 بت.",
  },
];

/**
 * القسم الثاني: 24 مسألة عملية (MCQ) على غرار مسائل محاضرات الدكتور (بكل خطوات البصمجة والحل)
 */
export const aiPracticalProblems: AIPracticalProblem[] = [
  // ==================== Chapter 1 (4 Problems) ====================
  {
    id: "ai-pr-1",
    chapterNumber: 1,
    problemType: "Geometric & Arithmetic Summations",
    difficulty: "Easy",
    question:
      "Evaluate the closed-form value of the summation ∑_{i=1}^{10} i + ∑_{i=0}^{4} 2^i:",
    options: ["70", "86", "85", "66"],
    correctIndex: 1,
    correctAnswer: "86",
    solutionStepsAr: [
      "1) نحسب المتسلسلة الحسابية: ∑_{i=1}^{10} i = n(n+1)/2 = 10 × 11 / 2 = 55.",
      "2) نحسب المتسلسلة الهندسية: ∑_{i=0}^{4} 2^i = 2^{4+1} - 1 = 32 - 1 = 31.",
      "3) نجمع الناتجين: 55 + 31 = 86.",
    ],
  },
  {
    id: "ai-pr-2",
    chapterNumber: 1,
    problemType: "Conditional Probability (Dice Roll - Ch1 Style)",
    difficulty: "Medium",
    question:
      "Two fair six-sided dice are rolled. Let A be the event that the sum of the two dice is 9, and let B be the event that the first die shows a 5. What is the conditional probability Pr(A | B)?",
    options: ["1/36", "1/9", "1/6", "4/36"],
    correctIndex: 2,
    correctAnswer: "1/6",
    solutionStepsAr: [
      "1) احتمال الحدث B (الزهرة الأولى = 5) هو Pr(B) = 1/6.",
      "2) الحدث (A ∩ B) يعني الزهرة الأولى 5 والمجموع 9، وده بيتحقق في حالة واحدة بس لما التانية تكون 4: (5,4)، أي Pr(A ∩ B) = 1/36.",
      "3) نقسم: Pr(A | B) = (1/36) / (1/6) = 1/6.",
    ],
  },
  {
    id: "ai-pr-3",
    chapterNumber: 1,
    problemType: "Conditional Probability (Coin Flips - Ch1 Style)",
    difficulty: "Medium",
    question:
      "A fair coin is flipped 4 times. Let A be the event that exactly 3 heads occur, and B be the event that the first flip is a head. What is Pr(A | B)?",
    options: ["1/4", "3/8", "1/2", "3/16"],
    correctIndex: 1,
    correctAnswer: "3/8",
    solutionStepsAr: [
      "1) الفضاء العيني الكلي لـ 4 رميات = 2^4 = 16 حالة.",
      "2) حالات B (أول رمية Head) = 2^3 = 8 حالات.",
      "3) حالات A ∩ B (أول رمية Head وباقي الـ 3 رميات فيهم 2 Heads) = 3 حالات: (HHHT, HHTH, HTHH).",
      "4) إذن Pr(A | B) = 3 / 8.",
    ],
  },
  {
    id: "ai-pr-4",
    chapterNumber: 1,
    problemType: "Logarithm & Exponent Identities (Ch1 Style)",
    difficulty: "Medium",
    question:
      "Using the logarithm and exponent identities from Chapter 1, simplify the expression: 4^(log_2 n)",
    options: ["2n", "n^2", "n^4", "log_2(4n)"],
    correctIndex: 1,
    correctAnswer: "n^2",
    solutionStepsAr: [
      "1) نستخدم قانون التبديل رقم 5 في شابتر 1: b^(log_c a) = a^(log_c b).",
      "2) إذن 4^(log_2 n) = n^(log_2 4).",
      "3) بما أن log_2(4) = 2، يصبح الناتج n^2.",
    ],
  },

  // ==================== Chapter 2 (4 Problems) ====================
  {
    id: "ai-pr-5",
    chapterNumber: 2,
    problemType: "Counting Primitive Operations (ArrayMax Style)",
    difficulty: "Medium",
    question:
      "Following the exact RAM primitive operation counting rules of ArrayMax in Chapter 2, what are the Best-Case and Worst-Case primitive operation counts t(n) for finding the maximum of n elements?",
    codeOrFormula:
      "cMax <- A[0]\nfor i <- 1 to n - 1 do\n    if cMax < A[i] then\n        cMax <- A[i]\nreturn cMax",
    options: [
      "Best: 3n, Worst: 5n",
      "Best: 5n, Worst: 7n - 2",
      "Best: 4n - 1, Worst: 6n + 1",
      "Best: n, Worst: n^2",
    ],
    correctIndex: 1,
    correctAnswer: "Best: 5n, Worst: 7n - 2",
    solutionStepsAr: [
      "1) بره الـ loop: cMax <- A[0] (2 عملية) + تهيئة i=1 (1 عملية) + return cMax (1 عملية) = 4 عمليات.",
      "2) فحص شرط الـ loop (i ≤ n-1) بيتنفذ n مرات.",
      "3) جسم الـ loop بيتنفذ (n-1) مرات: في الـ Best Case (A[0] هو الأكبر) بياخد 4 عمليات، وفي الـ Worst Case (مصفوفة تصاعدية) بياخد 6 عمليات.",
      "4) إذن Best Case = 4 + n + 4(n-1) = 5n، و Worst Case = 4 + n + 6(n-1) = 7n - 2.",
    ],
  },
  {
    id: "ai-pr-6",
    chapterNumber: 2,
    problemType: "Binary Search Trace (Ch2 Style)",
    difficulty: "Easy",
    question:
      "Given the sorted array A = [2, 4, 5, 7, 8, 9, 12, 14, 17, 19, 22, 25, 27, 28, 33, 37] (16 elements, 1-indexed) from Chapter 2, which sequence of elements is compared against key k = 22 using mid = ⌊(low + high)/2⌋?",
    options: [
      "{14, 25, 19, 22}",
      "{17, 27, 22}",
      "{14, 27, 22}",
      "{12, 25, 19, 22}",
    ],
    correctIndex: 0,
    correctAnswer: "{14, 25, 19, 22}",
    solutionStepsAr: [
      "1) اللفة 1: low=1, high=16 → mid = ⌊17/2⌋ = 8 → العنصر A[8] = 14 (22 > 14 إذن low = 9).",
      "2) اللفة 2: low=9, high=16 → mid = ⌊25/2⌋ = 12 → العنصر A[12] = 25 (22 < 25 إذن high = 11).",
      "3) اللفة 3: low=9, high=11 → mid = ⌊20/2⌋ = 10 → العنصر A[10] = 19 (22 > 19 إذن low = 11).",
      "4) اللفة 4: low=11, high=11 → mid = 11 → العنصر A[11] = 22 (تم إيجاده).",
    ],
  },
  {
    id: "ai-pr-7",
    chapterNumber: 2,
    problemType: "EuclidGCD Recursive Trace (Ch2 Style)",
    difficulty: "Easy",
    question:
      "When executing EuclidGCD(412, 260) from Chapter 2, what are the values of (a, b) at the 4th recursive call (level 4 in the trace table)?",
    codeOrFormula:
      "Algorithm EuclidGCD(a, b):\n  if b = 0 then return a\n  return EuclidGCD(b, a mod b)",
    options: ["(260, 152)", "(152, 108)", "(108, 44)", "(44, 20)"],
    correctIndex: 2,
    correctAnswer: "(108, 44)",
    solutionStepsAr: [
      "1) Call 1: (412, 260) → 412 mod 260 = 152.",
      "2) Call 2: (260, 152) → 260 mod 152 = 108.",
      "3) Call 3: (152, 108) → 152 mod 108 = 44.",
      "4) Call 4: (108, 44) (وتكمل لـ (44,20) → (20,4) → (4,0) والناتج 4).",
    ],
  },
  {
    id: "ai-pr-8",
    chapterNumber: 2,
    problemType: "Maximum Suffix Sum M_t Trace (MaxsubFastest)",
    difficulty: "Medium",
    question:
      "In Algorithm MaxsubFastest (where M_0 = 0 and M_t = max{0, M_{t-1} + A[t]}), what is the sequence of M_1, M_2, M_3, M_4 for array A = [-2, 5, -1, 4] and the returned maximum subarray sum?",
    options: [
      "M = [0, 5, 4, 8], Max = 8",
      "M = [-2, 3, 2, 6], Max = 6",
      "M = [0, 5, 0, 4], Max = 5",
      "M = [2, 7, 6, 10], Max = 10",
    ],
    correctIndex: 0,
    correctAnswer: "M = [0, 5, 4, 8], Max = 8",
    solutionStepsAr: [
      "1) M_0 = 0.",
      "2) M_1 = max{0, 0 + (-2)} = 0.",
      "3) M_2 = max{0, 0 + 5} = 5.",
      "4) M_3 = max{0, 5 + (-1)} = 4.",
      "5) M_4 = max{0, 4 + 4} = 8 ← أكبر قيمة في M هي 8.",
    ],
  },

  // ==================== Chapter 3 (4 Problems) ====================
  {
    id: "ai-pr-9",
    chapterNumber: 3,
    problemType: "Formal Θ Constants Selection (Ch3 Style)",
    difficulty: "Medium",
    question:
      "In the formal proof from Chapter 3 that (1/2)n^2 - 3n = Θ(n^2), which set of constants (c1, c2, n0) satisfies c1*n^2 ≤ (1/2)n^2 - 3n ≤ c2*n^2 for all n ≥ n0?",
    options: [
      "c1 = 1/2, c2 = 3, n0 = 1",
      "c1 = 1/14, c2 = 1/2, n0 = 7",
      "c1 = 1, c2 = 2, n0 = 3",
      "c1 = 1/7, c2 = 1/4, n0 = 2",
    ],
    correctIndex: 1,
    correctAnswer: "c1 = 1/14, c2 = 1/2, n0 = 7",
    solutionStepsAr: [
      "1) بقسمة المتباينة على n^2 نحصل على: c1 ≤ 1/2 - 3/n ≤ c2.",
      "2) الطرف الأيمن يتحقق لكل n ≥ 1 باختيار c2 = 1/2.",
      "3) الطرف الأيسر يصبح موجباً عند n ≥ 7 حيث 1/2 - 3/7 = 1/14، فنختار c1 = 1/14 و n0 = 7.",
    ],
  },
  {
    id: "ai-pr-10",
    chapterNumber: 3,
    problemType: "Nested Loops Complexity Analysis",
    difficulty: "Medium",
    question:
      "What is the tightest Big-Oh characterization of the following nested loop fragment?",
    codeOrFormula:
      "s <- 0\nfor i <- 1 to n do\n    j <- 1\n    while j < n do\n        s <- s + j\n        j <- j * 2",
    options: ["O(n^2)", "O(n lg n)", "O(n)", "O(2^n)"],
    correctIndex: 1,
    correctAnswer: "O(n lg n)",
    solutionStepsAr: [
      "1) الـ outer loop (i من 1 لـ n) بيتكرر n مرات.",
      "2) الـ inner while loop بيضاعف j في كل لفة (j = j * 2) لحد ما يوصل لـ n، يعني بيلف lg n مرات.",
      "3) بما إن اللوبين مستقلين، نضرب: n × lg n = O(n lg n).",
    ],
  },
  {
    id: "ai-pr-11",
    chapterNumber: 3,
    problemType: "Comparing Two Algorithms (Finding n0)",
    difficulty: "Medium",
    question:
      "Suppose Insertion Sort takes 8n^2 steps and Merge Sort takes 64n lg n steps on the same machine. For which smallest power-of-2 value of n (n ≥ 2) does Merge Sort start beating Insertion Sort (64n lg n < 8n^2)?",
    options: ["n = 8", "n = 16", "n = 32", "n = 64"],
    correctIndex: 3,
    correctAnswer: "n = 64",
    solutionStepsAr: [
      "1) نكتب المتباينة: 64n lg n < 8n^2 ← نقسم الطرفين على 8n ← نحصل على 8 lg n < n.",
      "2) نجرب n = 16: 8 × lg(16) = 8 × 4 = 32 > 16 (خطأ).",
      "3) نجرب n = 32: 8 × lg(32) = 8 × 5 = 40 > 32 (خطأ).",
      "4) نجرب n = 64: 8 × lg(64) = 8 × 6 = 48 < 64 (صح!).",
    ],
  },
  {
    id: "ai-pr-12",
    chapterNumber: 3,
    problemType: "Two-Variable Asymptotic Complexity (Ch3 Style)",
    difficulty: "Easy",
    question:
      "What is the asymptotic complexity of the two-variable expression (1 + 2 + ... + m)(1 + 2 + ... + n) from Chapter 3?",
    options: ["O(m + n)", "O(m * n)", "O(m^2 * n^2)", "O(m^2 + n^2)"],
    correctIndex: 2,
    correctAnswer: "O(m^2 * n^2)",
    solutionStepsAr: [
      "1) القوس الأول (1 + 2 + ... + m) = m(m+1)/2 = O(m^2).",
      "2) القوس الثاني (1 + 2 + ... + n) = n(n+1)/2 = O(n^2).",
      "3) حاصل ضربهما = O(m^2 * n^2).",
    ],
  },

  // ==================== Chapter 4 (5 Problems) ====================
  {
    id: "ai-pr-13",
    chapterNumber: 4,
    problemType: "Master Theorem Case 1 (Ch4 Style)",
    difficulty: "Easy",
    question:
      "Using the Master Theorem, what is the solution to the recurrence T(n) = 4T(n/2) + n?",
    options: ["Θ(n)", "Θ(n lg n)", "Θ(n^2)", "Θ(n^2 lg n)"],
    correctIndex: 2,
    correctAnswer: "Θ(n^2)",
    solutionStepsAr: [
      "1) نحدد المعاملات: a = 4, b = 2, f(n) = n.",
      "2) نحسب الحد الحرج: n^(log_b a) = n^(log_2 4) = n^2.",
      "3) نقارن f(n) = n^1 مع n^2: بما أن n^1 أصغر بأس (ε = 1) ← Case 1 ← T(n) = Θ(n^2).",
    ],
  },
  {
    id: "ai-pr-14",
    chapterNumber: 4,
    problemType: "Master Theorem Case 2 with Log Factor (Ch4 Style)",
    difficulty: "Medium",
    question:
      "Using the Master Theorem, what is the solution to the recurrence T(n) = 2T(n/2) + n log n?",
    options: ["Θ(n log n)", "Θ(n log^2 n)", "Θ(n^2)", "Θ(n)"],
    correctIndex: 1,
    correctAnswer: "Θ(n log^2 n)",
    solutionStepsAr: [
      "1) a = 2, b = 2, f(n) = n log^1 n.",
      "2) الحد الحرج: n^(log_2 2) = n^1.",
      "3) بما أن f(n) = Θ(n^(log_b a) * log^k n) حيث k = 1 ← Case 2 ← نزيد أس اللوغاريتم 1 فيصبح Θ(n log^2 n).",
    ],
  },
  {
    id: "ai-pr-15",
    chapterNumber: 4,
    problemType: "Master Theorem Case 3 (Ch4 Style)",
    difficulty: "Medium",
    question:
      "Using the Master Theorem, what is the solution to the recurrence T(n) = 9T(n/3) + n^(2.5)?",
    options: ["Θ(n^2)", "Θ(n^2 lg n)", "Θ(n^2.5)", "Θ(n^3)"],
    correctIndex: 2,
    correctAnswer: "Θ(n^2.5)",
    solutionStepsAr: [
      "1) a = 9, b = 3, f(n) = n^2.5.",
      "2) الحد الحرج: n^(log_3 9) = n^2.",
      "3) بما أن f(n) = n^2.5 أكبر بأس من n^2 (ε = 0.5) وشرط الانتظام 9(n/3)^2.5 = (9/3^2.5)n^2.5 ≤ δ n^2.5 متحقق (δ < 1) ← Case 3 ← Θ(n^2.5).",
    ],
  },
  {
    id: "ai-pr-16",
    chapterNumber: 4,
    problemType: "Change of Variables Recurrence (z = lg n, Ch4 Style)",
    difficulty: "Hard",
    question:
      "Solve the recurrence T(n) = 2T(n^(1/2)) + lg n from the end of Chapter 4 by substituting z = lg n:",
    options: [
      "O(lg n)",
      "O(lg n * lg(lg n))",
      "O(n lg n)",
      "O(√n lg n)",
    ],
    correctIndex: 1,
    correctAnswer: "O(lg n * lg(lg n))",
    solutionStepsAr: [
      "1) نفرض z = lg n ← إذن n = 2^z و n^(1/2) = 2^(z/2).",
      "2) نعرف S(z) = T(2^z) فتصبح المعادلة: S(z) = 2S(z/2) + z.",
      "3) بـ Master Theorem على S(z): a=2, b=2 ← z^(log_2 2) = z^1، و f(z) = z ← Case 2 (k=0) ← S(z) = Θ(z lg z).",
      "4) نرجع z = lg n ← T(n) = O(lg n * lg(lg n)).",
    ],
  },
  {
    id: "ai-pr-17",
    chapterNumber: 4,
    problemType: "Recursion Tree Per-Level Cost (Ch4 Style)",
    difficulty: "Medium",
    question:
      "In the recursion tree for T(n) = 3T(n/4) + cn^2 (from Chapter 4, page 58), what is the total cost of all nodes at depth i = 1 (the children of the root)?",
    options: ["(3/4) cn^2", "(3/16) cn^2", "3 cn^2", "(1/4) cn^2"],
    correctIndex: 1,
    correctAnswer: "(3/16) cn^2",
    solutionStepsAr: [
      "1) الجذر (depth 0) له 3 أبناء في المستوى الأول (depth 1).",
      "2) حجم المشكلة في كل ابن هو n/4، فتكلفة الابن الواحد = c(n/4)^2 = (1/16)cn^2.",
      "3) مجموع تكلفة الـ 3 أبناء في المستوى الأول = 3 × (1/16)cn^2 = (3/16)cn^2.",
    ],
  },

  // ==================== Chapter 5 (3 Problems) ====================
  {
    id: "ai-pr-18",
    chapterNumber: 5,
    problemType: "Lomuto PARTITION Trace (Ch5 Style)",
    difficulty: "Medium",
    question:
      "When running the Lomuto PARTITION procedure (from Chapter 5, Figure 5.2) on A = [2, 8, 7, 1, 3, 5, 6, 4] with pivot x = 4, what is the final partitioned array?",
    options: [
      "[1, 2, 3, 4, 5, 6, 7, 8]",
      "[2, 1, 3, 4, 7, 5, 6, 8]",
      "[3, 2, 1, 4, 8, 7, 6, 5]",
      "[2, 1, 3, 4, 8, 7, 5, 6]",
    ],
    correctIndex: 1,
    correctAnswer: "[2, 1, 3, 4, 7, 5, 6, 8]",
    solutionStepsAr: [
      "1) الـ Pivot هو آخر عنصر x = 4، والمؤشر i يقف عند العناصر ≤ 4 بالترتيب: 2 ثم 1 ثم 3.",
      "2) قبل التبديل الأخير للمحور تكون المصفوفة: [2, 1, 3, 8, 7, 5, 6, 4] و i = 3.",
      "3) نبدل A[i+1] (اللي هو A[4] = 8) مع الـ Pivot (A[8] = 4) فنحصل على [2, 1, 3, 4, 7, 5, 6, 8].",
    ],
  },
  {
    id: "ai-pr-19",
    chapterNumber: 5,
    problemType: "RANDOMIZED-SELECT Index Calculation (Ch5 Style)",
    difficulty: "Medium",
    question:
      "In RANDOMIZED-SELECT(A, p, r, i) with p = 1, r = 10, and i = 7 (looking for the 7th smallest element), suppose RANDOMIZED-PARTITION returns pivot index q = 4. What are the parameters of the next recursive call?",
    codeOrFormula:
      "k <- q - p + 1\nif i = k then return A[q]\nelseif i < k then return RANDOMIZED-SELECT(A, p, q - 1, i)\nelse return RANDOMIZED-SELECT(A, q + 1, r, i - k)",
    options: [
      "RANDOMIZED-SELECT(A, 1, 3, 7)",
      "RANDOMIZED-SELECT(A, 5, 10, 7)",
      "RANDOMIZED-SELECT(A, 5, 10, 3)",
      "RANDOMIZED-SELECT(A, 4, 10, 3)",
    ],
    correctIndex: 2,
    correctAnswer: "RANDOMIZED-SELECT(A, 5, 10, 3)",
    solutionStepsAr: [
      "1) نحسب عدد عناصر النص الشمال شاملة الـ Pivot: k = q - p + 1 = 4 - 1 + 1 = 4.",
      "2) نقارن المطلوب i = 7 مع k = 4: بما أن i > k، ندخل على النص اليمين من q + 1 = 5 إلى r = 10.",
      "3) الترتيب الجديد المطلوب داخل النص اليمين هو i - k = 7 - 4 = 3 ← النداء هو RANDOMIZED-SELECT(A, 5, 10, 3).",
    ],
  },
  {
    id: "ai-pr-20",
    chapterNumber: 5,
    problemType: "9-to-1 Proportional Split Tree Depth (Ch5 Style)",
    difficulty: "Hard",
    question:
      "In Figure 5.5 of Chapter 5, when Quicksort always produces a 9-to-1 split (T(n) ≤ T(9n/10) + T(n/10) + cn), at what minimum depth and maximum depth does the recursion tree reach boundary conditions (size 1)?",
    options: [
      "Min depth: log_2(n), Max depth: n",
      "Min depth: log_10(n), Max depth: log_{10/9}(n)",
      "Min depth: n/10, Max depth: 9n/10",
      "Min depth: 1, Max depth: lg n",
    ],
    correctIndex: 1,
    correctAnswer: "Min depth: log_10(n), Max depth: log_{10/9}(n)",
    solutionStepsAr: [
      "1) الفرع الأسرع بيقسم على 10 في كل خطوة (n / 10^i = 1) فيوصل للـ leaf عند عمق i = log_10(n).",
      "2) الفرع الأطول بيضرب في 9/10 في كل خطوة (n * (9/10)^i = 1) فيوصل للـ leaf عند عمق i = log_{10/9}(n).",
      "3) كلا العمقين هما Θ(lg n)، وبالتالي التكلفة الكلية تظل O(n lg n).",
    ],
  },

  // ==================== Chapter 6 (4 Problems) ====================
  {
    id: "ai-pr-21",
    chapterNumber: 6,
    problemType: "Heap Index Calculations (PARENT, LEFT, RIGHT)",
    difficulty: "Easy",
    question:
      "In a 1-indexed binary heap stored in array A[1..15], for the node at index i = 5, what are the indices of its PARENT, LEFT child, and RIGHT child?",
    options: [
      "PARENT = 2, LEFT = 10, RIGHT = 11",
      "PARENT = 3, LEFT = 10, RIGHT = 11",
      "PARENT = 2, LEFT = 9, RIGHT = 10",
      "PARENT = 2, LEFT = 11, RIGHT = 12",
    ],
    correctIndex: 0,
    correctAnswer: "PARENT = 2, LEFT = 10, RIGHT = 11",
    solutionStepsAr: [
      "1) PARENT(5) = ⌊5 / 2⌋ = 2.",
      "2) LEFT(5) = 2 × 5 = 10.",
      "3) RIGHT(5) = 2 × 5 + 1 = 11.",
    ],
  },
  {
    id: "ai-pr-22",
    chapterNumber: 6,
    problemType: "Height of a Heap (Theorem 6.1)",
    difficulty: "Easy",
    question:
      "According to Theorem 6.1 (height = ⌊lg n⌋), what is the height of a binary heap containing n = 14 elements?",
    options: ["2", "3", "4", "7"],
    correctIndex: 1,
    correctAnswer: "3",
    solutionStepsAr: [
      "1) نطبق القانون المباشر من Theorem 6.1: h = ⌊lg n⌋.",
      "2) بما أن 2^3 = 8 و 2^4 = 16، فإن lg(14) ≈ 3.8.",
      "3) إذن ⌊3.8⌋ = 3.",
    ],
  },
  {
    id: "ai-pr-23",
    chapterNumber: 6,
    problemType: "Trace MAX-HEAPIFY (Ch6 Style)",
    difficulty: "Medium",
    question:
      "Given the array A = [16, 4, 10, 14, 7, 9, 3, 2, 8, 1] (1-indexed, heap-size = 10) from Figure 6.2 in Chapter 6, what is the resulting array after calling MAX-HEAPIFY(A, 2)?",
    options: [
      "[16, 14, 10, 4, 7, 9, 3, 2, 8, 1]",
      "[16, 14, 10, 8, 7, 9, 3, 2, 4, 1]",
      "[16, 10, 14, 8, 7, 9, 3, 2, 4, 1]",
      "[16, 14, 10, 8, 7, 9, 3, 4, 2, 1]",
    ],
    correctIndex: 1,
    correctAnswer: "[16, 14, 10, 8, 7, 9, 3, 2, 4, 1]",
    solutionStepsAr: [
      "1) عند i = 2 (القيمة 4): الأبناء هما A[4]=14 و A[5]=7 ← نبدل 4 مع الأكبر 14.",
      "2) ننزل لـ i = 4 (القيمة 4): الأبناء هما A[8]=2 و A[9]=8 ← نبدل 4 مع الأكبر 8.",
      "3) ننزل لـ i = 9 (القيمة 4): ليس لها أبناء (2×9 = 18 > 10) فتتوقف الخوارزمية وتصبح المصفوفة [16, 14, 10, 8, 7, 9, 3, 2, 4, 1].",
    ],
  },
  {
    id: "ai-pr-24",
    chapterNumber: 6,
    problemType: "Trace BUILD-MAX-HEAP (Ch6 Style)",
    difficulty: "Medium",
    question:
      "Perform BUILD-MAX-HEAP on the 6-element array A = [3, 5, 9, 6, 8, 20] (1-indexed). What is the final Max-Heap array?",
    options: [
      "[20, 8, 9, 6, 5, 3]",
      "[20, 9, 8, 6, 5, 3]",
      "[20, 6, 9, 3, 8, 5]",
      "[9, 8, 20, 6, 5, 3]",
    ],
    correctIndex: 0,
    correctAnswer: "[20, 8, 9, 6, 5, 3]",
    solutionStepsAr: [
      "1) نبدأ من i = ⌊6/2⌋ = 3 نزولاً إلى 1.",
      "2) عند i = 3 (A[3]=9): ابنها الوحيد l=6 (A[6]=20) أكبر منها ← نبدل 9 مع 20 ← [3, 5, 20, 6, 8, 9].",
      "3) عند i = 2 (A[2]=5): أبناؤها l=4 (6) و r=5 (8) ← الأكبر 8 ← نبدل 5 مع 8 ← [3, 8, 20, 6, 5, 9].",
      "4) عند i = 1 (A[1]=3): أبناؤها l=2 (8) و r=3 (20) ← الأكبر 20 ← نبدل 3 مع 20، ثم عند i=3 ابنها A[6]=9 أكبر من 3 ← نبدل 3 مع 9 ← [20, 8, 9, 6, 5, 3].",
    ],
  },
];