import React from 'react';
import { ArrowRight, Compass, Flame, Crosshair } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';

const PILLARS = [
  {
    id: 'technical',
    title: 'Technical Skills',
    eyebrow: 'BALL MASTERY & ACCURACY',
    description:
      'Ball control, precision passing, 1v1 dribbling moves, and lethal shooting mechanics designed to make technique instinctive.',
    points: ['Close ball manipulation', 'Weak foot development', 'First touch cushioning', 'Striking clean power & curl'],
    image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=800&q=80',
    icon: Crosshair,
  },
  {
    id: 'fitness',
    title: 'Fitness & Agility',
    eyebrow: 'ATHLETIC SPEED & STAMINA',
    description:
      'Speed ladder mechanics, explosive change of direction, cardiovascular endurance, and injury-prevention movement training.',
    points: ['Fast acceleration bursts', 'Deceleration & agility braking', 'Core stability & balance', '90-minute stamina base'],
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    icon: Flame,
  },
  {
    id: 'tactical',
    title: 'Tactical Development',
    eyebrow: 'FOOTBALL IQ & VISION',
    description:
      'Positional awareness, intelligent decision-making, pressing triggers, transitional awareness, and synchronized teamwork.',
    points: ['Pre-scanning before receiving', 'Zonal defensive shape', 'Off-ball combination runs', 'High-pressure composure'],
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    icon: Compass,
  },
];

export const BuiltForNextLevel: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 relative bg-white overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-amber-400/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          eyebrow="Comprehensive Development"
          title="BUILT FOR THE NEXT LEVEL"
          subtitle="A structured, European-calibre training methodology designed to transform enthusiastic grassroots players into polished, high-performing footballers."
        />

        {/* 3 Visual Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="group relative rounded-2xl bg-white border border-slate-200/90 hover:border-amber-400 hover:shadow-xl transition-all duration-300 shadow-sm flex flex-col justify-between overflow-hidden"
              >
                {/* Image Header */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  
                  {/* Category Chip */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-amber-300 shadow-sm backdrop-blur-md">
                    <Icon className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-amber-800">
                      Pillar 0{idx + 1}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-700 block mb-1">
                      {pillar.eyebrow}
                    </span>
                    <h3 className="text-2xl font-display uppercase tracking-wide text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-5">
                      {pillar.description}
                    </p>

                    {/* Bullet Points */}
                    <ul className="space-y-2 mb-6">
                      {pillar.points.map((pt, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-heading uppercase tracking-wider font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">
                      Curriculum Included
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-amber-600 group-hover:border-amber-400 transition-all">
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Explore All Training CTA */}
        <div className="text-center">
          <Button
            to="/training"
            variant="secondary"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
            className="border-amber-300 hover:border-amber-500 shadow-sm"
          >
            Explore All 6 Training Programmes
          </Button>
        </div>
      </div>
    </section>
  );
};
