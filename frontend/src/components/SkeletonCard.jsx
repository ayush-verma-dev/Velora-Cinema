import { motion } from "framer-motion";

function SkeletonCard() {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 1.4 }}
      className="overflow-hidden rounded-3xl bg-[#151A26]"
    >
      <div className="h-[420px] bg-white/5" />

      <div className="space-y-3 p-5">
        <div className="h-6 w-2/3 rounded bg-white/5" />
        <div className="h-4 w-1/3 rounded bg-white/5" />
        <div className="h-10 rounded-xl bg-white/5" />
      </div>
    </motion.div>
  );
}

export default SkeletonCard;