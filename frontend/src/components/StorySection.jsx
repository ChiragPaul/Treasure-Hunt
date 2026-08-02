import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const PlayerAvatarCanvas = ({ role }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    canvas.width = 100;
    canvas.height = 100;

    const noiseMap = Array.from({ length: 50 }, () =>
      Array.from({ length: 50 }, () => Math.random())
    );

    let time = 0;
    const render = () => {
      time += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#9BA8A8';

      const spacing = 4;
      const cols = Math.floor(canvas.width / spacing);
      const rowHeight = 6;
      const rows = Math.floor(canvas.height / rowHeight);

      const centerX = cols / 2;
      const centerY = rows / 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * rowHeight;

          let shapeVal = 0;
          const distX = Math.abs(i - centerX);

          if (role === '[LEAD]') {
            // Spartan helmet
            if (j > centerY - 8 && j < centerY + 4) {
              const headDist = Math.sqrt(Math.pow(distX, 2) + Math.pow(j - centerY + 2, 2));
              if (headDist < 6) shapeVal = 1;
              // Visor cutout
              if (distX < 1.5 && j > centerY - 2 && j < centerY + 5) shapeVal = 0;
              if (j === centerY - 2 && distX < 3) shapeVal = 0;
            }
            // Shoulders
            if (j >= centerY + 4 && j < centerY + 10) {
              if (distX < 8) shapeVal = 0.7;
            }
          }
          else if (role === '[SCOUT]') {
            // Hood
            if (j > centerY - 10 && j < centerY + 5) {
              const headDist = Math.sqrt(Math.pow(distX, 2) + Math.pow(j - centerY + 2, 2) * 1.5);
              if (headDist < 7) shapeVal = 0.9;
              // Face shadow
              if (distX < 3.5 && j > centerY && j < centerY + 5) shapeVal = 0.1;
            }
            if (j >= centerY + 5 && j < centerY + 11) {
              if (distX < 9) shapeVal = 0.8;
            }
          }
          else if (role === '[SUPPORT]') {
            // Heavy helmet + shoulder pads
            if (j > centerY - 8 && j < centerY + 4) {
              const headDist = Math.sqrt(Math.pow(distX, 2) + Math.pow(j - centerY + 2, 2));
              if (headDist < 6.5) shapeVal = 1;
              // T Visor cutout
              if (distX < 2 && j > centerY - 2 && j < centerY + 3) shapeVal = 0;
              if (j === centerY - 2 && distX < 4) shapeVal = 0;
            }
            if (j >= centerY + 4 && j < centerY + 10) {
              if (distX < 7) shapeVal = 0.8; // Body
              if (distX >= 7 && distX < 11 && j < centerY + 8) shapeVal = 1; // Shoulder pads
            }
          }
          else if (role === '[ASSAULT]') {
            // Robot / Antennas
            if (j > centerY - 6 && j < centerY + 5) {
              const headDist = Math.sqrt(Math.pow(distX, 2) + Math.pow(j - centerY + 1, 2));
              if (headDist < 5) shapeVal = 1;
              // Eyes
              if (Math.abs(distX - 2) < 1 && j === centerY) shapeVal = 0;
            }
            // Antennas
            if (distX === 6 && j > centerY - 8 && j < centerY + 2) shapeVal = 1;
            if (j >= centerY + 5 && j < centerY + 10) {
              if (distX < 7) shapeVal = 0.7;
            }
          }

          if (shapeVal > 0) {
            const dynamicShapeVal = shapeVal * (0.8 + 0.3 * Math.sin(time + i * 0.2 + j * 0.2));
            const noise = noiseMap[i % 50][j % 50];
            const finalVal = dynamicShapeVal * 0.8 + noise * 0.2;

            if (finalVal > 0.3) {
              const thickness = Math.max(1, (finalVal - 0.3) * 4);
              const length = Math.min(rowHeight, finalVal * rowHeight * 1.1);

              ctx.globalAlpha = Math.min(1, finalVal + 0.2);
              ctx.fillRect(
                x + (spacing - thickness) / 2,
                y + (rowHeight - length) / 2,
                thickness,
                length
              );
            }
          }
        }
      }
      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [role]);

  return <canvas ref={canvasRef} style={{ width: '80px', height: '80px', display: 'block' }} />;
};

