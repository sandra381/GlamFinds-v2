

const colorShades = {
  amarillo: [
    { name: 'almendra', rgb: [239, 222, 205] },
    { name: 'amarillo mostaza', rgb: [208, 166, 35] },
    { name: 'arena', rgb: [194, 178, 128] },
    { name: 'amarillo brillante', rgb: [255, 255, 0] },
    { name: 'amarillo palido', rgb: [255, 255, 153] },
    { name: 'amarillo dorado', rgb: [255, 223, 0] },
    { name: 'amarillo limon', rgb: [255, 247, 0] },
    { name: 'amarillo pastel', rgb: [255, 239, 170] },
    { name: 'amarillo oscuro', rgb: [204, 204, 0] },
    { name: 'dorado', rgb: [210, 180, 120] },
    { name: 'amarillo camel', rgb: [193, 154, 107] },
  ],
  azul: [
    { name: 'azul acero', rgb: [70, 130, 180] },
    { name: 'azul claro', rgb: [173, 216, 230] },
    { name: 'azul celeste', rgb: [135, 206, 235] },
    { name: 'azul cobalto', rgb: [61, 89, 171] },
    { name: 'azul marino', rgb: [0, 0, 128] },
    { name: 'azul marino', rgb: [0, 25, 57] },
    { name: 'azul oscuro', rgb: [23, 29, 48] },
    { name: 'azul oscuro', rgb: [0, 0, 139] },
    { name: 'azul rey', rgb: [65, 105, 225] },
    { name: 'azul turquesa', rgb: [64, 224, 208] },
    { name: 'azul grisaceo', rgb: [0, 128, 189] },
    { name: 'azul cielo', rgb: [135, 206, 235] },
    { name: 'azul real', rgb: [65, 105, 225] },
    { name: 'azul zafiro', rgb: [15, 82, 186] },
    { name: 'azul cobalto', rgb: [0, 71, 171] },
    { name: 'azul rey', rgb: [72, 61, 139] },
    { name: 'azul indigo', rgb: [75, 0, 130] },
    { name: 'azul vaquero', rgb: [33, 67, 95] },
    { name: 'azul petroleo', rgb: [0, 99, 126] },
    { name: 'azul aqua', rgb: [127, 255, 212] },
    { name: 'azul genciana', rgb: [30, 144, 255] },
    { name: 'azul denim', rgb: [21, 96, 189] },
    { name: 'azul noche', rgb: [25, 25, 112] },
    { name: 'azul electrico', rgb: [44, 117, 255] },
    { name: 'azul pastel', rgb: [174, 198, 207] },
    { name: 'azul lavanda', rgb: [230, 230, 250] },
    { name: 'azul hielo', rgb: [173, 216, 230] },
    { name: 'azul ceruleo', rgb: [42, 82, 190] },
    { name: 'azul Mediterraneo', rgb: [0, 121, 191] },
    { name: 'azul grisáceo', rgb: [96, 130, 182] },
    { name: 'azul cobalto oscuro', rgb: [61, 89, 171] },
    { name: 'azul pastel suave', rgb: [189, 183, 107] },
    { name: 'azul cian', rgb: [0, 255, 255] },
    { name: 'celeste', rgb: [153, 172, 182] },
    { name: 'azul oscuro', rgb: [39, 39, 48] },
    { name: 'azul turquesa clarito', rgb: [57, 85, 97] },
    { name: 'azul oscuro grisoso', rgb: [54, 69, 79] },
    { name: 'azul obscuro celeste', rgb: [112, 128, 144] },
  ],
  beige: [
    { name: 'beige', rgb: [183, 166, 149] },
    { name: 'beige claro', rgb: [245, 245, 220] },
    { name: 'beige claro', rgb: [230, 188, 137] },
    { name: 'beige grisaceo', rgb: [190, 187, 185] },
    { name: 'beige oscuro', rgb: [210, 180, 140] },
    { name: 'beige oscuro', rgb: [167, 116, 81] },
    { name: 'beige arenoso', rgb: [222, 202, 170] },
    { name: 'beige palido', rgb: [245, 245, 200] },
    { name: 'beige dorado', rgb: [210, 180, 120] },
    { name: 'beige intenso', rgb: [126, 116, 100] },
  ],
  blanco: [
    { name: 'blanco', rgb: [255, 255, 255] },
    { name: 'blanco hueso', rgb: [255, 250, 240] },
    { name: 'blanco perla', rgb: [252, 244, 248] },
    { name: 'blanco nieve', rgb: [255, 250, 250] },
    { name: 'blanco marfil', rgb: [255, 255, 240] },
    { name: 'blanco roto', rgb: [245, 245, 245] },
    { name: 'blanco suave', rgb: [225, 220, 219] },
    { name: 'blanco hueso gris', rgb: [214, 210, 212] },
  ],
  gris: [
    { name: 'gris', rgb: [197, 196, 196] },
    { name: 'gris azulado claro', rgb: [202, 206, 217] },
    { name: 'gris claro', rgb: [220, 225, 228] },
    { name: 'gris claro', rgb: [211, 211, 211] },
    { name: 'gris oscuro', rgb: [169, 169, 169] },
    { name: 'gris oscuro', rgb: [71, 65, 127] },
    { name: 'gris plata', rgb: [192, 192, 192] },
  ],
  marron: [
    { name: 'marron', rgb: [148, 134, 119] },
    { name: 'marron camel', rgb: [193, 154, 107] },
    { name: 'marron claro', rgb: [210, 180, 140] },
    { name: 'marron grisaceo', rgb: [139, 114, 103] },
    { name: 'marron oscuro', rgb: [139, 69, 19] },
    { name: 'marron palido', rgb: [189, 176, 185] },
    { name: 'marron rojizo', rgb: [57, 32, 26] },
    { name: 'marron terracota', rgb: [166, 104, 70] },
    { name: 'marron cobre', rgb: [184, 115, 51] },
    { name: 'marron castaño', rgb: [139, 69, 19] },
    { name: 'marron nuez', rgb: [150, 75, 0] },
    { name: 'marron tierra', rgb: [222, 184, 135] },
    { name: 'marron caramelo', rgb: [175, 111, 71] },
    { name: 'marron miel', rgb: [201, 140, 70] },
    { name: 'cafe', rgb: [165, 42, 42] },
    { name: 'chocolate', rgb: [210, 105, 30] },
    { name: 'marron camel', rgb: [193, 154, 107] },
    { name: 'marron claro', rgb: [210, 180, 140] },
    { name: 'marron grisaceo', rgb: [139, 114, 103] },
    { name: 'marron oscuro', rgb: [139, 69, 19] },
    { name: 'marron rojizo', rgb: [57, 32, 26] },
    { name: 'marron terracota', rgb: [166, 104, 70] },
    { name: 'marron cobre', rgb: [184, 115, 51] },
    { name: 'marron castaño', rgb: [139, 69, 19] },
    { name: 'marron nuez', rgb: [150, 75, 0] },
    { name: 'marron caoba', rgb: [128, 0, 0] },
    { name: 'marron caramelo', rgb: [175, 111, 71] },
    { name: 'marron miel', rgb: [201, 140, 70] },
    { name: 'marron tierra', rgb: [222, 184, 135] },
    { name: 'marron grisaceo', rgb: [105, 65, 62] },
    { name: 'marron suave', rgb: [192, 183, 173] },
    { name: 'marron arcilla', rgb: [198, 156, 109] },
    { name: 'cafe chocolate', rgb: [66, 59, 51] },
    { name: 'cafe apagado', rgb: [58, 38, 27] },
    { name: 'cafe clarito', rgb: [71, 67, 63] },
    { name: 'cafe medio', rgb: [86, 74, 81] },
    { name: 'cafe verdoso', rgb: [111, 105, 119] },
  ],
  morado: [
    { name: 'morado', rgb: [128, 0, 128] },
    { name: 'morado noche', rgb: [64, 0, 64] },
    { name: 'morado oscuro', rgb: [75, 0, 130] },
    { name: 'morado pastel', rgb: [218, 112, 214] },
    { name: 'morado real', rgb: [102, 51, 153] },
    { name: 'morado intenso', rgb: [30, 34, 48] },
    { name: 'morado lavanda', rgb: [230, 230, 250] },
    { name: 'morado ciruela', rgb: [142, 69, 133] },
    { name: 'morado berenjena', rgb: [97, 49, 103] },
    { name: 'lavanda', rgb: [230, 230, 250] },
    { name: 'lila', rgb: [200, 162, 200] },
    { name: 'lila suave', rgb: [217, 210, 215] },
    { name: 'lila', rgb: [188, 180, 196] },
    { name: 'malva', rgb: [224, 176, 255] },
    { name: 'violeta', rgb: [238, 130, 238] },
    { name: 'violeta claro', rgb: [199, 21, 133] },
    { name: 'violeta medio', rgb: [138, 43, 226] },
    { name: 'violeta oscuro', rgb: [148, 0, 211] },
    { name: 'violeta intenso', rgb: [110, 47, 145] },
    { name: 'orquidea media', rgb: [186, 85, 211] },
    { name: 'orquidea oscuro', rgb: [153, 50, 204] },
    { name: 'purpura', rgb: [128, 0, 128] },
    { name: 'purpura claro', rgb: [147, 112, 219] },
    { name: 'purpura oscuro', rgb: [104, 34, 139] },
    { name: 'purpura profundo', rgb: [102, 2, 60] },
    { name: 'purpura intenso', rgb: [71, 12, 107] }
  ],
  naranja: [
    { name: 'naranja', rgb: [215, 70, 11] },
    { name: 'naranja oscuro', rgb: [215, 115, 50] },
    { name: 'naranja brillante', rgb: [255, 165, 0] },
    { name: 'naranja pastel', rgb: [255, 195, 160] },
    { name: 'naranja quemado', rgb: [204, 85, 0] },
    { name: 'naranja mandarina', rgb: [255, 140, 0] },
    { name: 'naranja coral', rgb: [255, 127, 80] },
    { name: 'terracota', rgb: [198, 104, 70] }
  ],
  negro: [
    { name: 'negro', rgb: [0, 0, 0] },
    { name: 'negro suave', rgb: [26, 24, 23] },
    { name: 'negro carbon', rgb: [54, 69, 79] },
    { name: 'negro azabache', rgb: [0, 0, 0] },
    { name: 'negro onix', rgb: [36, 36, 36] }
  ],
  rojo: [
    { name: 'rojo brillante', rgb: [255, 0, 0] },
    { name: 'rojo carmesi', rgb: [220, 20, 60] },
    { name: 'rojo coral', rgb: [255, 127, 80] },
    { name: 'rojo oscuro', rgb: [139, 0, 0] },
    { name: 'rojo oscuro', rgb: [97, 21, 38] },
    { name: 'rojo ladrillo', rgb: [178, 34, 34] },
    { name: 'rojo oxido', rgb: [165, 42, 42] },
    { name: 'rojo sangre', rgb: [150, 7, 38] }
  ],
  rosa: [
    { name: 'rosa bebe', rgb: [255, 192, 203] },
    { name: 'rosa claro', rgb: [255, 182, 193] },
    { name: 'rosa claro', rgb: [225, 198, 231] },
    { name: 'rosa fuerte', rgb: [255, 20, 147] },
    { name: 'rosa intenso', rgb: [255, 105, 180] },
    { name: 'rosa mexicano', rgb: [226, 0, 116] },
    { name: 'rosa muy pálido', rgb: [255, 240, 245] },
    { name: 'rosa pastel', rgb: [255, 174, 185] },
    { name: 'rosa polvo', rgb: [219, 112, 147] },
    { name: 'rosa palido', rgb: [233, 225, 219] },
    { name: 'rosa viejo', rgb: [188, 143, 143] },
    { name: 'rosado palido', rgb: [200, 177, 176] },
    { name: 'rosa palido blanco', rgb: [214, 214, 215] },
  ],
  verde: [
    { name: 'verde azulado', rgb: [112, 96, 82] },
    { name: 'verde botella', rgb: [0, 106, 78] },
    { name: 'verde claro', rgb: [183, 232, 164] },
    { name: 'verde claro', rgb: [144, 238, 144] },
    { name: 'verde esmeralda', rgb: [80, 200, 120] },
    { name: 'verde intenso', rgb: [30, 34, 48] },
    { name: 'verde lima', rgb: [50, 205, 50] },
    { name: 'verde menta', rgb: [152, 251, 152] },
    { name: 'verde menta', rgb: [203, 219, 178] },
    { name: 'verde musgo', rgb: [85, 107, 47] },
    { name: 'verde musgo', rgb: [47, 39, 53] },
    { name: 'verde oliva', rgb: [163, 159, 141] },
    { name: 'verde oliva', rgb: [126, 88, 166] },
    { name: 'verde oliva claro', rgb: [203, 183, 187] },
    { name: 'verde oliva oscuro', rgb: [50, 40, 28] },
    { name: 'verde oliva oscuro', rgb: [180, 170, 157] },
    { name: 'verde seco', rgb: [140, 143, 100] },
    { name: 'verde azulado', rgb: [60, 55, 42] },
    { name: 'verde cafe', rgb: [53, 52, 46] },
  ]
};

// ---------- FUNCIONES AUXILIARES ----------

function getAllColors() {
  let allColors = [];
  for (const category in colorShades) {
    allColors = allColors.concat(colorShades[category]);
  }
  return allColors;
}

function colorDistance(c1, c2) {
  const [r1, g1, b1] = c1;
  const [r2, g2, b2] = c2;
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function findClosestColor(rgbColor, colorList) {
  let closest = colorList[0];
  let minDistance = colorDistance(rgbColor, closest.rgb);
  for (const color of colorList) {
    const distance = colorDistance(rgbColor, color.rgb);
    if (distance < minDistance) {
      closest = color;
      minDistance = distance;
    }
  }
  return closest.name;
}

module.exports = {
  colorShades,
  getAllColors,
  colorDistance,
  findClosestColor
};