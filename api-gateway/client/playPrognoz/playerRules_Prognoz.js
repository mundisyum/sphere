$(function () {
  //const list1 = ['audio/1.m4a', 'audio/2.m4a', 'audio/3.m4a', 'audio/4.m4a'];
  var list1, list2, list3, listLength, playingList, sound1, sound2, currentTime, pausedState;
  var i = 0;
  var k = 1;
  var playPauseState = 0;
  $("#howler-play").hide();
  
  // -----======================================================CAHNGE HERE restaurant input field for FORM=========================================----
  $("input[name=place]").val("post-method-test");
  
  //var for like/dislike func
  var $formLike = $('form#formLike');
  var $formDislike = $('form#formDislike');
  url = 'https://script.google.com/macros/s/AKfycbyV549CRxXuV25LGzS2BCj6IQzld6IWHTjFHYb7V-9ZmDRiOEnwYC1Ek0b71MTTTduSSQ/exec';
  
  
  //(<any>this.sound)._src = newSrc;
  
  //время начала проигрывания второго листа
  const hourForPlayingList2 = 12;
  const hourForPlayingList3 = 19;
  
  //fade time in sec
  const fadeTime = 2;
  
  
  $.ajax({
    // -----======================================================CAHNGE HERE restaurant path=========================================----
    url: "https://570427.selcdn.ru/Sphere/playServerless/tracksMorning.txt",
    contentType: "text/plain; charset=utf-8",
    success: function (data) {
      //parsing tracks.txt
      list1 = data.split(/\r\n|\r|\n/g);
      
      for (var i = 0; i < list1.length; i++) {
        list1[i] = "https://570427.selcdn.ru/Sphere/musiclibrary/" + list1[i];
      }
      
      //list1 = tracksArray;
      //playingList = list1;
      //listLength = playingList.length;
      //console.log(list1);
      shuffle(list1);
      ajaxingList2();
      
    },
    error: function () {
      console.log("failed to load tracks.txt")
    }
  });
  
  
  function ajaxingList2() {
    
    $.ajax({
      url: "https://570427.selcdn.ru/Sphere/playServerless/tracksDay.txt",
      contentType: "text/plain; charset=utf-8",
      success: function (data) {
        //parsing tracks.txt
        list2 = data.split(/\r\n|\r|\n/g);
        
        for (var i = 0; i < list2.length; i++) {
          list2[i] = "https://570427.selcdn.ru/Sphere/musiclibrary/" + list2[i];
        }
        
        //list1 = tracksArray;
        //playingList = list1;
        //listLength = playingList.length;
        //console.log(list1);
        
        //console.log("playing list is" + playingList);
        
        // shuffling 2 arrays
        shuffle(list2);
        //console.log("shuffled list1" + list1);
        ajaxingList3();
        
        //$("#howler-play").show();
      },
      error: function () {
        console.log("failed to load tracks1.txt")
      }
    })
  }
  
  
  function ajaxingList3() {
    
    $.ajax({
      url: "https://570427.selcdn.ru/Sphere/playServerless/tracksNight.txt",
      contentType: "text/plain; charset=utf-8",
      success: function (data) {
        //parsing tracks.txt
        list3 = data.split(/\r\n|\r|\n/g);
        
        for (var i = 0; i < list3.length; i++) {
          list3[i] = "https://570427.selcdn.ru/Sphere/musiclibrary/" + list3[i];
        }
        
        //list1 = tracksArray;
        //playingList = list1;
        //listLength = playingList.length;
        //console.log(list1);
        
        var currentTime = new Date;
        var currentHour = currentTime.getHours();
        //var currentHour = currentTime.getMinutes();
        
        //console.log("playing list is" + playingList);
        
        shuffle(list3);
        //console.log("shuffled list1" + list1);
        //checking if time is for list1 or already for list2
        if (currentHour < hourForPlayingList2 && currentHour > 6) {
          playingList = list1;
          listLength = playingList.length;
          console.log("playing list is 1");
        } //else time is already for list 2
        else if (currentHour < hourForPlayingList3 && currentHour > 6) {
          playingList = list2;
          listLength = playingList.length;
          console.log("playing list is 2");
        } else {
          playingList = list3;
          listLength = playingList.length;
          console.log("playing list is 3");
        }
        
        $("#howler-play").show();
        
      },
      error: function () {
        console.log("failed to load tracks3.txt")
      }
    })
  }
  
  
  //var listLength = playingList.length;
  
  
  // function for shuffling array
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    
    return array;
  }
  
  //---------------------------------- BLOCK for preloading
  /*
  var loaded = 0;
  function loadedAudio() {
      // this will be called every time an audio file is loaded
      // we keep track of the loaded files vs the requested files
      loaded++;
      console.log(loaded + " audio files loaded!");
      if (loaded == list2.length){
        console.log("ALL files have loaded");
       // main();
      }
  }

  function preloadsounds()
  {
    //$("#loader").show();
    //console.log(level.config);
    //audioFiles = level.config.soundfiles;

    // we start preloading all the audio files with html audio
    for (var i in list2) {
        preloadAudio(list2[i]);
    }
  }

  function preloadAudio(url)
  {
    console.log("trying to preload "+ url);
    var audio = new Audio();
    // once this file loads, it will call loadedAudio()
    // the file will be kept by the browser as cache
    audio.addEventListener('canplaythrough', loadedAudio, false);

    audio.addEventListener('error', function failed(e)
    {
      console.log("COULD NOT LOAD AUDIO");
      //$("#NETWORKERROR").show();
    });
    audio.src = url;

    audio.load();
  }
  */
  //----------------------------------END OF BLOCK for preloading
  
  /*	sound1.once('play', function () {
        var time1 = sound1.duration();
        var timetoswitch1 = (time1 - fadeTime) * 1000;
        console.log(time1, timetoswitch1);
        var intTime = setTimeout (() => {
          //var k = k + 2;
          //loadingSound2 (k+2, list1, i);
          sound2.play();
            }, timetoswitch1);
    }) */
  
  
  /*	sound2.once('play', function () {
  
      var time2 = sound2.duration();
      var timetoswitch2 = (time2 - fadeTime) * 1000;
      console.log(time2, timetoswitch2);
      var intTime = setTimeout (() => {
            //var i = i + 2;
            //loadingSound1 (i+2, list1, k);
            playSound1();
        }, timetoswitch2)
    })
  */
  
  
  function loadingSound1(i) {
    
    sound1 = new Howl({
      src: [playingList[i]],
      preload: true,
      html5: true,
      volume: 0,
      onpause: function () {
        clearInterval(intervaller)
      },
      onend: function () {
        //console.log('i = ' + i + 'k = ' + k);
        sound2.play();
        
        sound1.off();
        sound1.unload();
        
        currentTime = new Date;
        currentHour = currentTime.getHours();
        
        //currentHour = currentTime.getMinutes();
        
        //listLength = playingList.length;
        //checking if all list was played or not
        //if not all then
        if (currentHour < hourForPlayingList2 || playingList == list3) {
          if ((i == (playingList.length - 1)) || (i == (playingList.length - 2))) {
            i = 0;
            loadingSound1(i);
          } else {
            i = i + 2;
            loadingSound1(i);
          }
          console.log("keeping same playlist, and upcoming track is " + playingList[i]);
        } //else change the playing list on next one and load tracks from there
        else if (currentHour >= hourForPlayingList2 && currentHour < hourForPlayingList3 && playingList != list2) {
          i = 0;
          playingList = list2;
          loadingSound1(i);
          console.log("---------------------now the time for list2, and upcoming track is " + playingList[i]);
        } else if (currentHour >= hourForPlayingList3) {
          i = 0;
          playingList = list3;
          loadingSound1(i);
          console.log("---------------------now the time for list3, and upcoming track is " + playingList[i])
        } else {
          if ((i == (playingList.length - 1)) || (i == (playingList.length - 2))) {
            i = 0;
            loadingSound1(i);
          } else {
            i = i + 2;
            loadingSound1(i);
          }
          console.log("keeping same playlist, and upcoming track is " + playingList[i]);
        }
      },
      onloaderror: function (e, msg) {
        console.log('onloaderrorrrr');
        console.log('Unable to load file: ' + playingList[i] + ' | error message : ' + msg);
        console.log('First argument error ' + e);
        sound1.off();
        
        setTimeout(function () {
          
          if ((i == (playingList.length - 1)) || (i == (playingList.length - 2))) {
            i = 0;
            loadingSound1(i);
          } else {
            i = i + 2;
            loadingSound1(i);
          }
          
        }, 3000);
      }
      /*onend: function (i, list1) {
       if ((i+1) != listLength || (i+2) != listLength) {
         var i = i + 2;
         loadingSound1 (i, list1)
       }
      }*/
    })
  }
  
  function loadingSound2(k) {
    
    sound2 = new Howl({
      src: [playingList[k]],
      preload: true,
      html5: true,
      onpause: function () {
        clearInterval(intervaller)
      },
      onend: function () {
        //console.log('k = ' + k);
        //listLength = playingList.length;
        sound1.play();
        
        sound2.off();
        sound2.unload();
        
        currentTime = new Date;
        currentHour = currentTime.getHours();
        //currentHour = currentTime.getMinutes();
        //checking if all list was played or not (k+1) != listLength ||
        //if not all - then
        if (currentHour < hourForPlayingList2 || playingList == list3) {
          if ((k == (playingList.length - 1)) || (k == (playingList.length - 2))) {
            k = 1;
            loadingSound2(k);
          } else {
            k = k + 2;
            loadingSound2(k);
          }
          console.log("keeping same playlist, and upcoming track is " + playingList[k]);
        } else if (currentHour >= hourForPlayingList2 && currentHour < hourForPlayingList3 && playingList != list2) {
          k = 1;
          playingList = list2;
          loadingSound2(k);
          console.log("--------------------------now the time for list2, and upcoming track is " + playingList[k]);
        } else if (currentHour >= hourForPlayingList3) {
          k = 1;
          playingList = list3;
          loadingSound2(k);
          console.log("--------------------------now the time for list3, and upcoming track is " + playingList[k]);
        } else {
          if ((k == (playingList.length - 1)) || (k == (playingList.length - 2))) {
            k = 1;
            loadingSound2(k);
          } else {
            k = k + 2;
            loadingSound2(k);
          }
          console.log("keeping same playlist, and upcoming track is " + playingList[k]);
        }
      },
      onloaderror: function (e, msg) {
        console.log('onloaderrorrrr');
        console.log('Unable to load file: ' + playingList[k] + ' | error message : ' + msg);
        console.log('First argument error ' + e);
        sound2.off();
        
        setTimeout(function () {
          if ((k == (playingList.length - 1)) || (k == (playingList.length - 2))) {
            k = 1;
            loadingSound2(k);
          } else {
            k = k + 2;
            loadingSound2(k);
          }
        }, 3000);
      }
      //onend: function (i, list1) {
      // if ((k+1) != listLength || (k+2) != listLength) {
      // 	console.log(k);
      // 	loadingSound2 (k+2, list1)
      // }
      //}
    })
  }
  
  /*	sound1.on('play', function() {
    var time1 = sound1.duration();
    var timetoswitch1 = (time1 - fadeTime) * 1000;
    console.log(time1, timetoswitch1);
    var intTime = setTimeout (() => {
      sound2.play();
    }, timetoswitch1);
  }); */
  
  /*	sound2.on('play', function() {
    var time2 = sound2.duration();
    var timetoswitch2 = (time2 - fadeTime) * 1000;
    console.log(time2, timetoswitch2);
    var intTime = setTimeout (() => {
      sound1.play();
    }, timetoswitch2)
  }); */
  
  
  /*	var sound1 = new Howl({
      src: [list1[i]],
      preload: true
    });

    var sound2 = new Howl({
      src: ['audio/2.m4a']
    });
  */
  
  $("#howler-play").on("click", function () {
    
    
    if (playPauseState == 0) {
      
      loadingSound1(i);
      loadingSound2(k);
      sound1.play();
      console.log("initialiation complete");
      
      playPauseState = "playing";
      
    } else if (playPauseState == "playing") {
      
      if (sound1.playing() && !sound2.playing()) {
        sound1.pause();
        pausedState = 1;
        console.log(pausedState);
      } else if (!sound1.playing() && sound2.playing()) {
        sound2.pause();
        pausedState = 2;
        console.log(pausedState);
      } else if (sound1.playing() && sound2.playing()) {
        sound1.pause();
        sound2.pause();
        pausedState = 3;
        console.log(pausedState);
      } else {
      
      }
      
      playPauseState = "paused";
      console.log("paused complete");
      
    } else {
      
      if (pausedState == 1) {
        sound1.play();
      } else if (pausedState == 2) {
        sound2.play();
      } else if (pausedState == 3) {
        sound1.play();
        sound2.play();
      }
      
      playPauseState = "playing";
      console.log("playing complete");
      
    }
    
    //preloadsounds();
    
    
    //console.log(listLength);
    
    //var time1 = sound1.duration();
    //var time2 = sound2.duration();
    // var timeCurrent = sound1.currentTime;
    //var timetoswitch1 = (time1 - fadeTime) * 1000;
    //var timetoswitch2 = (time2 - fadeTime) * 1000;
    
    
    //	sound1.on('play', function(time1) {
    //		var interval = setInterval (() => {
    //			if (time1 < 1000) {
    //				sound2.play();
    //				clearInterval(interval);
    //		}
    //		}, 1000)
    //	})
    
    
    //setInterval(() => {
    //	if (time1 < 2000) {
    //		sound2.play();
    //		clearInterval(this);
    //	}
    //	else {
    //		return;
    //		}
    //	},1000);
    
    //sound1.on('end', function() {
    //	sound2.play()
    //})
    //setTimeout(sound2.play(), 2000);
    //setTimeout(function() {sound2.play()}, 1000);
  });
  
  $("#submitLike").on("click", function (e) {
    
    if (sound1 == undefined || sound2 === undefined) {
      console.error('Error! Start player to enable likes');
      return;
    }
    
    insertingLikeDislikeFormData();
  
    console.log({formData: $formDislike.serializeObject()})
  
    setTimeout(function () {
      e.preventDefault();
      var jqxhr = $.ajax({
        // url: url,
        url: 'http://localhost:3200/sphere-api-middleware',
        method: "POST",
        contentType : 'application/json',
        dataType: "json",
        data: JSON.stringify($formLike.serializeObject()),
        success: console.log("value sended")
      })
      .done(function (res) {
        if (res.result === 'success') console.log("Success! Your like Saved");
        if (res.error) console.error(res.error);
      });
      ;
    }, 3000);
  });
  
  $("#submitDislike").on("click", function (e) {
  
    if (sound1 == undefined || sound2 === undefined) {
      console.error('Error! Start player to enable dislikes');
      return;
    }
    
    insertingLikeDislikeFormData();
    
    console.log({formData: $formDislike.serializeObject()})
    setTimeout(function () {
      e.preventDefault();
      var jqxhr = $.ajax({
        // url: url,
        url: 'http://localhost:3200/sphere-api-middleware',
        method: "POST",
        contentType : 'application/json',
        dataType: "json",
        data: JSON.stringify($formDislike.serializeObject()),
        success: console.log("value sended")
      })
      .done(function (res) {
        if (res.result === 'success') console.log("Success! Your dislike Saved.") // TODO: This song is now removed from your playlist");
        if (res.error) console.error(res.error);
      });
    }, 3000);
  });
  
  function insertingLikeDislikeFormData() {
    
    if (playingList == list1) {
      $("input[name=playlistname]").val("Morning list");
    } else if (playingList == list2) {
      $("input[name=playlistname]").val("Day list");
    } else if (playingList == list3) {
      $("input[name=playlistname]").val("Night list");
    } else {
      $("input[name=playlistname]").val("non-basic playlist");
    }
    
    if (sound1.playing() && !sound2.playing()) {
      var song1name = sound1._src.split("https://570427.selcdn.ru/Sphere/musiclibrary/")[1];
      $("input[name=songname]").val(song1name);
    } else if (!sound1.playing() && sound2.playing()) {
      var song2name = sound2._src.split("https://570427.selcdn.ru/Sphere/musiclibrary/")[1];
      $("input[name=songname]").val(song2name);
    } else {
      // TODO: sometimes "crossfaded" is sent like a songname
      // if paused -> songname === 'crossfaded'
      $("input[name=songname]").val("crossfaded");
      //console.log("сердечко нажалось на кроссфейде или без музыки :(");
    }
  }
  
  
  $("#howler-volup").on("click", function () {
    var vol = howler_example.volume();
    vol += 0.1;
    if (vol > 1) {
      vol = 1;
    }
    howler_example.volume(vol);
  });
  
  $("#howler-voldown").on("click", function () {
    var vol = howler_example.volume();
    vol -= 0.1;
    if (vol < 0) {
      vol = 0;
    }
    howler_example.volume(vol);
  });
  
});