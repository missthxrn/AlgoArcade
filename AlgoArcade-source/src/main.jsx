import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const MODULES = [
  {
    id: "structures",
    code: "01",
    label: "Data Structures",
    short: "Stacks, queues, trees",
    accent: "#ff4fd8",
    concept: "Data structures decide how information is stored, accessed, and updated.",
    ai: "Think of data structures as containers with rules. A stack removes the newest item first, a queue serves the oldest item first, and a tree branches data into parent-child relationships. Choosing the right structure can make code faster and easier to reason about.",
    useCase: "Undo buttons, printer queues, file systems, game decision trees",
    subtopics: [
      ["Stack", "LIFO access for undo, recursion, and browser history."],
      ["Queue", "FIFO access for printer jobs, requests, and task scheduling."],
      ["Tree", "Hierarchical data for folders, menus, and search decisions."],
      ["Graph", "Connected nodes for maps, social networks, and routing."]
    ]
  },
  {
    id: "algorithms",
    code: "10",
    label: "Algorithms",
    short: "Sorting and searching",
    accent: "#42e8ff",
    concept: "Algorithms are repeatable steps that transform input into useful output.",
    ai: "A sorting algorithm compares values and rearranges them into order. Bubble sort is not the fastest, but it is great for learning because each swap is visible. Efficient algorithms matter when your input grows from 10 items to 10 million.",
    useCase: "Search results, leaderboards, recommendation ranking, database indexing",
    subtopics: [
      ["Sorting", "Rearranges values into a useful order."],
      ["Searching", "Finds target data quickly, especially in sorted lists."],
      ["Complexity", "Describes how time or memory changes as input grows."],
      ["Recursion", "Solves a problem by calling smaller versions of itself."]
    ]
  },
  {
    id: "networks",
    code: "11",
    label: "Networks",
    short: "Packets and routing",
    accent: "#8cff66",
    concept: "Computer networks move messages as packets through connected devices.",
    ai: "A message is split into packets, each packet is forwarded by routers, and the destination reassembles the data. This is why large files, video calls, and web pages can travel across many machines without one single fixed path.",
    useCase: "Web browsing, multiplayer games, video calls, cloud apps",
    subtopics: [
      ["Packets", "Small chunks of data sent across a network."],
      ["Routing", "Choosing a path for packets to reach the destination."],
      ["Protocols", "Rules like HTTP and TCP that systems agree to follow."],
      ["Latency", "Delay between sending data and receiving a response."]
    ]
  }
];

