import { useCallback, useEffect, useRef, useState } from "react";
import { makePost, seedPosts, type SimPost } from "@/lib/simulator";
import type { IncidentStatus } from "@/lib/ops";

const SEED = 5;
const MAX = 30;
const INTERVAL_MS = 4000;

function playAlert(priority: SimPost["priority"]) {
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = priority === "critical" ? 880 : 620;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
    osc.onended = () => void ctx.close();
  } catch {
    /* audio unavailable */
  }
}

export function useIngestionFeed() {
  const [posts, setPosts] = useState<SimPost[]>([]);
  const [live, setLive] = useState(true);
  const [sound, setSound] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, IncidentStatus>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const indexRef = useRef(SEED);
  const soundRef = useRef(sound);
  soundRef.current = sound;

  useEffect(() => {
    setPosts(seedPosts(SEED));
  }, []);

  useEffect(() => {
    if (!live) return;
    const timer = setInterval(() => {
      const post = makePost(indexRef.current++);
      setPosts((prev) => [post, ...prev].slice(0, MAX));
      if (soundRef.current) playAlert(post.priority);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [live]);

  const toggleSound = useCallback(() => {
    setSound((s) => {
      if (!s) playAlert("high");
      return !s;
    });
  }, []);

  const setStatus = useCallback((id: string, status: IncidentStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
  }, []);

  const statusOf = useCallback(
    (post: SimPost): IncidentStatus => statuses[post.id] ?? "new",
    [statuses],
  );

  return {
    posts,
    live,
    setLive,
    sound,
    toggleSound,
    statuses,
    statusOf,
    setStatus,
    selectedId,
    setSelectedId,
  };
}

export type IngestionFeed = ReturnType<typeof useIngestionFeed>;
