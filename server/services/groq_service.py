from typing import List, Dict, Any
from groq import AsyncGroq
from server.config import GROQ_API_KEY, AI_MODEL


class GroqService:
    def __init__(self):
        self.api_key = GROQ_API_KEY
        self.model = AI_MODEL
        self._client: AsyncGroq | None = None

    def is_configured(self) -> bool:
        return bool(self.api_key and self.api_key.strip() and "your_" not in self.api_key)

    @property
    def client(self) -> AsyncGroq:
        if not self._client:
            self._client = AsyncGroq(api_key=self.api_key)
        return self._client

    async def verify_connection(self) -> bool:
        if not self.is_configured():
            return False
        try:
            res = await self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": "ping"}],
                max_tokens=5,
            )
            return bool(res and res.choices)
        except Exception as e:
            return False

    def get_system_prompt(self, mode: str = "chat", response_length: str = "balanced") -> str:
        # Core Persona and Universal Strict Response Guidelines
        core_rules = (
            "You are ALPHA, an advanced, highly intelligent and professional AI companion.\n"
            "CRITICAL RESPONSE GUIDELINES (Always follow strictly):\n"
            "1. SHORT, CLEAR & DIRECT: Keep answers short, clear, and direct. Deliver immediate value without fluff.\n"
            "2. NO UNNECESSARY FILLER: Avoid unnecessary explanations, conversational preamble, filler, and repeated information.\n"
            "3. NEVER REPEAT USER'S QUESTION: Never repeat, restate, or rephrase the user's question back to them.\n"
            "4. BULLET POINTS OVER PARAGRAPHS: Use concise, scannable bullet points instead of long paragraphs.\n"
            "5. 3–5 EXPLANATION POINTS: Keep explanations strictly to 3–5 bullet points unless the user explicitly requests more.\n"
            "6. SIMPLE QUESTIONS: Answer simple, factual, or conceptual questions in 2–5 direct sentences.\n"
            "7. SINGLE BEST SOLUTION: Provide the single best solution. Avoid generating multiple alternative solutions unless asked.\n"
            "8. STEP-BY-STEP FOR COMPLEX TASKS: For complex tasks or workflows, explain step by step without unnecessary details.\n"
            "9. COMPLETE CODE & OUTPUT: For coding questions, provide complete, working, production-quality code when requested (no placeholders), and show the expected output briefly.\n"
            "10. LARGE PROJECTS: If asked for an entire multi-file codebase or huge project, provide the core foundational module/file and ask the user before generating the rest.\n"
            "11. FORMATTING: Use clean GitHub-flavored markdown. Format code snippets with language fences (```language ... ```).\n"
            "12. ACCURACY & USEFULNESS: Prioritize accuracy, readability, precision, and practical usefulness at all times."
        )

        # Response-Length Mode Modulation
        len_mode = (response_length or "balanced").lower().strip()
        if len_mode == "quick":
            length_instructions = (
                "\nRESPONSE LENGTH MODE: QUICK\n"
                "- Goal: Rapid, ultra-concise answer.\n"
                "- Format: 1–3 punchy bullet points OR 2–3 brief sentences maximum.\n"
                "- Code: Provide only the minimal working code snippet with zero surrounding chatter.\n"
                "- Skip all background context, theory, and pleasantries."
            )
        elif len_mode == "detailed":
            length_instructions = (
                "\nRESPONSE LENGTH MODE: DETAILED\n"
                "- Goal: Comprehensive, in-depth explanation and full implementation.\n"
                "- Format: Structured breakdown with headers, numbered steps, and complete code with comments.\n"
                "- Include concrete examples, key edge cases, and expected output.\n"
                "- Maintain clean, logical organization without rambling or repetition."
            )
        else:  # "balanced"
            length_instructions = (
                "\nRESPONSE LENGTH MODE: BALANCED (Default)\n"
                "- Goal: Clear explanations with practical examples and expected output.\n"
                "- Format: 3–5 crisp bullet points alongside a concise example or code snippet.\n"
                "- Show expected output briefly.\n"
                "- Optimal blend of speed, clarity, and depth."
            )

        # Operational Mode Customizations
        if mode == "code":
            mode_instructions = (
                "\nOPERATIONAL MODE: CODE\n"
                "- Deliver complete, bug-free, modern code with standard conventions.\n"
                "- Include a brief expected output or execution demonstration.\n"
                "- Limit accompanying explanation to 3–5 bullet points highlighting core logic or edge cases."
            )
        elif mode == "create":
            mode_instructions = (
                "\nOPERATIONAL MODE: CREATE\n"
                "- Deliver original, high-value ideas, outlines, or creative content in structured bullet points."
            )
        elif mode == "search":
            mode_instructions = (
                "\nOPERATIONAL MODE: SEARCH\n"
                "- Synthesize live search context into authoritative, bulleted facts. Cite source names where relevant."
            )
        elif mode == "learn":
            mode_instructions = (
                "\nOPERATIONAL MODE: LEARN\n"
                "- Explain concepts using an intuitive real-world analogy and a 3–5 step conceptual progression."
            )
        else:
            mode_instructions = (
                "\nOPERATIONAL MODE: CHAT\n"
                "- Maintain a professional, articulate, and direct conversational tone."
            )

        return f"{core_rules}\n{length_instructions}\n{mode_instructions}"

    async def chat(
        self,
        messages: List[Dict[str, str]],
        mode: str = "chat",
        response_length: str = "balanced",
    ) -> str:
        if not self.is_configured():
            raise ValueError("Groq API is not configured. Please supply GROQ_API_KEY in your server environment.")

        system_message = {
            "role": "system",
            "content": self.get_system_prompt(mode=mode, response_length=response_length),
        }

        formatted_messages = [system_message] + messages

        temperature = 0.7 if mode == "create" else 0.35

        # Adapt max_tokens based on selected response-length mode
        len_mode = (response_length or "balanced").lower().strip()
        if len_mode == "quick":
            max_tokens = 600
        elif len_mode == "detailed":
            max_tokens = 3600
        else:
            max_tokens = 1600

        try:
            completion = await self.client.chat.completions.create(
                model=self.model,
                messages=formatted_messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )

            content = completion.choices[0].message.content if completion.choices else None
            return content or "No response generated."
        except Exception as err:
            raise RuntimeError(f"Groq API Error: {str(err)}") from err


groq_service = GroqService()