const QUIZ_SECTIONS = [
  {
    id: "structures",
    label: "Data Structures",
    accent: "#ff4fd8",
    questions: [
      {
        q: "A browser back button behaves most like which data structure?",
        options: ["Stack", "Queue", "Tree"],
        answer: "Stack",
        feedback: "Correct. The latest page you visited is removed first."
      },
      {
        q: "Which structure is best for a printer job line?",
        options: ["Queue", "Stack", "Binary tree"],
        answer: "Queue",
        feedback: "Right. The first print job added should usually print first."
      },
      {
        q: "Which data structure naturally represents folders inside folders?",
        options: ["Tree", "Queue", "Array only"],
        answer: "Tree",
        feedback: "Correct. Trees represent parent-child relationships."
      }
    ]
  },
  {
    id: "algorithms",
    label: "Algorithms",
    accent: "#42e8ff",
    questions: [
      {
        q: "Why do programmers analyze algorithm efficiency?",
        options: ["To predict performance as input grows", "To make icons prettier", "To avoid using variables"],
        answer: "To predict performance as input grows",
        feedback: "Exactly. Efficiency helps predict speed and memory use."
      },
      {
        q: "What does a sorting algorithm do?",
        options: ["Orders values", "Deletes all duplicates", "Opens a network port"],
        answer: "Orders values",
        feedback: "Yes. Sorting rearranges values into a chosen order."
      },
      {
        q: "Binary search works best when the data is...",
        options: ["Sorted", "Randomly shuffled", "Encrypted only"],
        answer: "Sorted",
        feedback: "Correct. Binary search depends on sorted order."
      }
    ]
  },
  {
    id: "networks",
    label: "Networks",
    accent: "#8cff66",
    questions: [
      {
        q: "What does a router do in a network?",
        options: ["Forwards packets", "Sorts arrays", "Stores passwords only"],
        answer: "Forwards packets",
        feedback: "Yes. Routers move packets toward their destinations."
      },
      {
        q: "What is a packet?",
        options: ["A small piece of transmitted data", "A programming loop", "A database table"],
        answer: "A small piece of transmitted data",
        feedback: "Correct. Packets are chunks of a larger message."
      },
      {
        q: "Latency means...",
        options: ["Network delay", "A stack operation", "A sorted list"],
        answer: "Network delay",
        feedback: "Right. Latency is the delay in communication."
      }
    ]
  },
  {
    id: "mixed",
    label: "Mixed Review",
    accent: "#ffd166",
    questions: [
      {
        q: "Which pair is correctly matched?",
        options: ["Stack - LIFO", "Queue - hierarchy", "Router - sorting"],
        answer: "Stack - LIFO",
        feedback: "Correct. Stack follows Last In, First Out."
      },
      {
        q: "Which concept helps compare algorithms as input size increases?",
        options: ["Complexity", "Packet", "Front pointer only"],
        answer: "Complexity",
        feedback: "Yes. Complexity describes scaling behavior."
      },
      {
        q: "Which app feature best proves this is interactive learning?",
        options: ["Simulation with feedback", "Static PDF text", "One image only"],
        answer: "Simulation with feedback",
        feedback: "Exactly. Interaction plus feedback makes the demo stronger."
      }
    ]
  }
];

const SCREENS = [
  ["overview", "Overview"],
  ["learn", "Learn"],
  ["lab", "Sim Lab"],
  ["quiz", "Quiz"],
  ["progress", "Progress"]
];

const SUBTOPIC_DETAILS = {
  Stack: {
    title: "Stack",
    summary: "A stack stores items in Last In, First Out order. The newest item is always the first one removed.",
    explanation: "Stacks are useful when software needs to remember recent actions. Browser history, undo systems, function calls, and recursion all depend on stack-like behavior. The two main actions are push, which adds an item to the top, and pop, which removes the top item."
  },
  Queue: {
    title: "Queue",
    summary: "A queue stores items in First In, First Out order. The oldest item is served first.",
    explanation: "Queues are common whenever work must be handled fairly in arrival order. Printers, ticket counters, request handlers, and background jobs use queues. The main actions are enqueue, which adds to the rear, and dequeue, which removes from the front."
  },
  Tree: {
    title: "Tree",
    summary: "A tree arranges data as parent and child nodes, starting from one root.",
    explanation: "Trees are ideal for hierarchical information. File systems, menus, HTML documents, and decision paths can be represented as trees. Each node can branch into children, which makes trees useful for searching and organizing related data."
  },
  Graph: {
    title: "Graph",
    summary: "A graph connects nodes with edges, allowing many-to-many relationships.",
    explanation: "Graphs are used when connections matter more than hierarchy. Maps, social networks, recommendation systems, dependency charts, and network routes are graph problems. Algorithms can explore graphs to find paths, clusters, or shortest routes."
  },
  Sorting: {
    title: "Sorting",
    summary: "Sorting rearranges values into a useful order such as ascending or descending.",
    explanation: "Sorting makes data easier to scan, compare, and search. In real apps it powers leaderboards, ranked results, tables, and reports. Different sorting algorithms use different strategies, so their speed can vary a lot on large inputs."
  },
  Searching: {
    title: "Searching",
    summary: "Searching finds a target value inside a collection of data.",
    explanation: "Linear search checks items one by one and works on any list. Binary search is faster, but it needs sorted data because it repeatedly cuts the search range in half. Search appears everywhere: contacts, files, products, and databases."
  },
  Complexity: {
    title: "Complexity",
    summary: "Complexity explains how an algorithm changes as the input gets bigger.",
    explanation: "Time complexity estimates speed, while space complexity estimates memory use. A solution that feels fine for 10 items may fail for a million. Complexity helps developers choose algorithms that keep working as the app grows."
  },
  Recursion: {
    title: "Recursion",
    summary: "Recursion solves a problem by calling the same solution on a smaller version.",
    explanation: "A recursive function needs a base case to stop and a recursive case to keep breaking the problem down. It is useful for trees, nested folders, math sequences, and divide-and-conquer algorithms like merge sort."
  },
  Packets: {
    title: "Packets",
    summary: "Packets are small chunks of data sent across a network.",
    explanation: "Large messages are split into packets so they can move efficiently through networks. Each packet contains data plus addressing information. The receiver collects packets and reconstructs the original message."
  },
  Routing: {
    title: "Routing",
    summary: "Routing chooses where packets should travel next.",
    explanation: "Routers inspect packet destination information and forward packets toward the right network. A packet may pass through several routers before reaching a server. Routing makes the internet flexible because traffic can move through different paths."
  },
  Protocols: {
    title: "Protocols",
    summary: "Protocols are shared rules computers follow to communicate.",
    explanation: "Protocols make communication predictable. HTTP helps browsers request web pages, TCP helps deliver data reliably, and IP handles addressing. Without protocols, devices would not agree on how to format or interpret messages."
  },
  Latency: {
    title: "Latency",
    summary: "Latency is the delay between sending a request and receiving a response.",
    explanation: "Low latency makes apps feel fast, while high latency causes lag. Video calls, online games, and live collaboration tools are especially sensitive to latency. Distance, routing, congestion, and server speed can all affect it."
  }
};

