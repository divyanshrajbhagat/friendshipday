import React, { useState, useRef, useEffect } from 'react'

// ── Data ──────────────────────────────────────────────────────────────────────

const FRIEND = 'Prachiiiiii 🐼'
const TOTAL_STEPS = 6

const FLIP_CARDS = [
  { img: '/flip_1.jpg', msg: 'You really don’t make it easy to ignore you 😏' },
  { img: '/flip_2.jpg', msg: 'This smile = instant mood fix 😌✨' },
  { img: '/flip_3.jpg', msg: 'I was staring at this longer than I should’ve 🫣' },
  { img: '/flip_4.jpg', msg: 'I was supposed to just look… not fall more 😤❤️' },
  { img: '/flip_5.jpg', msg: 'You’ve got that quiet kind of hotness… the dangerous one 😭' },
  { img: '/flip_6.jpg', msg: 'Lowkey dangerous… highkey worth it 🔥' },
]

const SCRATCHES = [
  'You have the best laugh in the entire world 🌟',
  'Nobody makes me feel more understood than you ❤️',
  'Guess who misses you for no reason at all? — ofc me, always 🫶',
  "You're the first person I think of when something good happens ✨",
  'You’re the kind of person I never want to lose 🤍',
  'I come online and just hope you’re there… not even kidding 😂',
]

const GALLERY = [
  '/memory_1.png',
  '/memory_2.png',
  '/memory_3.png',
]

// ── Step Navigation ───────────────────────────────────────────────────────────

type Phase = 'visible' | 'exiting' | 'entering'

function useStepNav(total: number) {
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState<Phase>('visible')
  const phaseRef = useRef<Phase>('visible')
  const stepRef = useRef(0)
  phaseRef.current = phase
  stepRef.current = step

  const navigate = (to: number) => {
    if (phaseRef.current !== 'visible') return
    const target = Math.max(0, Math.min(to, total - 1))
    setPhase('exiting')
    setTimeout(() => {
      setStep(target)
      setPhase('entering')
      requestAnimationFrame(() => requestAnimationFrame(() => setPhase('visible')))
    }, 440)
  }

  return {
    step,
    phase,
    goNext: () => navigate(stepRef.current + 1),
    goTo: (s: number) => navigate(s),
  }
}

// ── Floaties ──────────────────────────────────────────────────────────────────

function Floaties() {
  const emojis = ['❤️', '🌸', '✨', '🌼', '💕', '⭐', '🍀', '🌿', '🎀', '🌺']
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {emojis.map((e, i) => (
        <span
          key={i}
          className="absolute text-2xl select-none"
          style={{
            opacity: 0.18,
            left: `${8 + (i * 9.3) % 84}%`,
            top: `${6 + (i * 11.7) % 78}%`,
            animation: `floatDrift ${5 + (i % 4)}s ease-in-out ${i * 0.65}s infinite alternate`,
          }}
        >
          {e}
        </span>
      ))}
    </div>
  )
}

