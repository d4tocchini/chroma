#ifdef VERT

attribute vec2 position;
attribute vec2 texCoord;
uniform vec2 screenSize;
uniform vec2 pixelPosition;
uniform vec2 pixelSize;
varying vec2 tc;

void main() {
  float tx = position.x * 0.5 + 0.5; //-1 -> 0, 1 -> 1
  float ty = -position.y * 0.5 + 0.5; //-1 -> 1, 1 -> 0
  //(x + 0)/sw * 2 - 1, (x + w)/sw * 2 - 1
  float x = (pixelPosition.x + pixelSize.x * tx)/screenSize.x * 2.0 - 1.0;  //0 -> -1, 1 -> 1
  //1.0 - (y + h)/sh * 2, 1.0 - (y + h)/sh * 2
  float y = 1.0 - (pixelPosition.y + pixelSize.y * ty)/screenSize.y * 2.0;  //0 -> 1, 1 -> -1
  gl_Position = vec4(x, y, 0.0, 1.0);
  tc = texCoord;
}

#endif

#ifdef FRAG

uniform vec2 Point;
uniform float	Radius;
uniform float	EdgeSmooth;
uniform vec4 Value;
uniform float Width;
uniform float Height;
varying vec2 tc;

void main(){
  vec2 texelSize = vec2(Width, Height);
  vec2 tcs = tc * texelSize;
  vec4 color = Value;
  float d = distance(Point, tcs);
  float a = max((Radius - d) / Radius, 0.0);
  float c = ceil(a);
  color.xyz *= c;
  color.w *= pow(a, EdgeSmooth + 0.1);
  gl_FragColor = color;
}

#endif