function App() {
  const [screen, setScreen] = useState("overview");
  const [active, setActive] = useState(0);
  const [answers, setAnswers] = useState({});
  const [stackItems, setStackItems] = useState(["A", "B", "C"]);
  const [queueItems, setQueueItems] = useState(["P1", "P2", "P3"]);
  const [bars, setBars] = useState([72, 28, 94, 46, 60, 34]);
  const [sortStep, setSortStep] = useState(0);
  const [packetStep, setPacketStep] = useState(0);
  const [quizSection, setQuizSection] = useState("structures");
  const [activeSubtopic, setActiveSubtopic] = useState(null);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("Ask a question about the current module and the AI tutor will explain it in student-friendly language.");

  const module = MODULES[active];
  const screenIndex = SCREENS.findIndex(([id]) => id === screen);
  const previousScreen = SCREENS[(screenIndex - 1 + SCREENS.length) % SCREENS.length][0];
  const nextScreen = SCREENS[(screenIndex + 1) % SCREENS.length][0];
  const score = Object.values(answers).filter(Boolean).length;
  const totalQuestions = QUIZ_SECTIONS.reduce((sum, section) => sum + section.questions.length, 0);
  const interactionPoints = score + sortStep + packetStep + (stackItems.length !== 3 ? 1 : 0) + (queueItems.length !== 3 ? 1 : 0);
  const progress = Math.min(100, Math.round((interactionPoints / (totalQuestions + 9)) * 100));

  const sortedBars = useMemo(() => {
    const copy = [...bars];
    let swaps = sortStep;
    for (let pass = 0; pass < copy.length && swaps > 0; pass += 1) {
      for (let i = 0; i < copy.length - 1 && swaps > 0; i += 1) {
        if (copy[i] > copy[i + 1]) {
          [copy[i], copy[i + 1]] = [copy[i + 1], copy[i]];
          swaps -= 1;
        }
      }
    }
    return copy;
  }, [bars, sortStep]);

  function answerQuiz(key, option, answer) {
    setAnswers({ ...answers, [key]: option === answer });
  }

  function pushStack() {
    if (stackItems.length < 5) setStackItems([...stackItems, String.fromCharCode(65 + stackItems.length)]);
  }

  function popStack() {
    if (stackItems.length > 0) setStackItems(stackItems.slice(0, -1));
  }

  function enqueue() {
    if (queueItems.length < 5) setQueueItems([...queueItems, `P${queueItems.length + 1}`]);
  }

  function dequeue() {
    if (queueItems.length > 0) setQueueItems(queueItems.slice(1));
  }

  function shuffleBars() {
    setBars([...bars].sort(() => Math.random() - 0.5));
    setSortStep(0);
  }

  return (
    <main className="app">
      <div className="scanline" />
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">AA</span>
          <div>
            <h1>AlgoArcade</h1>
            <p>CS learning lab</p>
          </div>
        </div>

        <nav className="screen-nav" aria-label="App screens">
          {SCREENS.map(([id, label]) => (
            <button
              key={id}
              className={screen === id ? "active" : ""}
              onClick={() => {
                setScreen(id);
                if (id !== "learn") setActiveSubtopic(null);
              }}
            >
              {label}
            </button>
          ))}
        </nav>

      </aside>

      <section className="stage">
        <header className="topbar">
          <div>
            <p className="eyebrow">AI Model Development Contest 2026</p>
            <h2>{screen === "overview" ? "Computer Science Arcade" : screen === "lab" ? "Simulation Lab" : screen === "quiz" ? "Knowledge Check" : screen === "progress" ? "Learner Progress" : module.label}</h2>
          </div>
          <div className="top-actions">
            <div className="page-arrows" aria-label="Page navigation">
              <button
                aria-label="Previous page"
                title="Previous page"
                onClick={() => {
                  setScreen(previousScreen);
                  if (previousScreen !== "learn") setActiveSubtopic(null);
                }}
              >
                <span aria-hidden="true">‹</span>
              </button>
              <button
                aria-label="Next page"
                title="Next page"
                onClick={() => {
                  setScreen(nextScreen);
                  if (nextScreen !== "learn") setActiveSubtopic(null);
                }}
              >
                <span aria-hidden="true">›</span>
              </button>
            </div>
            <div className="creator-pill">
              <span>Built by</span>
              <strong>Dhrishya V V</strong>
            </div>
            <div className="progress">
              <span>{progress}% complete</span>
              <div><i style={{ width: `${progress}%` }} /></div>
            </div>
          </div>
        </header>

        <section className="screen-frame">
          {screen === "overview" && (
            <Overview setScreen={setScreen} setActive={setActive} />
          )}

          {screen === "learn" && (
            <LearnScreen
              active={active}
              setActive={setActive}
              module={module}
              activeSubtopic={activeSubtopic}
              setActiveSubtopic={setActiveSubtopic}
              aiQuestion={aiQuestion}
              setAiQuestion={setAiQuestion}
              aiResponse={aiResponse}
              setAiResponse={setAiResponse}
            />
          )}

          {screen === "lab" && (
            <LabScreen
              stackItems={stackItems}
              queueItems={queueItems}
              pushStack={pushStack}
              popStack={popStack}
              enqueue={enqueue}
              dequeue={dequeue}
              sortedBars={sortedBars}
              sortStep={sortStep}
              setSortStep={setSortStep}
              shuffleBars={shuffleBars}
              packetStep={packetStep}
              setPacketStep={setPacketStep}
            />
          )}

          {screen === "quiz" && (
            <QuizScreen answers={answers} answerQuiz={answerQuiz} quizSection={quizSection} setQuizSection={setQuizSection} />
          )}

          {screen === "progress" && (
            <ProgressScreen score={score} totalQuestions={totalQuestions} progress={progress} answers={answers} setScreen={setScreen} />
          )}
        </section>
      </section>
    </main>
  );
}

