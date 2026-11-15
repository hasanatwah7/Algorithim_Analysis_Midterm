export interface TheoryConcept {
  id: string;
  title: string;
  contentAr: string;
  keyTerms: string[];
  formulas?: string[];
  importantNoteAr?: string;
}

export interface WorkedExample {
  problem: string;
  solutionStepsAr: string[];
  finalAnswer: string;
}

export interface PracticalPattern {
  id: string;
  problemType: string;
  stepsAr: string[];
  workedExample: WorkedExample;
}

export interface ChapterData {
  id: string;
  number: number;
  title: string;
  titleAr: string;
  summaryAr: string;
  theory: TheoryConcept[];
  practical: PracticalPattern[];
  quizQuestionIds: string[];
}

export interface QuizQuestion {
  id: string;
  source: "Exercise 1" | "Exercise 2" | "Exercise 3";
  questionNumber: number;
  chapterNumber: number | "general";
  importanceTier: 1 | 2 | 3;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  correctAnswer: string;
  explanationAr: string;
}

export const chapters: ChapterData[] = [
  {
    id: "ch-1",
    number: 1,
    title: "Preliminaries for Analysis of Algorithms",
    titleAr: "مقدمات تحليل الخوارزميات والمراجعة الرياضية",
    summaryAr:
      "مراجعة أساسية لقوانين المجموع واللوغاريتمات، طرق الإثبات (خصوصاً Induction)، الاحتمالات والقيمة المتوقعة، وهياكل البيانات الأولية.",
    theory: [
      {
        id: "ch1-t1",
        title: "Why Analyze Algorithms?",
        contentAr:
          "تحليل الخوارزميات هدفه نقيس كفاءة الخوارزمية ونقارنها بغيرها نظرياً وعملياً، بحيث التحليل يكون Machine-independent (ميعتمدش على الجهاز أو لغة البرمجة) ويحسب استهلاك الموارد (Resource utilization).",
        keyTerms: ["Machine-independent", "Resource utilization"],
      },
      {
        id: "ch1-t2",
        title: "Summations, Logarithms & Floor/Ceiling",
        contentAr:
          "القوانين الرياضية الأساسية المستخدمة في تحليل التعقيد: المتسلسلة الحسابية والهندسية، قوانين اللوغاريتمات الخمسة، ودوال التقريب Floor و Ceiling.",
        keyTerms: ["Arithmetic Series", "Geometric Series", "Floor", "Ceiling"],
        formulas: [
          "\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}",
          "\\sum_{i=1}^{n} a^i = \\frac{a(a^n - 1)}{a - 1} \\quad (a \\neq 1)",
          "\\log_b(ac) = \\log_b a + \\log_b c",
          "\\log_b(a/c) = \\log_b a - \\log_b c",
          "\\log_b(a^c) = c\\log_b a",
          "\\log_b a = \\frac{\\log_c a}{\\log_c b}",
          "b^{\\log_c a} = a^{\\log_c b}",
        ],
        importantNoteAr:
          "في السلايد ص 3 مكتوبة المتسلسلة الهندسية بمقام (1-1) بالغلط، والمقام الصحيح هو (1-a).",
      },
      {
        id: "ch1-t3",
        title: "Simple Justification Techniques",
        contentAr:
          "ثلاث طرق رئيسية للإثبات: By Example (مثال أو Counterexample)، Contrapositives & Contradiction (العكس الموجب والتناقض)، و Induction (الاستقراء الرياضي).",
        keyTerms: ["By Example", "Contrapositive", "Contradiction", "Induction"],
      },
      {
        id: "ch1-t4",
        title: "Basic Probability & Expectation",
        contentAr:
          "الفضاء العيني S والحدث A، الاحتمال الشرطي، المتغيرات العشوائية (Indicator Random Variable قيمته 0 أو 1)، والقيمة المتوقعة E(X) وخاصية الخطية Linearity of Expectation.",
        keyTerms: [
          "Sample Space",
          "Conditional Probability",
          "Indicator Random Variable",
          "Linearity of Expectation",
        ],
        formulas: [
          "Pr(A|B) = \\frac{Pr(A \\cap B)}{Pr(B)}",
          "E(X) = \\sum_x x \\cdot Pr(X = x)",
          "E(X + Y) = E(X) + E(Y)",
          "E(XY) = E(X)E(Y) \\quad (\\text{if independent})",
        ],
      },
      {
        id: "ch1-t5",
        title: "Elementary Data Structures",
        contentAr:
          "الـ Stack (LIFO: PUSH/POP)، الـ Queue (FIFO: ENQUEUE/DEQUEUE بـ Circular Array)، الـ Doubly Linked List (LIST-INSERT بـ O(1)، و LIST-DELETE بـ O(1) لو معاك pointer أو Θ(n) لو معاك key)، وتمثيل الأشجار العامة بـ Left-Child, Right-Sibling بمساحة O(n).",
        keyTerms: [
          "Stack (LIFO)",
          "Queue (FIFO)",
          "Doubly Linked List",
          "Left-Child Right-Sibling",
        ],
        importantNoteAr:
          "تريك الامتحان: LIST-DELETE بتاخد O(1) لو معاك pointer للـ node، لكن Θ(n) لو معاك الـ key بس لأنك هتدور عليها الأول بـ LIST-SEARCH.",
      },
    ],
    practical: [
      {
        id: "ch1-p1",
        problemType: "Proof by Induction (الاستقراء الرياضي)",
        stepsAr: [
          "الخطوة 1 (Basis): عوض بأصغر قيمة مسموحة لـ n واتأكد إن المتباينة أو المعادلة صح.",
          "الخطوة 2 (Inductive Hypothesis): اكتب جملة ثابتة 'Assume the claim holds for n' (أو لكل i < n لو بتعتمد على خطوتين ورا).",
          "الخطوة 3 (Inductive Step): اكتب المطلوب لـ n+1 (أو n)، افصله لجزء تعوض فيه بالفرضية + الباقي، وبسّط جبرياً.",
        ],
        workedExample: {
          problem:
            "أثبت بالـ Induction أن متتالية فيبوناتشي F(1)=1, F(2)=2, F(n)=F(n-1)+F(n-2) تحقق F(n) < 2^n لكل n ≥ 1.",
          solutionStepsAr: [
            "Basis: عند n=1: F(1) = 1 < 2^1 = 2 (صح). وعند n=2: F(2) = 2 < 2^2 = 4 (صح).",
            "Inductive Hypothesis: نفرض أن F(i) < 2^i صحيحة لكل i < n (حيث n > 2).",
            "Inductive Step: لـ n > 2، F(n) = F(n-1) + F(n-2) < 2^{n-1} + 2^{n-2} < 2^{n-1} + 2^{n-1} = 2 × 2^{n-1} = 2^n.",
          ],
          finalAnswer: "تم الإثبات: F(n) < 2^n لكل n ≥ 1.",
        },
      },
      {
        id: "ch1-p2",
        problemType: "Conditional Probability (الاحتمال الشرطي السريع)",
        stepsAr: [
          "الخطوة 1: حدد عدد حالات الحدث المشروط B لوحده.",
          "الخطوة 2: عدّ كام حالة من حالات B بتحقق الحدث A في نفس الوقت (A ∩ B).",
          "الخطوة 3: اقسم عدد حالات (A ∩ B) على عدد حالات B مباشرة.",
        ],
        workedExample: {
          problem:
            "عند رمي زهرتي نرد، ما احتمال أن يكون مجموعهما 10 (الحدث A) علماً بأن الزهرة الأولى ظهرت 6 (الحدث B)؟",
          solutionStepsAr: [
            "حالات B (الأولى = 6): هي 6 حالات فقط: (6,1), (6,2), (6,3), (6,4), (6,5), (6,6)، أي Pr(B) = 1/6.",
            "حالات (A ∩ B) (المجموع = 10 والأولى = 6): حالة واحدة فقط هي (6,4)، أي Pr(A ∩ B) = 1/36.",
            "نقسم: Pr(A|B) = (1/36) / (1/6) = 1/6.",
          ],
          finalAnswer: "1/6",
        },
      },
    ],
    quizQuestionIds: ["ex3-q3", "ex1-q3", "ex1-q6"],
  },
  {
    id: "ch-2",
    number: 2,
    title: "Sort of Algorithms (Analysis Fundamentals & Classic Examples)",
    titleAr: "مقدمة تحليل الخوارزميات وخوارزميات أساسية",
    summaryAr:
      "نموذج RAM، عدّ الـ Primitive Operations، إثبات صحة الـ Loops بالـ Loop Invariant، تحليل Insertion Sort، Binary Search، Euclid GCD، و Matrix Multiplication.",
    theory: [
      {
        id: "ch2-t1",
        title: "Algorithm, Scalability & RAM Model",
        contentAr:
          "الخوارزمية خطوات finite, deterministic, effective. الـ Scalability هي قدرة الخوارزمية على التعامل مع زيادة حجم البيانات. نموذج RAM بيفترض إن كل عملية أولية (Primitive Operation) بتاخد وقت ثابت مستقل عن حجم الـ input.",
        keyTerms: [
          "Scalability",
          "RAM Model",
          "Primitive Operations",
          "Worst-Case Analysis",
        ],
      },
      {
        id: "ch2-t2",
        title: "Loop Invariant (3 Parts)",
        contentAr:
          "أداة إثبات صحة أي Loop من 3 مراحل: Initialization (قبل أول لفة)، Maintenance (لو صح قبل اللفة يفضل صح بعدها)، Termination (عند انتهاء الـ Loop يضمن صحة النتيجة).",
        keyTerms: ["Initialization", "Maintenance", "Termination"],
      },
      {
        id: "ch2-t3",
        title: "Insertion Sort & Inversions",
        contentAr:
          "الـ Inversion هو زوج عناصر في ترتيب عكسي. المصفوفة تكون Partially sorted لو عدد الـ inversions فيها أقل من ثابت في n. Best case (مرتبة) = O(n)، Worst case (مرتبة عكسياً) = O(n^2).",
        keyTerms: ["Inversion", "Partially Sorted Array", "Insertion Sort"],
        formulas: [
          "\\text{Best Case: } T(n) = an + b = O(n)",
          "\\text{Worst Case: } T(n) = an^2 + bn + c = O(n^2)",
        ],
      },
      {
        id: "ch2-t4",
        title: "Divide & Conquer and Key Algorithms Summary",
        contentAr:
          "مقارنة تعقيد خوارزميات الشابتر: Maxsub (O(n^3) → O(n^2) → O(n))، ArrayMax (5n best / 7n-2 worst)، BinarySearch (O(lg n))، EuclidGCD (أقل من log max(a,b))، SimpleTextSearch (O(M(N-M+1)))، و Matrix Product العادي و D&C الساذج (الاتنين Θ(n^3)).",
        keyTerms: ["Divide and Conquer", "Binary Search", "EuclidGCD", "Matrix Product"],
      },
    ],
    practical: [
      {
        id: "ch2-p1",
        problemType: "عدّ الـ Primitive Operations لـ Loop (زي Insertion Sort / ArrayMax)",
        stepsAr: [
          "الخطوة 1: السطور خارج الـ Loop تتعد بـ 1.",
          "الخطوة 2: رأس الـ for-loop بيتعد n مرات، وجسمه (n-1) مرات.",
          "الخطوة 3: لو في while-loop داخلي، افرض عدد لفاته t_j. في الـ Best Case عوض t_j = 1، وفي الـ Worst Case عوض t_j = j واستخدم قانون المجموع.",
        ],
        workedExample: {
          problem: "احسب تعقيد INSERTION-SORT في الـ Best Case والـ Worst Case.",
          solutionStepsAr: [
            "معادلة التكلفة العامة: T(n) = c1*n + c2*(n-1) + c3*(n-1) + c4*Σt_j + c5*Σ(t_j-1) + c6*Σ(t_j-1) + c7*(n-1).",
            "Best Case (مصفوفة مرتبة): الشرط A[i] > key بيفشل فوراً، فـ t_j = 1 لكل j. إذن Σt_j = n-1 و Σ(t_j-1) = 0، والناتج معادلة خطية an + b = O(n).",
            "Worst Case (مرتبة عكسياً): t_j = j، إذن Σt_j = n(n+1)/2 - 1 و Σ(t_j-1) = n(n-1)/2، والناتج معادلة تربيعية an^2 + bn + c = O(n^2).",
          ],
          finalAnswer: "Best Case = O(n), Worst Case = O(n^2)",
        },
      },
      {
        id: "ch2-p2",
        problemType: "تتبع Binary Search (1-indexed)",
        stepsAr: [
          "الخطوة 1: ابدأ بـ low = 1 و high = n.",
          "الخطوة 2: احسب mid = floor((low + high) / 2) وقارن A[mid] بالمطلوب.",
          "الخطوة 3: لو المطلوب أكبر حرك low = mid + 1، ولو أصغر حرك high = mid - 1، وسجل قيمة A[mid] في كل لفة.",
        ],
        workedExample: {
          problem:
            "في المصفوفة A = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]، ما هي العناصر التي تتم مقارنتها مع الرقم 8؟",
          solutionStepsAr: [
            "اللفة 1: low=1, high=12 → mid = floor(13/2) = 6 → نقارن مع A[6] = 6 (8 > 6، إذن low = 7).",
            "اللفة 2: low=7, high=12 → mid = floor(19/2) = 9 → نقارن مع A[9] = 9 (8 < 9، إذن high = 8).",
            "اللفة 3: low=7, high=8 → mid = floor(15/2) = 7 → نقارن مع A[7] = 7 (8 > 7، إذن low = 8).",
            "اللفة 4: low=8, high=8 → mid = 8 → نقارن مع A[8] = 8 (تم إيجاده).",
          ],
          finalAnswer: "{6, 9, 7, 8}",
        },
      },
      {
        id: "ch2-p3",
        problemType: "استنتاج الـ Recurrence Relation من كود Recursive",
        stepsAr: [
          "الخطوة 1: عدّ الكود بينادي نفسه كام مرة (ده المعامل a).",
          "الخطوة 2: شوف حجم المدخل بيقل إزاي في النداء (n-1 ولا n/2).",
          "الخطوة 3: احسب تكلفة الشغل غير التكراري بره النداء (O(1) ولا O(n)).",
        ],
        workedExample: {
          problem:
            "استنتج معادلة التكرار لـ recursiveMax(A, n) التي تقارن max(recursiveMax(A, n-1), A[n-1]).",
          solutionStepsAr: [
            "عدد الاستدعاءات في الـ return = استدعاء واحد (a = 1).",
            "حجم المشكلة ينقص بمقدار 1 ← T(n-1).",
            "المقارنة بين رقمين تأخذ وقت ثابت O(1).",
          ],
          finalAnswer: "T(n) = T(n - 1) + O(1)",
        },
      },
    ],
    quizQuestionIds: [
      "ex1-q2",
      "ex1-q4",
      "ex1-q7",
      "ex1-q8",
      "ex2-q4",
      "ex2-q8",
      "ex3-q7",
    ],
  },
  {
    id: "ch-3",
    number: 3,
    title: "Growth Functions of Algorithm",
    titleAr: "دوال النمو ورموز التقارب (Asymptotic Notations)",
    summaryAr:
      "دراسة كفاءة الخوارزميات عند n → ∞ باستخدام Θ و O و Ω و o و ω، ترتيب معدلات النمو، إثباتات الثوابت c1, c2, n0، وفكرة Potential Function.",
    theory: [
      {
        id: "ch3-t1",
        title: "The 5 Asymptotic Notations",
        contentAr:
          "Θ(g(n)) حد محكم (أعلى وأسفل معاً)، O(g(n)) حد أعلى (≤)، Ω(g(n)) حد أسفل (≥)، o(g(n)) أصغر قطعياً (النهاية = 0)، و ω(g(n)) أكبر قطعياً (النهاية = ∞). يشترط أن تكون الدوال asymptotically nonnegative.",
        keyTerms: ["Big-Theta", "Big-Oh", "Big-Omega", "Little-oh", "Little-omega"],
        formulas: [
          "f(n) = \\Theta(g(n)) \\iff f(n) = O(g(n)) \\text{ and } f(n) = \\Omega(g(n))",
          "f(n) = o(g(n)) \\iff \\lim_{n\\to\\infty} \\frac{f(n)}{g(n)} = 0",
        ],
        importantNoteAr:
          "تريك: الثوابت المخفية الضخمة زي 10^100 * n نظرياً Θ(n) لكن عملياً 10n log n أسرع للأحجام العملية.",
      },
      {
        id: "ch3-t2",
        title: "Important Asymptotic Facts & Growth Order",
        contentAr:
          "أي كثيرة حدود من الدرجة k هي Θ(n^k). أساس اللوغاريتم لا يؤثر في Θ/O/Ω. إثبات مهم: lg(n!) = Θ(n lg n) (جزء الـ Ω مثبت لـ n ≥ 4 و lg n > 2 عند n > 4).",
        keyTerms: ["Polynomial Growth", "Change of Base", "lg(n!)", "Potential Function"],
        formulas: [
          "\\log n \\prec \\log^2 n \\prec \\sqrt{n} \\prec n \\prec n\\log n \\prec n^2 \\prec n^3 \\prec 2^n",
          "\\lg(n!) = \\Theta(n\\lg n)",
          "\\hat{t}_i = t_i + \\Phi_i - \\Phi_{i-1}",
        ],
      },
    ],
    practical: [
      {
        id: "ch3-p1",
        problemType: "إيجاد الثوابت c1, c2, n0 لإثبات Θ(g(n))",
        stepsAr: [
          "الخطوة 1: اكتب المتباينة c1*g(n) ≤ f(n) ≤ c2*g(n).",
          "الخطوة 2: اقسم كل الأطراف على g(n).",
          "الخطوة 3: اختار c2 ≥ معامل أكبر أس، وجرب قيم n لحد ما الطرف الأوسط يبقى موجب لاختيار c1 و n0.",
        ],
        workedExample: {
          problem: "أثبت بالتعريف الرسمي أن (1/2)n^2 - 3n = Θ(n^2).",
          solutionStepsAr: [
            "نكتب: c1*n^2 ≤ (1/2)n^2 - 3n ≤ c2*n^2.",
            "نقسم على n^2: c1 ≤ 1/2 - 3/n ≤ c2.",
            "للطرف الأيمن: 1/2 - 3/n ≤ 1/2 دائماً لكل n ≥ 1 ← نختار c2 = 1/2.",
            "للطرف الأيسر: نجرب n = 7 ← 1/2 - 3/7 = 1/14 > 0 ← نختار c1 = 1/14 و n0 = 7.",
          ],
          finalAnswer: "c1 = 1/14, c2 = 1/2, n0 = 7",
        },
      },
      {
        id: "ch3-p2",
        problemType: "إيجاد نقطة التقاطع n0 لمقارنة خوارزميتين",
        stepsAr: [
          "الخطوة 1: اكتب المتباينة T_A(n) < T_B(n).",
          "الخطوة 2: بسّط المتباينة (اقسم على n لو مشتركة).",
          "الخطوة 3: عوض بالاختيارات لإيجاد أصغر n يحقق المتباينة.",
        ],
        workedExample: {
          problem:
            "الخوارزمية A تحتاج 10 n lg n عملية، والخوارزمية B تحتاج n^2 عملية. أوجد n0 بحيث A أفضل من B لكل n ≥ n0 (من الاختيارات: 10, 20, 30, 60).",
          solutionStepsAr: [
            "نكتب: 10 n lg n < n^2 ← نقسم على n ← 10 lg n < n.",
            "نجرب n = 30: 10 * lg(30) ≈ 10 * 4.91 = 49.1 > 30 (خطأ).",
            "نجرب n = 60: 10 * lg(60) ≈ 10 * 5.91 = 59.1 < 60 (صح).",
          ],
          finalAnswer: "n0 = 60",
        },
      },
    ],
    quizQuestionIds: ["ex1-q6", "ex2-q2", "ex2-q5", "ex3-q2"],
  },
  {
    id: "ch-4",
    number: 4,
    title: "Recurrences and The Master Theorem",
    titleAr: "معادلات التكرار ونظرية الماستر (Master Theorem)",
    summaryAr:
      "تحليل Merge Sort وحل معادلات التكرار بـ 4 طرق: Iterative Substitution، Recursion Tree، Guess-and-Test، و Master Theorem (مع تريك z = lg n).",
    theory: [
      {
        id: "ch4-t1",
        title: "Merge Sort & Its Tree",
        contentAr:
          "Merge Sort يعتمد على Divide and Conquer. دمج مصفوفتين بـ merge يأخذ O(n) باستخدام Sentinel (∞). ارتفاع شجرة Merge-Sort هو lg n والشغل بكل مستوى O(n) فالإجمالي O(n lg n). عيبه في Big Data هو الـ Space Complexity (O(n) extra memory).",
        keyTerms: ["Merge Sort", "Sentinel", "Space Complexity", "O(n lg n)"],
      },
      {
        id: "ch4-t2",
        title: "Solving Recurrences (4 Methods)",
        contentAr:
          "1) Iterative Substitution: فك المعادلة للوصول لنمط. 2) Recursion Tree: شجرة بصرية، أقصى عدد أوراق n^(log_b a). 3) Guess-and-Test: تخمين وإثبات بالاستقراء (لو فشل بحد صغير نطرحه من الفرض). 4) Master Theorem لـ T(n)=aT(n/b)+f(n).",
        keyTerms: [
          "Iterative Substitution",
          "Recursion Tree",
          "Guess-and-Test",
          "Master Theorem",
        ],
        formulas: [
          "\\text{Case 1: } f(n) = O(n^{\\log_b a - \\epsilon}) \\implies T(n) = \\Theta(n^{\\log_b a})",
          "\\text{Case 2: } f(n) = \\Theta(n^{\\log_b a} \\log^k n) \\implies T(n) = \\Theta(n^{\\log_b a} \\log^{k+1} n)",
          "\\text{Case 3: } f(n) = \\Omega(n^{\\log_b a + \\epsilon}) \\text{ & } af(n/b) \\le \\delta f(n) \\implies T(n) = \\Theta(f(n))",
        ],
      },
    ],
    practical: [
      {
        id: "ch4-p1",
        problemType: "حل Recurrence بـ Master Theorem (وتريك z = lg n)",
        stepsAr: [
          "الخطوة 1: طلع a و b و f(n).",
          "الخطوة 2: احسب الحد الحرج n^(log_b a).",
          "الخطوة 3: قارن أس f(n) مع log_b a لتحديد Case 1 أو 2 أو 3.",
          "الخطوة 4 (لو فيه √n): عوض z = lg n ← n = 2^z وحل S(z) بالـ Master Theorem ثم رجع z.",
        ],
        workedExample: {
          problem: "حل T(n) = 2T(√n) + O(1) باستخدام التعويض z = lg n.",
          solutionStepsAr: [
            "نفرض z = lg n إذن n = 2^z و √n = 2^(z/2).",
            "نضع S(z) = T(2^z) ← تصبح المعادلة S(z) = 2S(z/2) + O(1).",
            "نطبق Master Theorem: a=2, b=2 ← z^(log_2 2) = z^1. وبما أن f(z)=O(1) أصغر بأس ← Case 1 ← S(z) = Θ(z).",
            "نرجع z = lg n ← T(n) = O(lg n).",
          ],
          finalAnswer: "O(lg n)",
        },
      },
      {
        id: "ch4-p2",
        problemType: "حل T(n-1) بـ Iterative Substitution",
        stepsAr: [
          "الخطوة 1: فك المعادلة 3 مرات لكشف النمط.",
          "الخطوة 2: اجمع الحدود الخارجة في صورة Σ.",
          "الخطوة 3: طبق قانون المجموع المناسب (ثابت ← n، i ← n^2، i^2 ← n^3، 2^i ← 2^n).",
        ],
        workedExample: {
          problem: "حل T(n) = T(n - 1) + 2^n حيث n > 0.",
          solutionStepsAr: [
            "T(n) = T(n-1) + 2^n = T(n-2) + 2^{n-1} + 2^n = ... = T(0) + Σ_{i=1..n} 2^i.",
            "مجموع المتسلسلة الهندسية = 2(2^n - 1) = 2^{n+1} - 2.",
            "الحد المسيطر هو 2^n.",
          ],
          finalAnswer: "O(2^n)",
        },
      },
    ],
    quizQuestionIds: [
      "ex1-q3",
      "ex1-q5",
      "ex2-q1",
      "ex2-q3",
      "ex2-q6",
      "ex2-q7",
      "ex2-q10",
      "ex3-q1",
      "ex3-q4",
      "ex3-q6",
    ],
  },
  {
    id: "ch-5",
    number: 5,
    title: "Quick Sort and Selection",
    titleAr: "الترتيب السريع (Quicksort) والاختيار الخطي (Selection)",
    summaryAr:
      "خوارزمية Quicksort و PARTITION، تحليل الـ Worst Case والـ Proportional Splits والـ Randomized Quicksort، و RANDOMIZED-SELECT لإيجاد العنصر رقم i في وقت خطي.",
    theory: [
      {
        id: "ch5-t1",
        title: "Quicksort & In-Place Partitioning",
        contentAr:
          "Quicksort يعتمد على Divide and Conquer، وميزته الكبرى إنه In-place (مبيحجزش ذاكرة إضافية) ومتوسط مقارناته O(n lg n) بثوابت صغيرة. دالة PARTITION تاخد Θ(n) وتضع الـ Pivot في مكانه النهائي.",
        keyTerms: ["In-place", "Pivot", "PARTITION", "Combine (No work)"],
      },
      {
        id: "ch5-t2",
        title: "Performance Cases & Randomized Quicksort",
        contentAr:
          "Worst Case = Θ(n^2) لما المصفوفة تكون مرتبة أصلاً (تقسيم n-1 و 0: T(n) = T(n-1) + O(n)). Best Case أو أي تقسيم بنسبة ثابتة (زي 9:1 أو 99:1) = O(n lg n). RANDOMIZED-PARTITION يختار pivot عشوائي لتجنب الـ Worst Case، وإثبات المقارنات يعتمد على أن كل زوج عناصر يتقارن باحتمال 2/(j-i+1).",
        keyTerms: ["Worst-case Θ(n^2)", "9-to-1 split", "Randomized Quicksort", "Lemma 5.1"],
      },
      {
        id: "ch5-t3",
        title: "RANDOMIZED-SELECT (Linear Time Selection)",
        contentAr:
          "إيجاد العنصر رقم i (مثل الـ Median) في وقت متوقع Θ(n). الفرق عن Quicksort إن الـ Recursion بيتم على ناحية واحدة بس من الـ Partition. الـ Worst Case بتاعها لسه Θ(n^2).",
        keyTerms: ["Order Statistic", "RANDOMIZED-SELECT", "Expected Θ(n)"],
      },
    ],
    practical: [
      {
        id: "ch5-p1",
        problemType: "تتبع PARTITION(A, p, r) (Lomuto)",
        stepsAr: [
          "الخطوة 1: الـ Pivot x = A[r]، و i = p - 1، و j يمشي من p لـ r - 1.",
          "الخطوة 2: لو A[j] > x حرك j بس. لو A[j] ≤ x زود i واحد وبدل A[i] مع A[j].",
          "الخطوة 3: في النهاية بدل A[r] مع A[i + 1] ورجع i + 1.",
        ],
        workedExample: {
          problem: "نفذ PARTITION على المصفوفة A = [2, 8, 7, 1, 3, 5, 6, 4].",
          solutionStepsAr: [
            "x = 4, i = 0.",
            "j=1 (2≤4) → i=1, swap(2,2). j=2,3 (8,7>4) → تجاهل.",
            "j=4 (1≤4) → i=2, swap(8,1) → [2,1,7,8,3,5,6,4].",
            "j=5 (3≤4) → i=3, swap(7,3) → [2,1,3,8,7,5,6,4]. j=6,7 (5,6>4) → تجاهل.",
            "أخيراً بدل A[4]=8 مع Pivot=4 → [2, 1, 3, 4, 7, 5, 6, 8].",
          ],
          finalAnswer: "[2, 1, 3, 4, 7, 5, 6, 8] (q = 4)",
        },
      },
      {
        id: "ch5-p2",
        problemType: "تتبع RANDOMIZED-SELECT(A, p, r, i)",
        stepsAr: [
          "الخطوة 1: نفذ PARTITION للحصول على مكان الـ Pivot q.",
          "الخطوة 2: احسب k = q - p + 1.",
          "الخطوة 3: لو i == k رجع A[q]، لو i < k ادخل شمال بـ i، لو i > k ادخل يمين بـ (i - k).",
        ],
        workedExample: {
          problem:
            "أوجد العنصر الـ 3 الأصغر (i=3) في A = [2, 1, 3, 4, 7, 5, 6, 8] بعد أول Partition (q=4, p=1, r=8).",
          solutionStepsAr: [
            "k = 4 - 1 + 1 = 4.",
            "بما أن i=3 < k=4 → ندخل النص الشمال A[1..3] = [2, 1, 3] ونطلب i = 3.",
            "Partition على [2, 1, 3] بـ Pivot 3 → q = 3 ← k = 3.",
            "هنا i == k (3 == 3) ← نرجع A[3] = 3.",
          ],
          finalAnswer: "3",
        },
      },
    ],
    quizQuestionIds: ["ex3-q5", "ex3-q9", "ex3-q10"],
  },
  {
    id: "ch-6",
    number: 6,
    title: "Heap Sort",
    titleAr: "الترتيب بالكومة (Heapsort)",
    summaryAr:
      "بنية الـ Binary Heap (Max-Heap و Min-Heap)، قوانين الأب والأبناء، خوارزمية MAX-HEAPIFY في O(lg n)، بناء الكومة BUILD-MAX-HEAP في O(n)، و HEAPSORT في O(n lg n) In-place.",
    theory: [
      {
        id: "ch6-t1",
        title: "Binary Heap Structure & Properties",
        contentAr:
          "الـ Heap هي Array بتمثل شجرة ثنائية شبه مكتملة (Nearly complete binary tree). بتمتاز بخاصيتين: length[A] و heap-size[A]. الارتفاع لـ n عقدة هو ⌊lg n⌋ (Theorem 6.1). تجمع بين سرعة Merge Sort (O(n lg n)) وميزة Insertion Sort (In-place).",
        keyTerms: ["Max-Heap", "Min-Heap", "heap-size", "In-place O(n lg n)"],
        formulas: [
          "\\text{PARENT}(i) = \\lfloor i/2 \\rfloor",
          "\\text{LEFT}(i) = 2i",
          "\\text{RIGHT}(i) = 2i + 1",
          "\\text{Height} = \\lfloor \\lg n \\rfloor",
        ],
        importantNoteAr:
          "الـ Max-Heap شرطها A[PARENT(i)] ≥ A[i] (أكبر عنصر عند الجذر A[1]) وبتستخدم في Heapsort التصاعدي.",
      },
      {
        id: "ch6-t2",
        title: "MAX-HEAPIFY, BUILD-MAX-HEAP & HEAPSORT",
        contentAr:
          "MAX-HEAPIFY(A, i) بتنزل العنصر المخالف لتحت وتاخد O(lg n) (بمعادلة T(n) ≤ T(2n/3) + Θ(1)). BUILD-MAX-HEAP بتلف من ⌊n/2⌋ لـ 1 (لأن العناصر من ⌊n/2⌋+1 لـ n كلها Leaves) وتاخد وقت خطي O(n) مش O(n lg n)! خوارزمية HEAPSORT بتبني الكومة ثم تبدل الجذر بآخر عنصر وتنقص heap-size وتنادي MAX-HEAPIFY(A, 1) بإجمالي O(n lg n).",
        keyTerms: ["MAX-HEAPIFY O(lg n)", "BUILD-MAX-HEAP O(n)", "HEAPSORT O(n lg n)"],
      },
    ],
    practical: [
      {
        id: "ch6-p1",
        problemType: "تتبع MAX-HEAPIFY(A, i)",
        stepsAr: [
          "الخطوة 1: احسب l = 2i و r = 2i + 1 (شرط يكونوا ≤ heap-size).",
          "الخطوة 2: اختار أكبر قيمة بين A[i] و A[l] و A[r] وسمي مكانها largest.",
          "الخطوة 3: لو largest ≠ i، بدل A[i] مع A[largest] وكرر نفس الخطوات على index الـ largest.",
        ],
        workedExample: {
          problem:
            "تتبع MAX-HEAPIFY(A, 2) على المصفوفة A = [16, 4, 10, 14, 7, 9, 3, 2, 8, 1] (1-indexed, heap-size=10).",
          solutionStepsAr: [
            "عند i=2 (القيمة 4): ابناه l=4 (14) و r=5 (7). الأكبر هو A[4]=14 ← نبدل A[2] و A[4] فتصبح A[2]=14, A[4]=4.",
            "ننزل عند i=4 (القيمة 4): ابناه l=8 (2) و r=9 (8). الأكبر هو A[9]=8 ← نبدل A[4] و A[9] فتصبح A[4]=8, A[9]=4.",
            "ننزل عند i=9 (القيمة 4): ملهاش أبناء داخل heap-size=10 ← نتوقف.",
          ],
          finalAnswer: "[16, 14, 10, 8, 7, 9, 3, 2, 4, 1]",
        },
      },
      {
        id: "ch6-p2",
        problemType: "تطبيق BUILD-MAX-HEAP و HEAPSORT",
        stepsAr: [
          "الخطوة 1: ابدأ من i = floor(n/2) نزولاً إلى 1 ونفذ MAX-HEAPIFY(A, i) لبناء الـ Max-Heap.",
          "الخطوة 2 (للترتيب): بدل الجذر A[1] مع آخر عنصر A[heap-size].",
          "الخطوة 3: نقص heap-size بواحد، ونفذ MAX-HEAPIFY(A, 1)، وكرر حتى heap-size = 1.",
        ],
        workedExample: {
          problem: "ابني Max-Heap للمصفوفة A = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7] (n=10).",
          solutionStepsAr: [
            "نبدأ من i = floor(10/2) = 5 نزولاً إلى 1 (العناصر 6..10 أوراق).",
            "i=5 (16): أبناؤها A[10]=7 ← جاهزة.",
            "i=4 (2): أبناؤها 14, 8 ← تبديل مع 14 ← تصبح [..., 14, ..., 2].",
            "i=3 (3): أبناؤها 9, 10 ← تبديل مع 10.",
            "i=2 (1): تنزل مكان 16 ثم 7.",
            "i=1 (4): تنزل مكان 16 ثم 14 ثم 8 لتستقر الكومة.",
          ],
          finalAnswer: "[16, 14, 10, 8, 7, 9, 3, 2, 4, 1]",
        },
      },
    ],
    quizQuestionIds: [],
  },
];

