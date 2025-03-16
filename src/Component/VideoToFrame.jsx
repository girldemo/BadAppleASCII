import { useEffect, useRef, useState, useCallback } from "react";

function VideoToFrame({ videoUrl, convertChars, renderResolution, updateInterval = 50 }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const [stringFrame, setStringFrame] = useState("");
  const lastUpdateRef = useRef(0);

  const videoToFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");

    // Thiết lập kích thước cho canvas
    const width = renderResolution;
    const height = (9 / 16) * width;
    canvas.width = width;
    canvas.height = height;

    // Vẽ frame từ video lên canvas
    ctx.drawImage(video, 0, 0, width, height);

    // Lấy dữ liệu pixel từ canvas
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    let charString = "";

    // Chuyển đổi mỗi pixel thành ký tự dựa trên độ sáng
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const charIndex = Math.floor((brightness / 255) * (convertChars.length - 1));
      charString += convertChars[charIndex];

      if (((i / 4) + 1) % width === 0) {
        charString += "\n";
      }
    }
    setStringFrame(charString);
  }, [convertChars, renderResolution]);

  const updateFrame = useCallback((time) => {
    if (!lastUpdateRef.current || time - lastUpdateRef.current >= updateInterval) {
      videoToFrame();
      lastUpdateRef.current = time;
    }
    animationFrameIdRef.current = requestAnimationFrame(updateFrame);
  }, [videoToFrame, updateInterval]);

  useEffect(() => {
    //console.log("effect");
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      lastUpdateRef.current = performance.now();
      animationFrameIdRef.current = requestAnimationFrame(updateFrame);
    };

    video.addEventListener("play", handlePlay);

    return () => {
      video.removeEventListener("play", handlePlay);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  console.log("render");

  return (
    <div style={{ display: "flex", gap: "150px", alignItems: "center" }}>
      <div id="video">
        <video ref={videoRef} width="640" height="360" controls>
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>
      <div id="frame">
        <pre style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>{stringFrame}</pre>
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      </div>
    </div>
  );
}

export default VideoToFrame;
