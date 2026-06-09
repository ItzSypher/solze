import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function Reviews() {
  return (
    <section id="reviews" className="mx-auto max-w-7xl px-4 sm:px-6 mt-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-xl mx-auto"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Customer reviews
        </p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
          What people are saying
        </h2>
      </motion.div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex gap-0.5 text-muted-foreground/40">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="h-4 w-4" />
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No reviews yet — be the first to share your experience after your
              order arrives.
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
