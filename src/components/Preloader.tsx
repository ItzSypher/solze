import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoAsset from "@/assets/solze-logo.png.asset.json";

export function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide quickly so the hero can paint (LCP): fade out on next frame,
    // with a short safety cap regardless of pending network work.
    const raf = requestAnimationFrame(() => setLoading(false));
    const cap = setTimeout(() => setLoading(false), 600);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(cap);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="relative"
          >
            <img
              src={logoAsset.url}
              alt="Solze"
              className="w-[100px] h-[100px] md:w-[300px] md:h-[300px] object-contain"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
