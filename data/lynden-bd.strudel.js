// @title Cheers
// slow, loose, late-night groove

samples('https://raw.githubusercontent.com/felixroos/dough-samples/main/piano.json')

samples({
  cheers_guitar: {
    C3: 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/gtr/0001_cleanC.wav'
  },

  cheers_clap: [
    'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/realclaps/1.wav'
  ],

  cheers_tom: [
    'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/ht/HT0D0.wav'
  ]
})

setcpm(112 / 4)

const changes = "<0!4 5!2 0!2 7!2 5!2 0!2 7!2>"

// ----------------------------------------------------
// CALM BASE
// ----------------------------------------------------

const drums = stack(

  s("bd ~ ~ [~ bd]")
    .gain(.44),

  s("~ ~ sd ~")
    .gain(.29)
    .room(.18),

  s("hh*8")
    .gain(".065 .03 .05 .025 .07 .03 .05 .025")
    .hpf(5200)
    .degradeBy(.36),

  s("~ cheers_clap ~ ~")
    .gain(.08)
    .room(.34)
    .degradeBy(.76),

  s("~ ~ ~ [cheers_tom ~]")
    .gain(.10)
    .room(.25)
    .mask("<0@3 1>")

)
.swingBy(.18, 4)


// ----------------------------------------------------
// BASS
// ----------------------------------------------------

const bass = note("[a2@3 e3] [f#3@3 e3]")
  .transpose(changes)
  .s("triangle")
  .attack(.008)
  .decay(.12)
  .sustain(.24)
  .release(.12)
  .lpf(1250)
  .gain(".31 .26 .29 .25")


// ----------------------------------------------------
// PIANO
// ----------------------------------------------------

const piano = note(
  "[a3,c#4,e4] ~ [e4,g4,b4] ~"
)
  .transpose(changes)
  .s("piano")
  .clip(.52)
  .release(.32)
  .gain(".21 .15 .18 .15")
  .pan("<.42 .58>")
  .room(.34)
  .delay(.12)
  .delaytime(.25)
  .delayfeedback(.16)


// ----------------------------------------------------
// GUITAR
// ----------------------------------------------------

const guitar = note(
  "a3 ~ ~ ~ [e4 ~] ~ ~ ~"
)
  .transpose(changes)
  .s("cheers_guitar")
  .clip(.28)
  .release(.10)
  .hpf(320)
  .lpf(3800)
  .gain(.095)
  .pan(.67)
  .delay(.18)
  .delaytime(.375)
  .delayfeedback(.20)
  .degradeBy(.30)


// ----------------------------------------------------
// SMALL MELODIC PHRASE
// ----------------------------------------------------

const littleToast = note(
  "<e5 ~ [g5 a5] ~ c#5 ~ [d5 c#5] ~>"
)
  .transpose(changes)
  .s("piano")
  .clip(.48)
  .release(.22)
  .gain(.14)
  .pan(.56)
  .room(.46)
  .delay(.18)
  .mask("<0@7 1>")


// ----------------------------------------------------
// BUILD UP
//
// Two cycles where the groove slowly starts moving.
// ----------------------------------------------------

const buildUp = stack(

  s("~ ~ [bd ~] [~ bd]")
    .gain("<.12 .22>")
    .room(.08),

  s("hh*8")
    .gain("<.035 .065>")
    .hpf(5600)
    .degradeBy("<.55 .25>"),

  s("~ cheers_clap ~ cheers_clap")
    .gain("<.035 .07>")
    .room(.26)
    .degradeBy(.35),

  note("a2 ~ e3 ~")
    .transpose(changes)
    .s("triangle")
    .release(.10)
    .lpf(1500)
    .gain("<.10 .17>"),

  note("~ [e4 g4] ~ [f#4 a4]")
    .transpose(changes)
    .s("piano")
    .clip(.42)
    .release(.12)
    .gain("<.07 .12>")
    .room(.28)

)
.mask("<0@5 1@2 0@9>")
.swingBy(.18, 4)


// ----------------------------------------------------
// OPEN GROOVE
//
// Longer upbeat section.
// Still relaxed, just more alive.
// ----------------------------------------------------

const openGroove = stack(

  s("bd ~ [~ bd] ~")
    .gain("<.24 .30 .34 .32 .26>"),

  s("~ sd ~ sd")
    .gain("<.15 .20 .23 .22 .17>")
    .room(.14),

  s("hh*8")
    .gain(".055 .025 .07 .03 .06 .025 .075 .03")
    .hpf(5600)
    .degradeBy(.12),

  s("~ cheers_clap ~ cheers_clap")
    .gain("<.055 .075 .085 .075 .055>")
    .room(.25)
    .degradeBy(.28),

  note(`
    a2 e3 ~ e3
    a2 ~ c#3 e3
  `)
    .transpose(changes)
    .s("triangle")
    .attack(.004)
    .release(.09)
    .lpf(1650)
    .gain("<.15 .19 .22 .20 .16>"),

  note(`
    [a4 c#5] ~ e5 ~
    [c#5 e5] ~ [f#5 e5] ~
  `)
    .transpose(changes)
    .s("piano")
    .clip(.45)
    .release(.15)
    .gain("<.10 .13 .15 .14 .11>")
    .pan("<.42 .58>")
    .room(.31)
    .delay(.10)
    .delaytime(.25),

  note("~ a3 ~ [e4 ~]")
    .transpose(changes)
    .s("cheers_guitar")
    .clip(.27)
    .release(.08)
    .hpf(350)
    .lpf(4100)
    .gain("<.045 .065 .075 .065 .045>")
    .pan(.70)
    .delay(.14)
    .delaytime(.375)

)
.mask("<0@7 1@5 0@4>")
.swingBy(.20, 4)


// ----------------------------------------------------
// LITTLE EXIT
//
// Makes the transition back to calm less abrupt.
// ----------------------------------------------------

const comeDown = stack(

  s("hh*8")
    .gain("<.05 .025>")
    .hpf(5500)
    .degradeBy(.30),

  note("[a3,c#4,e4] ~ ~ ~")
    .transpose(changes)
    .s("piano")
    .clip(.5)
    .release(.30)
    .gain("<.12 .07>")
    .room(.42),

  note("e3 ~ ~ ~")
    .transpose(changes)
    .s("triangle")
    .release(.18)
    .lpf(1100)
    .gain("<.13 .07>")

)
.mask("<0@12 1@2 0@2>")


// ----------------------------------------------------
// OCCASIONAL END CHORD
// ----------------------------------------------------

const lastGlass = note("[a4,c#5,e5,b5]")
  .transpose(changes)
  .s("piano")
  .clip(.75)
  .release(.45)
  .gain(.16)
  .room(.58)
  .delay(.20)
  .mask("<0@15 1>")


// ----------------------------------------------------
// MASTER
// ----------------------------------------------------

stack(
  drums,
  bass,
  piano,
  guitar,
  littleToast,

  buildUp,
  openGroove,
  comeDown,

  lastGlass
)
.gain(.54)