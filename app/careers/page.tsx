"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { reveal, stagger } from "@/lib/animations";
import { Bookmark, Building2, ChevronDown, MapPin, Share2, Search, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface Career {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  qualifications?: string[];
}

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

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

  const filteredCareers = careers.filter(career => 
    career.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    career.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    career.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#f8f9fa] pt-28 pb-24">
      <div className="container-main max-w-7xl">
        
        {/* Top Bar matching Google Careers style */}
        <div className="mb-6 flex flex-col gap-4 border-b border-zinc-200 pb-4 md:flex-row md:items-center md:justify-between">
          <div className="text-xl font-medium text-zinc-700">
            {loading ? (
              <span className="text-zinc-400">Loading jobs...</span>
            ) : (
              <>
                <span className="text-[#137333] font-semibold">{filteredCareers.length}</span> jobs matched
              </>
            )}
          </div>
          <button 
            onClick={() => setSearchQuery("")}
            className="self-start rounded-md bg-[#e8f0fe] px-4 py-2 text-sm font-medium text-[#1967d2] transition hover:bg-[#d2e3fc] md:self-auto"
          >
            Clear filters
          </button>
        </div>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[280px_1fr]">
          
          {/* Left Sidebar Filters */}
          <aside className="sticky top-28 flex flex-col gap-0 border-r border-zinc-200 pr-6 hidden md:flex">
            
            {/* Search Box */}
            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder="What do you want to do?" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-zinc-300 bg-white p-3 text-sm text-zinc-800 shadow-sm outline-none transition focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
              />
            </div>
          </aside>

          {/* Main Content - Job Listings */}
          <div className="flex flex-col gap-6">

            {/* Mobile Search Box */}
            <div className="relative md:hidden">
              <input 
                type="text" 
                placeholder="What do you want to do?" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-zinc-300 bg-white p-3 text-sm text-zinc-800 shadow-sm outline-none transition focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
              />
            </div>
            
            {/* Alert Toggle Placeholder */}
            <div className="flex items-center gap-3 text-sm text-zinc-600">
              <div className="h-4 w-8 rounded-full bg-zinc-300 relative cursor-pointer">
                <div className="absolute left-1 top-1 h-2 w-2 rounded-full bg-zinc-500" />
              </div>
              Turn on job alerts for this search
            </div>

            <AnimatePresence mode="popLayout">
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex h-40 items-center justify-center"
                >
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-[#1a73e8]" />
                </motion.div>
              ) : filteredCareers.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-12 text-center"
                >
                  <Briefcase size={40} className="mb-4 text-zinc-300" />
                  <h3 className="text-xl font-semibold text-zinc-800">No jobs found</h3>
                  <p className="mt-2 text-zinc-500">Try adjusting your search or filters.</p>
                </motion.div>
              ) : (
                <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-6">
                  {filteredCareers.map((career) => (
                    <motion.article 
                      key={career.id} 
                      variants={reveal}
                      layout
                      className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
                    >
                      {/* Job Header */}
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="font-display text-2xl font-normal text-zinc-900 md:text-3xl">
                          {career.title}
                        </h2>
                        <div className="flex shrink-0 items-center gap-2 text-zinc-500">
                          <button className="grid size-10 place-items-center rounded-full transition hover:bg-zinc-100 hover:text-zinc-900">
                            <Share2 size={20} />
                          </button>
                          <button className="grid size-10 place-items-center rounded-full transition hover:bg-zinc-100 hover:text-zinc-900">
                            <Bookmark size={20} />
                          </button>
                        </div>
                      </div>

                      {/* Job Meta Info */}
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-medium text-zinc-600">
                        <div className="flex items-center gap-1.5">
                          <Building2 size={16} className="text-zinc-400" />
                          DevSoc, {career.department || "General"}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={16} className="text-zinc-400" />
                          {career.location || "Christ University, Bengaluru"}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="my-6 h-px w-full bg-zinc-100" />

                      {/* Minimum Qualifications */}
                      <div className="text-zinc-800">
                        <h3 className="font-semibold mb-3">Minimum qualifications</h3>
                        <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed text-zinc-700">
                          {career.qualifications && career.qualifications.length > 0 ? (
                            career.qualifications.map((qual, idx) => (
                              <li key={idx}>{qual}</li>
                            ))
                          ) : (
                            <>
                              <li>{career.description}</li>
                              <li>Experience working in collaborative team environments.</li>
                              <li>Strong problem-solving skills and willingness to learn.</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </motion.article>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </main>
  );
}
