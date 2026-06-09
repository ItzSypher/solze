export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold">
              S
            </span>
            <span className="text-lg font-semibold">LOJA SOLZE</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Pieces made for sunlit days. Slow design, fair shipping, honest prices.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>New arrivals</li>
            <li>Best sellers</li>
            <li>Promotions</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Help</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Shipping</li>
            <li>Returns</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Newsletter</h4>
          <p className="text-sm text-muted-foreground">
            10% off your first order.
          </p>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} LOJA SOLZE. All rights reserved.
      </div>
    </footer>
  );
}
