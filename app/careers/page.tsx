"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { reveal, stagger } from "@/lib/animations";
import { Briefcase, ChevronRight, Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

interface Career {
  id: string;
  title: string;
  department: string;
  type: string; // e.g. "Full-time", "Internship"
  location: string;
  description: string;
}

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchCareers() {
      try {
        const querySnapshot = await getDocs(collection(db, "careers"));
        const careersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Career[];
        setCareers(careersData);
      } catch (error) {
        console.error("Error fetching careers:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCareers();
  }, []);

  return (
    <main className="min-h-screen pt-28 pb-24">
      <div className="container-main">
        <SectionHeader eyebrow="Opportunities" title="Open Positions" />
        
        <motion.p 
          variants={reveal} 
          initial="hidden" 
          animate="show" 
          className="mx-auto mt-6 max-w-2xl text-center text-lg text-zinc-600"
        >
          Join our team of developers, designers, and innovators. We're looking for passionate individuals to help build the future.
        </motion.p>

        {loading ? (
          <div className="mt-20 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-accent" />
          </div>
        ) : careers.length === 0 ? (
          <motion.div 
            variants={reveal} 
            initial="hidden" 
            animate="show" 
            className="mt-20 text-center"
          >
            <div className="mx-auto mb-6 grid size-20 place-items-center rounded-2xl bg-zinc-50">
              <Briefcase className="text-zinc-400" size={32} />
            </div>
            <h3 className="font-display text-2xl font-bold text-ink">No open positions</h3>
            <p className="mt-2 text-zinc-500">We aren't currently hiring for any roles. Check back soon!</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={stagger} 
            initial="hidden" 
            animate="show" 
            className="mx-auto mt-16 max-w-4xl grid gap-6"
          >
            {careers.map((career) => (
              <motion.div 
                key={career.id} 
                variants={reveal} 
                className="group flex flex-col justify-between gap-6 rounded-[24px] border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-accent hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:flex-row sm:items-center sm:p-8"
              >
                <div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                      {career.department || "General"}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-ink">{career.title}</h3>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-500">
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} />
                      {career.type || "Internship"}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} />
                      {career.location || "Christ University"}
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-zinc-600 max-w-2xl line-clamp-2">
                    {career.description}
                  </p>
                </div>
                
                <button 
                  onClick={() => router.push(`/careers/${career.id}`)}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 font-semibold text-white transition hover:bg-accent sm:w-auto sm:shrink-0"
                >
                  Apply Now
                  <ChevronRight size={18} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
