import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoAsset from "@/assets/solze-logo.png.asset.json";

export function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide preloader after initial load (or when data is ready)
    const handleLoad = () => {
      setTimeout(() => setLoading(false), 800);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
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
