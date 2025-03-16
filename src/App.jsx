import VideoToFrame from "./Component/VideoToFrame"

function App() {

  const videoUrl = "badApple.mp4";
  // ~}|{zyxwvutsrqponmlkjihgfedcba`_^]\[ZYXWVUTSRQPONMLKJIHGFEDCBA@?><=>;:9876543210./,-)(*&%$#\"!
  const convertChars = "?-)(*&%$#\"!";
  // render resolution (width input => height) 
  // 16:9 render
  const resolution = 200;
  
  return (
    <>
      <VideoToFrame videoUrl={videoUrl} convertChars={convertChars} renderResolution={resolution}/>
    </>
  )
}

export default App
