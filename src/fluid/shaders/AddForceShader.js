var glu = require('pex-glu');
var Context = glu.Context;
var Program = glu.Program;
var fs = require('fs');
var Vec2 = require('pex-geom').Vec2;
var shader = fs.readFileSync(__dirname + '/addForce.glsl', 'utf8');

function AddForceShader (width, height) {
  this.width = width;
  this.height = height;
  this._program = new Program(shader);
  this._program.use();
}

AddForceShader.prototype.update = function (options) {
  var destBuffer = options.destBuffer
    , backBufferTex = options.backBufferTex
    , addTex = options.addTex
    , force = options.force
    , frameRenderer = options.frameRenderer;

  if (!destBuffer) throw new Error("no destBuffer");
  if (!backBufferTex) throw new Error("no backBufferTex");
  if (!addTex) throw new Error("no velocityTex");
  //if (!force) throw new Error("no obstacleTex");
  if (!frameRenderer) throw new Error("no frameRenderer");

  destBuffer.bind();
  this._program.use();
  //vert
  this._program.uniforms.screenSize(new Vec2(this.width, this.height));
  this._program.uniforms.pixelPosition(new Vec2(0, 0));
  this._program.uniforms.pixelSize(new Vec2(this.width, this.height));
  //frag
  backBufferTex.bind(0);
  this._program.uniforms.Backbuffer(0);
  addTex.bind(1);
  this._program.uniforms.AddTexture(1);
  this._program.uniforms.force(force);
  var scale = new Vec2(addTex.width / destBuffer.width,
                        addTex.height / destBuffer.height);
  this._program.uniforms.Scale(scale);
  frameRenderer.draw(this._program);
  destBuffer.unbind();

}

module.exports = AddForceShader;
