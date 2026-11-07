import React from 'react';
import { Calendar, Clock, MapPin, AlertCircle, ExternalLink, Users } from 'lucide-react';
import { ACADEMY_CONFIG } from '../../data/academyData';

interface DaySchedule {
  id: string;
  day: string;
  status: string;
  juniorTiming: string;
  juniorAge: string;
  seniorTiming: string;
  seniorAge: string;
  pitchName: string;
  pitchDetails: string;
}

const ACADEMY_WEEKLY_SCHEDULE: DaySchedule[] = [
  {
    id: 'sch-mon',
    day: 'Monday',
    status: 'Active Training Day',
    juniorTiming: '4:30 PM to 5:30 PM',
    juniorAge: 'Age: 6 – 12',
    seniorTiming: '5:30 PM to 6:30 PM',
    seniorAge: 'Age: 12+',
    pitchName: 'Crimson Anisha Football Pitch',
    pitchDetails: 'Marunji Road, near Life Republic, Hinjawadi / Mulshi, Pune',
  },
  {
    id: 'sch-tue',
    day: 'Tuesday',
    status: 'Active Training Day',
    juniorTiming: '4:30 PM to 5:30 PM',
    juniorAge: 'Age: 6 – 12',
    seniorTiming: '5:30 PM to 6:30 PM',
    seniorAge: 'Age: 12+',
    pitchName: 'Crimson Anisha Football Pitch',
    pitchDetails: 'Marunji Road, near Life Republic, Hinjawadi / Mulshi, Pune',
  },
  {
    id: 'sch-thu',
    day: 'Thursday',
    status: 'Active Training Day',
    juniorTiming: '4:30 PM to 5:30 PM',
    juniorAge: 'Age: 6 – 12',
    seniorTiming: '5:30 PM to 6:30 PM',
    seniorAge: 'Age: 12+',
    pitchName: 'Crimson Anisha Football Pitch',
    pitchDetails: 'Marunji Road, near Life Republic, Hinjawadi / Mulshi, Pune',
  },
  {
    id: 'sch-fri',
    day: 'Friday',
    status: 'Active Training Day',
    juniorTiming: '4:30 PM to 5:30 PM',
    juniorAge: 'Age: 6 – 12',
    seniorTiming: '5:30 PM to 6:30 PM',
    seniorAge: 'Age: 12+',
    pitchName: 'Crimson Anisha Football Pitch',
    pitchDetails: 'Marunji Road, near Life Republic, Hinjawadi / Mulshi, Pune',
  },
];

export const SchedulePreview: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs uppercase font-heading tracking-[0.2em] font-bold text-amber-600">
                Weekly Timetable
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display uppercase tracking-wide text-slate-900">
              TRAINING SCHEDULE
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-800 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>4 Days a Week (Mon, Tue, Thu, Fri)</span>
          </div>
        </div>

        {/* Informative Alert */}
        <div className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-3 text-xs sm:text-sm text-slate-700 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong className="text-amber-800 font-semibold">Training Schedule:</strong> Weekly coaching sessions are held on Monday, Tuesday, Thursday, and Friday at Crimson Anisha Football Pitch. Players are requested to arrive 10 minutes prior to session kick-off in complete training gear.
          </p>
        </div>

        {/* Schedule Table / Grid */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200 text-xs font-heading uppercase tracking-wider text-slate-700">
                <th className="py-4 px-6">Day</th>
                <th className="py-4 px-6">Junior Batch (Age: 6 – 12)</th>
                <th className="py-4 px-6">Senior Batch (12+)</th>
                <th className="py-4 px-6">Ground Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {ACADEMY_WEEKLY_SCHEDULE.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Day Column */}
                  <td className="py-5 px-6">
                    <div className="font-heading font-bold uppercase text-slate-900 tracking-wide text-base">
                      {item.day}
                    </div>
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
                      {item.status}
                    </span>
                  </td>

                  {/* Junior Batch Column */}
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-1.5 text-sm font-mono font-bold text-slate-900">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{item.juniorTiming}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold mt-1">
                      <Users className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Junior Batch ({item.juniorAge})</span>
                    </div>
                  </td>

                  {/* Senior Batch Column */}
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-1.5 text-sm font-mono font-bold text-slate-900">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{item.seniorTiming}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold mt-1">
                      <Users className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Senior Batch ({item.seniorAge})</span>
                    </div>
                  </td>

                  {/* Ground Location Column */}
                  <td className="py-5 px-6">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-heading uppercase font-bold text-xs sm:text-sm text-slate-900 block tracking-wide">
                          {item.pitchName}
                        </span>
                        <span className="text-xs text-slate-500 block leading-relaxed max-w-xs">
                          {item.pitchDetails}
                        </span>
                        <a
                          href={ACADEMY_CONFIG.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-heading uppercase font-bold text-amber-600 hover:text-amber-700 mt-1 transition-colors"
                        >
                          <span>View on Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
