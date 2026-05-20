"use client";

import { useState } from "react";
import { DEMO_ESCALATIONS } from "@/lib/demo-data";
import { Escalation, EscalationStatus } from "@/types";
import { StarRating } from "@/components/ui/star-rating";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  User,
  Clock,
  MessageSquare,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function EscalationsPage() {
  const [escalations, setEscalations] = useState<Escalation[]>(DEMO_ESCALATIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  function updateStatus(id: string, status: EscalationStatus) {
    setEscalations((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status,
              resolved_at: status === "resolved" ? new Date().toISOString() : e.resolved_at,
            }
          : e
      )
    );
  }

  function addNote(id: string) {
    if (!notes.trim()) return;
    setEscalations((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, notes: e.notes ? `${e.notes}\n${notes}` : notes }
          : e
      )
    );
    setNotes("");
  }

  const pending = escalations.filter((e) => e.status === "pending");
  const inProgress = escalations.filter((e) => e.status === "in_progress");
  const resolved = escalations.filter(
    (e) => e.status === "resolved" || e.status === "dismissed"
  );

  function EscalationCard({ escalation }: { escalation: Escalation }) {
    const review = escalation.review;
    const isSelected = selectedId === escalation.id;

    return (
      <div
        className={`rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${
          isSelected ? "border-blue-300 ring-2 ring-blue-100" : "border-gray-200"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle size={18} className="text-red-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {review?.author_name ?? "Unknown"}
              </p>
              {review && <StarRating rating={review.rating} size={14} />}
            </div>
          </div>
          <Badge variant={escalation.status}>{escalation.status.replace("_", " ")}</Badge>
        </div>

        {review && (
          <p className="mt-3 text-sm leading-relaxed text-gray-700">{review.text}</p>
        )}

        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {formatDistanceToNow(new Date(escalation.created_at), { addSuffix: true })}
          </span>
          {escalation.assigned_to && (
            <span className="flex items-center gap-1">
              <User size={12} />
              {escalation.assigned_to}
            </span>
          )}
        </div>

        {escalation.notes && (
          <div className="mt-3 rounded-lg bg-yellow-50 p-3 text-xs text-yellow-800">
            <p className="font-medium">Notes:</p>
            <p className="mt-1 whitespace-pre-wrap">{escalation.notes}</p>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => setSelectedId(isSelected ? null : escalation.id)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            <MessageSquare size={14} />
            {isSelected ? "Close" : "Add Note"}
          </button>
          {escalation.status !== "resolved" && (
            <button
              onClick={() => updateStatus(escalation.id, "in_progress")}
              className="flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50"
            >
              <User size={14} />
              Assign
            </button>
          )}
          {escalation.status !== "resolved" && (
            <button
              onClick={() => updateStatus(escalation.id, "resolved")}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
            >
              <CheckCircle2 size={14} />
              Resolve
            </button>
          )}
          {escalation.status !== "dismissed" && escalation.status !== "resolved" && (
            <button
              onClick={() => updateStatus(escalation.id, "dismissed")}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50"
            >
              <XCircle size={14} />
              Dismiss
            </button>
          )}
        </div>

        {isSelected && (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a note..."
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") addNote(escalation.id);
              }}
            />
            <button
              onClick={() => addNote(escalation.id)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Escalations</h1>
        <p className="mt-1 text-sm text-gray-500">
          Negative reviews flagged for human attention
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-yellow-700">
            <AlertTriangle size={16} />
            Pending ({pending.length})
          </h2>
          <div className="space-y-4">
            {pending.map((e) => (
              <EscalationCard key={e.id} escalation={e} />
            ))}
            {pending.length === 0 && (
              <p className="text-sm text-gray-400">No pending escalations</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-700">
            <User size={16} />
            In Progress ({inProgress.length})
          </h2>
          <div className="space-y-4">
            {inProgress.map((e) => (
              <EscalationCard key={e.id} escalation={e} />
            ))}
            {inProgress.length === 0 && (
              <p className="text-sm text-gray-400">No escalations in progress</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={16} />
            Resolved ({resolved.length})
          </h2>
          <div className="space-y-4">
            {resolved.map((e) => (
              <EscalationCard key={e.id} escalation={e} />
            ))}
            {resolved.length === 0 && (
              <p className="text-sm text-gray-400">No resolved escalations</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
