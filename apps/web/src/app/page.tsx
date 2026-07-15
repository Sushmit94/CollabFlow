'use client';

import Link from 'next/link';
import { motion, useInView, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  KanbanSquare,
  Play,
  Radio,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import styles from './page.module.css';

const NAV_LINKS = [
  { label: 'Product', href: '#features' },
  { label: 'How it works', href: '#spotlight' },
  { label: 'Customers', href: '#testimonials' },
];

const LOGO_WORDS = ['NORTHWIND', 'VERTEX', 'ORBITAL', 'HALCYON', 'FORGEIQ', 'LUMENARY', 'CASCADE', 'IRONVALE'];

const FEATURES = [
  {
    icon: FileText,
    title: 'Live collaborative docs',
    desc: 'Write specs and notes together with cursors, presence, and updates that land instantly for everyone in the room.',
  },
  {
    icon: KanbanSquare,
    title: 'Kanban that keeps pace',
    desc: 'Drag tasks across columns and watch the board reshape in real time for every teammate, no refresh required.',
  },
  {
    icon: Users,
    title: 'Presence, always on',
    desc: 'See who is online, who is typing, and who just picked up a task — teamwork without the guesswork.',
  },
  {
    icon: Zap,
    title: 'Built for speed',
    desc: 'A sub-100ms sync layer means edits and moves feel local, even when your team is spread across time zones.',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise-grade security',
    desc: 'Workspace isolation, encrypted transport, and granular access controls keep sensitive work protected.',
  },
  {
    icon: Sparkles,
    title: 'Delightful by default',
    desc: 'A crafted interface that gets out of the way, so your team spends time shipping — not fighting the tool.',
  },
];

const STATS = [
  { value: 12000, suffix: '+', label: 'Teams shipping on CollabFlow' },
  { value: 3200000, suffix: '+', label: 'Tasks moved across boards' },
  { value: 99.98, suffix: '%', label: 'Realtime sync uptime', decimals: 2 },
  { value: 80, suffix: 'ms', label: 'Median edit-to-sync latency', prefix: '<' },
];

const TESTIMONIALS = [
  {
    quote: 'CollabFlow replaced three separate tools for us. Docs and sprint boards finally live in the same place, in real time.',
    name: 'Priya Nandakumar',
    role: 'Head of Product, Orbital',
  },
  {
    quote: 'The presence layer changed how our remote team works. You can feel who is in the doc with you — it just clicks.',
    name: 'Marcus Feld',
    role: 'Engineering Lead, Northwind',
  },
  {
    quote: 'We moved our whole sprint process here in a week. The board sync is instant, even with twenty people online.',
    name: 'Sofia Delgado',
    role: 'COO, Halcyon Labs',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className={styles.lp}>
      <div className={styles.bgLayer} />
      <div className={styles.noise} />

      <header className={styles.nav}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}><Users size={17} /></span>
          <span>CollabFlow</span>
        </Link>
        <nav className={styles.navLinks} aria-label="Marketing">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
        </nav>
        <div className={styles.navActions}>
          <Link href="/app" className={styles.btnGhost}>Sign in</Link>
          <Link href="/app" className={styles.btnPrimary}>Launch workspace<ArrowRight size={16} /></Link>
        </div>
      </header>

      <section className={styles.hero}>
        <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.5 }} className={styles.badge}>
          <span className={styles.badgeDot} />
          Now with live presence across every workspace
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.55, delay: 0.06 }}
          className={styles.heroTitle}
        >
          Where teams write, plan, and{' '}
          <span className={styles.heroGradientText}>ship together</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.55, delay: 0.12 }}
          className={styles.heroSubtitle}
        >
          CollabFlow brings live documents, sprint boards, and real-time presence into one calm,
          fast surface — so your team spends less time syncing and more time building.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.55, delay: 0.18 }}
          className={styles.heroActions}
        >
          <Link href="/app" className={styles.btnPrimary}>Launch workspace<ArrowRight size={16} /></Link>
          <Link href="/app#board" className={styles.btnSecondary}><Play size={16} />See it live</Link>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.55, delay: 0.24 }}
          className={styles.heroMeta}
        >
          <span className={styles.avatarStack}>
            <span style={{ background: '#4f7cff' }}>AM</span>
            <span style={{ background: '#22d3c8' }}>PN</span>
            <span style={{ background: '#a78bfa' }}>MF</span>
            <span style={{ background: '#f0b429' }}>SD</span>
          </span>
          Trusted by 12,000+ product and engineering teams
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className={styles.mockupWrap}
        >
          <ProductMockup />
        </motion.div>
      </section>

      <section className={styles.logoStripSection}>
        <div className={styles.logoStripLabel}>Powering realtime work at teams like</div>
        <div className={styles.marquee}>
          <div className={styles.marqueeTrack}>
            {[...LOGO_WORDS, ...LOGO_WORDS].map((word, index) => (
              <span className={styles.logoWord} key={`${word}-${index}`}>{word}</span>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="features">
        <Reveal className={styles.sectionHead}>
          <span className={styles.eyebrow}>Everything in one surface</span>
          <h2 className={styles.sectionTitle}>Built for the way modern teams actually work</h2>
          <p className={styles.sectionSubtitle}>
            No more bouncing between a docs tool, a board tool, and a chat tool to know what is happening.
            CollabFlow keeps writing, planning, and presence in sync.
          </p>
        </Reveal>

        <div className={styles.featureGrid}>
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.06} className={styles.featureCard}>
              <span className={styles.featureIcon}><feature.icon size={20} /></span>
              <div className={styles.featureTitle}>{feature.title}</div>
              <div className={styles.featureDesc}>{feature.desc}</div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={styles.section} id="spotlight">
        <div className={styles.spotlight}>
          <Reveal className={styles.spotlightText} direction="left">
            <span className={styles.eyebrow}>Live documents</span>
            <h3 className={styles.spotlightTitle}>Every keystroke, everywhere, instantly</h3>
            <p className={styles.spotlightDesc}>
              Write specs, meeting notes, and plans with a document that updates in real time for
              everyone watching. See who is typing, jump to their cursor, and never wonder if you
              are looking at the latest version.
            </p>
            <div className={styles.checkList}>
              <CheckItem>Cursor-level presence while you write</CheckItem>
              <CheckItem>Autosave with instant conflict-free sync</CheckItem>
              <CheckItem>Full history, restorable in one click</CheckItem>
            </div>
          </Reveal>
          <Reveal className={styles.spotlightVisual} direction="right" delay={0.1}>
            <DocMockup />
          </Reveal>
        </div>

        <div className={`${styles.spotlight} ${styles.spotlightReverse}`}>
          <Reveal className={styles.spotlightText} direction="right">
            <span className={styles.eyebrow}>Sprint boards</span>
            <h3 className={styles.spotlightTitle}>Kanban that moves as fast as your team</h3>
            <p className={styles.spotlightDesc}>
              Drag a task to done and watch it move for everyone in the room — no refresh, no
              stale state. Priorities, owners, and columns stay perfectly in sync across every
              screen.
            </p>
            <div className={styles.checkList}>
              <CheckItem>Realtime drag-and-drop across columns</CheckItem>
              <CheckItem>Priority-aware cards at a glance</CheckItem>
              <CheckItem>Built for fast-moving sprints</CheckItem>
            </div>
          </Reveal>
          <Reveal className={styles.spotlightVisual} direction="left" delay={0.1}>
            <BoardMockup />
          </Reveal>
        </div>
      </section>

      <section className={styles.section}>
        <Reveal>
          <div className={styles.statsBand}>
            {STATS.map((stat) => (
              <StatItem key={stat.label} {...stat} />
            ))}
          </div>
        </Reveal>
      </section>

      <section className={styles.section} id="testimonials">
        <Reveal className={styles.sectionHead}>
          <span className={styles.eyebrow}>Loved by teams</span>
          <h2 className={styles.sectionTitle}>Teams that ship faster with CollabFlow</h2>
        </Reveal>
        <div className={styles.testimonialGrid}>
          {TESTIMONIALS.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={index * 0.08} className={styles.testimonialCard}>
              <div className={styles.testimonialQuote}>&ldquo;{testimonial.quote}&rdquo;</div>
              <div className={styles.testimonialPerson}>
                <span className={styles.testimonialAvatar}>
                  {testimonial.name.split(' ').map((part) => part[0]).join('')}
                </span>
                <div>
                  <div className={styles.testimonialName}>{testimonial.name}</div>
                  <div className={styles.testimonialRole}>{testimonial.role}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <Reveal className={styles.ctaBanner}>
          <span className={styles.badge}><Radio size={14} />Live presence, from the first minute</span>
          <h2 className={styles.ctaTitle}>Bring your team into one calm, real-time workspace</h2>
          <p className={styles.ctaSubtitle}>
            Jump straight into the demo workspace — documents and boards are pre-loaded, no setup required.
          </p>
          <div className={styles.heroActions}>
            <Link href="/app" className={styles.btnPrimary}>Launch workspace<ArrowRight size={16} /></Link>
            <Link href="/app" className={styles.btnGhost}>Explore the dashboard</Link>
          </div>
        </Reveal>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.brand}>
              <span className={styles.brandMark}><Users size={17} /></span>
              <span>CollabFlow</span>
            </div>
            <p className={styles.footerTagline}>
              Real-time documents, boards, and presence for collaborative teams.
            </p>
          </div>
          <div>
            <div className={styles.footerColTitle}>Product</div>
            <div className={styles.footerLinks}>
              <a href="#features">Features</a>
              <a href="#spotlight">How it works</a>
              <Link href="/app">Workspace</Link>
            </div>
          </div>
          <div>
            <div className={styles.footerColTitle}>Company</div>
            <div className={styles.footerLinks}>
              <a href="#testimonials">Customers</a>
              <a href="#">About</a>
              <a href="#">Careers</a>
            </div>
          </div>
          <div>
            <div className={styles.footerColTitle}>Resources</div>
            <div className={styles.footerLinks}>
              <a href="#">Documentation</a>
              <a href="#">Changelog</a>
              <a href="#">Support</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} CollabFlow. All rights reserved.</span>
          <span>Made for teams who ship together.</span>
        </div>
      </footer>
    </div>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.checkItem}>
      <CheckCircle2 size={17} className={styles.checkIcon} />
      <span>{children}</span>
    </div>
  );
}

