import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const OrganizeInput = z.object({
  raw_text: z.string().default(""),
  file_data_urls: z.array(z.string()).default([]), // base64 data URLs of images
  current_timestamp: z.string(),
});

interface AiTask {
  task_text: string;
  due_date: string | null;
  priority: "low" | "medium" | "high";
}

interface AiPayload {
  summary: string;
  type: string;
  suggested_project: string | null;
  decisions: string[];
  tasks: AiTask[];
  tags: string[];
}

const SYSTEM_PROMPT = `You are the Blankspace Intelligence Engine for Third Room Studio.
The user pastes raw thinking (chat logs, transcripts, screenshots, notes).
Return a STRICT JSON object matching this schema — no prose, no markdown, no code fences:
{
  "summary": string (3-5 sentence executive summary),
  "type": one of "Brand" | "Business Model" | "Technical" | "Marketing" | "Finance" | "Operations" | "Strategy",
  "suggested_project": string | null (short partner or internal project name),
  "decisions": string[] (explicit decisions extracted from input, empty array if none),
  "tasks": [{ "task_text": string, "due_date": ISO-8601 string with timezone or null, "priority": "low"|"medium"|"high" }],
  "tags": string[] (3-6 lowercase single-word tags)
}
Interpret relative dates (tomorrow, next Monday, in 2 hours) using the provided current_timestamp.
Read attached images/screenshots as first-class context.`;

export const organizeCapture = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => OrganizeInput.parse(input))
  .handler(async ({ data, context }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const content: Array<Record<string, unknown>> = [
      {
        type: "text",
        text: `current_timestamp: ${data.current_timestamp}\n\n---\n${data.raw_text || "(no text — analyze the attached files)"}`,
      },
    ];
    for (const url of data.file_data_urls) {
      content.push({ type: "image_url", image_url: { url } });
    }

    const body = {
      model: "openai/gpt-5.5",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content },
      ],
      response_format: { type: "json_object" },
    };

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Rate limited — try again shortly.");
      if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Workspace settings.");
      throw new Error(`AI gateway ${res.status}: ${text}`);
    }

    const payload = await res.json();
    const raw = payload?.choices?.[0]?.message?.content ?? "{}";
    let parsed: AiPayload;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("AI returned malformed JSON");
    }

    // Persist capture + related rows
    const { supabase, userId } = context;

    // Find or create project
    let projectId: string | null = null;
    if (parsed.suggested_project) {
      const { data: existing } = await supabase
        .from("projects")
        .select("id")
        .ilike("name", parsed.suggested_project)
        .maybeSingle();
      if (existing) projectId = existing.id;
      else {
        const { data: created } = await supabase
          .from("projects")
          .insert({ name: parsed.suggested_project })
          .select("id")
          .single();
        projectId = created?.id ?? null;
      }
    }

    const { data: capture, error: capErr } = await supabase
      .from("captures")
      .insert({
        user_id: userId,
        project_id: projectId,
        raw_content: data.raw_text,
        file_urls: [],
        summary: parsed.summary,
        capture_type: parsed.type,
        ai_payload: parsed as unknown as never,
      })
      .select("id")
      .single();
    if (capErr || !capture) throw new Error(capErr?.message ?? "Insert capture failed");

    if (parsed.tasks?.length) {
      await supabase.from("tasks").insert(
        parsed.tasks.map((t) => ({
          capture_id: capture.id,
          project_id: projectId,
          task_text: t.task_text,
          due_date: t.due_date,
          priority: t.priority,
        })),
      );
    }

    if (parsed.decisions?.length) {
      await supabase.from("decisions").insert(
        parsed.decisions.map((d) => ({
          capture_id: capture.id,
          project_id: projectId,
          decision_text: d,
        })),
      );
    }

    if (parsed.tags?.length) {
      for (const name of parsed.tags) {
        const clean = name.toLowerCase().trim().slice(0, 50);
        if (!clean) continue;
        const { data: tag } = await supabase
          .from("tags")
          .upsert({ name: clean }, { onConflict: "name" })
          .select("id")
          .single();
        if (tag) await supabase.from("capture_tags").insert({ capture_id: capture.id, tag_id: tag.id });
      }
    }

    return { capture_id: capture.id, payload: parsed };
  });

// ---------- Speech-to-text ----------

const TranscribeInput = z.object({
  audio_base64: z.string(),
  mime: z.string().default("audio/webm"),
});

export const transcribeAudio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => TranscribeInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const bin = Uint8Array.from(atob(data.audio_base64), (c) => c.charCodeAt(0));
    const ext = data.mime.includes("mp4") ? "mp4" : data.mime.includes("wav") ? "wav" : data.mime.includes("mpeg") ? "mp3" : "webm";
    const blob = new Blob([bin], { type: data.mime });
    const form = new FormData();
    form.append("model", "openai/gpt-4o-transcribe");
    form.append("file", blob, `recording.${ext}`);

    const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Transcription failed ${res.status}: ${text}`);
    }
    const json = await res.json();
    return { text: (json.text as string) ?? "" };
  });
