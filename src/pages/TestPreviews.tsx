const testPreviews = [
  {
    label: "👩 Lucia Kováčová – Joga, Mallorca",
    url: "/preview/mallorca-lucia-kovacova-msys",
    accessCode: "luciakovacova",
  },
  {
    label: "👨 Marek Horváth – Fitcamp, Kréta",
    url: "/preview/kreta-marek-horvath-4odv",
    accessCode: "marekhorvath",
  },
];

const TestPreviews = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-8">
    <div className="max-w-lg w-full space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Testovacie preview stránky</h1>
      <p className="text-muted-foreground text-sm">Klikni na odkaz a zadaj prístupový kód.</p>
      <div className="space-y-4">
        {testPreviews.map((p) => (
          <a
            key={p.url}
            href={p.url}
            className="block rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow"
          >
            <p className="font-semibold text-foreground">{p.label}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Kód: <code className="bg-muted px-1.5 py-0.5 rounded">{p.accessCode}</code>
            </p>
          </a>
        ))}
      </div>
    </div>
  </div>
);

export default TestPreviews;
