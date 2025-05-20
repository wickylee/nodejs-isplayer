export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const weekdaysName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const resolutions = [
  {
    lable: "16:9 (Landscape)",
    options: [
      //[1024, 576],
      //[1152, 648],
      [1280, 720],
      [1366, 768],
      [1600, 900],
      [1920, 1080],
      [2560, 1440],
      [3840, 2160],
      [7680, 4320]
    ]
  },
  {
    lable: "16:9 (Portrait)",
    options: [
      //[576, 1024],
      //[648, 1152],
      [720, 1280],
      [768, 1366],
      [900, 1600],
      [1080, 1920],
      [1440, 2560],
      [2160, 3840],
      [4320, 7680]
    ]
  },
  {
    lable: "16:10 (Landscape)",
    options: [
      [1280, 800],
      [1440, 900],
      [1680, 1050],
      [1920, 1200],
      [2560, 1600]
    ]
  },
  {
    lable: "16:10 (Portrait)",
    options: [
      [800, 1280],
      [900, 1440],
      [1050, 1680],
      [1200, 1920],
      [1600, 2560]
    ]
  },
  {
    lable: "4:3 (Landscape)",
    options: [
      //[640, 480],
      [800, 600],
      [960, 720],
      [1024, 768],
      [1280, 960],
      [1400, 1050],
      [1440, 1080],
      [1600, 1200],
      [1856, 1392],
      [1920, 1440],
      [2048, 1536]
    ]
  },
  {
    lable: "4:3 (Portrait)",
    options: [
      //[640, 480],
      [600, 800],
      [720, 960],
      [768, 1024],
      [960, 1280],
      [1050, 1400],
      [1080, 1440],
      [1200, 1600],
      [1392, 1856],
      [1440, 1920],
      [1536, 2048]
    ]
  },
  {
    lable: "Video WALL (Landacap)",
    options: [
      [1920,2160],
      [1920,3240],
      [1920,4320],
      [3840,1080],
      [5760,1080],
      [7680,1080],
    ]
  },
  {
    lable: "Video WALL (Portrait)",
    options: [
      [1080,3840],
      [2160,1920],
      [3240,1920],
      [4320,1920],
    ]
  },
  {
    lable: "Special Size",
    options: [
      [2000,1200],
      [1200,2000]
    ]
  }
];

export const clientRequestErrors = {
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Payload Too Large",
  414: "URI Too Long",
  415: "Unsupported Media Type",
  416: "Range Not Satisfiable",
  417: "Expectation Failed",
  418: "I'm a teapot",
  421: "Misdirected Request",
  422: "Unprocessable Entity",
  423: "Locked",
  424: "Failed Dependency",
  425: "Too Early",
  426: "Upgrade Required",
  428: "Precondition Required",
  429: "Too Many Requests",
  431: "Request Header Fields Too Large",
  451: "Unavailable For Legal Reasons"
};

export const frameTransitions = [
  {
    lable: "Bounce",
    options: ["bounceIn", "bounceInLeft", "bounceInRight", "bounceInUp"]
  },
  {
    lable: "Fade",
    options: ["fadeIn", "fadeInDown", "fadeInLeft", "fadeInRight", "fadeInUp"]
  },
  {
    lable: "Flip",
    options: ["flipInX", "flipInY"]
  },
  {
    lable: "Rotate",
    options: [
      "rotateIn",
      "rotateInDownLeft",
      "rotateInDownRight",
      "rotateInUpLeft",
      "rotateInUpRight"
    ]
  },
  {
    lable: "Zoom",
    options: ["zoomIn", "zoomInDown", "zoomInLeft", "zoomInRight", "zoomInUp"]
  },
  {
    lable: "Slide",
    options: ["slideInDown", "slideInLeft", "slideInRight", "slideInUp"]
  },
  {
    lable: "Others",
    options: [
      "flash",
      "rubberBand",
      "swing",
      "tada",
      "wobble",
      "jello",
      "lightSpeedIn",
      "rollIn",
      "none"
    ]
  }
];