export const quizQuestions: QuizQuestion[] = [
  // Exercise 1
  {
    id: "ex1-q2",
    source: "Exercise 1",
    questionNumber: 2,
    chapterNumber: 2,
    importanceTier: 1,
    question:
      "Suppose you are given the array A = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], and you then perform the binary search algorithm to find the number 8. Which numbers in the array A are compared against the number 8?",
    options: ["{7,10,8}", "{6,9,7,8}", "5, 9, 7, 8", "6, 10, 8"],
    correctIndex: 1,
    correctAnswer: "{6,9,7,8}",
    explanationAr:
      "باستخدام 1-indexed و mid = floor((low+high)/2): الخطوة 1 تقارن A[6]=6، الخطوة 2 تقارن A[9]=9، الخطوة 3 تقارن A[7]=7، الخطوة 4 تقارن A[8]=8.",
  },
  {
    id: "ex1-q3",
    source: "Exercise 1",
    questionNumber: 3,
    chapterNumber: 4,
    importanceTier: 1,
    question:
      "Consider the following recurrence equation, defining a function T(n) = T(n - 1) + n for n > 1 and O(1) otherwise, has time complexity",
    options: ["n lg(n + 1)", "n^2 - 1", "n(n + 1)/2", "n^2(n - 1)/2"],
    correctIndex: 2,
    correctAnswer: "n(n + 1)/2",
    explanationAr:
      "بفك التكرار T(n) = n + (n-1) + ... + 1 = Σi = n(n+1)/2 (من قوانين شابتر 1 وشابتر 4).",
  },
  {
    id: "ex1-q4",
    source: "Exercise 1",
    questionNumber: 4,
    chapterNumber: 2,
    importanceTier: 2,
    question: "The result of the following recursive algorithm if a = 49 and b = 35 is",
    codeSnippet:
      "Algorithm recursiveFunc(a, b)\nInput Two positive integers a and b\nif (a = b) then\n    return a\nreturn recursiveFunc(min(a, b), abs(b - a))",
    options: ["3", "7", "9", "1"],
    correctIndex: 1,
    correctAnswer: "7",
    explanationAr:
      "دي خوارزمية إقليدس بالطرح: (49,35) → (35,14) → (14,21) → (14,7) → (7,7) ← الناتج 7 (وهو GCD(49,35)).",
  },
  {
    id: "ex1-q5",
    source: "Exercise 1",
    questionNumber: 5,
    chapterNumber: 4,
    importanceTier: 1,
    question:
      "Consider the following recurrence equation, defining a function T(n) = T(n - 1) + 2^n for n > 0 has a time complexity",
    options: ["O(n 2^n)", "O(2^n)", "O(n lg(n))", "O(n^3)"],
    correctIndex: 1,
    correctAnswer: "O(2^n)",
    explanationAr:
      "بفك التكرار يدينا متسلسلة هندسية 2^1 + 2^2 + ... + 2^n = 2(2^n - 1) = O(2^n).",
  },
  {
    id: "ex1-q6",
    source: "Exercise 1",
    questionNumber: 6,
    chapterNumber: 3,
    importanceTier: 1,
    question:
      "Give a big-Oh characterization, in terms of n, of the running time of the Loop1 method shown",
    codeSnippet:
      "Algorithm Loop1(n):\n  s <- 0\n  for i <- 1 to n^2 do\n    for j <- 1 to i do\n      s <- s + i",
    options: ["O(n^3)", "O(n^2 lg n)", "O(n^4 lg n)", "O(n^4)"],
    correctIndex: 3,
    correctAnswer: "O(n^4)",
    explanationAr:
      "الـ loop الداخلي بيتكرر i مرة، فالإجمالي Σ_{i=1}^{n^2} i = n^2(n^2+1)/2 = O(n^4).",
  },
  {
    id: "ex1-q7",
    source: "Exercise 1",
    questionNumber: 7,
    chapterNumber: 2,
    importanceTier: 2,
    question:
      "Suppose you are given a sorted array, A, of n distinct integers in the range from 1 to n + 1, so there is exactly one integer in this range missing from A. What is the running time for finding the integer in this range that is not in A.",
    options: ["O(1)", "O(lg n)", "O(n lg n)", "O(n)"],
    correctIndex: 1,
    correctAnswer: "O(lg n)",
    explanationAr:
      "لأن المصفوفة sorted، نقدر نستخدم Binary Search نقارن قيمة A[mid] بالـ index بتاعه عشان نلاقي الرقم الناقص في O(lg n).",
  },
  {
    id: "ex1-q8",
    source: "Exercise 1",
    questionNumber: 8,
    chapterNumber: 2,
    importanceTier: 1,
    question: "The shown recursive relation is defined by",
    codeSnippet:
      "Algorithm recursive_Relation(A, n)\nInput An array A of integer items and n = length[a]\nOutput Minimum Element\nIf (n = 0) then\n  Return A[1]\nReturn min(recursive_Relation(A, n - 1), A[n])",
    options: [
      "T(n) = T(n/2 - 1) + O(1)",
      "T(n) = cT(n - 1) + O(lg n)",
      "T(n) = T(n - 1) + O(1)",
      "T(n) = T(n - 1) + Θ(n)",
    ],
    correctIndex: 2,
    correctAnswer: "T(n) = T(n - 1) + O(1)",
    explanationAr:
      "الدالة بتنادي نفسها مرة واحدة على n-1 وبتعمل مقارنة min في وقت ثابت O(1).",
  },

  // Exercise 2
  {
    id: "ex2-q1",
    source: "Exercise 2",
    questionNumber: 1,
    chapterNumber: 4,
    importanceTier: 1,
    question:
      "The Recurrence T(n) = 3 T(n/6) + O(n) for n > 1 and O(1) otherwise, is determined by",
    options: ["O(lg(n))", "= O(n)", "= O(n^2)", "= O(n lg n)"],
    correctIndex: 1,
    correctAnswer: "= O(n)",
    explanationAr:
      "بـ Master Theorem: a=3, b=6 ← n^(log_6 3) ≈ n^0.613، و f(n) = n أكبر بأس ← Case 3 ← O(n).",
  },
  {
    id: "ex2-q2",
    source: "Exercise 2",
    questionNumber: 2,
    chapterNumber: 3,
    importanceTier: 1,
    question: "log n! is Ω(n log(n)) for n greater than",
    options: ["2", "0", "1", "4"],
    correctIndex: 3,
    correctAnswer: "4",
    explanationAr:
      "من إثبات شابتر 3 صفحة 11 نصاً: Since lg n > 2 for n > 4, therefore lg n! = Ω(n lg n).",
  },
  {
    id: "ex2-q3",
    source: "Exercise 2",
    questionNumber: 3,
    chapterNumber: 4,
    importanceTier: 2,
    question:
      "For big data, merge_sort algorithm is difficult to be applied because of its",
    options: [
      "data structure",
      "non of the answers",
      "time complxity",
      "space complexity",
    ],
    correctIndex: 3,
    correctAnswer: "space complexity",
    explanationAr:
      "لأن Merge Sort مش in-place وبيحجز مصفوفات مساعدة بمساحة O(n).",
  },
  {
    id: "ex2-q4",
    source: "Exercise 2",
    questionNumber: 4,
    chapterNumber: 2,
    importanceTier: 1,
    question:
      "The time complexity of INSERTION-SORT on the sorted array of n integer values",
    options: ["O(lg(n))", "O(n lg(n))", "O(n^2)", "O(n)"],
    correctIndex: 3,
    correctAnswer: "O(n)",
    explanationAr:
      "المصفوفة المرتبة هي الـ Best Case لـ Insertion Sort وبتاخد وقت خطي O(n).",
  },
  {
    id: "ex2-q5",
    source: "Exercise 2",
    questionNumber: 5,
    chapterNumber: 3,
    importanceTier: 1,
    question:
      "Algorithm A uses 10 n lg n operations, while algorithm B uses n^2 operations. Determine the value n0 such that A is better than B for n ≥ n0",
    options: ["10", "30", "20", "60"],
    correctIndex: 3,
    correctAnswer: "60",
    explanationAr:
      "نحتاج 10 lg n < n: عند n=30 يكون 49.1 > 30، وعند n=60 يكون 59.1 < 60.",
  },
  {
    id: "ex2-q6",
    source: "Exercise 2",
    questionNumber: 6,
    chapterNumber: 4,
    importanceTier: 2,
    question:
      "Given the array A(4, 7, 9, 22, 37, 39, 41, 45), then the expected running time comparisons to sort the array A using Merge-Sort algorithm equals to",
    options: ["64", "8", "24", "48"],
    correctIndex: 2,
    correctAnswer: "24",
    explanationAr:
      "عدد العناصر n = 8، وتعقيد Merge Sort هو n lg n = 8 × lg(8) = 8 × 3 = 24.",
  },
  {
    id: "ex2-q7",
    source: "Exercise 2",
    questionNumber: 7,
    chapterNumber: 4,
    importanceTier: 1,
    question: "The time complxity of T(n) = max{3T(n/2), 5T(n/4)} + O(n^2) is",
    options: ["= O(n lg n)", "= O(n^2 lg(n))", "= O(n^2 lg^2 n)", "= O(n^2)"],
    correctIndex: 3,
    correctAnswer: "= O(n^2)",
    explanationAr:
      "الفرع الأول n^(log_2 3) ≈ n^1.585 والثاني n^(log_4 5) ≈ n^1.161، وكلاهما أصغر من n^2، فبالـ Master Theorem Case 3 الإجمالي O(n^2).",
  },
  {
    id: "ex2-q8",
    source: "Exercise 2",
    questionNumber: 8,
    chapterNumber: 2,
    importanceTier: 2,
    question:
      "On Searching a sorted list A of n strings with maximum length K for a string S of length M, the time complexity of binary_search(A, S) algorithm is",
    options: ["O(K lg(n))", "= O(n * M)", "= O(n * M * K)", "O(M lg n)"],
    correctIndex: 3,
    correctAnswer: "O(M lg n)",
    explanationAr:
      "الـ Binary Search بيعمل O(lg n) خطوة، وكل مقارنة سترينج بتاخد O(M) على قد طول الكلمة S.",
  },
  {
    id: "ex2-q9",
    source: "Exercise 2",
    questionNumber: 9,
    chapterNumber: "general",
    importanceTier: 3,
    question:
      "On Sorting a list A of 8 integer values, BubbleSort(A) needs .... Comparisons",
    options: ["morethan80", "lessthan64", "only24", "only64"],
    correctIndex: 1,
    correctAnswer: "lessthan64",
    explanationAr:
      "BubbleSort على n=8 عناصر يحتاج على الأكثر n(n-1)/2 = 8×7/2 = 28 مقارنة، و 28 أقل من 64 (lessthan64).",
  },
  {
    id: "ex2-q10",
    source: "Exercise 2",
    questionNumber: 10,
    chapterNumber: 4,
    importanceTier: 1,
    question:
      "Consider the following recurrence equation, defining a function T(n) = T(n-1) + O(n^2) for n > 1 and O(1) otherwise, then the time complxity of T(n) is",
    options: ["O(n^2)", "O(n lg^2 n)", "O(n^3)", "= O(n^2 lg(n))"],
    correctIndex: 2,
    correctAnswer: "O(n^3)",
    explanationAr:
      "بفك التكرار نحصل على مجموع المربعات Σ_{i=1}^n i^2 = O(n^3).",
  },

  // Exercise 3
  {
    id: "ex3-q1",
    source: "Exercise 3",
    questionNumber: 1,
    chapterNumber: 4,
    importanceTier: 1,
    question:
      "Consider the recurrence equation T(n) = 2 T(√n) + O(1), then the time complexity of T(n) is (hint substitute lg n = z)",
    options: ["O(n)", "O(lg lg n)", "O(lg n)", "O(√n)"],
    correctIndex: 2,
    correctAnswer: "O(lg n)",
    explanationAr:
      "بوضع z = lg n تتحول إلى S(z) = 2S(z/2) + O(1)، وبـ Master Theorem Case 1 تعطي Θ(z) = O(lg n).",
  },
  {
    id: "ex3-q2",
    source: "Exercise 3",
    questionNumber: 2,
    chapterNumber: 3,
    importanceTier: 2,
    question:
      "Which of the following functions provides the maximum asymptotic complexity",
    options: ["O(n^2)", "O(n lg n)", "O(n)", "O(2^n)"],
    correctIndex: 3,
    correctAnswer: "O(2^n)",
    explanationAr:
      "الدالة الأسية O(2^n) هي الأعلى في معدل النمو مقارنة بالدوال الخطية والتربيعية.",
  },
  {
    id: "ex3-q3",
    source: "Exercise 3",
    questionNumber: 3,
    chapterNumber: 1,
    importanceTier: 2,
    question: "The height of the binary tree with n elements equals to",
    options: ["n", "√n", "n/2", "lg n"],
    correctIndex: 3,
    correctAnswer: "lg n",
    explanationAr:
      "ارتفاع الشجرة الثنائية المتوازنة/المكتملة التي تحتوي على n عنصر هو lg n (ومؤكدة أيضاً في Theorem 6.1 لشابتر 6).",
  },
  {
    id: "ex3-q4",
    source: "Exercise 3",
    questionNumber: 4,
    chapterNumber: 4,
    importanceTier: 1,
    question:
      "The maximum number of leaves in the tree for the recurrence relation T(n) = aT(n/b) + f(n)",
    options: ["n lg n", "n^(log_b a)", "√n", "lg n"],
    correctIndex: 1,
    correctAnswer: "n^(log_b a)",
    explanationAr:
      "في شجرة التكرار ذات عمق log_b n وتفرع a، عدد الأوراق هو a^(log_b n) = n^(log_b a).",
  },
  {
    id: "ex3-q5",
    source: "Exercise 3",
    questionNumber: 5,
    chapterNumber: 5,
    importanceTier: 1,
    question: "Quick sort is the fastest available method of sorting because of",
    options: [
      "it's in place algorithm",
      "number of comparisons is O(n)",
      "it's in place algorithm and number of comparisons needed is O(n lg n)",
      "it is not a comparison algorithm",
    ],
    correctIndex: 2,
    correctAnswer:
      "it's in place algorithm and number of comparisons needed is O(n lg n)",
    explanationAr:
      "يجمع Quicksort بين كونه In-place (بدون ذاكرة إضافية كبيرة) ومتوسط مقارناته O(n lg n) بثوابت صغيرة.",
  },
  {
    id: "ex3-q6",
    source: "Exercise 3",
    questionNumber: 6,
    chapterNumber: 4,
    importanceTier: 2,
    question:
      "Which of the following algorithm design technique is used in merge sort",
    options: [
      "Greedy method",
      "Backtracking",
      "Dynamic programming",
      "Divide and Conquer",
    ],
    correctIndex: 3,
    correctAnswer: "Divide and Conquer",
    explanationAr: "Merge Sort يعتمد على تقسيم المصفوفة لنصفين ثم الدمج (Divide and Conquer).",
  },
  {
    id: "ex3-q7",
    source: "Exercise 3",
    questionNumber: 7,
    chapterNumber: 2,
    importanceTier: 1,
    question: "The following algorithm is characterized by a recurrence relation of",
    codeSnippet:
      "Algorithm fnr(L, n, i):\n  if i == n:\n    return\n  for j = 0 to i+1 do\n    if L[i] >= L[j]\n      swap(L[i], L[j])\n  fnr(L, n, i+1)",
    options: [
      "T(n) = T(n - 1) + O(n)",
      "T(n) = T(n - 1) + O(1)",
      "T(n) = cT(n/2) + O(lg n)",
      "T(n) = T(n/2) + O(n)",
    ],
    correctIndex: 0,
    correctAnswer: "T(n) = T(n - 1) + O(n)",
    explanationAr:
      "كل استدعاء ينفذ حلقة for تكلفتها O(n) في أسوأ حالة ثم يستدعي نفسه للمشكلة المتبقية (n-1).",
  },
  {
    id: "ex3-q8",
    source: "Exercise 3",
    questionNumber: 8,
    chapterNumber: "general",
    importanceTier: 2,
    question:
      "The result of the following recursive method with n = 6 and r = 2",
    codeSnippet:
      "static int recusiveComb(int n, int r)\n{\n  if (n == r || r == 0)\n    return 1;\n  else\n    return RecursiveComb(n-1, r) + recusiveComb(n-1, r-1);\n}",
    options: ["20", "15", "10", "30"],
    correctIndex: 1,
    correctAnswer: "15",
    explanationAr: "الدالة تحسب التوافيق C(n, r): C(6, 2) = (6 × 5) / 2 = 15.",
  },
  {
    id: "ex3-q9",
    source: "Exercise 3",
    questionNumber: 9,
    chapterNumber: 5,
    importanceTier: 1,
    question:
      "Recurrence relation of Quick Sort Algorithm in Worst Case Scenario along with Time Complexity in Worst Case.",
    options: [
      "T(n) = 2T(n/2) + O(n)",
      "T(n) = T(n - 1) + O(n)",
      "T(n) = 2T(n/2) + O(n^2)",
      "T(n) = T(n/10) + T(9n/10) + O(n)",
    ],
    correctIndex: 1,
    correctAnswer: "T(n) = T(n - 1) + O(n)",
    explanationAr:
      "في أسوأ حالة (تقسيم n-1 و 0)، المعادلة تكون T(n) = T(n - 1) + O(n) وتعقيدها Θ(n^2).",
  },
  {
    id: "ex3-q10",
    source: "Exercise 3",
    questionNumber: 10,
    chapterNumber: 5,
    importanceTier: 1,
    question:
      "QuickSort Program Q makes t1 comparisons for sorted input {1, 2, 3, 4, 5} and t2 comparisons for unsorted input {4, 1, 5, 3, 2}. Typically,",
    options: ["t1 = 5", "t2 = 25", "t1 > t2", "t1 = t2"],
    correctIndex: 2,
    correctAnswer: "t1 > t2",
    explanationAr:
      "المصفوفة المرتبة تدخل Quicksort في أسوأ حالة O(n^2)، بينما غير المرتبة أقرب للمتوسط O(n lg n)، إذن t1 > t2.",
  },
];