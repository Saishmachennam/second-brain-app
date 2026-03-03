"use client";

import { useState, useEffect } from "react";

export default function Page() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("note");
  const [tags, setTags] = useState("");
  const [url, setUrl] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [notes, setNotes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  async function loadNotes() {
  const res = await fetch("/api/notes");
  const data = await res.json();

  if (Array.isArray(data)) {
    setNotes(data);
  } else {
    console.error("API did not return array:", data);
    setNotes([]);
  }
}

  async function saveNote() {
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        type,
        tags: tags.split(",").map(t => t.trim()),
        sourceUrl: url || null,
      }),
    });

    setTitle("");
    setContent("");
    setTags("");
    setUrl("");
    loadNotes();
  }

  async function deleteNote(id: string) {
    await fetch("/api/notes", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
    });

    loadNotes();
  }

  useEffect(() => {
    loadNotes();
  }, []);

  function togglePin(id: string) {
  if (pinnedNotes.includes(id)) {
    setPinnedNotes(pinnedNotes.filter((pid) => pid !== id));
  } else {
    setPinnedNotes([...pinnedNotes, id]);
  }
}

async function sendMessage() {
  if (!chatInput) return;

  const userMessage = { role: "user", content: chatInput };
  setMessages([...messages, userMessage]);
  setChatInput("");

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: chatInput }),
  });

  const data = await res.json();

  const aiMessage = { role: "assistant", content: data.reply };
  setMessages((prev) => [...prev, aiMessage]);
}

  const totalNotes = notes.filter(n => n.type === "note").length;
  const totalLinks = notes.filter(n => n.type === "link").length;
  const totalInsights = notes.filter(n => n.type === "insight").length;
  const [pinnedNotes, setPinnedNotes] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  return (
  <div className="min-h-screen bg-neutral-950 text-white flex">
    
      {/* SIDEBAR */}
<div className="w-64 bg-neutral-900 border-r border-neutral-800 p-6 hidden md:block">
  <h2 className="text-xl font-semibold mb-6">Dashboard</h2>

  <div className="space-y-3">
    <button
      onClick={() => setFilter("all")}
      className={`block w-full text-left px-3 py-2 rounded-lg ${
        filter === "all" ? "bg-neutral-800" : "hover:bg-neutral-800"
      }`}
    >
      📁 All Notes
    </button>

    <button
      onClick={() => setFilter("note")}
      className={`block w-full text-left px-3 py-2 rounded-lg ${
        filter === "note" ? "bg-neutral-800" : "hover:bg-neutral-800"
      }`}
    >
      📝 Notes
    </button>

    <button
      onClick={() => setFilter("link")}
      className={`block w-full text-left px-3 py-2 rounded-lg ${
        filter === "link" ? "bg-neutral-800" : "hover:bg-neutral-800"
      }`}
    >
      🔗 Links
    </button>

    <button
      onClick={() => setFilter("insight")}
      className={`block w-full text-left px-3 py-2 rounded-lg ${
        filter === "insight" ? "bg-neutral-800" : "hover:bg-neutral-800"
      }`}
    >
      💡 Insights
    </button>
  </div>
</div>
<div className="flex-1 px-6 py-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
  <h1 className="text-4xl font-bold">🧠 Second Brain</h1>

  <button
    onClick={() => setShowModal(true)}
    className="bg-white text-black px-5 py-2 rounded-xl font-semibold hover:opacity-80 transition"
  >
    + New Note
  </button>
</div>

      {/* FORM */}
      {/*}
      <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your knowledge..."
          className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700"
        >
          <option value="note">Note</option>
          <option value="link">Link</option>
          <option value="insight">Insight</option>
        </select>

        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
          className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700"
        />

        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Source URL (optional)"
          className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700"
        />

        <button
          onClick={saveNote}
          className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:opacity-80 transition"
        >
          Save Note
        </button>
      </div>
      */}

      {/* MODAL */}
{showModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 w-full max-w-lg space-y-4">

      <h2 className="text-xl font-semibold">Create Note</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your knowledge..."
        className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700"
      />

      <input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma separated)"
        className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700"
      />

      <div className="flex justify-end gap-3 pt-3">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 rounded-lg bg-neutral-700"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            saveNote();
            setShowModal(false);
          }}
          className="px-4 py-2 rounded-lg bg-white text-black font-semibold"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

