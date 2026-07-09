import { CheckCircle2, Circle, Clock, Target, TrendingUp, User, Key, Calendar, Zap } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useState, useEffect, useRef, memo } from 'react';
import { fetchStudentData } from '../services/apiService';

const FALLBACK_TIME = Date.now();

const SummaryRoutine = memo(function SummaryRoutine() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const loadData = async () => {
      try {
        const studentCode = localStorage.getItem('studentCode') || 'DEMO-123';
        const result = await fetchStudentData(studentCode);
        if (isMounted.current) setData(result);
      } catch (err) {
        console.error('Failed to load data', err);
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted.current = false; };
  }, []);

  const routine = []; // Extracted from live data in the future or empty for now

  if (loading || !data) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-white/5 rounded-xl w-1/3 mb-2"></div>
        <div className="h-6 bg-white/5 rounded-xl w-1/2 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-panel p-6 border-white/5 h-32"></div>
          ))}
        </div>
        <div className="glass-panel p-8 border-white/5 h-40"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-6 border-white/5 h-96"></div>
          <div className="glass-panel p-6 border-white/5 h-96"></div>
        </div>
      </div>
    );
  }

  const weeklyData = data.weeklyData || [];
  const studentInfo = data.studentInfo || {};
  const recentActivities = data.recentActivities || [];
  const aiAnalytics = data.aiAnalytics || {};

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Weekly Summary & Routine</h1>
        <p className="text-blue-200">Real-time database analytics and live student engagement tracking</p>
      </div>

      {/* Student Database Metadata Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 border-white/10 hover:border-orange-500/40 transition-all duration-300 hover:scale-[1.02] flex items-center gap-4 group">
          <div className="p-3.5 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(249,115,22,0.2)]">
            <User size={24} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Student Profile</h3>
            <p className="text-lg font-bold text-white tracking-tight mt-0.5">{studentInfo.name || 'Kumar Kartikey'}</p>
            <p className="text-xs text-green-400 font-medium mt-1">● {studentInfo.status || 'Active'}</p>
          </div>
        </div>

        <div className="glass-panel p-6 border-white/10 hover:border-emerald-500/40 transition-all duration-300 hover:scale-[1.02] flex items-center gap-4 group">
          <div className="p-3.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Key size={24} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Secure Link Code</h3>
            <p className="text-lg font-bold text-white tracking-tight mt-0.5">{studentInfo.linkCode || 'N/A'}</p>
            <p className="text-xs text-emerald-300 font-medium mt-1">Direct DB Pairing</p>
          </div>
        </div>

        <div className="glass-panel p-6 border-white/10 hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.02] flex items-center gap-4 group">
          <div className="p-3.5 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Last Activity</h3>
            <p className="text-sm font-bold text-white tracking-tight mt-0.5">
              {new Date(studentInfo.lastLoginAt || FALLBACK_TIME).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-xs text-purple-300 font-medium mt-1">Real-time sync</p>
          </div>
        </div>

        <div className="glass-panel p-6 border-white/10 hover:border-blue-500/40 transition-all duration-300 hover:scale-[1.02] flex items-center gap-4 group">
          <div className="p-3.5 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <Zap size={24} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Growth Index</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-bold text-white tracking-tight">{aiAnalytics.overallGrowthIndex?.value || 89.5}%</span>
              <span className="text-xs text-green-400 flex items-center font-bold"><TrendingUp size={14} className="mr-0.5"/> {aiAnalytics.improvementPercentage?.value || '+12.5%'}</span>
            </div>
            <p className="text-xs text-blue-300 font-medium mt-1">Multi-agent evaluated</p>
          </div>
        </div>
      </div>

      {/* Dynamic Next Step Achievement Banner */}
      {data.toAchieve && data.toAchieve.length > 0 ? (
        <div className="glass-panel p-8 border-orange-500/30 relative overflow-hidden group hover:border-orange-500/50 transition-all duration-300 shadow-[0_10px_30px_rgba(249,115,22,0.1)]">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full group-hover:bg-orange-500/10 transition-all pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)' }}></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target size={18} className="text-orange-400 animate-pulse" />
                <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider">Next Step Achievement</h3>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{data.toAchieve[0].title}</h2>
              <p className="text-sm text-blue-200">Deadline: {data.toAchieve[0].deadline} | Priority: {data.toAchieve[0].priority}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-8 border-white/10 flex items-center justify-center">
          <p className="text-text-muted">No active goals or achievements pending.</p>
        </div>
      )}

      {/* Main Charts & Routine Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Progress Summary */}
        <div className="lg:col-span-2 glass-panel p-6 border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Weekly Progress Summary</h3>
              <span className="text-xs text-blue-400 font-bold bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                {aiAnalytics.learningTrend?.value || 'Upward / Accelerating'}
              </span>
            </div>
            <div className="min-h-[300px] h-[300px] sm:h-80 w-full flex items-center justify-center">
              {weeklyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorGoals" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(10,13,20,0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="focus" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorFocus)" name="Focus Level" />
                    <Area type="monotone" dataKey="goalCompletion" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorGoals)" name="Goals Hit" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-text-muted">Insufficient data for weekly analysis.</p>
              )}
            </div>
          </div>
        </div>

        {/* Daily Routine Planner */}
        <div className="glass-panel p-6 border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Daily Routine</h3>
              <Clock size={18} className="text-blue-400" />
            </div>
            <div className="space-y-6">
              {routine.length > 0 ? routine.map((item, idx) => (
                <div key={idx} className="flex gap-4 relative group">
                  {idx !== routine.length - 1 && (
                    <div className="absolute left-2.5 top-6 bottom-[-20px] w-px bg-white/10 group-hover:bg-orange-500/30 transition-colors"></div>
                  )}
                  <div className="flex-shrink-0 mt-1">
                    {item.status === 'completed' ? (
                      <CheckCircle2 size={20} className="text-green-400 bg-bg rounded-full shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
                    ) : item.status === 'in-progress' ? (
                      <Circle size={20} className="text-orange-400 fill-orange-400/20 bg-bg rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.3)]" />
                    ) : (
                      <Circle size={20} className="text-white/30 bg-bg rounded-full" />
                    )}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${item.status === 'completed' ? 'text-white/60 line-through' : 'text-white'}`}>{item.task}</h4>
                    <p className="text-xs text-text-muted mt-1">{item.time}</p>
                  </div>
                </div>
              )) : (
                <p className="text-text-muted text-sm text-center py-8">No daily routine scheduled.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Live Activities */}
      <div className="glass-panel p-6 border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Recent Real-time Student Activities</h3>
          <span className="text-xs text-green-400 font-bold bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg animate-pulse">
            ● Live Sync
          </span>
        </div>
        {recentActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentActivities.map((act, idx) => (
              <div key={idx} className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-orange-500/30 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20">
                      {act.type}
                    </span>
                    <span className="text-xs text-text-muted">{act.time}</span>
                  </div>
                  <h4 className="text-white font-bold text-base group-hover:text-orange-300 transition-colors">{act.title}</h4>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-text-muted font-medium">Performance Result</span>
                  <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2.5 py-1 rounded border border-green-500/20">{act.score}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-10">
            <p className="text-text-muted">No recent activities available.</p>
          </div>
        )}
      </div>

      {/* Roadmap Modal Removed for dynamically loaded goals */}

    </div>
  );
});

export default SummaryRoutine;
