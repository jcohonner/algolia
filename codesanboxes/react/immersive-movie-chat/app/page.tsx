'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, UIMessage } from 'ai';
import Image from 'next/image';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import styles from './page.module.css';

type Movie = {
  title: string;
  year: number;
  reason: string;
  posterUrl: string;
};

type Turn = {
  user: string;
  assistant: string;
};

type RecommendationObject = {
  assistantMessage: string;
  movies: Movie[];
};

type AlgoliaHit = {
  title?: string;
  original_title?: string;
  year?: number;
  release_date?: number;
  overview?: string;
  poster?: string;
};

type DisplaySelectionArgs = {
  hits?: AlgoliaHit[];
};

const AGENT_API_URL =
  'https://3ea6kssdgw.algolia.net/agent-studio/1/agents/8ace0d38-0a9c-45df-920f-c6d4e28a5743/completions?compatibilityMode=ai-sdk-5';

function getMessageText(message: UIMessage): string {
  if (!message.parts?.length) return '';

  return message.parts
    .filter(
      (part): part is { type: 'text'; text: string } =>
        typeof part === 'object' && part !== null && part.type === 'text' && 'text' in part
    )
    .map((part) => part.text)
    .join('\n')
    .trim();
}

function parseRecommendationFromText(text: string): RecommendationObject | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const candidates = [trimmed];
  const fencedMatch = trimmed.match(/```json\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) candidates.push(fencedMatch[1].trim());

  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    candidates.push(trimmed.slice(start, end + 1));
  }

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as Partial<RecommendationObject>;
      if (!parsed || !Array.isArray(parsed.movies) || typeof parsed.assistantMessage !== 'string') {
        continue;
      }

      const movies = parsed.movies
        .filter((movie): movie is Movie => {
          return (
            typeof movie === 'object' &&
            movie !== null &&
            typeof movie.title === 'string' &&
            typeof movie.year === 'number' &&
            typeof movie.reason === 'string' &&
            typeof movie.posterUrl === 'string'
          );
        })
        .slice(0, 8);

      if (!movies.length) continue;

      return {
        assistantMessage: parsed.assistantMessage,
        movies
      };
    } catch {
      continue;
    }
  }

  return null;
}

function normalizeYear(hit: AlgoliaHit): number {
  if (typeof hit.year === 'number' && Number.isFinite(hit.year)) {
    return Math.trunc(hit.year);
  }

  if (typeof hit.release_date === 'number' && Number.isFinite(hit.release_date)) {
    return new Date(hit.release_date * 1000).getUTCFullYear();
  }

  return new Date().getUTCFullYear();
}

function mapHitsToMovies(hits: AlgoliaHit[]): Movie[] {
  return hits
    .filter((hit) => typeof hit === 'object' && hit !== null)
    .map((hit) => {
      const title = hit.title?.trim() || hit.original_title?.trim() || 'Titre inconnu';
      const reason = hit.overview?.trim() || 'Selection recommandee pour cette recherche.';
      return {
        title,
        year: normalizeYear(hit),
        reason,
        posterUrl: typeof hit.poster === 'string' ? hit.poster : ''
      };
    })
    .slice(0, 8);
}

export default function Home() {
  const [input, setInput] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    if (!trackRef.current) return;
    const safeIndex = Math.max(0, Math.min(index, movies.length - 1));
    const child = trackRef.current.children[safeIndex] as HTMLElement | undefined;
    if (!child) return;

    child.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    setCarouselIndex(safeIndex);
  };

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: AGENT_API_URL,
      headers: {
        'x-algolia-application-id': '3EA6KSSDGW',
        'x-algolia-api-key': '23fef1254e41ec407b1fc80f852e4a40'
      }
    }),
    async onToolCall({
      toolCall
    }: {
      toolCall: { toolName: string; input?: unknown };
    }) {
      if (toolCall.toolName !== 'displaySelection') return;

      const args = (toolCall.input ?? {}) as DisplaySelectionArgs;
      const hits = Array.isArray(args.hits) ? args.hits : [];
      const nextMovies = mapHitsToMovies(hits);

      if (!nextMovies.length) return;

      setMovies(nextMovies);
      setCarouselIndex(0);
      requestAnimationFrame(() => {
        scrollToIndex(0);
      });
    }
  });

  const isLoading = status === 'submitted' || status === 'streaming';
  const canGoPrev = carouselIndex > 0;
  const canGoNext = carouselIndex < movies.length - 1;

  const subtitle = useMemo(() => {
    if (!movies.length) {
      return 'Le carrousel se remplit des que l\'agent te propose une selection.';
    }
    return `${movies.length} films proposes`;
  }, [movies.length]);

  const latestUser = [...messages].reverse().find((message) => message.role === 'user');
  const latestAssistant = [...messages].reverse().find((message) => message.role === 'assistant');
  const latestUserText = latestUser ? getMessageText(latestUser) : '';
  const latestAssistantText = latestAssistant ? getMessageText(latestAssistant) : '';
  const parsedAssistant = useMemo(
    () => parseRecommendationFromText(latestAssistantText),
    [latestAssistantText]
  );

  useEffect(() => {
    if (!parsedAssistant) return;

    setMovies(parsedAssistant.movies);
    setCarouselIndex(0);
    requestAnimationFrame(() => {
      scrollToIndex(0);
    });
  }, [parsedAssistant]);

  const activeTurn: Turn | null = latestUserText
    ? {
        user: latestUserText,
        assistant:
          parsedAssistant?.assistantMessage ||
          latestAssistantText ||
          (isLoading ? 'Je cherche une selection qui te correspond...' : '')
      }
    : null;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userText = input.trim();
    if (!userText || isLoading) return;

    setInput('');
    sendMessage({ text: userText });
  };

  return (
    <main className={styles.page}>
      <section className={styles.carouselZone}>
        <header className={styles.header}>
          <h1>Movie Finder</h1>
          <p>{subtitle}</p>
        </header>

        <div className={styles.carouselShell}>
          <button
            className={styles.arrow}
            onClick={() => scrollToIndex(carouselIndex - 1)}
            disabled={!canGoPrev}
            aria-label="Film precedent"
            type="button"
          >
            ‹
          </button>

          <div className={styles.track} ref={trackRef}>
            {movies.length ? (
              movies.map((movie, index) => (
                <article key={`${movie.title}-${movie.year}`} className={styles.posterCard}>
                  <div className={styles.posterWrap}>
                    {movie.posterUrl ? (
                      <Image
                        src={movie.posterUrl}
                        alt={`Affiche du film ${movie.title}`}
                        fill
                        sizes="(max-width: 768px) 66vw, 33vw"
                        priority={index === 0}
                      />
                    ) : (
                      <div className={styles.posterFallback}>No Poster</div>
                    )}
                    <span className={styles.year}>{movie.year}</span>
                  </div>
                  <div className={styles.movieMeta}>
                    <h2>{movie.title}</h2>
                    <p>{movie.reason}</p>
                  </div>
                </article>
              ))
            ) : (
              <article className={styles.posterCard}>
                <div className={styles.posterWrap}>
                  <div className={styles.posterFallback}>Ton prochain film apparaitra ici</div>
                </div>
                <div className={styles.movieMeta}>
                  <h2>Lance le chat</h2>
                  <p>Decris ton mood, un genre, une duree ou une ambiance.</p>
                </div>
              </article>
            )}
          </div>

          <button
            className={styles.arrow}
            onClick={() => scrollToIndex(carouselIndex + 1)}
            disabled={!canGoNext}
            aria-label="Film suivant"
            type="button"
          >
            ›
          </button>
        </div>
      </section>

      <section className={styles.chatZone}>
        <div className={styles.bubbleStack}>
          {activeTurn ? (
            <>
              <p className={`${styles.bubble} ${styles.userBubble}`}>{activeTurn.user}</p>
              <p className={`${styles.bubble} ${styles.agentBubble}`}>{activeTurn.assistant}</p>
            </>
          ) : (
            <p className={`${styles.bubble} ${styles.agentBubble}`}>
              Dis-moi ce que tu veux regarder ce soir.
            </p>
          )}
        </div>

        <form onSubmit={onSubmit} className={styles.form}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ex: thriller court, intelligent, pas trop violent"
            className={styles.input}
            disabled={isLoading}
          />
          <button type="submit" className={styles.send} disabled={isLoading || !input.trim()}>
            {isLoading ? '...' : 'Go'}
          </button>
        </form>
      </section>
    </main>
  );
}
