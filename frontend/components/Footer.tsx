export default function Footer() {
  return (
    <footer className="bg-secondary/20 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-foreground/80 text-sm">
          © {new Date().getFullYear()} FemAura. Empowering Women with PCOS.
        </p>
        <div className="mt-4 flex justify-center space-x-6">
          <a href="#" className="text-foreground/60 hover:text-primary">Privacy</a>
          <a href="#" className="text-foreground/60 hover:text-primary">Terms</a>
          <a href="#" className="text-foreground/60 hover:text-primary">Contact</a>
        </div>
      </div>
    </footer>
  );
}


