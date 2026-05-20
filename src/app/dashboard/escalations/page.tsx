"use client";

import { useEffect, useState } from "react";
import { useBusiness } from "@/components/dashboard/business-provider";
import { getEscalations, updateEscalationStatus, addEscalationNote } from "@/lib/db";
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
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function EscalationsPage() {
  const { business, loading: bizLoading } = useBusiness();
  const [escalations, setEscalations] = useState<Escalation[]>(DEMO_ESCALATIONS);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function load() {
      if (business) {
        const data = await getEscalations(business.id);
        setEscalations(data);
      }
      setLoading(false);
    }
    if (!bizLoading) load();
  }, [business, bizLoading]);

  async function updateStatus(id: string, status: EscalationStatus) {
    await updateEscalationStatus(id, status);
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

  async function handleAddNote(id: string) {
    if (!notes.trim()) return;
    const esc = escalations.find((e) => e.id === id);
    await addEscalationNote(id, esc?.notes ?? null, notes);
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

  if (loading || bizLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  function EscalationCard({ escalation }: { escalation: Escalation }) {
    const review = escalation.review;
    const isSelected = selectedId === escalation.id;

    return (
      <div
        className={`rounded-xl border p-5 backdrop-blur-sm transition-all ${
          isSelected ? "border-cyan-500/30 ring-2 ring-cyan-500/10 bg-white/[0.05]" : "border-white/[0.06] bg-white/[0.03] hover:border-white/[0.1] hover:bg-white/[0.05]"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
              <AlertTriangle size={18} className="text-red-400" />
            </div>
            <div>
              <p className="font-medium text-white">
                {review?.author_name ?? "Unknown"}
              </p>
              {review && <StarRating rating={review.rating} size={14} />}
            </div>
          </div>
          <Badge variant={escalation.status}>{escalation.status.replace("_", " ")}</Badge>
        </div>

        {review && (
          <p className="mt-3 text-sm leading-relaxed text-white/60">{review.text}</p>
        )}

        <div className="mt-3 flex items-center gap-4 text-xs text-white/40">
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
          <div className="mt-3 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-300">
            <p className="font-medium">Notes:</p>
            <p className="mt-1 whitespace-pre-wrap text-amber-200/80">{escalation.notes}</p>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedId(isSelected ? null : escalation.id)}
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/60 hover:bg-white/[0.05]"
          >
            <MessageSquare size={14} />
            {isSelected ? "Close" : "Add Note"}
          </button>
          {escalation.status !== "resolved" && (
            <button
              onClick={() => updateStatus(escalation.id, "in_progress")}
              className="flex items-center gap-1.5 rounded-lg border border-cyan-500/20 px-3 py-1.5 text-xs font-medium text-cyan-400 hover:bg-cyan-500/10"
            >
              <User size={14} />
              Assign
            </button>
          )}
          {escalation.status !== "resolved" && (
            <button
              onClick={() => updateStatus(escalation.id, "resolved")}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10"
            >
              <CheckCircle2 size={14} />
              Resolve
            </button>
          )}
          {escalation.status !== "dismissed" && escalation.status !== "resolved" && (
            <button
              onClick={() => updateStatus(escalation.id, "dismissed")}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/40 hover:bg-white/[0.05]"
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
              className="flex-1 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddNote(escalation.id);
              }}
            />
            <button
              onClick={() => handleAddNote(escalation.id)}
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
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
        <h1 className="text-2xl font-bold text-white">Escalations</h1>
        <p className="mt-1 text-sm text-white/40">
          Negative reviews flagged for human attention
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-yellow-400">
            <AlertTriangle size={16} />
            Pending ({pending.length})
          </h2>
          <div className="space-y-4">
            {pending.map((e) => (
              <EscalationCard key={e.id} escalation={e} />
            ))}
            {pending.length === 0 && (
              <p className="text-sm text-white/30">No pending escalations</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-cyan-400">
            <User size={16} />
            In Progress ({inProgress.length})
          </h2>
          <div className="space-y-4">
            {inProgress.map((e) => (
              <EscalationCard key={e.id} escalation={e} />
            ))}
            {inProgress.length === 0 && (
              <p className="text-sm text-white/30">No escalations in progress</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-emerald-400">
            <CheckCircle2 size={16} />
            Resolved ({resolved.length})
          </h2>
          <div className="space-y-4">
            {resolved.map((e) => (
              <EscalationCard key={e.id} escalation={e} />
            ))}
            {resolved.length === 0 && (
              <p className="text-sm text-white/30">No resolved escalations</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
