const testPreviews = [
  {
    label: "👩 Lucia Kováčová – Joga, Mallorca (s letenkou)",
    url: "/preview/mallorca-lucia-kovacova-1v2s",
    note: "Verejný odkaz – bez hesla",
  },
  {
    label: "👨 Marek Horváth – Fitcamp, Kréta (bez letenky)",
    url: "/preview/kreta-marek-horvath-pjic",
    note: "Verejný odkaz – bez hesla",
  },
];

const TestPreviews = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-8">
    <div className="max-w-lg w-full space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Testovacie preview stránky</h1>
      <p className="text-muted-foreground text-sm">Klikni na odkaz – preview sa otvorí bez hesla.</p>
      <div className="space-y-4">
        {testPreviews.map((p) => (
          <a
            key={p.url}
            href={p.url}
            className="block rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow"
          >
            <p className="font-semibold text-foreground">{p.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{p.note}</p>
          </a>
        ))}
      </div>
    </div>
  </div>
);

export default TestPreviews;
