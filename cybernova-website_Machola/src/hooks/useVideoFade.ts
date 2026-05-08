import { useEffect, type RefObject } from 'react';

export function useVideoFade(videoRef: RefObject<HTMLVideoElement>) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let targetOpacity = 0;
    let currentOpacity = 0;
    let fadeFrame = 0;

    const animateOpacity = (target: number, duration = 500) => {
      cancelAnimationFrame(fadeFrame);
      const startOpacity = currentOpacity;
      const startTime = performance.now();

      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        currentOpacity = startOpacity + (target - startOpacity) * progress;
        video.style.opacity = String(currentOpacity);

        if (progress < 1) {
          fadeFrame = requestAnimationFrame(step);
        }
      };

      fadeFrame = requestAnimationFrame(step);
    };

    const handleCanPlay = () => {
      video.play();
      targetOpacity = 1;
      animateOpacity(1, 500);
    };

    const handleTimeUpdate = () => {
      const remaining = video.duration - video.currentTime;
      if (remaining <= 0.55 && targetOpacity === 1) {
        targetOpacity = 0;
        animateOpacity(0, 500);
      }
    };

    const handleEnded = () => {
      currentOpacity = 0;
      video.style.opacity = '0';
      window.setTimeout(() => {
        video.currentTime = 0;
        video.play();
        targetOpacity = 1;
        animateOpacity(1, 500);
      }, 100);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      cancelAnimationFrame(fadeFrame);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoRef]);
}