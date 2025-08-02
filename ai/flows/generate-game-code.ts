'use server';

/**
 * @fileOverview Generates game code from a user prompt, specifically for games rendered on an HTML Canvas.
 *
 * - generateGameCode - A function that generates or refines HTML, CSS, and JavaScript code for a playable canvas-based game.
 * - GenerateGameCodeInput - The input type for the generateGameCode function.
 * - GenerateGameCodeOutput - The return type for the generateGameCode function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateGameCodeInputSchema = z.object({
  prompt: z.string().describe('A description of the game concept or feedback for refinement.'),
  previousHtml: z.string().optional().describe('The HTML of the previous game version (should contain a canvas).'),
  previousCss: z.string().optional().describe('The CSS of the previous game version (styles the canvas and UI overlays).'),
  previousJs: z.string().optional().describe('The JavaScript of the previous game version (contains the canvas game loop and rendering logic).'),
});
export type GenerateGameCodeInput = z.infer<typeof GenerateGameCodeInputSchema>;

const GenerateGameCodeOutputSchema = z.object({
  html: z.string().describe('The HTML code for the game. This should be very simple: a container, a single `<canvas>` element, and HTML elements for UI overlays like a start screen or on-screen controls.'),
  css: z.string().describe('The CSS code for the game. This styles the page layout, centers the canvas, styles the UI overlay elements (buttons, score display), and ensures responsiveness.'),
  javascript: z.string().describe('The complete JavaScript code for the game. This MUST include: a game loop using `requestAnimationFrame`, all rendering logic using the Canvas 2D API, state management, and input handling.'),
  description: z.string().describe('A summary of the changes made to the code or the game being created, explaining what was implemented.'),
});
export type GenerateGameCodeOutput = z.infer<typeof GenerateGameCodeOutputSchema>;

export async function generateGameCode(input: GenerateGameCodeInput): Promise<GenerateGameCodeOutput> {
  return generateGameCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGameCodePrompt',
  input: { schema: GenerateGameCodeInputSchema },
  output: { schema: GenerateGameCodeOutputSchema },
  prompt: `You are an expert game developer specializing in creating beautiful, performant, and self-contained 2D games using the HTML Canvas.

Your task is to create or improve a complete browser-based game that is rendered entirely on a single \`<canvas>\` element. The game must be visually polished, functional on first load, and support both keyboard and mobile (touch) controls.

---
### 📜 CORE REQUIREMENTS (NON-NEGOTIABLE)

1.  **Canvas-First Architecture:**
    -   The game world, characters, and all dynamic elements MUST be drawn on a single \`<canvas>\` element.
    -   **HTML's Role:** The HTML file should contain the main game container, the \`<canvas>\` element, and any necessary UI overlays (e.g., a \`<div>\` for the start screen, game-over screen) or on-screen buttons for mobile.
    -   **CSS's Role:** The CSS is for styling the page, centering the canvas, and styling the HTML UI overlays and buttons. It should NOT be used for game elements, which are drawn in the canvas.
    -   **JavaScript's Role:** The JavaScript file is the engine. It MUST contain the entire game logic, state management, input handling, collision detection, and all rendering calls to the canvas 2D context.

2.  **JavaScript Game Loop:**
    -   You MUST implement a main game loop using \`requestAnimationFrame(gameLoop)\` for smooth, efficient animation.
    -   The loop should handle updating game state (moving objects, checking for collisions) and then clearing and re-drawing the entire scene on the canvas in each frame.

3.  **Design & Visual Polish:**
    -   Create a **modern and visually attractive** game.
    -   Use vibrant color palettes, clear shapes, and particle effects for actions like jumping, collisions, or scoring.
    -   All text inside the canvas (like score or instructions) must be rendered using \`ctx.fillText()\`.
    -   The game must have a clear **start screen** and **game-over screen** (can be HTML overlays or drawn on the canvas).

4.  **No Dependencies:**
    -   Use **pure HTML, CSS, and JavaScript**. No external game engines, libraries (no p5.js, Phaser, etc.), or frameworks.
    -   Do not use any external assets like images (\`<img>\`), fonts, or sounds. All visuals must be programmatically drawn on the canvas.

5.  **Responsiveness & Input:**
    -   The canvas should resize to fit its container while maintaining its aspect ratio.
    -   Implement **keyboard controls** (e.g., Arrow Keys, WASD).
    -   Add **on-screen touch buttons** (as HTML elements) for mobile play. These buttons will interact with the JavaScript game logic.

6.  **Code Quality:**
    -   Do not add comments in the code itself. The code should be clean and self-explanatory.
    -   The game must be complete and runnable without any edits.

---

{{#if previousHtml}}
### 🔄 Refine Existing Canvas Game

You will improve an existing canvas game based on the feedback below. Analyze the provided JS game loop and rendering logic, then generate the complete, updated code.

**Previous HTML:**
\`\`\`html
{{{previousHtml}}}
\`\`\`
**Previous CSS:**
\`\`\`css
{{{previousCss}}}
\`\`\`
**Previous JavaScript:**
\`\`\`javascript
{{{previousJs}}}
\`\`\`

**User Feedback:** "{{{prompt}}}"

First, provide a short summary of the changes you are about to make to the game's logic and rendering. Then, generate the **complete, updated** HTML, CSS, and JavaScript files.

{{else}}
### 🌟 Create New Canvas Game

You will create a brand new canvas game from a concept.

**Game Concept:** "{{{prompt}}}"

First, provide a short summary of the game you are about to create, including its core mechanics and visual style. Then, generate the **complete HTML, CSS, and JavaScript** for the entire game, ensuring it is fully playable and adheres to all core requirements.

{{/if}}

---
### 🧩 OUTPUT FORMAT

You must output a single, valid JSON object that strictly follows the output schema. Do not add any text before or after the JSON object.
`,
});

const generateGameCodeFlow = ai.defineFlow(
  {
    name: 'generateGameCodeFlow',
    inputSchema: GenerateGameCodeInputSchema,
    outputSchema: GenerateGameCodeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);

    // The AI is now prompted to return a valid JSON object directly,
    // which Genkit parses automatically based on the outputSchema.
    // This is more robust than manual string cleaning.
    if (!output) {
      throw new Error('AI failed to generate a valid output.');
    }

    return output;
  }
);