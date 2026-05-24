---
description: Dual-agent-architect-executor-automation
---

# Dual-Agent Execution Task
Perform the following task using the dual-agent protocol:

1. ARCHITECT PHASE (Claude Opus 4.7):
   - Analyze the following task: {{user_task}}
   - Design the technical architecture and file structure.
   - Output the plan clearly.

2. EXECUTOR PHASE (Gemini 3.1 Pro):
   - Implement the planned architecture immediately.
   - Write/Edit the necessary code files.
   - Perform file applications autonomously.

Constraint: Move seamlessly between planning and execution. Prioritize speed and accuracy.
