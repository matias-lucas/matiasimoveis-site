// Mesmas dimensões do ImovelCard real (w-full, imagem 4:3, padding 16px)
// pra não causar layout shift ao trocar entre skeleton e resultado real.
export function ImovelCardSkeleton() {
  return (
    <div className="w-full bg-bg-surface rounded-lg overflow-hidden shadow-md" aria-hidden="true">
      <div className="aspect-[4/3] bg-bg-sunken animate-pulse" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-5 w-28 rounded-sm bg-bg-sunken animate-pulse" />
        <div className="h-4 w-4/5 rounded-sm bg-bg-sunken animate-pulse" />
        <div className="h-3.5 w-2/5 rounded-sm bg-bg-sunken animate-pulse" />
        <div className="h-4 w-full rounded-sm bg-bg-sunken animate-pulse mt-2" />
      </div>
    </div>
  );
}
