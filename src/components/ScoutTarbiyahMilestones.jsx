import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { 
  Sparkles, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  Heart, 
  Radio, 
  Check, 
  Plus, 
  Edit3, 
  Save, 
  ShieldCheck,
  ChevronRight,
  Compass,
  Star
} from 'lucide-react';

const ESSENTIAL_SCOUTING_DUAS = [
  {
    id: 'travel',
    title: '🚗 Dua for Travel & Outdoor Trips (Dua As-Safar)',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    transliteration: 'Subhana-lladhi sakh-khara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun.',
    translation: 'Glory be to Him Who has subjected this to our use, whereas we were unable to subdue it, and to our Lord is our eventual return.'
  },
  {
    id: 'camp_site',
    title: '🏕️ Dua for Arriving & Camping at a New Site',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'udhu bi-kalimatillahi-t-tammati min sharri ma khalaq.",
    translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created.'
  },
  {
    id: 'meals',
    title: '🍽️ Dua for Patrol Meals & Feasts',
    arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ، بِسْمِ اللَّهِ',
    transliteration: 'Allahumma barik lana fima razaqtana wa qina adhaba-n-nar, Bismillah.',
    translation: 'O Allah, bless us in what You have provided for us, and save us from the punishment of the Fire. In the name of Allah.'
  },
  {
    id: 'sleeping',
    title: '⛺ Dua Before Sleeping in the Tent',
    arabic: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ',
    transliteration: 'Bismika Rabbi wada’tu janbi wa bika arfa’uh.',
    translation: 'In Your name, my Lord, I lay down my side and with Your help I raise it up.'
  },
  {
    id: 'waking',
    title: '🌅 Dua Upon Waking at Camp Sunrise',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Alhamdu lillahil-ladhi ahyana ba’da ma amatana wa ilayhin-nushur.',
    translation: 'All praise is due to Allah Who gave us life after giving us death, and to Him is our resurrection.'
  }
];