{/* STATS */}
<div className="grid md:grid-cols-3 gap-6 mb-10">

  <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
    <p className="text-sm text-neutral-400">Total Notes</p>
    <h2 className="text-3xl font-bold mt-2">{totalNotes}</h2>
  </div>

  <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
    <p className="text-sm text-neutral-400">Total Links</p>
    <h2 className="text-3xl font-bold mt-2">{totalLinks}</h2>
  </div>

  <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
    <p className="text-sm text-neutral-400">Total Insights</p>
    <h2 className="text-3xl font-bold mt-2">{totalInsights}</h2>
  </div>

</div>

      {/* CONTROLS */}
      <div className="mt-12 grid md:grid-cols-3 gap-4">
        <input
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 rounded-lg bg-neutral-800 border border-neutral-700"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-3 rounded-lg bg-neutral-800 border border-neutral-700"
        >
          <option value="all">All</option>
          <option value="note">Notes</option>
          <option value="link">Links</option>
          <option value="insight">Insights</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-3 rounded-lg bg-neutral-800 border border-neutral-700"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="az">A-Z</option>
        </select>
      </div>

      <p className="mt-6 text-sm text-neutral-400">
        Total Notes: {notes.length}
      </p>

      {/* NOTES GRID */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {Array.isArray(notes) &&
          notes
            .filter(
              (n) =>
                n.title?.toLowerCase().includes(search.toLowerCase()) ||
                n.content?.toLowerCase().includes(search.toLowerCase())
            )
            .filter((n) => (filter === "all" ? true : n.type === filter))
            .sort((a, b) => {
  const aPinned = pinnedNotes.includes(a.id);
  const bPinned = pinnedNotes.includes(b.id);

  if (aPinned && !bPinned) return -1;
  if (!aPinned && bPinned) return 1;

  if (sort === "az") return a.title.localeCompare(b.title);

  if (sort === "oldest")
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
})
            .map((n) => (
              <div
                key={n.id}
                className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 hover:border-neutral-600 hover:scale-[1.02] transition-all duration-200"
              >
                <div className="flex justify-between items-center">
  <h2 className="font-semibold text-lg">{n.title}</h2>

  <div className="flex gap-3 items-center">
    <button
      onClick={() => togglePin(n.id)}
      className="text-yellow-400 text-sm"
    >
      {pinnedNotes.includes(n.id) ? "📌" : "📍"}
    </button>

    <button
      onClick={() => deleteNote(n.id)}
      className="text-red-400 text-sm"
    >
      Delete
    </button>
  </div>
</div>

                <p className="text-sm mt-2 text-neutral-400 line-clamp-4">
                  {n.content}
                </p>

                {n.tags?.length > 0 && (
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {n.tags.map((t: string, i: number) => (
                      <span
                        key={i}
                        className="text-xs bg-neutral-800 px-2 py-1 rounded-full"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {n.sourceUrl && (
                  <a
                    href={n.sourceUrl}
                    target="_blank"
                    className="text-blue-400 text-sm mt-2 block"
                  >
                    View Source
                  </a>
                )}

                {n.summary && (
                  <div className="mt-3 p-3 bg-neutral-800 rounded-lg text-sm">
                    <strong className="text-yellow-400">
                      AI Summary:
                    </strong>
                    <p className="mt-1 text-neutral-300">{n.summary}</p>
                  </div>
                )}
              </div>
            ))}
      </div>
      {/* CHAT SECTION */}
<div className="mt-16 bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
  <h2 className="text-xl font-semibold mb-4">🧠 Ask Your Notes</h2>

  <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
    {messages.map((m, i) => (
      <div
        key={i}
        className={`p-3 rounded-lg text-sm ${
          m.role === "user"
            ? "bg-neutral-800"
            : "bg-neutral-700 text-green-400"
        }`}
      >
        {m.content}
      </div>
    ))}
  </div>

  <div className="flex gap-3">
    <input
      value={chatInput}
      onChange={(e) => setChatInput(e.target.value)}
      placeholder="Ask something about your notes..."
      className="flex-1 p-3 rounded-lg bg-neutral-800 border border-neutral-700"
    />

    <button
      onClick={sendMessage}
      className="bg-white text-black px-5 rounded-lg font-semibold"
    >
      Send
    </button>
  </div>
</div>
    </div>
  </div>
);
}