export const ClocksAppearInitSetting = {
  AnalogClock: {
    name: "General Analog Clock",
    clockStyleSetting: {
      clockAppearance: {
        width: "300px",
        height: "300px",
        backgroundColor: "#0C2437",
        // background-image: URL()
        borderWidth: "1px",
        borderColor: "#000000",
        borderRadius: "50%",
        boxShadow: "2px 2px 4px 0px rgba(0,0,0,0.5)",
      },
      clockFace: {
        width: "280px",
        height: "280px",
        padding: "10px",
        backgroundColor: "#EFE8E8",
        // background-image: URL()
        borderWidth: "1px",
        borderColor: "#000000",
        borderRadius: "50%",
        boxShadow: "2px 3px 8px 0 rgba(0,0,0,0.3) inset",
      },
      dialLines:{
        opacity: 1,
        width: "2px",
        height: "5px",
        backgroundColor: "#bfccd6",
        borderRadius: "50%",
        boxShadow: "1px 1px 2px 0px rgba(0,0,0,0.3)",
      },
      dialLinesQuarter:{
        opacity: 1,
        width: "2px",
        height: "10px",
        backgroundColor: "#bfccd6",
        borderRadius: "50%",
      },
      numbersLayer:{
        opacity: 1,
        padding: "10px",
      },
      hourNumbers:{
        fontSize: "12px",
        fontFamily: "Arial",
        color: "#9E9E9E",
        textShadow: "1px 1px 2px #000000",
      },
      hourNumbersQuarter:{
        fontSize: "24px",
        color: "#000000",
      },
      clockHand: {
        boxShadow: "1px 1px 2px 0px rgba(0,0,0,0.3)",
      },
      hourHand: {
        // height: "28%",
        backgroundColor: "#000000",
        borderTopLeftRadius: "50%",
        borderTopRightRadius: "50%",
      },
      minuteHand: {
        // height: "36%",
        backgroundColor: "#000000",
        borderTopLeftRadius: "50%",
        borderTopRightRadius: "50%",
      },
      secondHand: {
        // height: "50%",
        opacity: 1,
        backgroundColor:  "#c20303",
        borderTopLeftRadius: "50%",
        borderTopRightRadius: "50%",
      },
      centerDot: { 
        width: "14px",
        height: "14px",
        backgroundColor: "white",
        borderWidth: "1px",
        borderColor: "#000000",
        borderRadius: "50%",
      },
      dateDay:{
        opacity: 1,
        height: "20px",
        margin: "70px",
        padding: "10px",
        backgroundColor: "#EFF2F5",
        color: "#000000",
        fontSize: "12px",
        fontFamily: "Arial, Helvetica, sans-serif",
        boxShadow: "1px 1px 2px 0px rgba(0,0,0,0.3) inset",
      }
    }
  },
  DigitalClock: {
    name: "General Digital Clock",
    clockStyleSetting: {
      clockAppearance: {
        width: "800px",
        height: "240px",
        padding: "10px",
        backgroundColor: "#000000",
        // background: "radial-gradient(ellipse at center, #0a2e38 0%, #000000 70%)",
        // background-image: URL()
        border: "1px solid black",
        borderRadius: "20px",
        boxShadow: "2px 3px 8px 0 rgba(0,0,0,0.5)",
      },
      clockDate:{
        height: "40px",
        backgroundColor: "#000000",
        fontSize: "40px",
        fontFamily: "Arial",
        color: "#ffffff",
        textShadow: "0 0 20px rgba(10,175,230,1)",
      },
      spanLine:{
        opacity: 1,
        margin: "0px",
        height: "0px",
        backgroundColor: "#ffffff",
        boxShadow: "0px 0px 10px 1px rgba(255,255,255,1)",
      },
      clockTime: {
        padding: "0px",
        fontSize: "96px",
        fontFamily: "Arial",
        color: "#ffffff",
        textShadow: "0 0 20px rgba(10,175,230,1)",
      },
    }
  },
//   RollingDigitalClock: {
//     name: "Rolling Digital Clock",
//     clockStyleSetting: {
//       clockAppearance: {
//         width: "530px",
//         height: "200px",
//         padding: "0px",
//         backgroundColor: "#000000",
//         // background-image: URL()
//         border: "5px solid rgba(10,10,10,0.5)",
//         borderRadius: "40px",
//         // background: "#bfccd6",
//         boxShadow: "1px 1px 8px 0 rgba(0,0,0,0.5)",
//         // fontFamily: "Share Tech Mono",
//       },
//       clockDate:{
//         // height: "50px",
//         padding: "5px",
//         backgroundColor: "#000000",
//         fontSize: "36px",
//         fontFamily: "Arial",
//         color: "#ffffff",
//         textShadow: "0 0 20px rgba(10,175,230,1)",
//       },
//       clockTime: {
//         height: "130px",
//         // padding: "0px",
//         backgroundColor: "#032535",
//         fontSize: "130px",
//         fontFamily: "Arial",
//         color: "#ffffff",
//         textShadow: "0 0 20px rgba(10,175,230,1)",
//     }
//   }
// },
  LcdStyleDigitalClock: {
    name: "LCD Style Digital Clock",
    clockStyleSetting: {
      clockAppearance: {
        width: "500px",
        height: "160px",
        // padding: "0px",
        backgroundColor: "#ffffff",
        // background-image: URL()
        border: "1px solid rgba(10,10,10,0.5)",
        borderWidth: "1px",
        borderColor: "#000000",
        borderRadius: "20px",
        boxShadow: "1px 1px 8px 0 rgba(0,0,0,0.5)",
      },
      clockDispaly:{
        width: "460px",
        height: "120px",
        // padding: "0px",
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#2D2D2D",
        backgroundColor: "#CED0C9",
        border: "1px solid rgba(0,0,0,0.5)",
        borderWidth: "1px",
        borderColor: "#000000",
        borderRadius: "10px",
        boxShadow: "2px 2px 8px 0 rgba(0,0,0,0.5) inset",
      },
      timeDigit: {
        // padding: "0px",
        // width: "800px",
        // height: "240px",
        fontSize: "21px",
        fontFamily: "Arial",
        color: "#5A0606",
        
        // boxShadow: "0 0 20px rgba(10,175,230,1)",
     }
    }
}
}

