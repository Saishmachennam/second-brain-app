export default function DocsPage() {
  return (
    <div className="max-w-3xl mx-auto p-8 space-y-12">
      <h1 className="text-4xl font-bold">Second Brain – Architecture & Design</h1>

      {/* Portable Architecture */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">1. Portable Architecture</h2>
        <p className="text-gray-700 leading-relaxed">
          The system is designed with clear separation of concerns across four layers:
        </p>
        <ul className="list-disc ml-6 mt-4 space-y-2 text-gray-700">
          <li><strong>UI Layer:</strong> Built with Next.js and Tailwind. Purely responsible for rendering and interaction.</li>
          <li><strong>API Layer:</strong> Next.js route handlers manage data and AI calls. Can be swapped with Express or FastAPI without affecting UI.</li>
          <li><strong>AI Layer:</strong> Server-side LLM integration (Groq). Abstracted so OpenAI, Claude, or Gemini can replace it.</li>
          <li><strong>Data Layer:</strong> Prisma ORM connected to Neon PostgreSQL. Swappable with any SQL database.</li>
        </ul>
        <p className="mt-4 text-gray-700">
          Each layer can evolve independently, ensuring portability and long-term maintainability.
        </p>
      </section>

      {/* UX Principles */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">2. Principles-Based UX</h2>
        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          <li>AI is assistive, not authoritative.</li>
          <li>Users always see their original content alongside AI outputs.</li>
          <li>Explicit loading states reduce cognitive uncertainty.</li>
          <li>Minimal friction in capturing knowledge.</li>
          <li>Search and filters prioritize clarity over complexity.</li>
        </ul>
      </section>

      {/* Agent Thinking */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">3. Agent Thinking</h2>
        <p className="text-gray-700 leading-relaxed">
          The system improves itself over time. Every note automatically generates summaries and tags,
          enriching the dataset. This increases retrieval quality and enables better conversational querying.
          Over time, the knowledge base becomes more structured and semantically meaningful.
        </p>
      </section>

      {/* Infrastructure Mindset */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">4. Infrastructure Mindset</h2>
        <p className="text-gray-700 leading-relaxed">
          The Second Brain exposes its intelligence via API endpoints, enabling external systems to query
          the knowledge base. This allows integration into Slack bots, embedded widgets, or other applications.
          The system is built not just as an app, but as programmable infrastructure for knowledge.
        </p>
      </section>
    </div>
  );
}