var gl = null;
var canvas = null;
var shaderProgram = null;
var fragmentShader = null;
var vertexShader = null;
var m4 = null;

var cubeVertices = [], cubeIndex = [], cubeColors = [];
var sphereVertices = [], sphereIndex = [], sphereColors = [];
var triangleVertices = [], triangleIndex = [], triangleColors = [];

var cubeVerticesBuffer, cubeColorBuffer, cubeIndexBuffer;
var sphereVerticesBuffer, sphereColorBuffer, sphereIndexBuffer;
var triangleVerticesBuffer, triangleColorBuffer, triangleIndexBuffer;

function init() {
  configurarWebGL();
  iniciarShaders();

  definirQuadrado();

  configurarAnimacaoERenderizar();
}

function configurarWebGL() {
  canvas = document.getElementById("my-canvas");
  gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  m4 = twgl.m4;
}

function iniciarShaders() {
  var vertexSource = document.getElementById('shader-vs').innerHTML;
  var fragmentSource = document.getElementById('shader-fs').innerHTML;

  vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexSource);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(vertexShader)); return null;
  }

  fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentSource);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(fragmentShader)); return null;
  }

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Erro ao iniciar os shaders");
  }
  gl.useProgram(shaderProgram);

  shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.PositionAttribute);

  shaderProgram.ColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.ColorAttribute);

  shaderProgram.MVPmatrix = gl.getUniformLocation(shaderProgram, "uMVP");
}

function definirQuadrado() {
  cubeVertices = [
    // Front face
    -5.0, -1.0, 1.0,
    -3.0, -1.0, 1.0,
    -3.0, 1.0, 1.0,
    -5.0, 1.0, 1.0,

    // Back face
    -5.0, -1.0, -1.0,
    -5.0, 1.0, -1.0,
    -3.0, 1.0, -1.0,
    -3.0, -1.0, -1.0,

    // Top face
    -5.0, 1.0, -1.0,
    -5.0, 1.0, 1.0,
    -3.0, 1.0, 1.0,
    -3.0, 1.0, -1.0,

    // Bottom face
    -5.0, -1.0, -1.0,
    -3.0, -1.0, -1.0,
    -3.0, -1.0, 1.0,
    -5.0, -1.0, 1.0,

    // Right face
    -3.0, -1.0, -1.0,
    -3.0, 1.0, -1.0,
    -3.0, 1.0, 1.0,
    -3.0, -1.0, 1.0,

    // Left face
    -5.0, -1.0, -1.0,
    -5.0, -1.0, 1.0,
    -5.0, 1.0, 1.0,
    -5.0, 1.0, -1.0,
  ];

  cubeColors = [
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,

    1.0, 0.0, 1.0,
    1.0, 0.0, 1.0,
    1.0, 0.0, 1.0,
    1.0, 0.0, 1.0,

    0.5, 0.0, 0.0,
    0.5, 0.0, 0.0,
    0.5, 0.0, 0.0,
    0.5, 0.0, 0.0,

    0.0, 5.0, 0.0,
    0.0, 5.0, 0.0,
    0.0, 5.0, 0.0,
    0.0, 5.0, 0.0,

    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
  ];


  cubeIndex = [
    0, 1, 2, 0, 2, 3, // front
    4, 5, 6, 4, 6, 7, // back
    8, 9, 10, 8, 10, 11, // top
    12, 13, 14, 12, 14, 15, // bottom
    16, 17, 18, 16, 18, 19, // right
    20, 21, 22, 20, 22, 23, // left
  ];

  cubeVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);
  cubeVerticesBuffer.itemSize = 3;
  cubeVerticesBuffer.numItems = 24;


  // a buffer for colors
  cubeColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeColors), gl.STATIC_DRAW);
  cubeColorBuffer.itemSize = 3;
  cubeColorBuffer.numItems = 24;

  // a buffer for indices
  cubeIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(cubeIndex), gl.STATIC_DRAW);
}



function configurarAnimacaoERenderizar() {
  var anguloDeRotacao = 0;

  var loop = function () {
    anguloDeRotacao = performance.now() / 1000 / 6 * 2 * Math.PI;
    setarCameraERenderizar(anguloDeRotacao);
    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
}

function setarCameraERenderizar(anguloDeRotacao) {
  var eye = [50, 350.0, 500.0];
  var target = [0, 50, 00];
  var up = [0, 1, 0];

  var modeloAnimado = m4.multiply(m4.scaling([100, 100, 100]), m4.axisRotation([1, 1, 1], anguloDeRotacao));
  var modeloEstatico = m4.scaling([100, 100, 100]);

  var camera = m4.inverse(m4.lookAt(eye, target, up));
  var projecao = m4.perspective(glMatrix.toRadian(70), canvas.width / canvas.height, 0.1, 1000);


  var mvpAnimado = m4.multiply(m4.multiply(modeloAnimado, camera), projecao);
  var mvpEstatico = m4.multiply(m4.multiply(modeloEstatico, camera), projecao);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  renderizarQuadrado(mvpEstatico);
}

function renderizarQuadrado(mvp) {
  gl.uniformMatrix4fv(shaderProgram.MVPmatrix, false, mvp);

  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
  gl.vertexAttribPointer(shaderProgram.PositionAttribute, cubeVerticesBuffer.itemSize,
    gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeColorBuffer);
  gl.vertexAttribPointer(shaderProgram.ColorAttribute, cubeColorBuffer.itemSize,
    gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

  gl.drawElements(gl.TRIANGLES, cubeIndex.length, gl.UNSIGNED_BYTE, 0);
}

init();