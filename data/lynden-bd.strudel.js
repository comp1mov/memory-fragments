// cheeeees!
// An original birthday rock 'n' roll for Lynden.
// The Sun Inn, Barnes. 19:14, 5 April 2025.
// 156 BPM / twelve-bar boogie / shuffle / one more chorus.
samples('https://raw.githubusercontent.com/felixroos/dough-samples/main/piano.json')
samples({
  cheers_guitar: { C3: 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/gtr/0001_cleanC.wav' },
  cheers_clap: ['https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/realclaps/1.wav'],
  cheers_tom: ['https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/ht/HT0D0.wav']
})
setcpm(156 / 4)

const changes = "<0!4 5!2 0!2 7 5 0 7>"
const backbeat = stack(
  s("bd ~ [bd ~] [~ bd]").gain(.67),
  s("~ sd ~ sd").gain(".59 .72").room(.13),
  s("hh*8").gain(".22 .10 .17 .11 .23 .10 .18 .13").speed("1 1.08"),
  s("~ cheers_clap ~ cheers_clap").gain(.29).mask("<0@4 1@8>"),
  s("~ ~ ~ [sd cheers_tom sd sd]").gain(.39).mask("<0@3 1>")
)

const walkingBass = note("a2 c#3 e3 f#3 g3 f#3 e3 c#3")
  .transpose(changes).s("triangle").attack(.003)
  .decay(.09).sustain(.35).release(.055).lpf(1900)
  .gain(".46 .37 .42 .38 .46 .37 .42 .38")

const boogiePiano = note(`
  [a2,e3] [a2,f#3] [a2,g3] [a2,f#3]
  [a2,e3] [a2,f#3] [a2,g3] [a2,e3]
`).transpose(changes).s("piano").clip(.7).release(.07)
  .gain(".42 .31 .36 .31 .43 .31 .38 .32").pan(.35)
  .room(.12)

const guitarChops = note("a2*8").transpose(changes)
  .s("cheers_guitar").clip(.36).release(.055)
  .hpf(250).lpf(4800)
  .gain(".19 .07 .14 .09 .19 .07 .14 .1").pan(.72)
  .delay(.13).delaytime(.085).delayfeedback(.1)

const shoutBack = note(`
  <[e5 ~ [g5 a5] g5 e5 c#5 [d5 c#5] a4]
   [c5 c#5 e5 ~ [g5 e5] d5 c#5 ~]
   [e5 e5 [g5 a5] ~ g5 e5 [d5 c#5] a4]
   [[c5 c#5] e5 g5 a5 ~ g5 [e5 d5] c#5]>
`).transpose(changes).s("piano").clip(.68).release(.09)
  .gain(.35).pan(.58).room(.18)
  .mask("<1@12 0@12>")

const afterparty = note(`
  <[[a4 c5] c#5 e5 [g5 a5] c6 a5 [g5 e5] d5]
   [c#5 [e5 g5] a5 ~ [a5 g5] e5 [d5 c#5] a4]
   [[e5 g5] a5 [c6 a5] g5 [e5 d5] c#5 a4 e4]
   [a4 [c5 c#5] e5 g5 [a5 g5] [e5 d5] c#5 ~]>
`).transpose(changes).s("piano").clip(.55).release(.07)
  .gain(.34).pan(.55).room(.16)
  .mask("<0@12 1@12>")

// A brief band stop and a shouted last chord before the next round.
const lastOrders = note("[a3,c#4,e4,g4] ~ ~ [a3,c#4,e4,g4]")
  .transpose(7).s("piano").gain(.4).clip(.6).room(.25)
  .mask("<0@23 1>")

stack(backbeat, walkingBass, boogiePiano, guitarChops, shoutBack, afterparty)
  .mask("<1@23 [1 1 0 1]>")
  .stack(lastOrders)
  .swingBy(.22, 4)
  .gain(.34)