export default function ScoutTarbiyahMilestones({ 
  scout = {}, 
  currentUser = {}, 
  canEdit = false, 
  onSaveSuccess 
}) {
  const profile = { ...currentUser, ...scout };
  const targetUid = profile.uid || currentUser?.uid;

  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader' || currentUser?.role === 'admin';
  const isSuper = isOwner || isLeader || canEdit;

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Tarbiyah States
  const [adhanCertified, setAdhanCertified] = useState(Boolean(profile.adhanCertified));
  const [adhanDate, setAdhanDate] = useState(profile.adhanCertifiedDate || '');
  const [adhanCertBy, setAdhanCertBy] = useState(profile.adhanCertifiedBy || 'Troop Scoutmaster');
  const [quranSurahs, setQuranSurahs] = useState(profile.quranMemorizedSurahs || 'Surah Al-Fatihah, Ayah Al-Kursi, An-Nas, Al-Falaq, Al-Ikhlas');
  const [salatStanding, setSalatStanding] = useState(profile.salatCommitment || '5 Daily Prayers Consistent');
  const [completedDuas, setCompletedDuas] = useState(Array.isArray(profile.scoutingDuasCompleted) ? profile.scoutingDuasCompleted : ['travel', 'meals']);
  const [fastingNotes, setFastingNotes] = useState(profile.fastingMilestones || 'Fasted full Ramadan');

  const toggleDuaCompleted = async (duaId) => {
    const updated = completedDuas.includes(duaId)
      ? completedDuas.filter(id => id !== duaId)
      : [...completedDuas, duaId];
    
    setCompletedDuas(updated);
    if (!targetUid) return;

    try {
      await setDoc(doc(db, 'users', targetUid), {
        scoutingDuasCompleted: updated
      }, { merge: true });
    } catch (err) {
      console.warn("Auto-save dua status failed:", err);
    }
  };

  const handleSaveTarbiyah = async (e) => {
    if (e) e.preventDefault();
    if (!targetUid) return;

    setSaving(true);
    setSaveMsg('');
    try {
      const updates = {
        adhanCertified: adhanCertified,
        adhanCertifiedDate: adhanDate || (adhanCertified ? new Date().toISOString().split('T')[0] : null),
        adhanCertifiedBy: adhanCertBy || null,
        quranMemorizedSurahs: quranSurahs.trim() || null,
        salatCommitment: salatStanding,
        scoutingDuasCompleted: completedDuas,
        fastingMilestones: fastingNotes.trim() || null,
        updatedTarbiyahAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', targetUid), updates, { merge: true });
      setSaveMsg('✓ Islamic Tarbiyah & Adhan certifications saved successfully!');
      if (onSaveSuccess) onSaveSuccess(updates);
      setTimeout(() => setSaveMsg(''), 3500);
    } catch (err) {
      console.error("Failed to save tarbiyah milestones:", err);
      alert("Failed to save Tarbiyah records: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* ── HEADER ── */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0 shadow-lg shadow-emerald-950/40">
            <Sparkles size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Islamic Tarbiyah & Faith Milestones
              </span>
              {adhanCertified && (
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span>📢 Certified Muezzin</span>
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Character, Quran & Scouting Duas
            </h3>
            <p className="text-xs text-slate-400">
              Personal Islamic development, call to prayer certification, and essential outdoor supplications.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveTarbiyah}
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-950/40 self-start sm:self-auto disabled:opacity-50"
        >
          <Save size={13} />
          <span>{saving ? 'Saving...' : 'Save Tarbiyah Record'}</span>
        </button>
      </div>

      {saveMsg && (
        <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{saveMsg}</span>
        </div>
      )}

      {/* ── TOP 2 CARDS: ADHAN CERTIFICATION & QURAN ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Muezzin & Adhan Leadership Certification */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Radio size={16} className="text-amber-400" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Adhan & Iqamah Qualification</h4>
            </div>
            <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${
              adhanCertified ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {adhanCertified ? '✓ Certified' : 'In Training'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Certified scouts are authorized to make the Adhan and lead Iqamah for congregational prayers during troop campouts, hikes, and weekly halqas.
            </p>

            {isSuper && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-2">
                <label className="flex items-center gap-2 font-bold text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adhanCertified}
                    onChange={(e) => setAdhanCertified(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Certify Scout as Troop Muezzin</span>
                </label>

                {adhanCertified && (
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Certification Date:</span>
                      <input
                        type="date"
                        value={adhanDate}
                        onChange={(e) => setAdhanDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-slate-400 block">Certified By:</span>
                      <input
                        type="text"
                        value={adhanCertBy}
                        onChange={(e) => setAdhanCertBy(e.target.value)}
                        placeholder="Leader Name"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 2. Quran Memorization & Daily Salat */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-emerald-400" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Quran & Salat Commitment</h4>
            </div>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              {salatStanding}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Memorized Surahs & Juz Progress:</span>
              <textarea
                rows={2}
                value={quranSurahs}
                onChange={(e) => setQuranSurahs(e.target.value)}
                placeholder="List surahs memorized (e.g. Juz Amma, Surah Al-Mulk, Ayah Al-Kursi)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-emerald-500 font-sans leading-relaxed"
              />
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Ramadan & Voluntary Fasting Notes:</span>
              <input
                type="text"
                value={fastingNotes}
                onChange={(e) => setFastingNotes(e.target.value)}
                placeholder="e.g. Fasted Ramadan, Mondays/Thursdays"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. ESSENTIAL SCOUTING DUAS CHECKLIST ── */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Heart size={17} className="text-emerald-400" />
            <h4 className="text-sm font-black text-white">Essential Scouting & Outdoor Duas</h4>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            {completedDuas.length} / {ESSENTIAL_SCOUTING_DUAS.length} Mastered
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {ESSENTIAL_SCOUTING_DUAS.map((dua) => {
            const isDone = completedDuas.includes(dua.id);
            return (
              <div
                key={dua.id}
                onClick={() => toggleDuaCompleted(dua.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-3 ${
                  isDone 
                    ? 'bg-emerald-950/20 border-emerald-500/50 hover:border-emerald-400' 
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h5 className="font-bold text-xs text-white leading-tight">{dua.title}</h5>
                    <span className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                      isDone ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-black' : 'border-slate-700 bg-slate-900'
                    }`}>
                      {isDone && <Check size={12} />}
                    </span>
                  </div>

                  <p className="text-sm text-amber-200 font-serif leading-relaxed text-right dir-rtl mb-2">
                    {dua.arabic}
                  </p>

                  <p className="text-[11px] text-emerald-300 italic mb-1 font-sans">
                    {dua.transliteration}
                  </p>
                  
                  <p className="text-[10px] text-slate-400 leading-snug">
                    "{dua.translation}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{isDone ? '✓ Checked as Memorized' : '○ Click to mark mastered'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
