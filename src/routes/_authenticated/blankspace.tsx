import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Mic, Paperclip, Sparkles, Upload, Loader2, X } from "lucide-react";
import { organizeCapture, transcribeAudio } from "@/lib/organize.functions";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/blankspace")({
  head: () => ({
    meta: [
      { title: "Blankspace — Third Room HQ" },
      { name: "description", content: "Multimodal intake. Paste, drop, or speak — AI structures the rest." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BlankspacePage,
});

interface Attachment { name: string; dataUrl: string }

function BlankspacePage() {
  const organize = useServerFn(organizeCapture);
  const transcribe = useServerFn(transcribeAudio);
  const qc = useQueryClient();

  const [text, setText] = useState("");
  const [files, setFiles] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const { data: recent = [] } = useQuery({
    queryKey: ["captures", "list"],
    queryFn: async () => {
      const { data } = await supabase.from("captures").select("*").order("created_at", { ascending: false }).limit(20);
      return (data ?? []) as Tables<"captures">[];
    },
  });

  const addFiles = useCallback(async (list: FileList | File[]) => {
    const arr = Array.from(list);
    const out: Attachment[] = [];
    for (const f of arr) {
      if (!f.type.startsWith("image/")) {
        toast.error(`${f.name}: only images supported in v1`);
        continue;
      }
      if (f.size > 8 * 1024 * 1024) {
        toast.error(`${f.name}: 8MB max`);
        continue;
      }
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = reject;
        r.readAsDataURL(f);
      });
      out.push({ name: f.name, dataUrl });
    }
    setFiles((prev) => [...prev, ...out]);
  }, []);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
      const rec = new MediaRecorder(stream, { mimeType: mime });
      chunksRef.current = [];
      rec.ondataavailable = (e) => chunksRef.current.push(e.data);
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mime });
        if (blob.size < 1024) { toast.error("Recording too short"); return; }
        setLoading(true);
        try {
          const buf = await blob.arrayBuffer();
          const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
          const { text: transcript } = await transcribe({ data: { audio_base64: b64, mime } });
          setText((t) => (t ? t + "\n\n" : "") + transcript);
          toast.success("Transcribed");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Transcription failed");
        } finally {
          setLoading(false);
        }
      };
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
    } catch {
      toast.error("Microphone access denied");
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setRecording(false);
  }

  async function handleSubmit() {
    if (!text.trim() && files.length === 0) {
      toast.error("Add some text or an attachment");
      return;
    }
    setLoading(true);
    try {
      const { payload } = await organize({
        data: {
          raw_text: text,
          file_data_urls: files.map((f) => f.dataUrl),
          current_timestamp: new Date().toISOString(),
        },
      });
      toast.success(`Captured · ${payload.tasks.length} task(s) · ${payload.decisions.length} decision(s)`);
      setText("");
      setFiles([]);
      qc.invalidateQueries();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to organize");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Module 02</p>
        <h1 className="mt-1 font-display text-4xl">Blankspace</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          The intelligence canvas. Paste raw thinking, drop screenshots, or dictate.
          AI structures it into a summary, decisions, tasks, and tags.
        </p>
      </header>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); }}
        className={cn(
          "rounded-2xl border border-border bg-card shadow-card transition-colors",
          dragOver && "border-charcoal bg-muted",
        )}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste chat logs, meeting transcripts, brainstorms… or drop screenshots below."
          className="min-h-[220px] w-full resize-y rounded-t-2xl bg-transparent p-6 text-sm outline-none placeholder:text-muted-foreground"
        />

        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-border px-6 py-3">
            {files.map((f, i) => (
              <div key={i} className="group relative">
                <img src={f.dataUrl} alt={f.name} className="h-16 w-16 rounded-md object-cover" />
                <button
                  onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))}
                  className="absolute -right-1 -top-1 hidden rounded-full bg-charcoal p-0.5 text-offwhite group-hover:block"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 border-t border-border p-3">
          <div className="flex items-center gap-1">
            <label className="inline-flex cursor-pointer items-center gap-1 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted">
              <Paperclip className="h-3.5 w-3.5" /> Attach
              <input type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && addFiles(e.target.files)} />
            </label>
            <button
              onClick={recording ? stopRecording : startRecording}
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs",
                recording ? "bg-destructive text-destructive-foreground" : "text-muted-foreground hover:bg-muted",
              )}
            >
              <Mic className={cn("h-3.5 w-3.5", recording && "animate-pulse")} />
              {recording ? "Stop" : "Voice"}
            </button>
            <span className="ml-2 hidden items-center gap-1 text-xs text-muted-foreground sm:inline-flex">
              <Upload className="h-3 w-3" /> or drop images anywhere
            </span>
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Organizing…" : "Organize"}
          </Button>
        </div>
      </div>

      {/* Recent */}
      <section>
        <h2 className="font-display text-2xl">Recent Captures</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {recent.map((c) => (
            <article key={c.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-center gap-2">
                <span className="rounded bg-stone-warm px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-charcoal">
                  {c.capture_type ?? "note"}
                </span>
                <span className="text-[11px] text-muted-foreground">{format(parseISO(c.created_at), "MMM d, h:mm a")}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">{c.summary}</p>
              {c.raw_content && (
                <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">{c.raw_content}</p>
              )}
            </article>
          ))}
          {recent.length === 0 && <p className="text-sm text-muted-foreground">Nothing captured yet.</p>}
        </div>
      </section>
    </div>
  );
}
