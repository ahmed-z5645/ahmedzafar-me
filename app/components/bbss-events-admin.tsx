"use client";

import { useEffect, useState } from "react";
import type { BBSSEvent } from "../lib/bbss-events";

const TOKEN_KEY = "bbss_events_token";

type FormState = {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  location: string;
  description: string;
};

const EMPTY_FORM: FormState = {
  title: "",
  date: "",
  startTime: "18:00",
  endTime: "19:00",
  allDay: false,
  location: "",
  description: "",
};

function toIso(date: string, time: string) {
  return `${date}T${time}:00`;
}

function formToPayload(form: FormState) {
  if (!form.date) return null;
  return {
    title: form.title,
    start: form.allDay ? `${form.date}T00:00:00` : toIso(form.date, form.startTime),
    end: form.allDay ? `${form.date}T23:59:59` : toIso(form.date, form.endTime),
    allDay: form.allDay,
    location: form.location,
    description: form.description,
  };
}

function eventToForm(ev: BBSSEvent): FormState {
  const start = new Date(ev.start);
  const end = new Date(ev.end);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    title: ev.title,
    date: `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`,
    startTime: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
    endTime: `${pad(end.getHours())}:${pad(end.getMinutes())}`,
    allDay: ev.allDay,
    location: ev.location,
    description: ev.description,
  };
}

export default function BBSSEventsAdmin() {
  const [events, setEvents] = useState<BBSSEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem(TOKEN_KEY);
    if (stored) setToken(stored);
    refresh();
  }, []);

  function refresh() {
    setLoading(true);
    fetch("/api/bbss-events")
      .then((res) => res.json())
      .then((data: BBSSEvent[]) => {
        setEvents(data);
        setLoadError("");
      })
      .catch(() => setLoadError("Couldn't load events."))
      .finally(() => setLoading(false));
  }

  function unlock() {
    sessionStorage.setItem(TOKEN_KEY, tokenInput);
    setToken(tokenInput);
    setAuthError("");
  }

  async function write(method: "POST" | "PATCH" | "DELETE", body: object) {
    setSubmitting(true);
    setAuthError("");
    try {
      const res = await fetch("/api/bbss-events", {
        method,
        headers: { "Content-Type": "application/json", "x-bbss-events-token": token },
        body: JSON.stringify(body),
      });
      if (res.status === 401) {
        sessionStorage.removeItem(TOKEN_KEY);
        setToken("");
        setAuthError("Wrong password — try again.");
        return false;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setAuthError(data.error ?? "Something went wrong.");
        return false;
      }
      const data = await res.json();
      setEvents(data.events ?? []);
      return true;
    } catch {
      setAuthError("Network error — try again.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = formToPayload(form);
    if (!payload) return;
    const ok = editingId
      ? await write("PATCH", { id: editingId, ...payload })
      : await write("POST", payload);
    if (ok) {
      setForm(EMPTY_FORM);
      setEditingId(null);
    }
  }

  function startEdit(ev: BBSSEvent) {
    setEditingId(ev.id);
    setForm(eventToForm(ev));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    await write("DELETE", { id });
  }

  async function handleSync() {
    setSyncing(true);
    setSyncMessage("");
    try {
      const res = await fetch("/api/bbss-events/sync", {
        method: "POST",
        headers: { "x-bbss-events-token": token },
      });
      const data = await res.json();
      if (!res.ok) {
        setSyncMessage(data.error ?? "Sync failed.");
        return;
      }
      if (data.skipped) {
        setSyncMessage(data.reason ?? "Notion sync is not set up.");
        return;
      }
      setSyncMessage(`Synced ${data.synced} from Notion${data.removed ? `, removed ${data.removed} stale` : ""}.`);
      refresh();
    } catch {
      setSyncMessage("Network error — try again.");
    } finally {
      setSyncing(false);
    }
  }

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <div className="max-w-[720px] mx-auto text-[15px]">
      {!token && (
        <div className="mb-8 p-4 rounded-lg border border-foreground/15">
          <p className="mb-2 text-foreground/75">Enter the admin password to add or edit events.</p>
          <div className="flex gap-2">
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && unlock()}
              placeholder="Password"
              className="flex-1 px-3 py-2 rounded border border-foreground/20 bg-transparent"
            />
            <button
              onClick={unlock}
              className="px-4 py-2 rounded bg-accent text-white cursor-pointer"
            >
              Unlock
            </button>
          </div>
        </div>
      )}

      {token && (
        <form
          onSubmit={handleSubmit}
          className="mb-10 p-4 rounded-lg border border-foreground/15 flex flex-col gap-3"
        >
          <p className="font-semibold">{editingId ? "Edit event" : "Add event"}</p>
          {authError && <p className="text-red-600 text-sm">{authError}</p>}

          <input
            type="text"
            required
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="px-3 py-2 rounded border border-foreground/20 bg-transparent"
          />

          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="px-3 py-2 rounded border border-foreground/20 bg-transparent"
            />
            <label className="flex items-center gap-1.5 text-foreground/75">
              <input
                type="checkbox"
                checked={form.allDay}
                onChange={(e) => setForm({ ...form, allDay: e.target.checked })}
              />
              All day
            </label>
            {!form.allDay && (
              <>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className="px-3 py-2 rounded border border-foreground/20 bg-transparent"
                />
                <span className="text-foreground/50">to</span>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className="px-3 py-2 rounded border border-foreground/20 bg-transparent"
                />
              </>
            )}
          </div>

          <input
            type="text"
            placeholder="Location (optional)"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="px-3 py-2 rounded border border-foreground/20 bg-transparent"
          />

          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="px-3 py-2 rounded border border-foreground/20 bg-transparent resize-none"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded bg-accent text-white cursor-pointer disabled:opacity-50"
            >
              {editingId ? "Save changes" : "Add event"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 rounded border border-foreground/20 cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold">
          Events {!loading && `(${events.length})`}
        </p>
        {token && (
          <button
            onClick={handleSync}
            disabled={syncing}
            className="px-3 py-1.5 rounded border border-foreground/20 text-sm cursor-pointer disabled:opacity-50"
          >
            {syncing ? "Syncing…" : "Sync from Notion"}
          </button>
        )}
      </div>
      {syncMessage && <p className="text-foreground/60 text-sm mb-3">{syncMessage}</p>}
      {loading && <p className="text-foreground/60">Loading…</p>}
      {loadError && <p className="text-red-600">{loadError}</p>}
      {!loading && events.length === 0 && (
        <p className="text-foreground/60">No events yet.</p>
      )}

      <ul className="flex flex-col gap-2">
        {events.map((ev) => (
          <li
            key={ev.id}
            className="flex items-center justify-between gap-3 p-3 rounded-lg border border-foreground/10"
          >
            <div>
              <p className="font-medium">
                {ev.title}{" "}
                {ev.source === "notion" && (
                  <span className="text-[10px] uppercase tracking-wide text-foreground/40 align-middle">
                    Notion
                  </span>
                )}
              </p>
              <p className="text-foreground/60 text-sm">
                {ev.allDay
                  ? new Date(ev.start).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    }) + " · All day"
                  : `${fmt(ev.start)} – ${new Date(ev.end).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`}
                {ev.location && ` · ${ev.location}`}
              </p>
            </div>
            {token && (
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => startEdit(ev)}
                  className="px-3 py-1.5 rounded border border-foreground/20 text-sm cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ev.id)}
                  className="px-3 py-1.5 rounded border border-red-600/40 text-red-600 text-sm cursor-pointer"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