export const allowFunctionAnimeProperty = ["scale",
                                            "scaleX",
                                            "scaleY",
                                            "translate",
                                            "translateX",
                                            "translateY",
                                            "rotate",
                                            "rotateX",
                                            "rotateY",
                                            "delay"];

export const animeTextTimelineTemplates =  {
  None: [
    {
      targets: "#animateText .anime-char",
      scale: 1,
    },
  ],
    Animate_1: [
      {
        targets: "#animateText .anime-char",
        scale: [4, 1],
        opacity: [0, 1],
        translateZ: 0,
        easing: "easeOutExpo",
        duration: 950,
        delay: "(index * 70)",
      },
      {
        targets: "#animateText",
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000,
      },
    ],
    Animate_2: [
      {
        targets: "#animateText .anime-char",
        scale: [0.3,1],
        opacity: [0,1],
        translateZ: 0,
        easing: "easeOutExpo",
        duration: 600,
        delay: "(index * 70)",
      },
      {
        targets: "#animateText",
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000,
      },
    ],
    Animate_3: [
      {
        targets: "#animateText .anime-char",
        scaleX: [0,1],
        opacity: [0.5,1],
        easing: "easeOutExpo",
        duration: 700,
        // offset: '-=875',
        delay: "(index * 80)",
      },
      {
        targets: "#animateText",
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000,
      },
    ],
    Animate_4: [
      {
        targets: "#animateText .anime-char",
        opacity: [0,1],
        easing: "easeInOutQuad",
        duration: 2250,
        delay: "(index * 150)"
      },
      {
        targets: "#animateText",
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
      },
    ],
    Animate_5: [
      {
        targets: "#animateText .anime-char",
        opacity: [0,1],
        scale: [0.2, 1],
        duration: 800
      },
      {
        targets: "#animateText .anime-char",
        opacity: 0,
        scale: 3,
        duration: 600,
        easing: "easeInExpo",
        delay: 500
      },
    ],
    Animate_6: [
      {
        targets: "#animateText .anime-char",
        translateY: ["1.1em", 0],
        translateZ: 0,
        duration: 750,
        delay: "(index * 50)"
      },
      {
        targets: "#animateText .anime-char",
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: "(index * 50)"
      },
    ],
    animate_7: [
      {
        targets: "#animateText .anime-char",
        opacity: [0, 1],
        translateY: [200, 0],
        translateX: [100, 0],
        translateZ: 0,
        rotateZ: [180, 0],
        duration: 750,
        easing: "easeOutExpo",
        delay: "(index * 50)"
      },
      {
        targets: "#animateText .anime-char",
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
      },
    ],
    Animate_8: [
      {
        targets: "#animateText .anime-char",
        scale: [0, 1],
        duration: 1500,
        elasticity: 600,
        delay: "(index * 45)"
      },
      {
        targets: "#animateText",
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
      },
    ],
    Animate_9: [
      {
        targets: "#animateText .anime-char",
        rotateY: [-90, 0],
        duration: 1300,
        delay: "(index * 45)"
      },
      {
        targets: "#animateText",
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
      },
    ],
    Animate_10: [
      {
        targets: "#animateText .anime-char",
        translateX: [40,0],
        translateZ: 0,
        opacity: [0,1],
        easing: "easeOutExpo",
        duration: 1200,
        delay: "(index * 100)"
      },
      {
        targets: "#animateText",
        translateX: [0,-30],
        opacity: [1,0],
        easing: "easeInExpo",
        duration: 1100,
        delay: "(index * 100)"
      },
    ],
    Animate_11: [
      {
        targets: "#animateText .anime-char",
        translateY: [100,0],
        translateZ: 0,
        opacity: [0,1],
        easing: "easeOutExpo",
        duration: 1400,
        delay: "(index * 200)"
      },
      {
        targets: "#animateText .anime-char",
        translateY: [0,-100],
        opacity: [1,0],
        easing: "easeInExpo",
        duration: 1200,
        delay: "(index * 130)"
      },
    ],
    Animate_12: [
      {
        targets: "#animateText .anime-char",
        opacity: [0,1],
        translateY: [-100,0],
        easing: "easeOutExpo",
        duration: 1400,
        delay: "(index * 30)"
      },
      {
        targets: "#animateText",
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
      },
    ]
}

