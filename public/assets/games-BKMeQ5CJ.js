import { f as ReactDOM, j as jsxRuntimeExports, r as reactExports, A as ArrowLeft, e as RotateCw, S as Search, X, d as cn } from "./styles-DdAdgHfX.js";
function GamesPage() {
  const [games, setGames] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [selectedGame, setSelectedGame] = reactExports.useState(null);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedTag, setSelectedTag] = reactExports.useState(null);
  const iframeRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const url = `${window.location.origin}/g.json`;
    console.log("Fetching games from:", url);
    fetch(url).then((res) => {
      console.log("Response status:", res.status, res.statusText);
      if (!res.ok) throw new Error(`Failed to load games: ${res.status} ${res.statusText}`);
      return res.json();
    }).then((data) => {
      console.log("Loaded games:", data.length);
      setGames(data);
      setLoading(false);
    }).catch((err) => {
      console.error("Error loading games:", err);
      setError(err.message);
      setLoading(false);
    });
  }, []);
  const allTags = reactExports.useMemo(() => {
    const tagSet = /* @__PURE__ */ new Set();
    games.forEach((game) => {
      game.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [games]);
  const filteredGames = reactExports.useMemo(() => {
    return games.filter((game) => {
      const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !selectedTag || game.tags?.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [games, searchQuery, selectedTag]);
  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };
  const handleBackToList = () => {
    setSelectedGame(null);
  };
  const getGameUrl = (game) => {
    return `${window.location.origin}/resources/${game.directory}/index.html`;
  };
  const getImageUrl = (game) => {
    return `${"/"}resources/${game.directory}/${game.image}`;
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-screen w-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Loading games..." }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-screen w-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-destructive", children: [
      "Error: ",
      error
    ] }) });
  }
  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };
  if (selectedGame) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-screen w-screen flex flex-col bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b bg-card px-4 py-3 flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleBackToList,
            className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
            type: "button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
              "Back to games"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleRefresh,
            className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
            type: "button",
            title: "Refresh game",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCw, { className: "w-4 h-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: selectedGame.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "iframe",
        {
          ref: iframeRef,
          src: getGameUrl(selectedGame),
          className: "absolute inset-0 w-full h-full border-0",
          title: selectedGame.name,
          allow: "fullscreen; autoplay; encrypted-media; gamepad; microphone; camera",
          allowFullScreen: true
        }
      ) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background p-6 overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold font-display mb-2", children: "games" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
          "Browse and play ",
          games.length,
          " games"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-col sm:flex-row gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: "Search games...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "w-full pl-10 pr-10 py-2 rounded-md border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            }
          ),
          searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setSearchQuery(""),
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
              type: "button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
            }
          )
        ] }),
        allTags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Filter:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setSelectedTag(null),
              className: cn(
                "px-3 py-1 rounded-full text-xs border transition-colors",
                !selectedTag ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-accent border-border"
              ),
              type: "button",
              children: "All"
            }
          ),
          allTags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setSelectedTag(tag),
              className: cn(
                "px-3 py-1 rounded-full text-xs border transition-colors",
                selectedTag === tag ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-accent border-border"
              ),
              type: "button",
              children: tag
            },
            tag
          ))
        ] })
      ] }),
      filteredGames.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No games found" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4", children: filteredGames.map((game) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => handleGameSelect(game),
          className: "group relative aspect-square rounded-md border bg-card hover:bg-accent transition-all overflow-hidden",
          type: "button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-muted flex items-center justify-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: getImageUrl(game),
                  alt: game.name,
                  className: "w-full h-full object-cover",
                  loading: "lazy",
                  onError: (e) => {
                    const target = e.target;
                    target.style.display = "none";
                    const fallback = target.nextElementSibling;
                    if (fallback) fallback.style.display = "flex";
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 items-center justify-center hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl font-bold text-muted-foreground", children: game.name[0]?.toUpperCase() || "?" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-foreground truncate", children: game.name }),
              game.tags && game.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: game.tags.slice(0, 2).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary",
                  children: tag
                },
                tag
              )) })
            ] }) })
          ]
        },
        game.directory
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 mb-24 text-center text-sm text-muted-foreground", children: [
        "Showing ",
        filteredGames.length,
        " of ",
        games.length,
        " games"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed bottom-4 right-4 text-base text-muted-foreground z-10", children: [
      "brought to you by ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl text-primary", children: "fern" })
    ] })
  ] });
}
const rootElement = document.getElementById("root");
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(GamesPage, {}) })
  );
}