const StorySection = () => {
  const container = useRef();
  const videoRef = useRef();

  useGSAP(() => {
    gsap.fromTo('.story-reveal',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: container.current,
          start: "top 70%",
        }
      }
    );
  }, { scope: container });

  // Autoplay on scroll into view, pause on scroll out
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const players = [
    { title: 'PLAYER_01', role: '[LEAD]' },
    { title: 'PLAYER_02', role: '[SCOUT]' },
    { title: 'PLAYER_03', role: '[SUPPORT]' },
    { title: 'PLAYER_04', role: '[ASSAULT]' }
  ];

  return (
    <section id="story" className="story-container" ref={container} style={{
      padding: '8rem 4rem',
      backgroundColor: 'transparent',
      display: 'flex',
      flexDirection: 'row',
      gap: '4rem',
      maxWidth: '1200px',
      margin: '0 auto',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>

      {/* Left Column: Context & Video */}
      <div className="story-reveal story-left" style={{ flex: '1 1 55%', minWidth: '400px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '3rem', color: 'var(--color-accent)', fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>
            THE INCIDENT
          </h2>
          <p style={{ color: 'var(--color-text)', fontSize: '1.1rem', lineHeight: '1.8', fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
            Decades after the catastrophic failure of Reactor 4, the exclusion zone remains sealed. But anomalies have begun to shift, revealing pathways to secure bunkers containing invaluable artifacts. You and your squad have been briefed. Your mission: infiltrate, secure the payload, and extract before the radiation consumes you.
          </p>
        </div>

        {/* ── Local Video Player: scroll-triggered autoplay ── */}
        <div style={{ width: '100%', position: 'relative' }}>

          {/* Status bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            letterSpacing: '2px',
            color: 'rgba(57, 255, 20, 0.6)',
            padding: '0 2px',
          }}>
            <span>▸ RECOVERED FOOTAGE // SECTOR-4 // REACTOR COMPOUND</span>
            <span style={{ color: 'rgba(155,168,168,0.4)' }}>51.3894°N  30.0994°E</span>
          </div>

          {/* 16:9 video container */}
          <div style={{
            position: 'relative',
            width: '100%',
            background: '#000',
            border: '1px solid rgba(57, 255, 20, 0.25)',
            boxShadow: '0 0 30px rgba(57,255,20,0.06)',
            overflow: 'hidden',
          }}>
            {/* Corner brackets */}
            <div style={{ position:'absolute', top:0, left:0, width:'20px', height:'20px', borderTop:'2px solid rgba(57,255,20,0.7)', borderLeft:'2px solid rgba(57,255,20,0.7)', zIndex:3, pointerEvents:'none' }} />
            <div style={{ position:'absolute', top:0, right:0, width:'20px', height:'20px', borderTop:'2px solid rgba(57,255,20,0.7)', borderRight:'2px solid rgba(57,255,20,0.7)', zIndex:3, pointerEvents:'none' }} />
            <div style={{ position:'absolute', bottom:0, left:0, width:'20px', height:'20px', borderBottom:'2px solid rgba(57,255,20,0.7)', borderLeft:'2px solid rgba(57,255,20,0.7)', zIndex:3, pointerEvents:'none' }} />
            <div style={{ position:'absolute', bottom:0, right:0, width:'20px', height:'20px', borderBottom:'2px solid rgba(57,255,20,0.7)', borderRight:'2px solid rgba(57,255,20,0.7)', zIndex:3, pointerEvents:'none' }} />

            {/* Scanline overlay */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 3px)',
            }} />

            {/* Native HTML5 video — autoplays muted on scroll into view */}
            <video
              ref={videoRef}
              src="/Jumanji Open World - Official Trailer - Only In Cinemas This Christmas.mp4"
              muted
              loop
              playsInline
              controls
              preload="metadata"
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                position: 'relative',
                zIndex: 1,
              }}
            />
          </div>

          {/* Caption */}
          <div style={{
            marginTop: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            letterSpacing: '2px',
            color: 'rgba(155,168,168,0.35)',
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <span>ZONE_4_BROADCAST_ARCHIVE.mp4</span>
            <span>CLASSIFICATION: OMEGA</span>
          </div>
        </div>

      </div>

      {/* Right Column: Squad Roster */}
      <div className="story-reveal story-right" style={{
        flex: '0 0 350px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        borderLeft: '1px solid rgba(155, 168, 168, 0.3)',
        paddingLeft: '3rem'
      }}>
        {players.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {/* Avatar Canvas */}
            <PlayerAvatarCanvas role={p.role} />

            {/* Text labels */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: 'var(--color-text)', fontFamily: 'var(--font-sans)', letterSpacing: '2px', fontSize: '1.1rem', marginBottom: '0.2rem' }}>{p.title}</span>
              <span style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', fontSize: '0.9rem' }}>{p.role}</span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default StorySection;
