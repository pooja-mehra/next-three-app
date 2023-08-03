
export default function PreviewText(props:any) {
  const { children, position, scale, color, fontSize, fontFamily, opacity} = props 
  var canvas = document.createElement('canvas')
  var context:any = canvas.getContext('2d')
  context.textBaseline = 'middle'
  context.font = `${fontSize}px ${fontFamily}`
  var metrics = context.measureText(children)
  var textWidth = metrics.width
  context.lineWidth = 6
  context.fillStyle = color
  context.fillText(children, textWidth - textWidth * 0.8, fontSize)
  return (
    <sprite  scale={scale} position={position}>
      <spriteMaterial sizeAttenuation={false} attach="material" transparent alphaTest={0.5} opacity={1}>
        <canvasTexture attach="map" image={canvas} />
      </spriteMaterial>
    </sprite>
  )
}