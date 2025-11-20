"use client";

import { useState, useEffect } from "react";

interface LinkItem {
  id: number;
  code: string;
  url: string;
  clicks: number;
  createdAt: string;
}

export default function HomePage() {
  const [code, setCode] = useState("");
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState<LinkItem[]>([]);

  // Fetch all created links
  const loadLinks = async () => {
    try {
      const res = await fetch("/api/links");
      if (!res.ok) return;

      const data = await res.json();
      setLinks(data);
    } catch (err) {
      console.error("Error loading links:", err);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  // Create a new link
  const createLink = async () => {
    if (!code.trim() || !url.trim()) {
      alert("Please enter both short code and URL.");
      return;
    }

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, url }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Error creating link.");
        return;
      }

      setCode("");
      setUrl("");
      loadLinks(); // refresh list
    } catch (err) {
      console.error("Create error:", err);
      alert("Server error");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>TinyLink – URL Shortener</h1>

      {/* Form */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Short code (example: yt1)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ padding: "10px", width: "250px" }}
        />

        <input
          type="text"
          placeholder="Long URL (example: https://youtube.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ padding: "10px", width: "350px" }}
        />

        <button onClick={createLink} style={{ padding: "10px 20px" }}>
          Create
        </button>
      </div>

      {/* List of links */}
      <h2>Created Links</h2>

      {links.length === 0 ? (
        <p>No links created yet.</p>
      ) : (
        <ul>
          {links.map((link) => (
            <li key={link.id} style={{ marginBottom: "10px" }}>
              <strong>{link.code}</strong> → {link.url}
              {" "}
              <span style={{ marginLeft: "10px", color: "gray" }}>
                (Clicks: {link.clicks})
              </span>
              {" "}
              <a
                href={`/${link.code}`}
                target="_blank"
                style={{ marginLeft: "10px" }}
              >
                Visit
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
