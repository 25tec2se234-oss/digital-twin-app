import SpinWheel from "./wheel/SpinWheel";

export default function App() {
  return (
    <main className="stage-bg relative h-full w-full overflow-hidden">
      {/* soft god rays radiating behind the instrument */}
      <div className="god-rays pointer-events-none absolute left-1/2 top-1/2 h-[150vmin] w-[150vmin] -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
      {/* cinematic vignette */}
      <div className="vignette pointer-events-none absolute inset-0" aria-hidden="true" />

      <SpinWheel />
    </main>
  );
}
