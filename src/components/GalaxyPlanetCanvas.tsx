import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface SpiralStar {
  distance: number;
  angle: number;
  speed: number;
  size: number;
  alpha: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

export const GalaxyPlanetCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // 1. Background stars
    const starsCount = 140;
    const stars: Star[] = [];
    const starColors = ['#e0f2fe', '#bae6fd', '#7dd3fc', '#c084fc', '#f472b6', '#ffffff'];

    for (let i = 0; i < starsCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 2 + 0.5,
        size: Math.random() * 1.6 + 0.5,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    // 2. Spiral galaxy arms stars
    const spiralCount = 260;
    const spiralStars: SpiralStar[] = [];
    const galaxyArms = 3;

    for (let i = 0; i < spiralCount; i++) {
      const arm = i % galaxyArms;
      const armOffset = (arm * 2 * Math.PI) / galaxyArms;
      const distance = Math.pow(Math.random(), 1.6) * Math.min(width, height) * 0.65;
      // Logarithmic spiral angle + random spread
      const angle = armOffset + distance * 0.008 + (Math.random() - 0.5) * 0.65;
      const colors = ['#38bdf8', '#818cf8', '#c084fc', '#06b6d4', '#e0e7ff'];

      spiralStars.push({
        distance,
        angle,
        speed: (0.0006 + Math.random() * 0.0004) * (1 / (distance * 0.003 + 1)),
        size: Math.random() * 1.5 + 0.4,
        alpha: Math.random() * 0.7 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // 3. Shooting stars
    const shootingStars: ShootingStar[] = [];
    const maxShootingStars = 2;

    const createShootingStar = (): ShootingStar => ({
      x: Math.random() * width * 0.8,
      y: Math.random() * height * 0.4,
      length: Math.random() * 90 + 50,
      speed: Math.random() * 7 + 9,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
      opacity: 1,
      active: true,
    });

    // 4. Planet motion state
    let planetTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep space cosmic gradient
      const bgGradient = ctx.createRadialGradient(
        width * 0.65,
        height * 0.35,
        20,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.9
      );
      bgGradient.addColorStop(0, 'rgba(15, 23, 52, 0.45)');
      bgGradient.addColorStop(0.35, 'rgba(10, 15, 38, 0.55)');
      bgGradient.addColorStop(0.7, 'rgba(4, 7, 20, 0.75)');
      bgGradient.addColorStop(1, 'rgba(2, 4, 12, 0.88)');

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // --- Cosmic Nebula Clouds ---
      const nebula1 = ctx.createRadialGradient(
        width * 0.25 + Math.sin(planetTime * 0.4) * 30,
        height * 0.3 + Math.cos(planetTime * 0.3) * 20,
        10,
        width * 0.25,
        height * 0.3,
        width * 0.4
      );
      nebula1.addColorStop(0, 'rgba(99, 102, 241, 0.12)');
      nebula1.addColorStop(0.5, 'rgba(168, 85, 247, 0.06)');
      nebula1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, width, height);

      const nebula2 = ctx.createRadialGradient(
        width * 0.75 + Math.cos(planetTime * 0.3) * 25,
        height * 0.7 + Math.sin(planetTime * 0.4) * 25,
        20,
        width * 0.75,
        height * 0.7,
        width * 0.45
      );
      nebula2.addColorStop(0, 'rgba(6, 182, 212, 0.14)');
      nebula2.addColorStop(0.5, 'rgba(59, 130, 246, 0.05)');
      nebula2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, width, height);

      // --- Background Stars with Twinkle ---
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.twinklePhase += s.twinkleSpeed;
        const currentAlpha = Math.abs(Math.sin(s.twinklePhase)) * 0.75 + 0.25;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = currentAlpha;
        ctx.shadowBlur = s.size > 1.2 ? 6 : 0;
        ctx.shadowColor = s.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;

      // --- Rotating Spiral Galaxy Core ---
      const galaxyCenterX = width * 0.32;
      const galaxyCenterY = height * 0.42;

      // Core glow
      const coreGlow = ctx.createRadialGradient(
        galaxyCenterX,
        galaxyCenterY,
        0,
        galaxyCenterX,
        galaxyCenterY,
        Math.min(width, height) * 0.28
      );
      coreGlow.addColorStop(0, 'rgba(224, 242, 254, 0.35)');
      coreGlow.addColorStop(0.2, 'rgba(56, 189, 248, 0.22)');
      coreGlow.addColorStop(0.5, 'rgba(99, 102, 241, 0.12)');
      coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(galaxyCenterX, galaxyCenterY, Math.min(width, height) * 0.28, 0, Math.PI * 2);
      ctx.fill();

      // Spiral arms particles
      for (let i = 0; i < spiralStars.length; i++) {
        const ss = spiralStars[i];
        ss.angle += ss.speed;

        // Elliptical tilt for 3D perspective
        const x = galaxyCenterX + Math.cos(ss.angle) * ss.distance;
        const y = galaxyCenterY + Math.sin(ss.angle) * (ss.distance * 0.48);

        ctx.beginPath();
        ctx.arc(x, y, ss.size, 0, Math.PI * 2);
        ctx.fillStyle = ss.color;
        ctx.globalAlpha = ss.alpha * 0.8;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // --- Majestic Moving Sci-Fi Planet with Rings ---
      planetTime += 0.008;

      // Planet Center drifts smoothly in an orbit
      const planetRadius = Math.min(width, height) * 0.14;
      const planetX = width * 0.76 + Math.sin(planetTime * 0.5) * (width * 0.04);
      const planetY = height * 0.32 + Math.cos(planetTime * 0.7) * (height * 0.035);

      // 1. Back section of planetary rings (drawn BEFORE planet body)
      ctx.save();
      ctx.translate(planetX, planetY);
      ctx.rotate(-0.38 + Math.sin(planetTime * 0.2) * 0.04); // subtle dynamic tilt

      const ringInnerRadiusX = planetRadius * 1.5;
      const ringInnerRadiusY = planetRadius * 0.42;
      const ringOuterRadiusX = planetRadius * 2.35;
      const ringOuterRadiusY = planetRadius * 0.65;

      // Back half of rings (angles from PI to 2*PI)
      ctx.beginPath();
      ctx.ellipse(0, 0, ringOuterRadiusX, ringOuterRadiusY, 0, Math.PI, Math.PI * 2);
      ctx.ellipse(0, 0, ringInnerRadiusX, ringInnerRadiusY, 0, Math.PI * 2, Math.PI, true);
      ctx.closePath();

      const ringGradBack = ctx.createLinearGradient(-ringOuterRadiusX, 0, ringOuterRadiusX, 0);
      ringGradBack.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
      ringGradBack.addColorStop(0.3, 'rgba(168, 85, 247, 0.45)');
      ringGradBack.addColorStop(0.5, 'rgba(224, 242, 254, 0.6)');
      ringGradBack.addColorStop(0.7, 'rgba(6, 182, 212, 0.4)');
      ringGradBack.addColorStop(1, 'rgba(56, 189, 248, 0.15)');

      ctx.fillStyle = ringGradBack;
      ctx.fill();
      ctx.restore();

      // 2. Planet Outer Atmospheric Glow / Halo
      const atmosphereGlow = ctx.createRadialGradient(
        planetX,
        planetY,
        planetRadius * 0.8,
        planetX,
        planetY,
        planetRadius * 1.45
      );
      atmosphereGlow.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
      atmosphereGlow.addColorStop(0.6, 'rgba(56, 189, 248, 0.12)');
      atmosphereGlow.addColorStop(1, 'rgba(6, 182, 212, 0)');

      ctx.beginPath();
      ctx.arc(planetX, planetY, planetRadius * 1.45, 0, Math.PI * 2);
      ctx.fillStyle = atmosphereGlow;
      ctx.fill();

      // 3. Planet Sphere Body with 3D spherical lighting & texture bands
      ctx.save();
      ctx.beginPath();
      ctx.arc(planetX, planetY, planetRadius, 0, Math.PI * 2);
      ctx.clip(); // Clip everything to the sphere

      // Base planet surface
      const planetSurface = ctx.createRadialGradient(
        planetX - planetRadius * 0.45,
        planetY - planetRadius * 0.45,
        planetRadius * 0.05,
        planetX,
        planetY,
        planetRadius * 1.05
      );
      planetSurface.addColorStop(0, '#e0f2fe'); // bright highlight
      planetSurface.addColorStop(0.2, '#38bdf8'); // illuminated cyan surface
      planetSurface.addColorStop(0.5, '#0284c7'); // deep ocean blue
      planetSurface.addColorStop(0.75, '#1e1b4b'); // twilight zone
      planetSurface.addColorStop(0.95, '#030712'); // shadow side
      planetSurface.addColorStop(1, '#02040a');

      ctx.fillStyle = planetSurface;
      ctx.fillRect(planetX - planetRadius, planetY - planetRadius, planetRadius * 2, planetRadius * 2);

      // Atmospheric cloud bands shifting across planet
      const bandCount = 6;
      for (let b = 0; b < bandCount; b++) {
        const bandY = planetY - planetRadius + (b * (planetRadius * 2)) / bandCount;
        const bandOffset = Math.sin(planetTime * 0.6 + b * 1.2) * 12;

        ctx.beginPath();
        ctx.ellipse(
          planetX + bandOffset,
          bandY,
          planetRadius * 0.95,
          planetRadius * 0.16,
          0.12,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = b % 2 === 0 ? 'rgba(255, 255, 255, 0.12)' : 'rgba(14, 165, 233, 0.15)';
        ctx.fill();
      }

      // Atmospheric crescent rim lighting
      const rimLight = ctx.createRadialGradient(
        planetX - planetRadius * 0.5,
        planetY - planetRadius * 0.5,
        planetRadius * 0.9,
        planetX,
        planetY,
        planetRadius
      );
      rimLight.addColorStop(0, 'rgba(255, 255, 255, 0)');
      rimLight.addColorStop(0.85, 'rgba(125, 211, 252, 0.4)');
      rimLight.addColorStop(1, 'rgba(255, 255, 255, 0.75)');

      ctx.fillStyle = rimLight;
      ctx.fillRect(planetX - planetRadius, planetY - planetRadius, planetRadius * 2, planetRadius * 2);
      ctx.restore();

      // 4. Front section of planetary rings (drawn AFTER planet body so it passes in front)
      ctx.save();
      ctx.translate(planetX, planetY);
      ctx.rotate(-0.38 + Math.sin(planetTime * 0.2) * 0.04);

      // Front half of rings (angles from 0 to PI)
      ctx.beginPath();
      ctx.ellipse(0, 0, ringOuterRadiusX, ringOuterRadiusY, 0, 0, Math.PI);
      ctx.ellipse(0, 0, ringInnerRadiusX, ringInnerRadiusY, 0, Math.PI, 0, true);
      ctx.closePath();

      const ringGradFront = ctx.createLinearGradient(-ringOuterRadiusX, 0, ringOuterRadiusX, 0);
      ringGradFront.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
      ringGradFront.addColorStop(0.25, 'rgba(168, 85, 247, 0.5)');
      ringGradFront.addColorStop(0.5, 'rgba(224, 242, 254, 0.7)');
      ringGradFront.addColorStop(0.75, 'rgba(6, 182, 212, 0.55)');
      ringGradFront.addColorStop(1, 'rgba(56, 189, 248, 0.25)');

      ctx.fillStyle = ringGradFront;
      ctx.fill();

      // Subtle ring dark division line (Cassini Division)
      ctx.beginPath();
      ctx.ellipse(0, 0, ringInnerRadiusX * 1.35, ringInnerRadiusY * 1.35, 0, 0, Math.PI);
      ctx.strokeStyle = 'rgba(2, 6, 23, 0.65)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();

      // --- Shooting Stars (Occasional Comets) ---
      if (shootingStars.length < maxShootingStars && Math.random() < 0.015) {
        shootingStars.push(createShootingStar());
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.opacity -= 0.014;

        if (ss.opacity <= 0 || ss.x > width || ss.y > height) {
          shootingStars.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const cometGrad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        cometGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        cometGrad.addColorStop(0.6, `rgba(168, 85, 247, ${ss.opacity * 0.4})`);
        cometGrad.addColorStop(1, `rgba(255, 255, 255, ${ss.opacity * 0.9})`);

        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = cometGrad;
        ctx.lineWidth = 1.8;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#38bdf8';
        ctx.stroke();
        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none w-full h-full ${className}`}
      style={{ zIndex: 0 }}
    />
  );
};
