import React from 'react';
import { Clock, Calendar, Users, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { TrainingProgram } from '../../types';
import { PlaceholderBadge } from '../common/PlaceholderBadge';
import { Button } from '../common/Button';

interface ProgramCardProps {
  program: TrainingProgram;
  onEnquire?: (programTitle: string) => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program, onEnquire }) => {
  return (
    <div
      id={program.id}
      className="group rounded-2xl bg-white border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Card Media Header */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={program.image}
            alt={program.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

          {/* Badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-sm">
              {program.badge}
            </span>
          </div>

          {/* Placeholder Notice Badge */}
          <div className="absolute top-4 right-4">
            <PlaceholderBadge label="XYZ Details" />
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-2xl sm:text-3xl font-display uppercase tracking-wide text-white group-hover:text-amber-400 transition-colors">
              {program.title}
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-6">
          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            {program.longDesc}
          </p>

          {/* Meta Specifications Grid (Marked with XYZ) */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
            <div className="flex items-start gap-2">
              <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 block text-[11px] uppercase">Training Level</span>
                <span className="text-slate-900 font-semibold">{program.level}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 block text-[11px] uppercase">Age Cohort</span>
                <span className="text-slate-900 font-semibold">{program.ageGroup}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 block text-[11px] uppercase">Schedule</span>
                <span className="text-slate-900 font-semibold">{program.schedule}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 block text-[11px] uppercase">Duration</span>
                <span className="text-slate-900 font-semibold">{program.duration}</span>
              </div>
            </div>
          </div>

          {/* Curriculum Key Highlights */}
          <div>
            <h4 className="text-xs uppercase font-heading font-bold tracking-wider text-slate-800 mb-3">
              Curriculum Core Focus
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {program.highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Focus Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {program.focusAreas.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono uppercase bg-slate-100 text-slate-700 border border-slate-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Action */}
      <div className="p-6 pt-0">
        <Button
          to={`/contact?program=${encodeURIComponent(program.title)}`}
          onClick={() => onEnquire && onEnquire(program.title)}
          variant="secondary"
          size="md"
          className="w-full border-amber-300 hover:border-amber-500 hover:bg-amber-500 hover:text-slate-950 font-bold shadow-sm"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Enquire About {program.title.split(' ')[0]} Training
        </Button>
      </div>
    </div>
  );
};