export const weatherIconsMap =  [
    {name:  "default", iconsMap: [
      {mapKey: "50", file: "sky01.png"},
      {mapKey: "51", file: "sky02.png"},
      {mapKey: "52", file: "sky03.png"},
      {mapKey: "53", file: "sky04.png"},
      // {mapKey: "pic05", file: "sky05.png"},
      // {mapKey: "pic06", file: "sky06.png"},
      {mapKey: "54", file: "sky07.png"},
      // {mapKey: "pic08", file: "sky08.png"},
      // {mapKey: "pic09", file: "sky09.png"},
      // {mapKey: "pic10", file: "sky10.png"},
      {mapKey: "60", file: "sky11.png"},
      {mapKey: "61", file: "sky12.png"},
      {mapKey: "62", file: "sky13.png"},
      // {mapKey: "pic14", file: "sky14.png"},
      {mapKey: "63", file: "sky15.png"},
      {mapKey: "64", file: "sky16.png"},
      {mapKey: "65", file: "sky17.png"},
      {mapKey: "70", file: "sky18.png"},
      {mapKey: "71", file: "sky18.png"},
      {mapKey: "72", file: "sky18.png"},
      {mapKey: "73", file: "sky18.png"},
      {mapKey: "74", file: "sky18.png"},
      {mapKey: "75", file: "sky18.png"},
      {mapKey: "76", file: "sky19.png"},
      {mapKey: "77", file: "sky19.png"},
      {mapKey: "80", file: "sky22.png"},
      {mapKey: "81", file: "sky23.png"},
      {mapKey: "82", file: "sky24.png"},
      {mapKey: "83", file: "sky21.png"},
      {mapKey: "84", file: "sky20.png"},
      {mapKey: "85", file: "sky25.png"},
      {mapKey: "90", file: "sky26.png"},
      {mapKey: "91", file: "sky27.png"},
      {mapKey: "92", file: "sky28.png"},
      {mapKey: "93", file: "sky29.png"},
      //--
      {mapKey: "WFIREY", file: "alert01.png"},
      {mapKey: "WFIRER", file: "alert02.png"},
      {mapKey: "WRAINR", file: "alert05.png"},
      {mapKey: "WRAINA", file: "alert06.png"},
      {mapKey: "WRAINB", file: "alert07.png"},
      {mapKey: "WHOT", file: "alert08.png"},
      {mapKey: "WCOLD", file: "alert09.png"},
      {mapKey: "WMSGNL", file: "alert10.png"},
      {mapKey: "WL", file: "alert11.png"},
      {mapKey: "WTS", file: "alert12.png"},
      {mapKey: "WFNTSA", file: "alert13.png"},
      {mapKey: "WTMW", file: "alert14.png"},
      {mapKey: "WFROST", file: "alert23.png"},
      {mapKey: "TC1", file: "alert15.png"},
      {mapKey: "TC3", file: "alert16.png"},
      {mapKey: "TC8NE", file: "alert17.png"},
      {mapKey: "TC8SE", file: "alert18.png"},
      {mapKey: "TC8NW", file: "alert19.png"},
      {mapKey: "TC8SW", file: "alert20.png"},
      {mapKey: "TC9", file: "alert21.png"},
      {mapKey: "TC10", file: "alert22.png"},

    ]}
];

