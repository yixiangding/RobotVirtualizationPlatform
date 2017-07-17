// JavaScript Document
function main(){
	//获得画布对象和WebGL上下文
	var canvas = document.getElementById('canvas'); 
	var gl = getWebGLContext(canvas); 
	//var gl = canvas.getContext('experimental-webgl');
	
		//设置指定颜色清空画面
	gl.clearColor(0.0, 0.0, 0.0, 1.0);  
    gl.clear(gl.COLOR_BUFFER_BIT); 
	
	
	var v_shader = create_shader('vs');
	gl.fillStyle = 'rgba(0, 0, 255, 1.0)';
	gl.fillRect(120, 10, 150, 150);
	
	
	//GLSL: openGL Shading Language， 一种应用于GL的渲染着色语言
	
	
	
	
	
	
	
/*		//顶点着色器程序
	var VSHADER_SOURCE =
		"void main() { \n" +
		//设置坐标
		"gl_Position = vec4(0.0, 0.0, 0.0, 1.0); \n" +
		//设置尺寸
		"gl_PointSize = 10.0; \n" +
		"} \n";
	
	//片元着色器
	var FSHADER_SOURCE =
		"void main() {\n" +
		//设置颜色
		"gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n" +
		"}\n";
	
	function main() {
		//获取<canvas>标签。
		var canvas = document.getElementById("myCanvas");
		//获取WebGL绘图上下文。
		var gl = getWebGLContext(canvas);
		//如果浏览器不支持WebGL则提示错误。
		if (!gl) {
			console.log("Failed to get the rendering context for WebGL.");
			return;
		}
	
		//初始化着色器
		if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
			console.log("Faile to initialize shaders.");
			return;
		}
	
		//设置<canvas>的背景色
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
	
		//清空<canvas>
		gl.clear(gl.COLOR_BUFFER_BIT);
	
		//绘制一个点
		gl.drawArrays(gl.POINTS, 0, 1);
	
	}
	*/
}