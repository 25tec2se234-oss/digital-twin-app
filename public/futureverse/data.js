const universeData = {
    "ai": {
        "name": "AI & Automation",
        "color": 9133302,
        "hex": "#8b5cf6",
        "desc": "The architecture of intelligence. Explore the algorithms redefining logic, generation, and automation across every industry.",
        "radius": 12,
        "distance": 45,
        "speed": 0.002,
        "topics": [
            {
                "id": "ai-1",
                "title": "Generative AI Fundamentals",
                "content": "<h3>Beyond the Chatbot</h3><p>Generative AI represents a shift from analytical processing to synthetic creation. By mapping the statistical probability of tokens in a high-dimensional vector space, LLMs construct coherent text, code, and reasoning pathways.</p><div class='bg-white/5 border border-white/10 p-5 rounded-xl my-6'><h4 class='text-white font-bold mb-2'>Student Application</h4><p class='text-sm text-slate-300 m-0'>Don't use it to write essays. Use it to generate Socratic counter-arguments to your thesis to stress-test your logic before writing.</p></div>",
                "challenge": {
                    "type": "scenario",
                    "question": "What is the CORE mechanism that allows a Generative AI to produce coherent text?",
                    "options": [
                        {
                            "id": "A",
                            "text": "It copies text from a database it was trained on.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "It predicts the statistically most likely next token in a high-dimensional vector space.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "It uses hard-coded grammar rules to assemble grammatically correct sentences.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "It generates images and converts them to text for output.",
                            "correct": false
                        }
                    ]
                    , "explanation": "Generative AI works by predicting the next token based on statistical probability distributions in a high-dimensional vector space — not by copying or using rigid grammar rules."
                }
            },
            {
                "id": "ai-2",
                "title": "Autonomous Agents",
                "content": "<h3>The Digital Workforce</h3><p>An AI agent is an LLM wrapped in a control loop given access to tools. Instead of waiting for prompts, agents break down a goal, plan steps, and execute them autonomously. We are transitioning from 'AI as an Oracle' to 'AI as an Employee'.</p>",
                "challenge": {
                    "type": "multiple-choice",
                    "question": "How does an Autonomous AI Agent fundamentally differ from a standard chatbot?",
                    "options": [
                        {
                            "id": "A",
                            "text": "It can speak faster and handle more users simultaneously.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "It runs on specialized hardware unavailable to regular users.",
                            "correct": false
                        },
                        {
                            "id": "C",
                            "text": "It is wrapped in a control loop that allows it to plan, execute tool actions, and iterate toward a goal without constant human prompting.",
                            "correct": true
                        },
                        {
                            "id": "D",
                            "text": "It has a larger parameter count than standard language models.",
                            "correct": false
                        }
                    ]
                    , "explanation": "The key distinction is the control loop — agents don't just respond, they autonomously break down goals, select tools, execute actions, and self-correct until the task is complete."
                }
            },
            {
                "id": "ai-3",
                "title": "RAG (Retrieval-Augmented Generation)",
                "content": "<h3>The Cure for Hallucinations</h3><p>LLMs don't know private data. RAG solves this by converting documents into vector embeddings. When you ask a question, it retrieves the most relevant data and forces the AI to answer using ONLY that context.</p>",
                "challenge": {
                    "type": "application",
                    "question": "What problem does RAG (Retrieval-Augmented Generation) primarily solve?",
                    "options": [
                        {
                            "id": "A",
                            "text": "It makes AI models run faster on slower hardware.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "It prevents AI models from generating false or outdated information by grounding them in retrieved real-world documents.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "It allows AI to generate images alongside text.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "It reduces the cost of training large language models from scratch.",
                            "correct": false
                        }
                    ]
                    , "explanation": "RAG grounds the AI's output by first retrieving the most relevant documents from a knowledge base and forcing the model to answer ONLY using that context — directly combating hallucinations."
                }
            },
            {
                "id": "ai-4",
                "title": "Algorithmic Ethics & Bias",
                "content": "<h3>The Math of Morality</h3><p>Models are mirrors reflecting historical data. If a company uses biased hiring data, the AI mathematically scales that bias. AI Alignment ensures outputs align with human values and safety constraints.</p>",
                "challenge": {
                    "type": "scenario",
                    "question": "A hiring algorithm trained on historical resumes consistently ranks women lower. This is BEST classified as:",
                    "options": [
                        {
                            "id": "A",
                            "text": "A software bug that can be fixed with a simple patch.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Intentional design by the algorithm's creators.",
                            "correct": false
                        },
                        {
                            "id": "C",
                            "text": "Algorithmic bias — a systemic error arising from biased training data perpetuating historical discrimination.",
                            "correct": true
                        },
                        {
                            "id": "D",
                            "text": "Expected AI behavior that reflects objective statistical truth.",
                            "correct": false
                        }
                    ]
                    , "explanation": "This is algorithmic bias. When AI is trained on historically biased human decisions, it learns to replicate and scale that bias — making ethical data curation a non-negotiable requirement."
                }
            },
            {
                "id": "ai-5",
                "title": "Model Fine-Tuning (LoRA/PEFT)",
                "content": "<h3>Teaching Old Models New Tricks</h3><p>Fine-tuning adjusts a pre-trained model's weights using a custom dataset. Using parameter-efficient fine-tuning (PEFT) like LoRA, developers can train massive models on cheap consumer GPUs to speak in specific brand voices or output strict JSON.</p>",
                "challenge": {
                    "type": "multiple-choice",
                    "question": "What makes LoRA/PEFT techniques advantageous over full model fine-tuning?",
                    "options": [
                        {
                            "id": "A",
                            "text": "They permanently store new information inside the original model weights.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "They add new layers on top of the model that require more compute than training from scratch.",
                            "correct": false
                        },
                        {
                            "id": "C",
                            "text": "They inject small trainable matrices into the model, allowing domain adaptation with a fraction of the compute and memory cost.",
                            "correct": true
                        },
                        {
                            "id": "D",
                            "text": "They require access to proprietary cloud infrastructure from the AI provider.",
                            "correct": false
                        }
                    ]
                    , "explanation": "LoRA (Low-Rank Adaptation) freezes original model weights and inserts small trainable matrices — achieving near-full fine-tuning quality at a fraction of the computational cost."
                }
            },
            {
                "id": "ai-6",
                "title": "Computer Vision & Multimodality",
                "content": "<h3>When Machines See</h3><p>Multimodal models like GPT-4V or Gemini don't just read text; they process pixels. This unlocks massive potential in medical imaging, autonomous driving, and real-time environment analysis via smartphone cameras.</p>",
                "challenge": {
                    "type": "application",
                    "question": "What does a multimodal AI model enable that a text-only model cannot?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Faster processing of large documents due to hardware acceleration.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Understanding and reasoning across multiple input types simultaneously — such as image, audio, and text together.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "Generating more grammatically correct text responses.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "Operating without an internet connection on mobile devices.",
                            "correct": false
                        }
                    ]
                    , "explanation": "Multimodality allows the model to understand context from images, video, audio, and text simultaneously — enabling applications like visual question answering and medical image analysis."
                }
            },
            {
                "id": "ai-7",
                "title": "Synthetic Data Generation",
                "content": "<h3>Creating the Training Grounds</h3><p>The world is running out of high-quality human data. Synthetic data generation uses AI to create mathematically realistic but fake datasets, allowing companies to train models without violating privacy laws (like GDPR or HIPAA).</p>",
                "challenge": {
                    "type": "scenario",
                    "question": "When is synthetic data generation MOST critical in an AI project?",
                    "options": [
                        {
                            "id": "A",
                            "text": "When the team wants to replace their entire dataset with cheaper, computer-generated alternatives.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "When real-world data for rare or sensitive scenarios (e.g., medical edge cases, fraud) is too limited or legally restricted to collect.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "When the model performs too well and needs harder examples to learn from.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "When the project budget exceeds the allowable spend on data storage.",
                            "correct": false
                        }
                    ]
                    , "explanation": "Synthetic data is most powerful for rare-event training (fraud, medical anomalies) and privacy-protected domains where real data collection is legally or ethically impossible."
                }
            },
            {
                "id": "ai-8",
                "title": "Edge AI",
                "content": "<h3>Intelligence on the Fringe</h3><p>Instead of sending data to the cloud, Edge AI runs models directly on your phone, IoT device, or car. This guarantees zero-latency inference and total privacy, crucial for autonomous vehicles and real-time translation.</p>",
                "challenge": {
                    "type": "multiple-choice",
                    "question": "What is the PRIMARY advantage of deploying AI models at the 'edge' (on device) versus in the cloud?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Edge models are always more accurate than cloud-based ones.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Edge deployment eliminates the need for model training entirely.",
                            "correct": false
                        },
                        {
                            "id": "C",
                            "text": "It enables real-time inference with reduced latency, offline capability, and enhanced privacy since data never leaves the device.",
                            "correct": true
                        },
                        {
                            "id": "D",
                            "text": "It allows unlimited model size since device storage is cheaper than cloud.",
                            "correct": false
                        }
                    ]
                    , "explanation": "Edge AI's key advantages are ultra-low latency (no network round-trip), offline operation, and privacy (data stays on-device) — critical for healthcare wearables, autonomous vehicles, and industrial systems."
                }
            }
        ]
    },
    "human": {
        "name": "Human Psychology",
        "color": 1096065,
        "hex": "#10b981",
        "desc": "The un-automatable core. Explore the psychological and cognitive skills machines cannot replicate.",
        "radius": 10.5,
        "distance": 80,
        "speed": 0.0015,
        "topics": [
            {
                "id": "hs-1",
                "title": "Cognitive Empathy",
                "content": "<h3>The Foundation of Trust</h3><p>Cognitive empathy is the ability to consciously understand another person's perspective. It is the strategic ability to map emotional context. Real business runs on human trust and shared vulnerability—something an algorithm physically cannot possess.</p>",
                "challenge": {
                    "type": "scenario",
                    "question": "How does COGNITIVE EMPATHY differ from emotional empathy in a professional context?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Cognitive empathy means feeling the same emotions as the other person.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "It is the intellectual ability to understand another's perspective and reasoning without necessarily sharing their emotional state.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "It requires physical presence and cannot work in remote or async settings.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "Cognitive empathy is less valuable than emotional empathy in negotiations.",
                            "correct": false
                        }
                    ]
                    , "explanation": "Cognitive empathy is a learnable, analytical skill — understanding HOW someone thinks and what drives their decisions — making it far more applicable and controllable in professional contexts than raw emotional mirroring."
                }
            },
            {
                "id": "hs-2",
                "title": "Complex Negotiation",
                "content": "<h3>Expanding the Pie</h3><p>Basic negotiation is haggling over price. Complex negotiation is uncovering the hidden, unstated desires of the other party (fear of failure, ego) and restructuring the deal so both sides win. This requires reading micro-expressions and improvising under pressure.</p>",
                "challenge": {
                    "type": "multiple-choice",
                    "question": "In complex negotiation, what is the concept of 'ZOPA' and why is it critical?",
                    "options": [
                        {
                            "id": "A",
                            "text": "ZOPA is the final offer one party makes before walking away from the table.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "ZOPA (Zone of Possible Agreement) is the range where both parties' reservation points overlap — the only space where a deal can exist.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "ZOPA refers to the list of non-negotiable demands in a complex deal.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "ZOPA is a manipulation tactic to anchor the first offer extremely high.",
                            "correct": false
                        }
                    ]
                    , "explanation": "Identifying the ZOPA is foundational to any negotiation. If there's no overlap between what each party will accept at minimum, no deal is possible — and skilled negotiators work to expand the ZOPA, not just fight within it."
                }
            },
            {
                "id": "hs-3",
                "title": "Systems Thinking",
                "content": "<h3>Seeing the Forest</h3><p>Systems thinkers don't just solve immediate problems; they look for the feedback loops and root causes that created the problem. Instead of repeatedly fixing a bug, you redesign the architecture so the bug is mathematically impossible.</p>",
                "challenge": {
                    "type": "application",
                    "question": "Which behavior BEST demonstrates Systems Thinking when diagnosing a problem?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Immediately implementing the most obvious fix to stop the problem from worsening.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Mapping feedback loops and second-order effects across the entire system before intervening.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "Delegating the problem to the team member most directly affected by it.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "Focusing efforts exclusively on the part of the system that is most visibly broken.",
                            "correct": false
                        }
                    ]
                    , "explanation": "Systems Thinkers resist the urge to treat symptoms. They model the entire system — identifying feedback loops and leverage points — because a well-intentioned fix in one area can cause cascading failures elsewhere."
                }
            },
            {
                "id": "hs-4",
                "title": "Crisis Management",
                "content": "<h3>Decisions Under Darkness</h3><p>AI requires structured data to make predictions. In a true crisis, data is chaotic or absent. Human leaders must exercise judgment and take decisive action in the dark, managing the emotional panic of their teams.</p>",
                "challenge": {
                    "type": "scenario",
                    "question": "In a high-stakes crisis, the FIRST priority of effective crisis management is:",
                    "options": [
                        {
                            "id": "A",
                            "text": "Immediately communicating to the public to manage reputation before full facts are known.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Stabilizing the immediate situation to stop the escalation, then gathering facts before committing to a full response strategy.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "Identifying and publicly naming the person responsible for the crisis.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "Waiting until all information is available before taking any action to avoid making the situation worse.",
                            "correct": false
                        }
                    ]
                    , "explanation": "Effective crisis management is two-phase: first, contain the bleeding (immediate stabilization), then diagnose and respond strategically. Both acting without data AND waiting too long are catastrophic errors."
                }
            },
            {
                "id": "hs-5",
                "title": "First Principles Reasoning",
                "content": "<h3>Boiling it Down</h3><p>AI relies entirely on analogies (training data). Innovation requires First Principles reasoning—ignoring conventional wisdom and boiling a problem down to fundamental physical or logical truths, then building up from there.</p>",
                "challenge": {
                    "type": "multiple-choice",
                    "question": "First Principles Reasoning differs from analogical thinking primarily because:",
                    "options": [
                        {
                            "id": "A",
                            "text": "First Principles Reasoning is faster and requires less mental effort.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "It breaks a problem down to its fundamental truths and rebuilds solutions from scratch, rather than adapting existing models.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "Analogical thinking is only useful in creative fields while First Principles applies to engineering.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "First Principles is a management philosophy, not a problem-solving technique.",
                            "correct": false
                        }
                    ]
                    , "explanation": "First Principles strips away assumption and convention. Instead of asking 'how has this been done before?', it asks 'what is fundamentally true here?' — enabling breakthrough innovation where analogical thinking only produces incremental improvements."
                }
            },
            {
                "id": "hs-6",
                "title": "High-Stakes Storytelling",
                "content": "<h3>The Engineering of Belief</h3><p>You can have the best product in the world, but if you cannot tell a compelling story, no one will buy it. Storytelling is the API for the human brain. AI can write a memo; it cannot inspire a team to work over the weekend.</p>",
                "challenge": {
                    "type": "application",
                    "question": "What makes a story 'high-stakes' in a professional or leadership context?",
                    "options": [
                        {
                            "id": "A",
                            "text": "It involves dramatic events and extreme emotional language to provoke a strong reaction.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "It features a clear protagonist overcoming a trivial but relatable obstacle.",
                            "correct": false
                        },
                        {
                            "id": "C",
                            "text": "The outcome of the story directly changes what the audience believes, decides, or does — making it a tool for influence and alignment.",
                            "correct": true
                        },
                        {
                            "id": "D",
                            "text": "It is told by a senior leader and carries authority due to their position.",
                            "correct": false
                        }
                    ]
                    , "explanation": "High-stakes storytelling is defined by its function, not its drama. A truly high-stakes story shifts perspectives, galvanizes action, or builds trust — and can be a quiet, personal anecdote that fundamentally changes a decision."
                }
            },
            {
                "id": "hs-7",
                "title": "Behavioral Economics",
                "content": "<h3>Irrational Markets</h3><p>Humans do not act rationally. They are driven by loss aversion, sunk cost fallacies, and social proof. Understanding these biases allows you to design better products and anticipate market movements better than any linear predictive model.</p>",
                "challenge": {
                    "type": "scenario",
                    "question": "A restaurant adds a 'most expensive' decoy item to its menu. This exploits which principle?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Loss Aversion — people fear losing money more than they enjoy gaining value.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Social Proof — people order what they see others ordering.",
                            "correct": false
                        },
                        {
                            "id": "C",
                            "text": "The Decoy Effect / Anchoring — the high-priced item makes mid-tier options seem reasonably priced by comparison.",
                            "correct": true
                        },
                        {
                            "id": "D",
                            "text": "The Scarcity Principle — rare items are perceived as more valuable.",
                            "correct": false
                        }
                    ]
                    , "explanation": "This is the Decoy Effect combined with price anchoring. By setting a high anchor, the restaurant makes the second-most-expensive option feel like exceptional value — reliably shifting customers toward it."
                }
            },
            {
                "id": "hs-8",
                "title": "Cross-Cultural Communication",
                "content": "<h3>The Global Village</h3><p>The future of work is completely distributed. Navigating low-context (direct) vs high-context (indirect) cultures is critical. Misunderstandings across timezones kill projects faster than bad code.</p>",
                "challenge": {
                    "type": "multiple-choice",
                    "question": "When communicating across high-context vs. low-context cultures, what is the most critical adaptive skill?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Learning the language of the other culture fluently before any communication.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Recognizing whether meaning is embedded in explicit words (low-context) or in relationships, hierarchy, and situation (high-context) — then adapting your communication style accordingly.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "Using simple, emoji-based communication to bypass cultural misunderstandings entirely.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "Always adopting the other culture's communication style regardless of your own cultural norms.",
                            "correct": false
                        }
                    ],
                    "explanation": "High-context cultures (Japan, India, Gulf states) embed meaning in context, tone, and relationship — saying 'no' directly is offensive. Low-context cultures (US, Germany) value explicit, direct communication. Misreading this axis is the source of most cross-cultural business failures."
                }
            }
        ]
    },
    "education": {
        "name": "Future Education",
        "color": 3900150,
        "hex": "#3b82f6",
        "desc": "The evolution of learning. How digital twins, adaptive logic, and AI tutors are rebuilding the classroom.",
        "radius": 11.4,
        "distance": 115,
        "speed": 0.0011,
        "topics": [
            {
                "id": "ed-1",
                "title": "Adaptive Learning Systems",
                "content": "<h3>The End of the Bell Curve</h3><p>Traditional classrooms force 30 students to learn at the exact same pace. Adaptive systems track a student's cognitive model in real-time. If you fail calculus, it routes you back to the specific algebra concept you missed instantly.</p>",
                "challenge": {
                    "type": "scenario",
                    "question": "What is the core advantage of Adaptive Learning Systems over traditional fixed curricula?",
                    "options": [
                        {
                            "id": "A",
                            "text": "They are cheaper to build than traditional textbooks.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "They dynamically adjust content difficulty, pacing, and format to each learner's real-time performance data — eliminating one-size-fits-all delivery.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "They replace teachers entirely with AI, reducing educational costs.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "They standardize learning outcomes across all students regardless of background.",
                            "correct": false
                        }
                    ],
                    "explanation": "Adaptive systems solve the fundamental problem of traditional education: the same lesson delivered to 30 different cognitive profiles. By continuously modeling each student's knowledge state, they serve each learner at the exact edge of their current ability — where real learning happens."
                }
            },
            {
                "id": "ed-2",
                "title": "The Digital Twin of a Student",
                "content": "<h3>Your Cognitive Blueprint</h3><p>A digital twin in education is a secure data model representing your skills, learning speed, strengths, and weaknesses. It travels with you, helping AI tutors perfectly calibrate their instruction to your exact brain.</p>",
                "challenge": {
                    "type": "multiple-choice",
                    "question": "A 'Digital Twin of a Student' in education represents what capability?",
                    "options": [
                        {
                            "id": "A",
                            "text": "A virtual avatar that attends classes on behalf of a student who is absent.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "A dynamic computational model of a student's knowledge, learning style, and cognitive state that can predict future performance and simulate optimal learning interventions.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "A digital copy of a student's homework stored in the cloud.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "An AI chatbot trained on the student's past answers to help them revise.",
                            "correct": false
                        }
                    ],
                    "explanation": "A student digital twin goes beyond records — it's a living predictive model. By continuously ingesting engagement data, assessment results, and learning patterns, it allows educators to simulate 'if we try this intervention, what happens?' — a shift from reactive to proactive education design."
                }
            },
            {
                "id": "ed-3",
                "title": "Cryptographic Credentials",
                "content": "<h3>Beyond the Degree</h3><p>The future of credentials is cryptographic verification of actual projects built, code committed, and problems solved, immutably recorded on a ledger. Employers will verify what you *did*, not where you *sat*.</p>",
                "challenge": {
                    "type": "application",
                    "question": "What problem do Cryptographic Credentials (blockchain diplomas) primarily solve in education?",
                    "options": [
                        {
                            "id": "A",
                            "text": "They make education faster by eliminating the need for exams.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "They create tamper-proof, instantly verifiable academic credentials that eliminate diploma fraud and slow institutional verification processes.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "They make university degrees cheaper by reducing administrative overhead.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "They allow students to earn degrees entirely online without institutional accreditation.",
                            "correct": false
                        }
                    ],
                    "explanation": "Credential fraud costs employers billions annually. Blockchain-anchored credentials (MIT's Blockcerts, Velocity Network) are self-sovereign: the holder controls them, any verifier can cryptographically authenticate instantly — no calls to registrars, no fake transcripts."
                }
            },
            {
                "id": "ed-4",
                "title": "Hyper-Personalized AI Tutors",
                "content": "<h3>The Aristotle Model</h3><p>Imagine an AI tutor that knows your interests. If you love basketball, it teaches you physics using projectile motion formulas of a 3-point shot. It is infinitely patient, available 24/7, and speaks your language.</p>",
                "challenge": {
                    "type": "scenario",
                    "question": "What fundamentally differentiates a Hyper-Personalized AI Tutor from standard educational software?",
                    "options": [
                        {
                            "id": "A",
                            "text": "It delivers video lectures at the student's preferred playback speed.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "It models the student's individual misconceptions and cognitive gaps, then generates custom explanations, analogies, and questions designed specifically for that student's mental model.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "It replaces the teacher with a conversational AI for all classroom interactions.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "It provides gamified rewards to increase student motivation.",
                            "correct": false
                        }
                    ],
                    "explanation": "The breakthrough is misconception modeling: instead of delivering content, a hyper-personalized tutor diagnoses exactly WHERE a student's understanding breaks down, then generates a targeted explanation that bridges the gap — something impossible with pre-authored content."
                }
            },
            {
                "id": "ed-5",
                "title": "Project-Based Reality",
                "content": "<h3>Learning by Building</h3><p>The era of rote memorization is dead. Because AI can recall any fact instantly, the only valuable education is project-based learning: designing a product, testing it in the market, and learning the theory *while* building.</p>",
                "challenge": {
                    "type": "multiple-choice",
                    "question": "Why is Project-Based Learning (PBL) considered superior for developing future-ready skills?",
                    "options": [
                        {
                            "id": "A",
                            "text": "PBL is graded solely on effort, reducing student anxiety and improving retention.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "It develops transferable skills — complex problem-solving, collaboration, communication, and self-direction — through authentic work that cannot be developed through passive instruction or memorization.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "PBL replaces all academic subjects with vocational training, making graduates employment-ready faster.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "It standardizes curriculum across schools, ensuring all students have equal learning outcomes.",
                            "correct": false
                        }
                    ],
                    "explanation": "PBL's power is authentic context: students solve real problems with real constraints, developing the meta-skills employers value most. Cognitive science confirms that skills acquired in realistic, meaningful contexts transfer far more readily than isolated drills."
                }
            },
            {
                "id": "ed-6",
                "title": "Neuro-feedback in Learning",
                "content": "<h3>Closing the Loop</h3><p>Future learning environments will use non-invasive EEG headsets to measure cognitive load and focus. If the system detects you are zoning out or frustrated, it dynamically alters the difficulty or format of the lesson.</p>",
                "challenge": {
                    "type": "application",
                    "question": "What does Neuro-feedback in Learning enable that traditional assessment cannot?",
                    "options": [
                        {
                            "id": "A",
                            "text": "It allows students to absorb information while sleeping through audio stimulation.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Real-time monitoring of neural activity (attention, cognitive load, emotional state) during learning — enabling interventions before a student becomes frustrated or disengaged.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "It provides brain-enhancing electrical stimulation to increase IQ scores.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "It replaces traditional tests with brain-scan-based knowledge verification.",
                            "correct": false
                        }
                    ],
                    "explanation": "Neuro-feedback closes the feedback loop on the learning process itself. Instead of discovering a student was confused three weeks later via a test, EEG-based systems can detect cognitive overload in real time and trigger a pace adjustment, repeat, or break — fundamentally changing the responsiveness of instruction."
                }
            }
        ]
    },
    "career": {
        "name": "The New Economy",
        "color": 16096779,
        "hex": "#f59e0b",
        "desc": "The future of work. Discover hybrid roles, skill-based hiring, and how to build an un-automatable portfolio.",
        "radius": 12.6,
        "distance": 150,
        "speed": 0.0018,
        "topics": [
            {
                "id": "cw-1",
                "title": "The Portfolio Career",
                "content": "<h3>The End of the Ladder</h3><p>Working for one company for 40 years is over. A portfolio career means maintaining multiple streams of income and identity: consulting, building a SaaS, and creating content. This creates extreme resilience against AI disruption.</p>",
                "challenge": {
                    "type": "scenario",
                    "question": "What is the strategic advantage of a Portfolio Career over single-employer employment?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Portfolio careers always generate higher income than traditional employment.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Income, identity, and skill development are diversified across multiple parallel streams — reducing catastrophic risk from any single employer decision while compounding cross-domain expertise.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "Portfolio careers are primarily suitable for artists and creative professionals.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "They allow workers to avoid taxes by working as independent contractors across jurisdictions.",
                            "correct": false
                        }
                    ],
                    "explanation": "A portfolio career applies investment portfolio logic to your professional life: multiple income streams, cross-domain skill compounding, and protection against industry disruption. The risk is concentration — having one employer, one skill, one income stream is the most precarious career strategy in a volatile economy."
                }
            },
            {
                "id": "cw-2",
                "title": "Hybrid AI Roles",
                "content": "<h3>The Domain Expert + AI</h3><p>The highest paid jobs won't be pure programmers. They will be hybrid roles. The 'AI-Augmented Lawyer' or 'AI-Augmented Doctor'. AI will not replace domain experts. Domain experts who use AI will replace those who don't.</p>",
                "challenge": {
                    "type": "multiple-choice",
                    "question": "What is a 'Hybrid AI Role' and why is it increasingly the most valuable position in organizations?",
                    "options": [
                        {
                            "id": "A",
                            "text": "A job where the employee works both in-office and remotely using AI collaboration tools.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "A professional who combines deep domain expertise with AI fluency — directing AI systems, evaluating their outputs critically, and integrating them into high-stakes decision workflows.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "A role where an AI assistant handles 50% of tasks and a human handles the other 50%.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "A technical position requiring both machine learning skills and software engineering.",
                            "correct": false
                        }
                    ],
                    "explanation": "Pure AI skills without domain expertise produce generic outputs. Pure domain expertise without AI fluency produces slow outputs. Hybrid professionals who can point AI at the right problems, critically evaluate results, and integrate outputs into real decisions are the highest-leverage humans in any organization."
                }
            },
            {
                "id": "cw-3",
                "title": "Proof of Work",
                "content": "<h3>The New Resume</h3><p>When everyone can use AI to write a perfect cover letter, resumes lose all value. Employers will only look at 'Proof of Work'—live code deployments, published research, video teardowns, and actual revenue generated.</p>",
                "challenge": {
                    "type": "application",
                    "question": "In the context of future careers, what does 'Proof of Work' mean beyond blockchain?",
                    "options": [
                        {
                            "id": "A",
                            "text": "A formal employer reference proving you worked at a specific company.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Publicly visible artifacts of your thinking and execution — published code, writing, projects, and builds — that credibly demonstrate capability without requiring institutional credentials.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "A government certification proving a worker completed a required training program.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "An employment contract proving you were legitimately hired.",
                            "correct": false
                        }
                    ],
                    "explanation": "In the attention economy, credentials are claimed, but work is shown. GitHub repositories, published writing, shipped products, and public problem-solving are the new portfolio — they allow any person anywhere to demonstrate capability directly to any employer in the world, bypassing gatekeepers."
                }
            },
            {
                "id": "cw-4",
                "title": "Skill-Based Hiring",
                "content": "<h3>Bypassing the Gatekeepers</h3><p>Major corporations are dropping degree requirements. They are implementing blind, skill-based assessments. If you can pass the technical rigorous assessment or build the required architecture, you get the job, regardless of your background.</p>",
                "challenge": {
                    "type": "scenario",
                    "question": "Why is Skill-Based Hiring considered more equitable AND more effective than credential-based hiring?",
                    "options": [
                        {
                            "id": "A",
                            "text": "It eliminates the need for interviews, making the hiring process faster.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "It removes the proxy (degree, brand-name employer) and directly measures what matters — performance on relevant tasks — reducing both bias against non-traditional candidates and false positives from credentialed-but-incompetent hires.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "Skill-based tests are cheaper to administer than resume screening.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "It favors candidates from top universities who have proven their skills through rigorous coursework.",
                            "correct": false
                        }
                    ],
                    "explanation": "Degrees are imperfect signals — they correlate with capability but don't measure it. Skills-based assessment (work samples, take-home projects, structured simulations) directly measures job-relevant performance, reducing both access barriers for talented non-traditional candidates and costly bad hires."
                }
            },
            {
                "id": "cw-5",
                "title": "The Fractional Executive",
                "content": "<h3>C-Suite on Demand</h3><p>As companies become leaner (using AI to replace middle management), they will hire 'fractional' CMOs or CTOs—highly experienced professionals who work for 4 different companies simultaneously, providing strategic oversight without full-time bloat.</p>",
                "challenge": {
                    "type": "multiple-choice",
                    "question": "What is a 'Fractional Executive' and what market need do they serve?",
                    "options": [
                        {
                            "id": "A",
                            "text": "A part-time executive who works 50% at one company and 50% at another.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "An experienced C-suite professional who delivers high-level strategic leadership to multiple companies simultaneously for a fraction of a full-time salary — making executive talent accessible to SMEs.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "An executive who has been demoted to a fraction of their original role.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "An AI system that performs executive decision-making tasks fractionally.",
                            "correct": false
                        }
                    ],
                    "explanation": "Fractional executives solve the access problem for growing companies: hiring a full-time experienced CFO or CTO is prohibitively expensive, but the need for that strategic expertise is real. Fractional models give startups and SMEs access to seasoned operators at a cost structure that matches their stage."
                }
            },
            {
                "id": "cw-6",
                "title": "Continuous Upskilling",
                "content": "<h3>The Red Queen Hypothesis</h3><p>The half-life of a learned technical skill is dropping from 5 years to 18 months. The most valuable career skill is meta-learning: the ability to rapidly unlearn outdated frameworks and assimilate new paradigms in weeks.</p>",
                "challenge": {
                    "type": "application",
                    "question": "Why does 'Continuous Upskilling' require a fundamentally different mindset than traditional education?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Because formal degrees are no longer recognized by most employers globally.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Because in a world where half of all job-relevant skills become obsolete within 5 years, learning can no longer be a 'phase of life' — it must become a continuous operating mode, not an event.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "Because online courses are cheaper and faster than traditional education programs.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "Because companies are legally required to provide training to all employees annually.",
                            "correct": false
                        }
                    ],
                    "explanation": "The traditional model was: learn (school), earn (career), retire. In the age of automation and rapid technological change, skills have a half-life of years, not decades. The most valuable professionals treat learning as infrastructure — investing in it continuously, not reactively."
                }
            },
            {
                "id": "cw-7",
                "title": "Remote-First & Async",
                "content": "<h3>Death of the Office</h3><p>The best talent refuses to commute. Mastering asynchronous communication (writing clear briefs, recording Loom videos, leaving perfect documentation) is a mandatory career skill for the globalized workforce.</p>",
                "challenge": {
                    "type": "scenario",
                    "question": "What is the critical challenge of Remote-First & Async work that most organizations underestimate?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Remote workers are less productive than in-office workers due to more distractions at home.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Async communication eliminates the real-time feedback loops that build trust and shared context — requiring deliberate investment in documentation, structured communication norms, and explicit relationship-building rituals.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "The time zone differences make it impossible to collaborate effectively across continents.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "Remote-first teams have higher turnover because employees feel isolated without management oversight.",
                            "correct": false
                        }
                    ],
                    "explanation": "Async is powerful for deep work but corrosive to informal culture when not intentionally managed. Successful remote-first organizations (GitLab, Automattic) invest heavily in written communication standards, structured 1:1s, asynchronous documentation, and periodic in-person events to rebuild the trust fabric that office proximity created passively."
                }
            }
        ]
    },
    "creator": {
        "name": "Creator & Builder",
        "color": 15485081,
        "hex": "#ec4899",
        "desc": "The age of the sovereign builder. Leverage technology to build digital empires from a dorm room.",
        "radius": 9.6,
        "distance": 185,
        "speed": 0.0022,
        "topics": [
            {
                "id": "cr-1",
                "title": "The Sovereign Individual",
                "content": "<h3>A Company of One</h3><p>Historically, building a tech company required millions in VC funding. Today, one student with an internet connection can prompt an AI to write the code, generate the assets, and optimize the ad spend. The bottleneck is taste and execution.</p>",
                "challenge": {
                    "type": "scenario",
                    "question": "What does the 'Sovereign Individual' thesis predict about the future of economic power?",
                    "options": [
                        {
                            "id": "A",
                            "text": "That nation-states will become more powerful as digital infrastructure requires physical governance.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "That individuals with scarce digital skills and globally mobile capital will increasingly escape geographic taxation and governance, with nation-states competing to attract them — reversing the power imbalance between governments and citizens.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "That all governments will eventually merge into a single global governing body.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "That corporations will replace governments as the primary governing institutions.",
                            "correct": false
                        }
                    ],
                    "explanation": "The Sovereign Individual (Rees-Mogg & Davidson, 1997) predicted that the internet would allow individuals to operate economically beyond the reach of any single state. With crypto, remote work, and digital nomadism, this prediction is materializing — high-earning individuals can now choose their jurisdictions the way corporations always could."
                }
            },
            {
                "id": "cr-2",
                "title": "Audience as Leverage",
                "content": "<h3>Distribution is King</h3><p>You can build the greatest software in the world, but if no one knows it exists, it fails. Building a highly engaged audience through writing, video, or open-source contribution is the ultimate career leverage.</p>",
                "challenge": {
                    "type": "multiple-choice",
                    "question": "In the creator economy, why is 'audience as leverage' considered a form of capital?",
                    "options": [
                        {
                            "id": "A",
                            "text": "A large audience guarantees advertising revenue, making it equivalent to a salary.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "A direct, engaged audience gives a creator distribution independence — the ability to launch products, influence markets, or shift opportunities without needing institutional gatekeepers or intermediary platforms.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "Audience size determines a creator's negotiation power with brand sponsors.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "It functions as social proof that increases trust in professional job applications.",
                            "correct": false
                        }
                    ],
                    "explanation": "An audience is compounding trust capital. Unlike follower counts, an engaged audience is a distribution channel you own — when you launch a product, course, or idea, you're not paying for ads or seeking investors. This asymmetry (build once, monetize repeatedly) is what makes audiences one of the most valuable assets in the attention economy."
                }
            },
            {
                "id": "cr-3",
                "title": "No-Code / Low-Code",
                "content": "<h3>Democratizing Software</h3><p>Platforms like Bubble, Webflow, and Make allow non-technical founders to build complex applications visually. When combined with AI coding assistants, the barrier to launching a software product has effectively dropped to zero.</p>",
                "challenge": {
                    "type": "application",
                    "question": "What has No-Code/Low-Code democratized, and what is its real limitation?",
                    "options": [
                        {
                            "id": "A",
                            "text": "It has replaced all software engineers, and its only limitation is that it requires internet access.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "It has lowered the barrier to building functional digital products — but its limitation is that complex, scalable, or highly custom applications still require traditional engineering to handle edge cases, performance, and security.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "It has made software design accessible, but the resulting applications always lack visual design quality.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "No-Code has no real limitations — it can build any application that traditional code can.",
                            "correct": false
                        }
                    ],
                    "explanation": "No-code is transformative at the margins of complexity — it enables domain experts to build functional tools without engineering dependencies. But at scale, custom integrations, performance optimization, and security hardening still require code. The skill is knowing exactly where no-code is sufficient and where it breaks down."
                }
            },
            {
                "id": "cr-4",
                "title": "The Subscription Economy",
                "content": "<h3>Recurring Revenue</h3><p>Transitioning from selling time (freelancing) to selling access (newsletters, SaaS, communities). Building MRR (Monthly Recurring Revenue) is the mathematical foundation of financial independence for digital creators.</p>",
                "challenge": {
                    "type": "scenario",
                    "question": "Why has the Subscription Economy created more durable businesses than one-time purchase models?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Subscriptions cost less per transaction, making products more accessible.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Recurring revenue creates predictable cash flows, deepens customer relationships through continuous value delivery, and generates compounding retention data — fundamentally changing unit economics and valuation multiples.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "Customers prefer subscriptions because they only pay when they use the product.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "Subscription models are more profitable because they generate less customer service demand.",
                            "correct": false
                        }
                    ],
                    "explanation": "The subscription model shifts the business model from 'sell and forget' to 'deliver continuous value to retain.' This creates ARR (Annual Recurring Revenue) — the single metric that drives SaaS valuations — while forcing companies to earn retention every month, fundamentally aligning business incentives with customer success."
                }
            },
            {
                "id": "cr-5",
                "title": "Content Engineering",
                "content": "<h3>Algorithmic Empathy</h3><p>Understanding how recommendation algorithms (TikTok, YouTube, X) distribute content. It's not just making 'good videos'; it's engineering high-retention hooks, optimizing CTR (Click-Through Rate), and structuring narrative arcs.</p>",
                "challenge": {
                    "type": "multiple-choice",
                    "question": "What distinguishes 'Content Engineering' from traditional content creation?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Content Engineering uses AI to generate content automatically, eliminating human creators.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "It treats content as a systematic, data-driven product — engineered for specific search intent, distribution channels, conversion goals, and compounding organic traffic — rather than created for aesthetic expression.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "Content Engineering focuses on the technical aspects of website performance and speed.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "It is a specialized field exclusively applicable to technical documentation and SaaS marketing.",
                            "correct": false
                        }
                    ],
                    "explanation": "Content engineering approaches content as infrastructure: each piece is designed with a specific job (rank for keyword X, convert reader to trial user, answer objection Y). Over time, engineered content compounds into a moat — driving organic traffic that functions like a paid acquisition channel with compounding returns."
                }
            },
            {
                "id": "cr-6",
                "title": "Digital Product Design",
                "content": "<h3>Selling Zero-Marginal Cost Assets</h3><p>Unlike physical goods, a digital product (a course, a template, a script) costs $0 to duplicate. Creators who master packaging their knowledge into high-value digital products create scalable wealth vehicles.</p>",
                "challenge": {
                    "type": "application",
                    "question": "What makes 'Digital Product Design' fundamentally different from traditional product design?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Digital products don't require physical manufacturing, making them less complex to design.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Digital products can be continuously iterated based on real user behavior data — enabling design decisions informed by millions of micro-interactions rather than periodic user research.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "Digital design requires no prototyping because changes can be made in production instantly.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "It focuses exclusively on visual aesthetics rather than user experience and functionality.",
                            "correct": false
                        }
                    ],
                    "explanation": "The transformative advantage of digital product design is the feedback loop: A/B tests, heatmaps, funnel analytics, and session recordings allow designers to make evidence-based decisions at a pace and granularity impossible in physical product development. The best digital products are never 'finished' — they continuously evolve based on behavioral evidence."
                }
            }
        ]
    },
    "future": {
        "name": "Future Hardware",
        "color": 959977,
        "hex": "#0ea5e9",
        "desc": "The physical bleeding edge. Explore how hardware innovations will reshape our reality.",
        "radius": 13.5,
        "distance": 220,
        "speed": 0.001,
        "topics": [
            {
                "id": "ft-1",
                "title": "Spatial Computing",
                "content": "<h3>The Death of the Screen</h3><p>Spatial computing maps digital interfaces directly into the physical world. Instead of opening an anatomy app on a laptop, a medical student dissects a holographic heart floating in their living room.</p>",
                "challenge": {
                    "type": "scenario",
                    "question": "What makes Spatial Computing a paradigm shift rather than just an evolution of VR/AR?",
                    "options": [
                        {
                            "id": "A",
                            "text": "It requires more expensive hardware than current VR headsets.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Spatial computing merges the physical and digital into a continuous experience — computing becomes context-aware and spatially anchored in the real world, rather than confined to screens or isolated virtual environments.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "It is exclusively used for gaming and entertainment, making it more accessible than enterprise VR.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "Spatial computing eliminates the need for any physical hardware — running entirely on cloud infrastructure.",
                            "correct": false
                        }
                    ],
                    "explanation": "Spatial computing (Apple Vision Pro, Meta Quest) represents the next computing platform after mobile. When computing is spatially anchored — a digital overlay persisting in physical space — the interface metaphors change completely. Your desk, walls, and field of view become interactive surfaces. This is not an evolution of the screen; it is its replacement."
                }
            },
            {
                "id": "ft-2",
                "title": "Advanced Robotics & Humanoids",
                "content": "<h3>The Automation of Labor</h3><p>While AI automates cognitive work, general-purpose humanoid robots (like Tesla Optimus or Figure 01) powered by multimodal AI are preparing to automate physical labor, fundamentally restructuring global supply chains.</p>",
                "challenge": {
                    "type": "multiple-choice",
                    "question": "What is the 'uncanny valley' problem in Advanced Robotics & Humanoids and why does it matter commercially?",
                    "options": [
                        {
                            "id": "A",
                            "text": "The uncanny valley refers to technical failures in robot locomotion on uneven terrain.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "As humanoid robots become increasingly human-like in appearance and movement, they trigger revulsion rather than empathy in humans at a certain threshold of similarity — a psychological barrier to adoption.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "It is the valley between robot capability and human capability that robots cannot yet bridge.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "The uncanny valley describes the gap between robot manufacturing cost and viable commercial pricing.",
                            "correct": false
                        }
                    ],
                    "explanation": "The uncanny valley (Masahiro Mori, 1970) describes how near-human robots trigger discomfort rather than sympathy. This psychological response is a real commercial barrier — robots that appear 70% human often test worse than those appearing 30% human. Commercial humanoid designers (Boston Dynamics, Agility) must either cross the valley or stay clearly in 'robot territory.'"
                }
            },
            {
                "id": "ft-3",
                "title": "3D Printing & Additive Manufacturing",
                "content": "<h3>Instant Infrastructure</h3><p>From printing rocket engines in 24 hours to printing biological tissue. Distributed manufacturing means we will email physical objects (blueprints) and print them locally, destroying traditional shipping logistics.</p>",
                "challenge": {
                    "type": "application",
                    "question": "What is the most transformative application of 3D Printing / Additive Manufacturing in medicine?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Printing cheap generic medications that are equivalent to branded pharmaceuticals.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Bioprinting patient-specific tissue and organ scaffolds using the patient's own cells — potentially eliminating transplant rejection and donor organ shortages.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "Printing medical equipment for distribution in remote areas at low cost.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "Creating custom prosthetic limbs that are cosmetically superior to traditional prosthetics.",
                            "correct": false
                        }
                    ],
                    "explanation": "Bioprinting is 3D printing's most profound frontier: using a patient's own cells as 'ink' to construct tissue scaffolds that the body doesn't reject. Companies like Organovo have printed liver tissue; WFIRM has demonstrated bioprinted bladders implanted in patients. Eliminating organ shortages and rejection are the holy grails of this field."
                }
            },
            {
                "id": "ft-4",
                "title": "Solid-State Batteries",
                "content": "<h3>The Energy Density Leap</h3><p>The bottleneck for drones, robots, and EVs is energy density. Solid-state batteries promise to double the range, eliminate fire risks, and charge in minutes, unlocking electric aviation and untethered robotics.</p>",
                "challenge": {
                    "type": "scenario",
                    "question": "Beyond EVs, which sector stands to benefit MOST from solid-state battery commercialization?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Desktop computing — allowing CPUs to operate at higher clock speeds.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Aviation — enabling electric aircraft with ranges comparable to jet fuel, since aviation requires extreme energy density and current lithium-ion batteries are too heavy for long-haul flight.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "Data centers — reducing electricity consumption from cooling systems.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "Smartphone manufacturing — enabling thinner devices with week-long battery life.",
                            "correct": false
                        }
                    ],
                    "explanation": "Solid-state batteries' primary advantage is energy density and safety. For EVs, this is powerful; for aviation, it's potentially revolutionary. Current lithium-ion batteries are too heavy for flight ranges above ~1000km. Solid-state could enable regional electric aviation, fundamentally changing short-haul flight economics and carbon footprint."
                }
            },
            {
                "id": "ft-5",
                "title": "Smart Dust & Micro-Sensors",
                "content": "<h3>The Omnipresent Network</h3><p>Sensors the size of a grain of sand, distributed across agricultural fields or integrated into concrete, forming massive mesh networks that monitor the physical health of the planet in absolute real-time.</p>",
                "challenge": {
                    "type": "multiple-choice",
                    "question": "What is 'Smart Dust' and what does it enable at industrial scale?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Nano-scale cleaning robots that remove microscopic particles from semiconductor manufacturing.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Millimeter-scale wireless sensor nodes deployable in massive swarms to create dense, real-world data collection networks — enabling hyper-granular environmental, structural, and biological monitoring previously impossible.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "Ultra-fine particulates used in pharmaceutical delivery systems to target specific cells.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "A coating material that gives electronic surfaces dust-repellent properties.",
                            "correct": false
                        }
                    ],
                    "explanation": "Smart Dust (Kris Pister, UC Berkeley) envisions millimeter-scale wireless sensors scattered like seeds — on bridges, in forests, in bodies — creating a continuous sensing fabric over physical reality. Applications range from structural health monitoring and precision agriculture to military reconnaissance and medical diagnostics."
                }
            },
            {
                "id": "ft-6",
                "title": "Neuromorphic Computing",
                "content": "<h3>Silicon Brains</h3><p>Current chips process data sequentially. Neuromorphic chips mimic the human brain's neural structure, processing information in parallel while consuming a fraction of the power, unlocking true mobile AI.</p>",
                "challenge": {
                    "type": "application",
                    "question": "Why might Neuromorphic Computing ultimately outperform GPU-based AI for inference tasks?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Neuromorphic chips process more transistors simultaneously than GPU silicon.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "They use event-driven, sparse computation — only processing when input changes — consuming orders of magnitude less energy for equivalent inference tasks, which is critical for edge deployment and continuous operation.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "Neuromorphic computing uses quantum effects to process information at light speed.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "They are compatible with existing GPU software frameworks, reducing development cost.",
                            "correct": false
                        }
                    ],
                    "explanation": "GPUs compute every clock cycle regardless of whether anything changed — brute force parallelism. Neuromorphic chips fire only when there's a meaningful input change, like biological neurons. For always-on inference (smart cameras, hearing aids, robotics), this event-driven efficiency translates to 1000x power reduction — enabling AI at the edge without battery constraints."
                }
            },
            {
                "id": "ft-7",
                "title": "Exoskeletons",
                "content": "<h3>Human Augmentation</h3><p>Robotic suits that multiply human strength and endurance. Initially developed for military and medical rehabilitation, they will soon become standard in construction, warehouse logistics, and eldercare.</p>",
                "challenge": {
                    "type": "scenario",
                    "question": "What is the most significant near-term commercial application of Exoskeletons?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Military combat enhancement — giving soldiers superhuman strength and speed.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Industrial workplace injury prevention — reducing musculoskeletal disorders by augmenting workers in physically demanding environments like logistics, construction, and manufacturing.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "Consumer fitness — replacing gym equipment by providing resistance training at home.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "Space exploration — enabling astronauts to perform complex maintenance tasks in microgravity.",
                            "correct": false
                        }
                    ],
                    "explanation": "While military and medical applications capture attention, the largest near-term market is industrial: companies like EksoWorks, suitX, and Hyundai's H-MEX deploy passive and active exoskeletons in automotive plants and warehouses. Back injuries cost US employers $16B+ annually — exoskeleton ROI in high-injury industries is measured in months, not years."
                }
            }
        ]
    },
    "cyber": {
        "name": "Cyber & Web3",
        "color": 16007006,
        "hex": "#f43f5e",
        "desc": "The battleground of truth. Cryptography, decentralized ledgers, and zero-trust security.",
        "radius": 11.1,
        "distance": 255,
        "speed": 0.0014,
        "topics": [
            {
                "id": "cy-1",
                "title": "Zero-Trust Architecture",
                "content": "<h3>Verify Everything</h3><p>The old security model (a strong perimeter with a soft inside) is dead. Zero Trust assumes the network is already breached. Every single request between servers must be cryptographically authenticated, every time.</p>",
                "challenge": {
                    "type": "scenario",
                    "question": "What is the core principle of Zero-Trust Architecture and why does it represent a fundamental shift from perimeter security?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Zero-Trust means no employee is trusted with sensitive data under any circumstances.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "'Never trust, always verify' — every user, device, and connection is continuously authenticated and authorized based on real-time context, regardless of whether they're inside or outside the traditional network perimeter.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "It is a security model that requires zero employee training by automating all access decisions.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "Zero-Trust means using zero third-party security tools, relying only on in-house built systems.",
                            "correct": false
                        }
                    ],
                    "explanation": "Perimeter security assumed 'inside = trusted, outside = untrusted.' This collapsed with cloud, remote work, and insider threats. Zero-Trust eliminates the implicit trust of being on the network. Every access request is evaluated for device health, user identity, location, and behavior — making lateral movement after breach exponentially harder."
                }
            },
            {
                "id": "cy-2",
                "title": "Quantum Cryptography",
                "content": "<h3>The Q-Day Threat</h3><p>When quantum computers become powerful enough, they will instantly shatter modern RSA encryption. The race is on right now to implement Post-Quantum Cryptography (PQC) before state-actors harvest encrypted data today to decrypt tomorrow.</p>",
                "challenge": {
                    "type": "multiple-choice",
                    "question": "What threat does Quantum Cryptography simultaneously create and solve?",
                    "options": [
                        {
                            "id": "A",
                            "text": "It creates faster encryption that is too computationally expensive for most organizations.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Quantum computers threaten to break RSA/ECC encryption that secures the entire internet, while Quantum Key Distribution (QKD) uses quantum mechanics to create theoretically unbreakable key exchange — solving the exact problem they create.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "It creates data privacy risks through quantum sensing while solving them through stronger passwords.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "Quantum cryptography only applies to government and military communication, not commercial use.",
                            "correct": false
                        }
                    ],
                    "explanation": "The threat is real and urgent: 'harvest now, decrypt later' attacks are already happening — adversaries are collecting encrypted data today to decrypt once quantum computers mature. Post-quantum cryptography (NIST is standardizing PQC algorithms now) and QKD represent the dual response: mathematical and physical solutions to a civilization-scale security problem."
                }
            },
            {
                "id": "cy-3",
                "title": "Decentralized Finance (DeFi)",
                "content": "<h3>Code as Law</h3><p>Replacing traditional banking infrastructure (brokers, clearinghouses) with automated smart contracts on a blockchain. It allows for peer-to-peer lending and trading with zero intermediaries and 100% transparency.</p>",
                "challenge": {
                    "type": "application",
                    "question": "What unique cybersecurity risk does DeFi introduce that traditional finance does not face?",
                    "options": [
                        {
                            "id": "A",
                            "text": "DeFi platforms are vulnerable to physical theft because digital assets are stored on servers.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Smart contract code is public, immutable, and executes automatically — a bug is permanently exploitable and losses are irreversible, with no regulatory backstop or chargeback mechanism.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "DeFi transactions require government ID, creating identity theft risks.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "Crypto wallets are inherently weaker than bank-grade security infrastructure.",
                            "correct": false
                        }
                    ],
                    "explanation": "DeFi's 'code is law' property cuts both ways. When a smart contract functions correctly, it's trustless and efficient. When it doesn't — as in the $600M Poly Network hack or $325M Wormhole exploit — there's no FDIC, no chargebacks, no legal remediation. The contract executed exactly as written; the write was just wrong."
                }
            },
            {
                "id": "cy-4",
                "title": "Zero-Knowledge Proofs (ZKPs)",
                "content": "<h3>Privacy by Math</h3><p>A cryptographic breakthrough that allows you to prove you know a secret without revealing the secret itself. Example: Proving you are over 18 to a website without giving them your actual birthdate or ID.</p>",
                "challenge": {
                    "type": "scenario",
                    "question": "What is the practical value of Zero-Knowledge Proofs (ZKPs) beyond cryptocurrency?",
                    "options": [
                        {
                            "id": "A",
                            "text": "ZKPs allow users to store zero data on servers, improving privacy.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "They enable proving a statement is true (age, income, identity, credentials) without revealing the underlying data — enabling privacy-preserving compliance, authentication, and verification across any data-sensitive domain.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "ZKPs reduce the knowledge required to operate complex cryptographic systems.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "They allow security teams to identify attackers without needing attack evidence.",
                            "correct": false
                        }
                    ],
                    "explanation": "ZKPs solve the core privacy-verification dilemma: normally to prove you qualify, you reveal the qualifying data. ZKPs let you prove 'I am over 18' without revealing your birthdate, 'I have sufficient funds' without revealing your balance, or 'I am a licensed professional' without revealing your record. Applications span finance, healthcare, government, and digital identity."
                }
            },
            {
                "id": "cy-5",
                "title": "AI-Powered Cyber Warfare",
                "content": "<h3>Machine vs Machine</h3><p>Hackers are using AI to generate polymorphic malware that changes its code to evade detection. In response, AI defense systems autonomously patch vulnerabilities in milliseconds. It is a supersonic game of chess.</p>",
                "challenge": {
                    "type": "multiple-choice",
                    "question": "How does AI-Powered Cyber Warfare change the threat landscape fundamentally?",
                    "options": [
                        {
                            "id": "A",
                            "text": "AI makes cyberattacks faster but requires more human operators to control them.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "AI enables autonomous, adaptive attack campaigns at machine speed — identifying vulnerabilities, crafting novel exploits, and adapting to defenses in real time — collapsing the time window between discovery and exploitation from months to minutes.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "AI cyberattacks are detectable because they always follow predictable algorithmic patterns.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "AI only enhances defensive cybersecurity; offensive applications are technically constrained.",
                            "correct": false
                        }
                    ],
                    "explanation": "Traditional cyber offense required skilled human operators and took months. AI collapses this: automated vulnerability discovery, AI-generated spear-phishing, and reinforcement-learning-based attack agents can probe, adapt, and exploit at speeds no human defender can match. Nation-state actors are already deploying these capabilities, fundamentally changing military and corporate threat models."
                }
            },
            {
                "id": "cy-6",
                "title": "Digital Identity & Deepfakes",
                "content": "<h3>The Crisis of Reality</h3><p>When AI can clone your voice and face perfectly, how do you prove who you are online? Cryptographic signatures embedded in cameras and decentralized identity protocols will become mandatory for digital trust.</p>",
                "challenge": {
                    "type": "application",
                    "question": "What makes deepfake-driven identity fraud fundamentally different from previous forms of identity theft?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Deepfakes are more expensive to create, limiting their use to organized crime groups.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Deepfakes compromise biometric authentication — the 'last frontier' of identity verification — by synthetically generating faces and voices at near-perfect fidelity, rendering visual and audio evidence epistemically unreliable.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "Deepfakes only affect video content and cannot be used in text-based identity systems.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "They are easily detectable by current AI systems, limiting their effectiveness.",
                            "correct": false
                        }
                    ],
                    "explanation": "The catastrophic novelty of deepfakes is that they undermine trust in direct perceptual evidence — video, audio, photographs. When you can no longer trust seeing and hearing, the epistemic foundation of modern identity verification crumbles. This threatens financial KYC, legal evidence, democratic discourse, and interpersonal trust at scale."
                }
            }
        ]
    },
    "biotech": {
        "name": "BioTech & The Mind",
        "color": 2278750,
        "hex": "#22c55e",
        "desc": "Hacking the biological code. Neural interfaces, genomic editing, and radical longevity.",
        "radius": 10.2,
        "distance": 290,
        "speed": 0.0009,
        "topics": [
            {
                "id": "bio-1",
                "title": "Brain-Computer Interfaces (BCI)",
                "content": "<h3>The Final Frontier</h3><p>Connecting the human cortex directly to silicon. Early applications are restoring movement to paralyzed individuals. Future applications involve high-bandwidth thought-to-text communication, fundamentally altering what it means to be human.</p>",
                "challenge": {
                    "type": "scenario",
                    "question": "What is the 'bandwidth problem' in Brain-Computer Interfaces and why does it matter?",
                    "options": [
                        {
                            "id": "A",
                            "text": "BCIs require high-speed internet connections to transmit brain signals to servers.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Current BCIs can only interface with a tiny fraction of the brain's ~86 billion neurons, severely limiting resolution and the complexity of thought that can be decoded or encoded — the core technical barrier to full human-computer neural integration.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "The brain generates too much electrical noise, making signal interpretation unreliable.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "Bandwidth limitations mean BCIs can only work in one direction — reading brain signals but not writing them.",
                            "correct": false
                        }
                    ],
                    "explanation": "Neuralink's N1 reads from ~1024 electrodes out of 86 billion neurons — an extraordinarily sparse interface. This bandwidth limitation constrains BCIs to relatively simple decoded intentions (cursor movement, text) and basic sensory feedback. Scaling to natural language thought, memory, or emotional state requires neuroscience and engineering advances of several orders of magnitude."
                }
            },
            {
                "id": "bio-2",
                "title": "CRISPR & Gene Editing",
                "content": "<h3>Debugging DNA</h3><p>CRISPR acts as a molecular scissors, allowing scientists to cut out defective genetic code and paste in healthy sequences. We are moving from treating genetic diseases to outright curing them at the source code level.</p>",
                "challenge": {
                    "type": "multiple-choice",
                    "question": "What ethical constraint does 'germline gene editing' introduce that somatic cell editing does not?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Germline editing is less precise than somatic editing, creating more off-target effects.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Germline edits are heritable — changes made to embryos propagate to all descendants permanently, affecting individuals who cannot consent and potentially altering the human germline forever.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "Germline editing is illegal in all countries, making it impossible to conduct research.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "It is more expensive than somatic editing, making it accessible only to wealthy nations.",
                            "correct": false
                        }
                    ],
                    "explanation": "Somatic editing only affects the individual. Germline editing changes the heritable code — the modification is passed to every descendant, indefinitely, without their consent. This is why the Jiankui case (editing embryos for HIV resistance in 2018) caused international condemnation: it crossed from therapeutic intervention to heritable human modification without societal consensus."
                }
            },
            {
                "id": "bio-3",
                "title": "Synthetic Biology",
                "content": "<h3>Designing Life</h3><p>Instead of relying on nature, engineers are designing custom organisms from scratch to solve problems—like bacteria engineered to consume ocean plastic or produce sustainable biofuels.</p>",
                "challenge": {
                    "type": "application",
                    "question": "What is the 'Design-Build-Test-Learn' cycle in Synthetic Biology and why does it accelerate innovation?",
                    "options": [
                        {
                            "id": "A",
                            "text": "It is a project management framework used by biotech startups to organize research teams.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "It applies engineering iteration principles to biology: design a genetic circuit, build it using DNA synthesis, test its function in cells, and learn from the results to refine the design — dramatically compressing biological R&D timelines.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "It describes the lifecycle of a bio-manufactured product from lab to consumer market.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "It is the FDA regulatory framework for approving synthetic biology products.",
                            "correct": false
                        }
                    ],
                    "explanation": "Synthetic biology treats cells as programmable systems. The DBTL cycle borrows from software engineering — just as software developers iterate rapidly through code changes, synthetic biologists now use automated DNA synthesis, CRISPR editing, and high-throughput screening to iterate through genetic designs in days rather than years."
                }
            },
            {
                "id": "bio-4",
                "title": "AI in Drug Discovery",
                "content": "<h3>Folding the Unknown</h3><p>Systems like AlphaFold have predicted the 3D structures of hundreds of millions of proteins. This allows AI to simulate how potential drugs will interact with diseases in a computer, cutting years and billions of dollars off pharmaceutical research.</p>",
                "challenge": {
                    "type": "scenario",
                    "question": "How does AI in Drug Discovery primarily change the economics of pharmaceutical R&D?",
                    "options": [
                        {
                            "id": "A",
                            "text": "It replaces clinical trials with AI simulations, eliminating human testing costs.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "AI dramatically compresses the hit-identification and lead-optimization phases — from years of wet-lab screening to weeks of computational modeling — reducing the attrition cost of the ~90% of drug candidates that fail before Phase III.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "It automates drug manufacturing, reducing production costs at scale.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "AI predicts with certainty which drug candidates will succeed in clinical trials.",
                            "correct": false
                        }
                    ],
                    "explanation": "Traditional drug discovery's crushing cost is attrition: ~$2.6B per approved drug, mostly from candidates that fail late in development. AI (AlphaFold for protein structure, generative models for molecule design, ML for toxicity prediction) front-loads the filtering — identifying failure modes computationally before expensive biological testing begins."
                }
            },
            {
                "id": "bio-5",
                "title": "Radical Longevity",
                "content": "<h3>Solving Aging</h3><p>Aging is increasingly viewed not as an inevitability, but as a disease of cellular decay. Through senolytics, epigenetic reprogramming, and telomere extension, science is actively working to push the human healthspan past 120 years.</p>",
                "challenge": {
                    "type": "multiple-choice",
                    "question": "What distinguishes 'healthspan' from 'lifespan' as a target in Radical Longevity research?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Healthspan refers to genetic lifespan potential; lifespan is actual years lived.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Healthspan is the period of life free from chronic disease and functional decline — the target of longevity research is extending this, not merely the duration of biological existence.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "Healthspan is measured in quality-adjusted life years (QALYs) and is primarily an economic metric.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "Healthspan and lifespan are synonymous terms used interchangeably in geroscience.",
                            "correct": false
                        }
                    ],
                    "explanation": "Living to 120 with 40 years of disability is not the goal. Modern longevity science targets the 'compression of morbidity' — extending the period of vigorous health and compressing the period of decline into a shorter window near end of life. This requires targeting the hallmarks of aging (senescence, epigenetic drift, proteostasis collapse), not individual diseases."
                }
            },
            {
                "id": "bio-6",
                "title": "Digital Phenotyping",
                "content": "<h3>Quantified Mental Health</h3><p>Using data from your smartphone (typing speed, scroll patterns, vocal tone) to detect the early onset of depression, anxiety, or Alzheimer's before you even realize you have symptoms.</p>",
                "challenge": {
                    "type": "application",
                    "question": "What is 'Digital Phenotyping' and why does it represent a paradigm shift in mental health?",
                    "options": [
                        {
                            "id": "A",
                            "text": "It is a genetic profiling technique that identifies mental health predispositions through DNA analysis.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "The passive collection of behavioral data from smartphones (typing speed, GPS patterns, call frequency, screen time) to detect early biomarkers of mental health states — enabling continuous monitoring and early intervention without clinical visits.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "A digital system for recording and storing phenotypic observations in psychiatric research.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "Virtual reality-based therapy environments that adjust to the patient's behavioral responses.",
                            "correct": false
                        }
                    ],
                    "explanation": "Your phone carries a comprehensive behavioral record — how fast you type, how often you call, how far you travel — that encodes your mental state with surprising fidelity. Research shows smartphone data can detect depressive episodes, bipolar cycling, and anxiety surges before clinical presentation. The paradigm shift: mental health monitoring becomes continuous, passive, and ambient rather than episodic and self-reported."
                }
            }
        ]
    },
    "space": {
        "name": "Space & Physics",
        "color": 12616956,
        "hex": "#c084fc",
        "desc": "The multi-planetary future. Orbital mechanics, fusion power, and cosmic expansion.",
        "radius": 14.4,
        "distance": 325,
        "speed": 0.0007,
        "topics": [
            {
                "id": "sp-1",
                "title": "Reusable Rockets",
                "content": "<h3>The Economics of Orbit</h3><p>For 50 years, rockets were thrown away after one use. Reusability (like SpaceX's Falcon 9 and Starship) has dropped the cost of launching mass to orbit by 90%, opening space to commercial enterprise.</p>",
                "challenge": {
                    "type": "scenario",
                    "question": "What economic principle makes Reusable Rockets transformative, and what specific cost did SpaceX target?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Reusability eliminates the need for rocket fuel, reducing launch costs to near zero.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "The rocket is the most expensive component of a launch — recovering and reflying it amortizes its manufacturing cost across many missions, collapsing per-kg-to-orbit costs from ~$10,000 (2010) to ~$1,500 (Falcon 9, 2024).",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "Reusable rockets are faster to manufacture, reducing the lead time between launches.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "They eliminate insurance costs because the rocket is recovered intact after each launch.",
                            "correct": false
                        }
                    ],
                    "explanation": "Before SpaceX, rockets were treated like bullets — used once and discarded. The economic logic is brutal: if you threw away a 747 after every flight, air travel would be unaffordable. SpaceX's reuse of the Falcon 9 first stage (reflown 20+ times) has compressed launch costs 10x+ in a decade, opening access to a new era of commercial space."
                }
            },
            {
                "id": "sp-2",
                "title": "Orbital Manufacturing",
                "content": "<h3>Zero-G Factories</h3><p>Certain materials, like flawless fiber optic cables (ZBLAN) or perfect protein crystals for pharmaceuticals, can only be manufactured in the microgravity of space. Factories are moving to Low Earth Orbit.</p>",
                "challenge": {
                    "type": "multiple-choice",
                    "question": "What unique advantage does Orbital Manufacturing offer that no Earth-based factory can replicate?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Orbital facilities can operate 24/7 without labor costs, increasing manufacturing efficiency.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "The microgravity and high-vacuum environment of orbit enables manufacturing of materials (perfect crystals, ZBLAN fiber optics, protein crystals, foametal) that cannot be produced at high quality on Earth due to gravity-driven defects and contamination.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "Manufacturing in orbit reduces shipping costs because products can fall to Earth without fuel.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "Orbital factories have unlimited solar energy, eliminating energy costs.",
                            "correct": false
                        }
                    ],
                    "explanation": "Gravity causes convection, sedimentation, and crystallographic defects that are unavoidable on Earth. In microgravity, ZBLAN fiber optics (potentially 100x better signal transmission than silica), perfect pharmaceutical crystals (more effective drugs), and metallic foams with uniform cell structure become manufacturable — products worth thousands per gram that justify launch costs."
                }
            },
            {
                "id": "sp-3",
                "title": "Nuclear Fusion",
                "content": "<h3>Star Power on Earth</h3><p>Fusing atoms together releases nearly infinite clean energy with zero radioactive waste. Recent breakthroughs in magnetic confinement (Tokamaks) and laser ignition mean commercial fusion could power the grid by 2040.</p>",
                "challenge": {
                    "type": "application",
                    "question": "What is the 'ignition threshold' problem in Nuclear Fusion and why was the 2022 NIF result historic?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Ignition refers to starting the fusion reaction; the NIF was the first facility to start one.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Ignition is the threshold where fusion energy output exceeds the energy input delivered to the fuel — for the first time in history, the NIF's December 2022 experiment crossed this threshold, producing 3.15 MJ from 2.05 MJ of laser energy.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "The NIF achieved ignition by discovering a new isotope of hydrogen that fuses at lower temperatures.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "Ignition means the fusion plasma sustained itself for 24+ hours without external energy input.",
                            "correct": false
                        }
                    ],
                    "explanation": "Fusion ignition — where the fuel produces more energy than it receives — had been the field's goal since the 1950s. The NIF's 2022 result was the first scientific proof that net energy gain from laser fusion is physically possible. It doesn't solve engineering challenges (the lasers used 300 MJ total to produce 3.15 MJ at the fuel), but it validates the fundamental physics after 70 years of research."
                }
            },
            {
                "id": "sp-4",
                "title": "Asteroid Mining",
                "content": "<h3>The Trillion Dollar Rock</h3><p>A single metallic asteroid can contain more platinum and rare earth metals than have ever been mined in human history. The technology to capture, mine, and return these resources is currently in active development.</p>",
                "challenge": {
                    "type": "scenario",
                    "question": "What is the critical bottleneck that must be solved before Asteroid Mining becomes economically viable?",
                    "options": [
                        {
                            "id": "A",
                            "text": "Asteroids are too far from Earth for current spacecraft to reach within viable mission lifetimes.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Transportation cost from asteroid to Earth orbit remains prohibitive — extraction is technically feasible, but the cost-per-kg of bringing materials back must fall below the market price of the materials extracted.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "No legal framework exists for claiming ownership of asteroid resources.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "Asteroid minerals are chemically bound in forms that cannot be processed in space.",
                            "correct": false
                        }
                    ],
                    "explanation": "Near-Earth asteroids like 16 Psyche contain platinum-group metals worth trillions at current prices — but extracting them is only part of the equation. Returning them to Earth market would crash PGM prices, eliminating the value. The viable first target is in-space resources: water (rocket propellant), construction materials for lunar bases, and rare elements for orbital manufacturing where no return trip is needed."
                }
            },
            {
                "id": "sp-5",
                "title": "Megaconstellations",
                "content": "<h3>The Orbital Internet</h3><p>Deploying tens of thousands of small satellites in Low Earth Orbit (like Starlink) to blanket the entire planet in high-speed, low-latency broadband, connecting the most remote regions on Earth.</p>",
                "challenge": {
                    "type": "multiple-choice",
                    "question": "What is the primary controversy surrounding Megaconstellation projects like Starlink?",
                    "options": [
                        {
                            "id": "A",
                            "text": "They pose a collision risk with manned space stations like the ISS.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Their sheer number of satellites creates light-trail interference that is permanently altering astronomical observations and creating cascade collision risk in low Earth orbit — Kessler Syndrome — that could make LEO unusable.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "Megaconstellations create monopolies in satellite communications, violating antitrust law.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "The radio frequencies used by these satellites interfere with ground-based communications networks.",
                            "correct": false
                        }
                    ],
                    "explanation": "Starlink's ~6,000 satellites (of a planned 42,000) already appear in 30%+ of long-exposure astronomical images. More critically, thousands of objects in LEO dramatically increase collision probability — and each collision creates thousands of fragments (Kessler Syndrome), potentially triggering a cascade that renders LEO permanently inaccessible for generations."
                }
            },
            {
                "id": "sp-6",
                "title": "Quantum Supremacy",
                "content": "<h3>Breaking Classical Limits</h3><p>Quantum computers use qubits existing in superposition. They don't just calculate faster; they solve problems classical computers never could, simulating complex molecules to cure diseases and create new materials.</p>",
                "challenge": {
                    "type": "application",
                    "question": "What specific class of computational problem is a quantum computer exponentially better at than classical computers?",
                    "options": [
                        {
                            "id": "A",
                            "text": "All computational problems — quantum computers are universally faster across every task.",
                            "correct": false
                        },
                        {
                            "id": "B",
                            "text": "Problems with exponential classical complexity that exploit quantum superposition and interference: integer factorization (Shor's algorithm), unstructured search (Grover's), and quantum simulation of molecular systems.",
                            "correct": true
                        },
                        {
                            "id": "C",
                            "text": "Only cryptographic problems — quantum computers are purpose-built for breaking encryption.",
                            "correct": false
                        },
                        {
                            "id": "D",
                            "text": "Any problem that involves processing large datasets, making them ideal for big data analytics.",
                            "correct": false
                        }
                    ],
                    "explanation": "Quantum advantage is not universal — for most tasks, classical computers remain superior or equivalent. The quantum exponential advantage applies to specific problem structures: factoring large integers (threatening RSA), searching unsorted databases quadratically faster, and simulating quantum systems (drug discovery, materials science). For everything else — sorting, video rendering, spreadsheets — classical silicon wins."
                }
            }
        ]
    }
};