// ── Progress Indicator ────────────────────────────────────────────────────────

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div
      className="absolute top-4 left-0 right-0 flex justify-center gap-2 z-50 pointer-events-none"
      aria-label={`Step ${current + 1} of ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-500"
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            background:
              i === current
                ? '#6dcba0'
                : i < current
                ? 'rgba(249,168,201,0.7)'
                : 'rgba(200,180,200,0.22)',
          }}
        />
      ))}
    </div>
  )
}

// ── Step Transition Wrapper ───────────────────────────────────────────────────

function StepWrapper({ phase, children }: { phase: Phase; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transition: 'opacity 0.44s cubic-bezier(0.4,0,0.2,1), transform 0.44s cubic-bezier(0.4,0,0.2,1), filter 0.44s ease',
        opacity: phase === 'visible' ? 1 : 0,
        transform:
          phase === 'exiting'
            ? 'translateY(-32px) scale(0.95)'
            : phase === 'entering'
            ? 'translateY(36px) scale(0.96)'
            : 'translateY(0) scale(1)',
        filter: phase !== 'visible' ? 'blur(6px)' : 'blur(0)',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
      }}
    >
      {children}
    </div>
  )
}

// ── Shared: Continue Button ───────────────────────────────────────────────────

function ContinueBtn({
  label = 'Continue →',
  onClick,
  disabled,
}: {
  label?: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-8 py-3 rounded-full text-white font-['Nunito'] font-bold text-base shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
      style={{ background: 'linear-gradient(135deg,#f9a8c9,#6dcba0)' }}
    >
      {label}
    </button>
  )
}

// ── Shared: Scrollable Step Layout ────────────────────────────────────────────

function StepLayout({
  children,
  footer,
}: {
  children: React.ReactNode
  footer: React.ReactNode
}) {
  return (
    <div className="h-full flex flex-col pt-14">
      <div className="flex-1 overflow-y-auto px-5 py-5" style={{ overscrollBehavior: 'contain' }}>
        {children}
      </div>
      <div className="flex-none flex justify-center pb-6 pt-3 px-5">{footer}</div>
    </div>
  )
}

// ── Step 0: Envelope ──────────────────────────────────────────────────────────

function EnvelopeStep({ onNext }: { onNext: () => void }) {
  const [open, setOpen] = useState(false)
  const [risen, setRisen] = useState(false)

  const handleOpen = () => {
    if (open) return
    setOpen(true)
    setTimeout(() => setRisen(true), 840)
  }

  return (
    <div
      className="h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#fce4ec 0%,#f3e5f5 50%,#e8f5e9 100%)' }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(180,200,220,0.09) 1px,transparent 1px),linear-gradient(90deg,rgba(180,200,220,0.09) 1px,transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Bg deco */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {['🌸', '❤️', '✨', '🌼', '💕', '⭐', '🍀'].map((e, i) => (
          <span
            key={i}
            className="absolute text-3xl select-none"
            style={{
              opacity: 0.18,
              left: `${(i * 14 + 5) % 88}%`,
              top: `${(i * 16 + 5) % 75}%`,
              animation: `floatDrift ${4 + (i % 3)}s ease-in-out ${i * 0.8}s infinite alternate`,
            }}
          >
            {e}
          </span>
        ))}
      </div>

      {!open && (
        <div className="flex flex-col items-center mb-8 z-10 relative text-center">
          <p
            className="font-['Caveat'] text-2xl text-pink-400 tracking-wide mb-1"
            style={{ animation: 'pulseOpacity 2s ease-in-out infinite' }}
          >
            you have a message 💌
          </p>
          <p className="font-['Caveat'] text-3xl font-bold text-pink-500 tracking-wide mb-1">
            Happy Friendship Day 🌸
          </p>
          <p className="font-['Caveat'] text-3xl font-bold text-pink-600 tracking-wider">
            Prachiii🐼
          </p>
        </div>
      )}

      {/* Envelope */}
      <div
        className="relative cursor-pointer select-none z-10"
        onClick={handleOpen}
        style={{ width: 300, height: 220, perspective: '800px' }}
      >
        {/* Body */}
        <div
          className="absolute inset-0 rounded-2xl shadow-2xl overflow-hidden"
          style={{ background: 'linear-gradient(145deg,#ffd6e7,#ffe9f3)' }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'linear-gradient(to top right,#f9a8c9 50%,transparent 50%)' }}
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'linear-gradient(to top left,#f9a8c9 50%,transparent 50%)' }}
          />
          {!open && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-6xl"
                style={{ animation: 'pulseOpacity 1.8s ease-in-out infinite' }}
              >
                💌
              </span>
            </div>
          )}
        </div>

        {/* Flap */}
        <div
          className="absolute top-0 left-0 right-0 z-10"
          style={{
            height: '50%',
            transformOrigin: 'top center',
            transform: open ? 'rotateX(-175deg)' : 'rotateX(0deg)',
            transition: 'transform 0.9s cubic-bezier(0.4,0,0.2,1)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              background: 'linear-gradient(135deg,#ff9bc3,#ffb3d1)',
              borderRadius: '16px 16px 0 0',
            }}
          />
        </div>

        {/* Rising letter */}
        {open && (
          <div
            className="absolute left-3 right-3 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center px-6"
            style={{
              height: '88%',
              bottom: 10,
              background: 'rgba(255,255,255,0.97)',
              transform: risen ? 'translateY(-58%)' : 'translateY(0)',
              transition: 'transform 0.9s cubic-bezier(0.34,1.56,0.64,1)',
              zIndex: 20,
            }}
          >
            <div className="text-4xl mb-2">❤️</div>
            <p className="font-['Caveat'] text-gray-500 text-base mb-0.5">Hey Bestie,</p>
            <p className="font-['Caveat'] text-pink-500 text-2xl font-bold mb-2">prachiiiiii 🐼</p>
            <p className="font-['Caveat'] text-gray-700 text-xl leading-snug mb-4">
              I made something for you…
              <br />
              <span className="text-pink-500 font-bold">Happy Friendship Day ❤️</span>
            </p>
            {risen && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onNext()
                }}
                className="px-8 py-3 rounded-full text-white font-['Nunito'] font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
                style={{ background: 'linear-gradient(135deg,#6dcba0,#a8e6c9)' }}
              >
                Tap to Begin 🌿
              </button>
            )}
          </div>
        )}
      </div>

      {!open && (
        <p
          className="mt-10 font-['Nunito'] text-pink-400/60 text-sm z-10 relative"
          style={{ animation: 'floatDrift 1.8s ease-in-out infinite alternate' }}
        >
          ↑ click to open
        </p>
      )}
    </div>
  )
}

// ── Step 1: Hero Message ──────────────────────────────────────────────────────

function HeroStep({ onNext }: { onNext: () => void }) {
  return (
    <StepLayout footer={<ContinueBtn label="Continue →" onClick={onNext} />}>
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          <span
            className="px-4 py-1.5 rounded-full text-sm font-['Nunito'] font-semibold"
            style={{ background: '#d4f1e3', color: '#3a8c60' }}
          >
            to the best one 🌼
          </span>
        </div>

        <h1
          className="font-['Caveat'] text-center mb-6"
          style={{ fontSize: 'clamp(2.4rem,7vw,4.5rem)', color: '#5a3d5c', lineHeight: 1.1 }}
        >
          To My Favourite Person
        </h1>

        <div
          className="relative mb-6 group w-full overflow-x-auto overflow-y-auto max-h-[360px] rounded-3xl shadow-xl flex items-center justify-center p-1"
          style={{
            backgroundColor: '#f0e8ef',
            border: '1.5px solid rgba(255,182,193,0.5)',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <img
            src="/prachiii_hero.png"
            alt="Prachiii 🐼"
            className="max-w-full max-h-full w-auto h-auto object-contain rounded-2xl"
            loading="lazy"
          />
          <span
            className="absolute -top-3 -right-2 text-3xl pointer-events-none z-10"
            style={{ animation: 'floatDrift 3s ease-in-out infinite alternate' }}
          >
            🌸
          </span>
        </div>

        <div
          className="rounded-3xl p-6 shadow-lg mb-5"
          style={{
            background: 'rgba(255,255,255,0.88)',
            border: '1.5px solid rgba(255,182,193,0.35)',
          }}
        >
          <div className="text-2xl mb-3">💌</div>
          <p className="font-['Caveat'] text-xl text-gray-700 leading-relaxed mb-3">
            Having someone who feels calm, easy, and real is rare.
          </p>
          <p className="font-['Caveat'] text-xl text-gray-700 leading-relaxed">
            And somehow… I found that in you.
            <br />
            My safe place. My favourite human. 🌿
          </p>
          <div className="mt-4 flex gap-2 text-xl">
            <span>🌼</span>
            <span>❤️</span>
            <span>⭐</span>
            <span>🌸</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 w-full">
          {GALLERY.map((src, i) => (
            <div
              key={i}
              className="overflow-x-auto overflow-y-auto rounded-2xl shadow-md flex items-center justify-center p-1 border border-white/60 h-24 sm:h-28"
              style={{
                backgroundColor: '#fff0f5',
                overscrollBehavior: 'contain',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <img
                src={src}
                alt={`Memory ${i + 1}`}
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </StepLayout>
  )
}

// ── Step 2: Music ─────────────────────────────────────────────────────────────

// ── Step 2: Music ─────────────────────────────────────────────────────────────

function MusicStep({ onNext }: { onNext: () => void }) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(180)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const togglePlay = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => {
          setPlaying((p) => !p)
        })
    }
  }

  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    const cur = audioRef.current.currentTime || 0
    const dur = audioRef.current.duration || 180
    setCurrentTime(cur)
    if (dur && !isNaN(dur) && isFinite(dur)) setDuration(dur)
    setProgress((cur / (dur || 180)) * 100)
  }

  const formatTime = (timeInSecs: number) => {
    const elapsed = Math.floor(timeInSecs || 0)
    const mins = Math.floor(elapsed / 60)
    const secs = elapsed % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="h-full flex flex-col items-center justify-center px-5 pt-14 pb-6">
      <audio
        ref={audioRef}
        src="/song.mp3"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          setPlaying(false)
          setProgress(0)
        }}
      />
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h2 className="font-['Caveat'] text-5xl" style={{ color: '#5a3d5c' }}>
            Our Song
          </h2>
          <p className="font-['Nunito'] text-sm mt-1" style={{ color: '#a0779e' }}>
            the one that's always going to be ours 🎵
          </p>
        </div>

        <div
          className="rounded-3xl p-8 shadow-xl mb-8"
          style={{
            background: 'linear-gradient(145deg,#fff0f7,#f0faf5)',
            border: '1.5px solid rgba(255,182,193,0.4)',
          }}
        >
          {/* Spinning disc */}
          <div className="flex justify-center mb-6">
            <div
              className="w-28 h-28 rounded-full shadow-xl flex items-center justify-center text-5xl"
              style={{
                background: 'linear-gradient(135deg,#ffd6e7,#b8e8d4,#ffd6e7)',
                animation: playing ? 'spinSlow 5s linear infinite' : 'none',
                boxShadow: playing
                  ? '0 0 32px rgba(255,182,193,0.55)'
                  : '0 8px 24px rgba(0,0,0,0.10)',
                transition: 'box-shadow 0.5s',
              }}
            >
              🎵
            </div>
          </div>

          {/* Progress */}
          <div className="mb-2">
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: '#ffe0ea' }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg,#f9a8c9,#6dcba0)',
                  transition: 'width 0.1s linear',
                }}
              />
            </div>
            <div
              className="flex justify-between mt-1 text-xs font-['Nunito']"
              style={{ color: '#c4a0be' }}
            >
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-5 mt-5">
            <button className="text-2xl opacity-30">⏮</button>
            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full text-white text-2xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              style={{ background: 'linear-gradient(135deg,#f9a8c9,#6dcba0)' }}
            >
              {playing ? '⏸' : '▶'}
            </button>
            <button className="text-2xl opacity-30">⏭</button>
          </div>
          <p
            className="text-center mt-3 font-['Nunito'] text-xs"
            style={{ color: '#c4a0be' }}
          >
            {playing ? '🎵 now playing…' : 'press play to hear it 🌿'}
          </p>
        </div>

        <div className="flex justify-center">
          <ContinueBtn label="Continue →" onClick={onNext} />
        </div>
      </div>
    </div>
  )
}

// ── Step 3: Memory Wall ───────────────────────────────────────────────────────

function FlipCard({ img, msg }: { img: string; msg: string }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div
      onClick={() => setFlipped((f) => !f)}
      className="cursor-pointer"
      style={{ perspective: '1000px', aspectRatio: '4/3' }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            borderRadius: 14,
            overflowX: 'auto',
            overflowY: 'auto',
            boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
            backgroundColor: '#fff0f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <img
            src={img}
            alt=""
            className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl p-0.5"
            loading="lazy"
          />
          <div
            style={{
              position: 'absolute',
              bottom: 6,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <span className="font-['Nunito'] text-xs text-white/90 bg-black/40 backdrop-blur-xs px-3 py-0.5 rounded-full shadow-sm">
              tap ✨
            </span>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg,#fff5f8,#f5fff8)',
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
          }}
        >
          <p
            className="font-['Caveat'] text-center text-sm sm:text-lg leading-snug px-1 font-semibold"
            style={{ color: '#7a4a6a' }}
          >
            {msg}
          </p>
        </div>
      </div>
    </div>
  )
}

function MemoryStep({ onNext }: { onNext: () => void }) {
  return (
    <StepLayout footer={<ContinueBtn label="Reveal More →" onClick={onNext} />}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="font-['Caveat'] text-4xl md:text-5xl" style={{ color: '#5a3d5c' }}>
            Flip one over
          </h2>
          <p className="font-['Nunito'] text-sm mt-1" style={{ color: '#a0779e' }}>
            every photo has something written on the back 💌
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {FLIP_CARDS.map((card, i) => (
            <FlipCard key={i} img={card.img} msg={card.msg} />
          ))}
        </div>
      </div>
    </StepLayout>
  )
}

// ── Step 4: Scratch Cards ─────────────────────────────────────────────────────

function ScratchCard({ label, onScratched }: { label: string; onScratched: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const doneRef = useRef(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    g.addColorStop(0, '#b8e8d4')
    g.addColorStop(1, '#ffd6e7')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'
    ctx.lineWidth = 1.5
    for (let i = 0; i < 18; i++) {
      ctx.beginPath()
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 14 + 4, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.fillStyle = 'rgba(255,255,255,0.88)'
    ctx.font = '600 15px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('✨ scratch me ✨', canvas.width / 2, canvas.height / 2)
  }, [])

  const doScratch = (clientX: number, clientY: number) => {
    if (doneRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const rect = canvas.getBoundingClientRect()
    const x = (clientX - rect.left) * (canvas.width / rect.width)
    const y = (clientY - rect.top) * (canvas.height / rect.height)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 26, 0, Math.PI * 2)
    ctx.fill()
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let transparent = 0
    for (let i = 3; i < data.length; i += 4) if (data[i] < 128) transparent++
    if ((transparent * 100) / (canvas.width * canvas.height) > 52 && !doneRef.current) {
      doneRef.current = true
      setRevealed(true)
      onScratched()
    }
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-md"
      style={{ aspectRatio: '3/2', backgroundColor: '#fff5f8' }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center p-3 text-center"
        style={{ background: 'linear-gradient(135deg,#fff5f8,#f5fff8)' }}
      >
        <p
          className="font-['Caveat'] text-base leading-snug"
          style={{ color: '#7a4a6a' }}
        >
          {label}
        </p>
      </div>
      {!revealed && (
        <canvas
          ref={canvasRef}
          width={240}
          height={160}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
          onMouseDown={() => { drawing.current = true }}
          onMouseUp={() => { drawing.current = false }}
          onMouseLeave={() => { drawing.current = false }}
          onMouseMove={(e) => { if (drawing.current) doScratch(e.clientX, e.clientY) }}
          onTouchStart={(e) => { e.preventDefault(); drawing.current = true }}
          onTouchEnd={() => { drawing.current = false }}
          onTouchMove={(e) => { e.preventDefault(); if (drawing.current) doScratch(e.touches[0].clientX, e.touches[0].clientY) }}
        />
      )}
      {revealed && (
        <div className="absolute inset-0 flex items-end justify-center pb-2 pointer-events-none">
          <span className="text-xs font-['Nunito'] text-green-500 bg-white/80 px-2 py-0.5 rounded-full">
            revealed ❤️
          </span>
        </div>
      )}
    </div>
  )
}

function ScratchStep({ onNext }: { onNext: () => void }) {
  const [count, setCount] = useState(0)
  const scratchedSet = useRef(new Set<number>())

  const handle = (i: number) => {
    if (!scratchedSet.current.has(i)) {
      scratchedSet.current.add(i)
      setCount((c) => c + 1)
    }
  }

  return (
    <StepLayout footer={<ContinueBtn label="Next →" onClick={onNext} />}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-5">
          <h2 className="font-['Caveat'] text-4xl md:text-5xl" style={{ color: '#5a3d5c' }}>
            Scratch these open
          </h2>
          <p className="font-['Nunito'] text-sm mt-1" style={{ color: '#a0779e' }}>
            {count} of {SCRATCHES.length} uncovered
          </p>
          <div className="flex justify-center gap-2 mt-2">
            {SCRATCHES.map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-all duration-500"
                style={{
                  background: scratchedSet.current.has(i) ? '#6dcba0' : '#ffd6e7',
                  transform: scratchedSet.current.has(i) ? 'scale(1.4)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SCRATCHES.map((label, i) => (
            <ScratchCard key={i} label={label} onScratched={() => handle(i)} />
          ))}
        </div>
        {count === SCRATCHES.length && (
          <p
            className="text-center font-['Caveat'] text-xl mt-5"
            style={{ color: '#6dcba0', animation: 'fadeSlideUp 0.5s ease both' }}
          >
            You found them all! 🎉 Every single one is true.
          </p>
        )}
      </div>
    </StepLayout>
  )
}

// ── Step 5: YES / NO Meme ─────────────────────────────────────────────────────

function MemeStep({ onNext }: { onNext: () => void }) {
  const [clickCount, setClickCount] = useState(0)
  const [yesScale, setYesScale] = useState(1)
  const [noScale, setNoScale] = useState(1)
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null)
  const [accepted, setAccepted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const messages = [
    "Will you stay with me forever? ❤️",
    "kitne pyaar se poocha tha haan krna thaa, chalo ab yes krdo 😚😚",
    "aaree krde haan , i know tmne glti se no pr click krdiya 😁😚",
    "uff ye ldkiii 🤷🤦, hnn krde hnn krde😁😚",
    "गलत जवाब 😑",
    "tmhe kya lga mein itni aasani se jaane doonga aapko 🐼, see who is here 'dev' sooo say yes",
    "ab aakhiri baar pooch rhaa haan krdee",
    "ab aakhiri option ki koi option ni milega 😚😚"
  ]

  const handleNo = () => {
    const nextCount = clickCount + 1
    setClickCount(nextCount)

    // YES grows
    setYesScale((s) => s + 0.25)

    // NO shrinks
    if (nextCount < 6) {
      setNoScale((s) => Math.max(0.4, s - 0.08))
    }

    // Move NO randomly (mobile safe)
    const maxX = Math.max(window.innerWidth - 90, 20)
    const maxY = Math.max(window.innerHeight - 60, 20)
    const x = Math.min(Math.max(20, Math.random() * maxX), maxX)
    const y = Math.min(Math.max(20, Math.random() * maxY), maxY)
    setNoPos({ x, y })
  }

  const handleYes = () => {
    setAccepted(true)
    setTimeout(onNext, 1400)
  }

  const isTakeover = clickCount >= 6
  const currentQuestion = messages[Math.min(clickCount, messages.length - 1)]

  return (
    <div className="h-full flex flex-col items-center justify-center px-5 pt-14 pb-6 text-center relative overflow-hidden">
      {!accepted ? (
        <>
          <div
            className="text-5xl mb-4"
            style={{ animation: 'floatDrift 2s ease-in-out infinite alternate' }}
          >
            🐼❤️
          </div>

          <h2
            className="font-['Caveat'] text-3xl sm:text-5xl mb-6 max-w-sm px-2 min-h-[80px] flex items-center justify-center leading-snug"
            style={{ color: '#5a3d5c' }}
          >
            {currentQuestion}
          </h2>

          {/* Button Arena */}
          <div
            ref={containerRef}
            className="relative w-full max-w-xs mx-auto flex justify-center items-center gap-6 min-h-[80px]"
          >
            {/* YES Button */}
            <button
              onClick={handleYes}
              className="font-['Nunito'] font-bold text-white shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer"
              style={
                isTakeover
                  ? {
                      position: 'fixed',
                      inset: 0,
                      width: '100vw',
                      height: '100vh',
                      fontSize: '28px',
                      borderRadius: 0,
                      zIndex: 9999,
                      background: 'linear-gradient(135deg, #ff477e, #ff758f)',
                    }
                  : {
                      background: 'linear-gradient(135deg, #ff477e, #ff758f)',
                      padding: '14px 28px',
                      fontSize: '18px',
                      borderRadius: '50px',
                      transform: `scale(${yesScale})`,
                      zIndex: 10,
                    }
              }
            >
              YES 💕
            </button>

            {/* NO Button */}
            <button
              onClick={handleNo}
              onMouseEnter={handleNo}
              className="font-['Nunito'] font-bold rounded-full shadow-md transition-all duration-200 cursor-pointer"
              style={{
                background: '#e9ecef',
                color: '#6c757d',
                padding: '12px 24px',
                fontSize: '16px',
                transform: `scale(${noScale})`,
                position: noPos ? 'fixed' : 'relative',
                left: noPos ? `${noPos.x}px` : 'auto',
                top: noPos ? `${noPos.y}px` : 'auto',
                zIndex: 9,
              }}
            >
              NO 😜
            </button>
          </div>
        </>
      ) : (
        <div style={{ animation: 'fadeSlideUp 0.5s ease both' }}>
          <div className="text-7xl mb-5">💚🎉</div>
          <h2 className="font-['Caveat'] text-5xl mb-3" style={{ color: '#5a3d5c' }}>
            YAYYYY!!! 💚
          </h2>
          <p className="font-['Caveat'] text-2xl leading-relaxed" style={{ color: '#7a4a6a' }}>
            I knew it 😚✨
            <br />
            You're stuck with me now forever 😌💖
          </p>
        </div>
      )}
    </div>
  )
}

// ── Step 6: Final Letter ──────────────────────────────────────────────────────

function FinalStep({ onReplay }: { onReplay: () => void }) {
  return (
    <StepLayout
      footer={
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onReplay}
            className="px-10 py-3 rounded-full text-white font-['Nunito'] font-bold text-base shadow-xl hover:scale-105 active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg,#f9a8c9,#6dcba0)' }}
          >
            ↑ Play it again 🔁
          </button>
          <p className="font-['Caveat'] text-lg" style={{ color: '#a0779e' }}>
            You’re worth choosing… even when you test my patience 😌
          </p>
        </div>
      }
    >
      <div className="max-w-md mx-auto">
        <div className="text-center mb-5">
          <h2 className="font-['Caveat'] text-4xl" style={{ color: '#5a3d5c' }}>
            One last thing
          </h2>
          <p className="font-['Nunito'] text-sm mt-1" style={{ color: '#a0779e' }}>
            a little letter, just for you 💌
          </p>
        </div>

        <div
          className="relative rounded-3xl shadow-2xl overflow-hidden"
          style={{ background: '#fffdf8', border: '1.5px solid rgba(200,180,160,0.35)' }}
        >
          {/* Notebook lines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(transparent,transparent 39px,rgba(180,200,220,0.22) 39px,rgba(180,200,220,0.22) 40px)',
              backgroundPositionY: '60px',
            }}
          />
          {/* Margin line */}
          <div
            className="absolute top-0 bottom-0 left-14"
            style={{ width: 1, background: 'rgba(255,150,160,0.30)' }}
          />

          <div className="relative p-8" style={{ paddingLeft: '4.2rem' }}>
            {/* Stickers */}
            <div className="absolute top-3 right-5 flex gap-2 text-xl">
              <span style={{ animation: 'floatDrift 3s ease-in-out infinite alternate' }}>🌸</span>
              <span style={{ animation: 'floatDrift 4s ease-in-out 0.5s infinite alternate' }}>⭐</span>
            </div>

            <p className="font-['Caveat'] text-2xl font-bold mb-4" style={{ color: '#5a3d5c' }}>
              Dear Prachiiiiii 🐼,
            </p>

            <div
              className="space-y-4 font-['Caveat'] text-xl leading-relaxed"
              style={{ color: '#4a3a4a' }}
            >
              <p>
                Tu sach me bohot special hai yaar. Jab bhi sab kuch heavy lagta hai na, tere se baat karne ke baad somehow pehele se bahut better lagne lgta haii and ye bas tere se hi krne kae baad hota hai sooo for me you are very very special❤️
              </p>
              <p>
                Hnn maana tu meri favourite person hai but this doesn't mean kii aap mujhe yaad na kroo( aare kabhi tm v yaad krliya kroo 😋😚... I know tm kaafi busy ho sab kuch sambhalna parta hai aapko
              </p>

              {/* Polaroid stickers */}
              <div className="flex gap-3 my-4 overflow-x-auto py-1 max-w-full" style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}>
                {[
                  '/letter_polaroid_1.jpg',
                  '/letter_polaroid_2.jpg',
                ].map((src, i) => (
                  <div
                    key={i}
                    className="overflow-x-auto overflow-y-auto shadow-md shrink-0 flex items-center justify-center p-0.5"
                    style={{
                      width: 110,
                      height: 85,
                      backgroundColor: '#ffffff',
                      borderRadius: 10,
                      transform: i === 0 ? 'rotate(-2.5deg)' : 'rotate(2deg)',
                      border: '3px solid white',
                      overscrollBehavior: 'contain',
                      WebkitOverflowScrolling: 'touch',
                    }}
                  >
                    <img src={src} alt="" className="max-w-full max-h-full w-auto h-auto object-contain rounded-md" loading="lazy" />
                  </div>
                ))}
              </div>

              <p>
                And agar tm ye soch rhi agar ni v yaad karoongi to kya hi kar lega then remember.....mein yaad karloonga yaar aapko...simple...hehehehe...😜
              </p>
              <p>
                Thank you for sab kuch—late-night talks, random voice notes, making normal days feel special,the comfort of just existing together...and many more.
              </p>
              <p>
                And last but not least, just promise me one thing – if kabhi v you feels too heavy, then you will tell me, samjhiiiiiiiiiiii🐼
              </p>
              <p className="font-bold text-pink-600">
                You know who misses you a lot - Ofcourse meee 🖐️😜❤️
              </p>
              <p className="font-bold text-gray-700">
                Bakii mein to aapse accha hoon hii 😁😚
              </p>
            </div>
          </div>
        </div>
      </div>
    </StepLayout>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const { step, phase, goNext, goTo } = useStepNav(TOTAL_STEPS)

  const steps: React.ReactNode[] = [
    <EnvelopeStep onNext={goNext} />,
    <HeroStep onNext={goNext} />,
    <MemoryStep onNext={goNext} />,
    <ScratchStep onNext={goNext} />,
    <MemeStep onNext={goNext} />,
    <FinalStep onReplay={() => goTo(0)} />,
  ]

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background: '#fdf8f4',
        backgroundImage:
          'linear-gradient(rgba(180,220,195,0.10) 1px,transparent 1px),linear-gradient(90deg,rgba(180,220,195,0.10) 1px,transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <Floaties />
      {step > 0 && <ProgressDots total={TOTAL_STEPS} current={step} />}
      <StepWrapper phase={phase}>{steps[step]}</StepWrapper>
    </div>
  )
}