export const currencySymbols =  [
  {'Dollar': '\u0024'},
  {'Cent': '\u00A2'},
  {'Pound': '\u00A3'},
  {'Euro': '\u20AC'},
  {'Yen': '\u00A5'},
  {'Indian Rupee': '\u20B9'},
  {'Ruble':'\u20BD'},
  // {'China Yuan': '\u5143'},
  {'Currency': '\u00A4'},
  {'Euro-Currency': '\u20A0'},
  {'Colon': '\u20A1'},
  {'Cruzeiro': '\u20A2'},
  {'French Franc': '\u20A3'},
  {'Lira': '\u20A4'},
  {'Mill': '\u20A5'},
  {'Naira': '\u20A6'},
  {'Peseta': '\u20A7'},
  {'Rupee': '\u20A8'},
  {'Won': '\u20A9'},
  {'New Sheqel': '\u20AA'},
  {'Dong': '\u20AB'},
  {'Kip': '\u20AD'},
  {'Tugrik': '\u20AE'},
  {'Drachma': '\u20AF'},
  {'German Penny': '\u20B0'},
  {'Peso': '\u20B1'},
  {'Guarani': '\u20B2'},
  {'Austral': '\u20B3'},
  {'Hryvnia': '\u20B4'},
  {'Cedi Sign': '\u20B5'},
  {'Livre Tournois': '\u20B6'},
  {'Tenge Sign': '\u20B8'},
  {'Turkish Lira': '\u20BA'},
  {'Manat': '\u20BC'},
  {'Bengali Rupee': '\u09F2'},
  // {'Bengali Rupee': '\u09F3'},
  {'Gujarati Rupee': '\u0AF1'},
  {'Tamil Rupee': '\u0BF9'},
  {'Thai Baht': '\u0E3F'},
  {'Khmer Riel': '\u17DB'},
  {'Square Yuan': '\u3350'},
  // {'Yen Character': '\u5186'},
  // {'Won Character': '\uC6D0'},
  {'Rial': '\uFDFC'},
  // {'Fullwidth Dollar': '\uFF04'},
  // {'Fullwidth Cent': '\uFFE0'},
  // {'Fullwidth Pound': '\uFFE1'},
  // {'Fullwidth Yen Sign': '\uFFE5'},
  // {'Fullwidth Won Sign': '\uFFE6'},
]
