import { useNavigate } from "react-router-dom";

import Hero from "../components/Hero";
import MovieGrid from "../components/MovieGrid";
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Hero Section */}
      <Hero />

      {/* Now Showing Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-14 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          {/* Left Content */}
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
              Velora Originals
            </p>

            <h2 className="mb-5 text-5xl font-bold text-foreground md:text-6xl">
              Now Showing
            </h2>

            <p className="max-w-xl text-lg leading-relaxed text-muted">
              Explore our exclusive blockbuster collection with premium IMAX
              experiences.
            </p>
          </div>

          {/* View All Button */}
          <button
            onClick={() => {
              window.scrollTo(0, 0);
              navigate("/movies");
            }}
            className="rounded-full border border-yellow-400 px-8 py-4 text-lg font-semibold text-yellow-300 transition-all duration-300 hover:bg-yellow-400 hover:text-black hover:shadow-[0_0_25px_rgba(250,204,21,.35)]"
          >
            View All
          </button>
        </div>

        {/* Movie Cards */}
        <MovieGrid />
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}

export default Home;