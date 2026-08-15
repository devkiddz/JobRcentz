import ActionButton from './ActionButton';
import LogoContainer from './LogoContainer';

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/40 backdrop-blur-3xl">
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4">
        <LogoContainer />
        <div className="flex items-center gap-4">
          <ActionButton />
        </div>
      </nav>
    </header>
  );
}