function Overview({ setScreen, setActive }) {
  return (
    <div className="overview slide-in">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Demo mode AI tutor + visual interaction</p>
          <h3>Learn CS by touching the concept, not just reading it.</h3>
          <p>
            A retro arcade learning app where students explore data structures,
            run algorithm steps, route network packets, answer quizzes, and track progress.
          </p>
          <button className="pressable" onClick={() => setScreen("learn")}>Start learning</button>
        </div>
        <ArcadeCabinet />
      </section>

      <div className="module-grid">
        {MODULES.map((item, index) => (
          <button
            key={item.id}
            className="module-card"
            style={{ "--accent": item.accent }}
            onClick={() => {
              setActive(index);
              setScreen("learn");
            }}
          >
            <span>{item.code}</span>
            <strong>{item.label}</strong>
            <small>{item.short}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

function generateAiResponse(question, module) {
  const text = question.trim().toLowerCase();

  if (!text) {
    return "Type a question first. Try asking: explain this with an example, why is this useful, or what mistake should I avoid?";
  }

  if (text.includes("example") || text.includes("real")) {
    return `For ${module.label}, a real example is: ${module.useCase}. The key idea is to choose the right concept when the data or communication pattern matches the problem.`;
  }

  if (text.includes("difference") || text.includes("compare")) {
    return module.id === "structures"
      ? "Stack and queue differ by removal order: stack removes the newest item first, while queue removes the oldest item first. Trees and graphs are used when relationships between items matter."
      : module.id === "algorithms"
        ? "Sorting changes the order of data, searching finds a target, recursion breaks a problem into smaller calls, and complexity predicts how expensive the solution becomes."
        : "Packets are the data chunks, routing decides where they go, protocols define the rules, and latency measures the delay.";
  }

  if (text.includes("easy") || text.includes("simple") || text.includes("explain")) {
    return `${module.label} in simple words: ${module.ai}`;
  }

  if (text.includes("quiz") || text.includes("test")) {
    return `Quiz hint for ${module.label}: focus on the rule or purpose. Ask yourself what problem the concept solves, then match that to the option.`;
  }

  return `AI Tutor: Good question. For ${module.label}, remember this core idea: ${module.concept} ${module.ai}`;
}

function LearnScreen({ active, setActive, module, activeSubtopic, setActiveSubtopic, aiQuestion, setAiQuestion, aiResponse, setAiResponse }) {
  const detail = activeSubtopic ? SUBTOPIC_DETAILS[activeSubtopic] : null;

  if (detail) {
    return (
      <div className="subtopic-screen slide-in" style={{ "--accent": module.accent }}>
        <button className="pressable secondary" onClick={() => setActiveSubtopic(null)}>Back to {module.label}</button>
        <section className="subtopic-visual-card">
          <SubtopicVisual title={detail.title} />
        </section>
        <article className="subtopic-explanation">
          <span className="terminal-title">{module.label} subtopic</span>
          <h3>{detail.title}</h3>
          <strong>{detail.summary}</strong>
          <p>{detail.explanation}</p>
        </article>
      </div>
    );
  }

  return (
    <div className="learn-grid slide-in">
      <div className="module-switcher">
        {MODULES.map((item, index) => (
          <button
            key={item.id}
            className={active === index ? "active" : ""}
            style={{ "--accent": item.accent }}
            onClick={() => {
              setActive(index);
              setActiveSubtopic(null);
            }}
          >
            <span>{item.code}</span>
            <strong>{item.label}</strong>
          </button>
        ))}
      </div>

      <div className="concept-board" style={{ "--accent": module.accent }}>
        <ConceptVisual id={module.id} />
      </div>

      <article className="terminal">
        <span className="terminal-title">AI tutor output</span>
        <h3>{module.concept}</h3>
        <p>{module.ai}</p>
        <div className="use-case">
          <span>Real-world use</span>
          <strong>{module.useCase}</strong>
        </div>
        <div className="subtopic-list">
          <span>More topics inside this module</span>
          {module.subtopics.map(([title, detail]) => (
            <button key={title} onClick={() => setActiveSubtopic(title)}>
              <strong>{title}</strong>
              <small>{detail}</small>
            </button>
          ))}
        </div>
        <div className="ask-ai">
          <span>Ask AI Tutor</span>
          <textarea
            value={aiQuestion}
            onChange={(event) => setAiQuestion(event.target.value)}
            placeholder={`Ask about ${module.label}...`}
            rows="3"
          />
          <button className="pressable" onClick={() => setAiResponse(generateAiResponse(aiQuestion, module))}>
            Generate answer
          </button>
          <p>{aiResponse}</p>
        </div>
      </article>
    </div>
  );
}

function LabScreen(props) {
  return (
    <div className="lab-grid slide-in">
      <section className="lab-card">
        <span className="terminal-title">Practical activity 01</span>
        <h3>Stack vs Queue Console</h3>
        <div className="structures-lab">
          <div>
            <strong>Stack: LIFO</strong>
            <div className="stack-tower">
              {props.stackItems.map((item) => <span key={item}>{item}</span>)}
            </div>
            <div className="controls">
              <button className="pressable" onClick={props.pushStack}>Push</button>
              <button className="pressable secondary" onClick={props.popStack}>Pop</button>
            </div>
          </div>
          <div>
            <strong>Queue: FIFO</strong>
            <div className="queue-line">
              {props.queueItems.map((item) => <span key={item}>{item}</span>)}
            </div>
            <div className="controls">
              <button className="pressable" onClick={props.enqueue}>Enqueue</button>
              <button className="pressable secondary" onClick={props.dequeue}>Dequeue</button>
            </div>
          </div>
        </div>
      </section>

      <section className="lab-card">
        <span className="terminal-title">Practical activity 02</span>
        <h3>Bubble Sort Stepper</h3>
        <div className="bars">
          {props.sortedBars.map((height, index) => (
            <span key={`${height}-${index}`} style={{ height: `${height}%` }}>{height}</span>
          ))}
        </div>
        <div className="controls">
          <button className="pressable" onClick={() => props.setSortStep(Math.min(props.sortStep + 1, 12))}>Compare + swap</button>
          <button className="pressable secondary" onClick={props.shuffleBars}>Shuffle</button>
        </div>
      </section>

      <section className="lab-card wide">
        <span className="terminal-title">Practical activity 03</span>
        <h3>Network Packet Route</h3>
        <div className={`network step-${props.packetStep}`}>
          <b>Laptop</b><i /><b>Router A</b><i /><b>Router B</b><i /><b>Server</b>
          <span className="packet">1011</span>
        </div>
        <button className="pressable" onClick={() => props.setPacketStep((props.packetStep + 1) % 4)}>Move packet</button>
      </section>
    </div>
  );
}

function QuizScreen({ answers, answerQuiz, quizSection, setQuizSection }) {
  const activeSection = QUIZ_SECTIONS.find((section) => section.id === quizSection) || QUIZ_SECTIONS[0];

  return (
    <div className="quiz-screen slide-in">
      <div className="quiz-tabs">
        {QUIZ_SECTIONS.map((section) => (
          <button
            key={section.id}
            className={quizSection === section.id ? "active" : ""}
            style={{ "--accent": section.accent }}
            onClick={() => setQuizSection(section.id)}
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className="quiz-grid">
        {activeSection.questions.map((item, index) => {
          const key = `${activeSection.id}-${index}`;
          return (
            <article className="quiz-card" key={key} style={{ "--accent": activeSection.accent }}>
              <span>{activeSection.label} / Q{index + 1}</span>
              <h3>{item.q}</h3>
              <div>
                {item.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => answerQuiz(key, option, item.answer)}
                    className={answers[key] !== undefined && option === item.answer ? "right" : ""}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {answers[key] !== undefined && (
                <p>{answers[key] ? item.feedback : "Not quite. Revisit the Learn or Sim Lab screen, then try again."}</p>
              )}
            </article>
          );
        })}
      </div>

      <section className="quiz-summary">
        <strong>{Object.entries(answers).filter(([key, value]) => key.startsWith(activeSection.id) && value).length}/{activeSection.questions.length}</strong>
        <span>{activeSection.label} score</span>
      </section>
    </div>
  );
}

function ProgressScreen({ score, totalQuestions, progress, answers, setScreen }) {
  return (
    <div className="progress-screen slide-in">
      <section className="completion">
        <span className="terminal-title">Learner feedback</span>
        <h3>{score}/{totalQuestions} quiz answers correct</h3>
        <div className="big-meter">
          <i style={{ width: `${progress}%` }} />
        </div>
        <p>
          The app combines AI-style explanations, visual models, simulations,
          quizzes, instant feedback, and progress tracking for the contest demo.
        </p>
        <button className="pressable" onClick={() => setScreen("overview")}>Replay demo</button>
      </section>

      <section className="badges">
        {QUIZ_SECTIONS.map((section) => {
          const cleared = section.questions.filter((_, index) => answers[`${section.id}-${index}`]).length;
          return (
            <div key={section.id} style={{ "--accent": section.accent }}>
              <span>{cleared}/{section.questions.length}</span>
              <strong>{section.label}</strong>
              <small>{cleared === section.questions.length ? "Quiz cleared" : "Quiz pending"}</small>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function ConceptVisual({ id }) {
  if (id === "algorithms") {
    return (
      <div className="algo-visual">
        {[42, 18, 76, 33, 61].map((value, index) => <span key={value} style={{ height: `${value}%`, animationDelay: `${index * 120}ms` }}>{value}</span>)}
        <b>compare</b>
        <b>swap</b>
        <b>repeat</b>
      </div>
    );
  }

  if (id === "networks") {
    return (
      <div className="network-visual">
        <span>Client</span><i /><span>Router</span><i /><span>Cloud</span><i /><span>Server</span>
        <strong>packet: 1011</strong>
      </div>
    );
  }

  return (
    <div className="structures-visual">
      <div className="stack-preview"><span>C</span><span>B</span><span>A</span></div>
      <div className="tree-preview">
        <b>root</b><i /><b>left</b><b>right</b>
      </div>
      <div className="queue-preview"><span>front</span><span>P1</span><span>P2</span><span>rear</span></div>
    </div>
  );
}

function SubtopicVisual({ title }) {
  if (title === "Stack") {
    return (
      <div className="detail-stack">
        <span>top</span>
        {["function()", "undo edit", "page C", "page B"].map((item) => <b key={item}>{item}</b>)}
        <small>pop removes the top item first</small>
      </div>
    );
  }

  if (title === "Queue") {
    return (
      <div className="detail-queue">
        <span>front</span>
        {["Job 1", "Job 2", "Job 3", "Job 4"].map((item) => <b key={item}>{item}</b>)}
        <span>rear</span>
      </div>
    );
  }

  if (title === "Tree" || title === "Recursion") {
    return (
      <div className="detail-tree">
        <b>{title === "Tree" ? "root" : "solve(n)"}</b>
        <i />
        <span>{title === "Tree" ? "left child" : "solve(n-1)"}</span>
        <span>{title === "Tree" ? "right child" : "base case"}</span>
      </div>
    );
  }

  if (title === "Graph" || title === "Routing") {
    return (
      <div className="detail-graph">
        {["A", "B", "C", "D", "E"].map((node) => <b key={node}>{node}</b>)}
        <i className="edge e1" /><i className="edge e2" /><i className="edge e3" /><i className="edge e4" />
      </div>
    );
  }

  if (title === "Sorting" || title === "Complexity") {
    return (
      <div className="detail-bars">
        {[20, 76, 42, 90, 58, 32].map((value) => <b key={value} style={{ height: `${value}%` }}>{value}</b>)}
        <span>{title === "Sorting" ? "compare -> swap -> repeat" : "n grows -> work grows"}</span>
      </div>
    );
  }

  if (title === "Searching") {
    return (
      <div className="detail-search">
        {[4, 8, 15, 16, 23, 42].map((value) => <b key={value} className={value === 23 ? "target" : ""}>{value}</b>)}
        <span>target found: 23</span>
      </div>
    );
  }

  if (title === "Packets" || title === "Protocols" || title === "Latency") {
    return (
      <div className={`detail-network ${title.toLowerCase()}`}>
        <b>Client</b><i /><b>{title === "Protocols" ? "HTTP/TCP" : "Router"}</b><i /><b>Server</b>
        <span>{title === "Latency" ? "delay: 42ms" : "packet: 1011"}</span>
      </div>
    );
  }

  return <ConceptVisual id="structures" />;
}

function ArcadeCabinet() {
  return (
    <div className="cabinet">
      <div className="cabinet-screen">
        <span>AI</span>
        <b>LEARN</b>
        <i />
      </div>
      <div className="cabinet-controls">
        <span /><span /><span />
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
