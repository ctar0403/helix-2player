export const gameOptions = {
    columnRadius        : 1,                // column radius
    columnColor         : 0x00ff00,         // column color
    totalPlaftforms     : 10,               // total platorms in game
    platformGap         : 3,                // vertical gap between two platorms
    platformRadius      : 3,                // platform radius
    platformHeight      : 1,                // platform heignt
    minThetaLength      : Math.PI * 1.5,    // min theta length, minimum radians of the circular sector
    maxThetaLength      : Math.PI * 1.85,   // max theta length, maximum radians of the circular sector
    rotationSpeed       : 0.01,                // helix rotation speed
    gapColor            : 0x00ff00,         // gap color
    ballRadius          : 0.4,              // ball radius
    ballColor           : 0x444444,         // ball color
    spikeRadius         : 0.2,              // spike radius
    spikeHeight         : 0.6,              // spike height
    spikeColor          : 0x444444,         // spike color
    gravity             : 10,               // ball gravity
    bounceImpulse       : 6,                // ball bounce impulse
    spikeProbability    : 0.25,             // probabilty of a spike to appear, 0..1          
    platformColors  : [0xff0000, 0x0000ff, 0xffff00, 0xff00ff]
};
