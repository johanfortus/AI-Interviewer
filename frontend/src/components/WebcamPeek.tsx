import { useEffect, useRef, useState } from "react";

export default function WebcamPeek() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("Webcam error:", err);
      }
    })();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream | undefined;
      stream?.getTracks().forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [enabled]);

  return (
    <div className="fixed right-4 bottom-4 z-50 bg-[var(--color-card)] rounded-xl shadow-soft p-2 border border-[var(--color-border)]">
      <video
        ref={videoRef}
        className="w-44 h-32 rounded-lg object-cover bg-black"
        muted
        playsInline
      />
      <button
        onClick={() => setEnabled((v) => !v)}
        className="mt-2 w-full text-sm font-medium bg-[var(--color-primary)] text-white rounded-lg py-1.5 hover:bg-[var(--color-primary-600)]"
      >
        {enabled ? "Hide Camera" : "Show Camera"}
      </button>
    </div>
  );
}
