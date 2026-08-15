import { useCallback, useEffect, useRef, useState } from "react";
import { makePost, makePostAsync, seedPosts, seedPostsAsync, LIVE_FEED_INTERVAL_MS, type SimPost } from "@/lib/simulator";
import type { IncidentStatus } from "@/lib/ops";
import { useDemoScenario } from "@/context/DemoScenarioContext";

const SEED = 5;
const MAX = 30;
const INTERVAL_MS = LIVE_FEED_INTERVAL_MS || 9000;

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
  const [isClassifying, setIsClassifying] = useState(false);
  const indexRef = useRef(SEED);
  const soundRef = useRef(sound);
  soundRef.current = sound;
  const isProcessingRef = useRef(false);

  // Connect with demo scenario context
  let demoContext: ReturnType<typeof useDemoScenario> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    demoContext = useDemoScenario();
  } catch {
    /* if used outside provider */
  }

  // Initial seed on mount
  useEffect(() => {
    setPosts(seedPosts(SEED));

    let isMounted = true;
    seedPostsAsync(SEED)
      .then((aiPosts) => {
        if (isMounted && aiPosts.length > 0) {
          setPosts(aiPosts);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync injected scenario posts immediately when triggered
  useEffect(() => {
    if (demoContext?.injectedPosts && demoContext.injectedPosts.length > 0) {
      const scenarioItems = demoContext.injectedPosts;
      setPosts((prev) => {
        const filtered = prev.filter((p) => !scenarioItems.some((s) => s.id === p.id));
        return [...scenarioItems, ...filtered].slice(0, MAX);
      });
      setSelectedId(scenarioItems[0]?.id || null);
    }
  }, [demoContext?.injectedPosts]);

  // Live ingestion stream with dynamic AI classification (1 post every 8-10s)
  useEffect(() => {
    if (!live) return;

    const timer = setInterval(async () => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;
      setIsClassifying(true);

      const nextIndex = indexRef.current++;
      try {
        const post = await makePostAsync(nextIndex);
        setPosts((prev) => [post, ...prev].slice(0, MAX));
        if (soundRef.current) playAlert(post.priority);
      } catch {
        const post = makePost(nextIndex);
        setPosts((prev) => [post, ...prev].slice(0, MAX));
        if (soundRef.current) playAlert(post.priority);
      } finally {
        isProcessingRef.current = false;
        setIsClassifying(false);
      }
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
    isClassifying,
  };
}

export type IngestionFeed = ReturnType<typeof useIngestionFeed>;