function Reveal({
  children,
  className,
  delay = 0,
  direction = 'up',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
}) {
  const offsets = {
    up: { y: 24, x: 0 },
    left: { y: 0, x: -28 },
    right: { y: 0, x: 28 },
  } as const;
  const { x, y } = offsets[direction];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay }}
    >
      {children}
    </motion.div>
  );
}

function StatItem({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  label,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate(latest) {
        node.textContent = `${prefix}${formatStat(latest, decimals)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, prefix, decimals]);

  return (
    <div className={styles.statItem}>
      <div className={styles.statValue} ref={ref}>{prefix}0{suffix}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

function formatStat(value: number, decimals: number): string {
  if (decimals > 0) return value.toFixed(decimals);
  if (value >= 1000) return Math.round(value).toLocaleString('en-US');
  return Math.round(value).toString();
}

function ProductMockup() {
  return (
    <div className={styles.mockup}>
      <motion.div
        className={`${styles.floatCard} ${styles.floatCardOne}`}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Users size={14} color="#22d3c8" />
        4 teammates editing
      </motion.div>
      <motion.div
        className={`${styles.floatCard} ${styles.floatCardTwo}`}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      >
        <CheckCircle2 size={14} color="#4f7cff" />
        Task moved to Done
      </motion.div>

      <div className={styles.mockupTopbar}>
        <span className={styles.mockupDot} />
        <span className={styles.mockupDot} />
        <span className={styles.mockupDot} />
      </div>
      <div className={styles.mockupBody}>
        <div className={styles.mockupPane}>
          <div className={styles.mockupLine} style={{ width: '55%' }} />
          <div className={styles.mockupLine} style={{ width: '90%' }} />
          <div className={styles.mockupLine} style={{ width: '80%' }} />
          <div className={styles.mockupLine} style={{ width: '70%' }} />
          <div className={styles.mockupLine} style={{ width: '85%' }} />
          <div className={styles.mockupLine} style={{ width: '40%' }} />
        </div>
        <div className={styles.mockupPane}>
          <div className={styles.mockupBoard}>
            {[0, 1, 2].map((col) => (
              <div className={styles.mockupColumn} key={col}>
                {Array.from({ length: col === 1 ? 3 : 2 }).map((_, index) => (
                  <div className={styles.mockupCard} key={index}>
                    <span className={styles.mockupChip} />
                    Task item {col * 2 + index + 1}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DocMockup() {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div className={styles.mockupLine} style={{ width: '70%', height: 14 }} />
      <div className={styles.mockupLine} style={{ width: '95%' }} />
      <div className={styles.mockupLine} style={{ width: '88%' }} />
      <div className={styles.mockupLine} style={{ width: '92%' }} />
      <div className={styles.mockupLine} style={{ width: '60%' }} />
      <div style={{ height: 10 }} />
      <div className={styles.mockupLine} style={{ width: '80%' }} />
      <div className={styles.mockupLine} style={{ width: '75%' }} />
      <div className={styles.mockupLine} style={{ width: '50%' }} />
    </div>
  );
}

function BoardMockup() {
  return (
    <div className={styles.mockupBoard}>
      {[0, 1, 2].map((col) => (
        <div className={styles.mockupColumn} key={col}>
          {Array.from({ length: col === 0 ? 3 : 2 }).map((_, index) => (
            <div className={styles.mockupCard} key={index}>
              <span className={styles.mockupChip} />
              Sprint task {col * 2 + index + 1}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
