navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;

var width = 1023;
var height = 1023;

var debug_width = 1023;
var debug_height = 256;

var SOUND_LEVEL_DEV = 10;
var FFT_SIZE = 512;
var span = width/FFT_SIZE;
var DEBUG = false;


function initialize() {
  var audioElement = document.getElementById("audio");
  var frequencyElement = document.getElementById("frequency");
  var timeDomainElement = document.getElementById("timedomain");
  var frequencyContext = frequencyElement.getContext("2d");
  var timeDomainContext = timeDomainElement.getContext("2d");
  var viewElement = document.getElementById("view");
  var viewContext = viewElement.getContext("2d");
  var frequencyData;
  var timeDomainData;

  var max_visuals = 10;
  var numflg = new Array( max_visuals );

  /*描画オブジェクト*/
  var ViewObjects = new Array( max_visuals );
  var DefaultWave,
    RectWave,
    CircleWave,
    DebugView;

  frequencyElement.width = debug_width;
  frequencyElement.height = debug_height;
  timeDomainElement.width = debug_width;
  timeDomainElement.height = debug_height;

  viewElement.height = height;
  viewElement.width = width;

  navigator.getUserMedia(
    {audio : true},
    function(stream) {
      /*オブジェクトの初期化*/
      ViewObjects[1] = DefaultWave;
      ViewObjects[2] = CircleWave;
      ViewObjects[3] = RectWave;
      ViewObjects[4] = null;
      ViewObjects[5] = null;
      ViewObjects[6] = null;
      ViewObjects[7] = null;
      ViewObjects[8] = null;
      ViewObjects[9] = null;
      ViewObjects[0] = NewVisual;

      for(var i = 0; i < numflg.length; ++i){
        numflg[i] = false;
      }

      numflg[1] = true;
      numflg[2] = true;

      // var url = URL.createObjectURL(stream);
      /* 			audioElement.src = url; */
      var audioContext = new AudioContext();
      var mediastreamsource = audioContext.createMediaStreamSource(stream);
      var analyser = audioContext.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      frequencyData = new Uint8Array(analyser.fftSize);
      timeDomainData = new Uint8Array(analyser.fftSize);
      mediastreamsource.connect(analyser);
      var animation = function(){

        analyser.getByteFrequencyData(frequencyData);
        analyser.getByteTimeDomainData(timeDomainData);
        //viewContext.fillStyle = "rgba(0, 0, 0,1.0)";
        //viewContext.rect(0, 0, width, height);
        viewContext.clearRect(0, 0, width, height);
        //viewContext.fill();
        for(var i = 0; i < numflg.length; ++i){
          if(numflg[i] != false){
            if(ViewObjects[i] != null){
              if(ViewObjects[i].run){
                ViewObjects[i].run();	
              }
            }
          }
        }

        /*DEBUG view*/
        if(DEBUG == true){
          DebugView.run();
        }
        requestAnimationFrame(animation);

      };

      animation();

    },
    function(e) {
      console.log(e);
    }
  );
  var radians = function(angle){
    return angle * (Math.PI/180);
  }


  DefaultWave = {
    run:function(){
      console.log();
      viewContext.beginPath();
      viewContext.moveTo(0, (1 - (timeDomainData[0] / 255)) * height);
      for (var i = 1, l = timeDomainData.length; i < l; i++) {
        var time_y = (1 - ((timeDomainData[i] / 255))) * (height);
        viewContext.lineTo(i*span, time_y);
      }
      viewContext.fillStyle = "rgba(250, 250, 225,0.6)";
      viewContext.fill();
    },
    visible:true,
    opacity:1.0,
    up_key:function(){
    },
    down_key:function(){
    },right_key:function(){

    },left_key:function(){

    }

  }
  RectWave = {
    run:function(){
      console.log();
      //		viewcontext.beginpath();
      //		viewContext.moveTo(0, (1 - (timeDomainData[0] / 255)) * height);
      viewContext.strokeStyle = "rgba(250, 230, 225,0.5)";
      viewContext.fillStyle = "rgba(250, 250, 225,0.6)";

      timeDomainData.length;
      viewContext.beginPath();

      for (var i = 1, l = 10; i < l; i++) {
        for (var j = 10, l2 = 20; j < l2; j++) {
          var min_size = height/9;
          var max_size = 25000;
          var default_pos_x = 0;
          var default_pos_y = -height;
          console.log((0.5 - ((timeDomainData[i*20] / 255))) + " = i");
          var time_y = (0.5 - ((timeDomainData[i*20] / 255))) * (max_size);
          var time_x = (0.5 - ((timeDomainData[j*20] / 255))) * (max_size);
          viewContext.lineWidth = 5*(1 - (timeDomainData[i*20] / 255));

          viewContext.rect(default_pos_x + (min_size*i) - ((min_size+time_x)/2),
            default_pos_y + (min_size*j) - ((min_size+time_y)/2),
            time_y, time_x);
          viewContext.lineWidth =1;

        }
      }
      //viewContext.fill();
      viewContext.stroke();

      //viewContext.fillStyle = "rgba(250, 250, 225,0.6)";
      //viewContext.fill();
    },
    visible:true,
    opacity:1.0,
    up_key:function(){
    },
    down_key:function(){
    },right_key:function(){

    },left_key:function(){

    }

  }
  NewVisual = {
    run:function(){
      console.log();
      //		viewcontext.beginpath();
      //		viewContext.moveTo(0, (1 - (timeDomainData[0] / 255)) * height);
      viewContext.strokeStyle = "rgba(250, 230, 225,0.5)";
      viewContext.fillStyle = "rgba(250, 250, 225,0.6)";

      timeDomainData.length;
      viewContext.beginPath();

      for (var i = 1, l = 10; i < l; i++) {
        for (var j = 10, l2 = 20; j < l2; j++) {
          var min_size = height/9;
          var max_size = 25000;
          var default_pos_x = 0;
          var default_pos_y = -height;
          console.log((0.5 - ((timeDomainData[i*20] / 255))) + " = i");
          var time_y = (0.5 - ((timeDomainData[i*20] / 255))) * (max_size);
          var time_x = (0.5 - ((timeDomainData[j*20] / 255))) * (max_size);
          viewContext.lineWidth = 5*(1 - (timeDomainData[i*20] / 255));

          viewContext.rect(default_pos_x + (min_size*i) - ((min_size+time_x)/2),
            default_pos_y + (min_size*j) - ((min_size+time_y)/2),
            time_y, time_x);
          viewContext.lineWidth =1;

        }
      }
      //viewContext.fill();
      viewContext.stroke();

      //viewContext.fillStyle = "rgba(250, 250, 225,0.6)";
      //viewContext.fill();
    },
    visible:true,
    opacity:1.0,
    up_key:function(){
    },
    down_key:function(){
    },right_key:function(){

    },left_key:function(){

    }

  }

  CircleWave = {
    run:function(){
      var centery = height/2;
      var centerx = width/2;
      viewContext.beginPath();
      var radius = this.radius;
      for(var i = 0; i <= timeDomainData.length; ++i){
        radius += this.radius_add;
        var rad = radians(this.default_rad + (i* this.radius_term));
        var x = centerx + (radius * Math.cos(rad )) * (1 - (timeDomainData[i] / 255));
        var y = centery + (radius * Math.sin(rad )) * (1 - (timeDomainData[i] / 255));
        viewContext.lineTo(x, y);
      }
      viewContext.strokeStyle = "rgba(250, 250, 250,0.6)";
      viewContext.fillStyle = "rgba(250, 255, 215,0.2)";
      viewContext.stroke();	
      /* 				viewContext.fill();	 */
      this.default_rad += 0.1;
      if(360 <= this.default_rad){
        this.default_rad = 0;
      }
    },
    visible:true,
    opacity:1.0,
    default_rad:0,
    radius:300,
    radius_add:0.0,
    radius_term:120,
    up_key:function(){
      this.radius_add += 0.1;
      console.log("radius_add" + this.radius_add);
    },
    down_key:function(){
      this.radius_add -= 0.1;
      console.log("radius_add" + this.radius_add);
    },right_key:function(){
      this.radius_term -= 1;
      console.log("radius_term = " + this.radius_term);

    },left_key:function(){
      this.radius_term += 1;
      console.log("radius_term = " + this.radius_term);

    }

  }

  var DebugView = {
    run:function(){
      viewContext.beginPath();
      viewContext.moveTo(0, 0);
      viewContext.lineTo(width,0);
      viewContext.lineTo(width,height);
      viewContext.lineTo(0,height);
      viewContext.lineTo(0,0);

      viewContext.stroke();

      frequencyContext.clearRect(0, 0, width, height);
      frequencyContext.beginPath();
      frequencyContext.moveTo(0, debug_height - frequencyData[0]);
      for (var i = 1, l = frequencyData.length/SOUND_LEVEL_DEV; i < l; i++) {
        frequencyContext.lineTo(i, debug_height - frequencyData[i*SOUND_LEVEL_DEV]);
      }
      frequencyContext.strokeStyle = "rgba(255, 255, 255,0.6)";
      frequencyContext.stroke();

      timeDomainContext.clearRect(0, 0, width, height);
      timeDomainContext.beginPath();
      timeDomainContext.moveTo(0, debug_height - timeDomainData[0]);
      for (var i = 1, l = timeDomainData.length; i < l; i++) {
        timeDomainContext.lineTo(i, debug_height - timeDomainData[i]);
      }
      timeDomainContext.strokeStyle = "rgba(255, 255, 255,0.6)";

      timeDomainContext.stroke();
    },
    visible:true,
    opacity:1.0,
    up_key:function(){
    },
    down_key:function(){
    },right_key:function(){

    },left_key:function(){

    }

  }

  function KeyDownFunc(e){

    // ------------------------------------------------------------
    // 入力情報を取得
    // ------------------------------------------------------------
    // キーコード
    var key_code = e.keyCode;
    // Shiftキーの押下状態
    var shift_key = e.shiftKey;
    // Ctrlキーの押下状態
    var ctrl_key = e.ctrlKey;
    // Altキーの押下状態
    var alt_key = e.altKey;

    // ------------------------------------------------------------
    // 出力テスト
    // ------------------------------------------------------------
    console.log("code:" + key_code);
    console.log("shift:" + shift_key);
    console.log("ctrl" + ctrl_key);
    console.log("alt:" + alt_key);


    var 	leftKey = 72,
      upKey = 74,
      rightKey = 76,
      downKey = 75,
      onekey = 49,
      twokey = 50,
      threekey = 51,
      fourkey = 52,
      fivekey = 53,
      sixkey = 54,
      sevenkey = 55,
      eightkey = 56,
      ninekey = 57,
      zerokey = 48;
    if(key_code == onekey){
      console.log("pressed 1");
    }else if(key_code == twokey){
      console.log("pressed 2");
    }

    if(key_code == upKey){
      //Up
      CircleWave.up_key();
    }else if(key_code == downKey){
      //Down
      CircleWave.down_key();

    }else if(key_code == leftKey){
      //left
      CircleWave.left_key();

    }else if(key_code == rightKey){
      //right_key
      CircleWave.right_key();

    }else if(key_code == zerokey){
      numflg[0] = !numflg[0];

    }else if(key_code == onekey){
      numflg[1] = !numflg[1];

    }	
    else if(key_code == twokey){
      numflg[2] = !numflg[2];

    }	
    else if(key_code == threekey){
      numflg[3] = !numflg[3];

    }	
    else if(key_code == fourkey){
      numflg[4] = !numflg[4];

    }	
    else if(key_code == fivekey){
      numflg[5] = !numflg[5];

    }	
    else if(key_code == sixkey){
      numflg[6] = !numflg[6];

    }	
    else if(key_code == sevenkey){
      numflg[7] = !numflg[7];

    }	
    else if(key_code == eightkey){
      numflg[8] = !numflg[8];

    }	
    else if(key_code == ninekey){
      numflg[9] = !numflg[9];

    }	

  }
  document.addEventListener("keydown" , KeyDownFunc);

}


window.addEventListener("load", initialize, false);
