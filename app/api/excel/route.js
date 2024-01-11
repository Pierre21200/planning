import { NextRequest, NextResponse } from 'next/server';
import { PdfReader } from 'pdfreader';
import fs from 'fs';
const xlsx = require('xlsx');

const parsedData = [];

export async function POST(request) {
  const data = await request.formData();
  const file = data.get('file');

  if (!file) {
    return NextResponse.json({ success: false });
  }

  let horairesParJour = {
    semaine: [],
    lundi: [],
    mardi: [],
    mercredi: [],
    jeudi: [],
    vendredi: [],
    samedi: [],
    dimanche: [],
  };

  if (file.name.toLowerCase().endsWith('.pdf')) {
    try {
      async function extraireDonneesDuPDF(file) {
        const pdfBuffer = Buffer.from(await file.arrayBuffer());

        const promesseTraitement = new Promise((resolve, reject) => {
          new PdfReader().parseBuffer(pdfBuffer, (err, item) => {
            if (err) {
              console.error('Erreur:', err);
            } else if (!item) {
              // Fin du buffer, écrire les données dans un fichier JSON
              parsedData.sort((a, b) => a.y - b.y);
              const jsonData = JSON.stringify(parsedData, null, 2);

              fs.writeFile('resultat_extraction.json', jsonData, (writeErr) => {
                if (writeErr) {
                  console.error(
                    "Erreur lors de l'écriture du fichier JSON:",
                    writeErr,
                  );
                } else {
                  console.log(
                    'Extraction réussie. Résultat dans le fichier "resultat_extraction.json".',
                  );
                  // on sait que le premier élément du tableau est la semaine concernée
                  horairesParJour.semaine.push(parsedData[0].text);

                  // On va ensuite essayer d'établir une range x et y pour chaque journée, on sait qu'elle sera fixe
                  const rl = [
                    { x: 0, y: 3.7 },
                    { x: 25, y: 13.5 },
                  ]; // range lundi x (0, 25), y (3.7, 13.5)

                  const rj = [
                    { x: 0, y: 14.3 },
                    { x: 25, y: 24.1 },
                  ];

                  const rs = [
                    { x: 0, y: 24.8 },
                    { x: 25, y: 35.3 },
                  ];

                  const rm = [
                    { x: 25.1, y: 3.7 },
                    { x: 48, y: 13.5 },
                  ];

                  const rv = [
                    { x: 25.1, y: 14.3 },
                    { x: 48, y: 24.1 },
                  ];

                  const rd = [
                    { x: 25.1, y: 24.8 },
                    { x: 48, y: 35.3 },
                  ];

                  const rme = [
                    { x: 49, y: 3.7 },
                    { x: 72, y: 13.5 },
                  ];

                  const lundiElements = parsedData.filter(
                    (element) =>
                      rl[0].x < element.x &&
                      element.x < rl[1].x &&
                      rl[0].y < element.y &&
                      element.y < rl[1].y &&
                      element.text === 'MF',
                  );

                  const mardiElements = parsedData.filter(
                    (element) =>
                      rm[0].x < element.x &&
                      element.x < rm[1].x &&
                      rm[0].y < element.y &&
                      element.y < rm[1].y &&
                      element.text === 'MF',
                  );
                  const mercrediElements = parsedData.filter(
                    (element) =>
                      rme[0].x < element.x &&
                      element.x < rme[1].x &&
                      rme[0].y < element.y &&
                      element.y < rme[1].y &&
                      element.text === 'MF',
                  );

                  const jeudiElements = parsedData.filter(
                    (element) =>
                      rj[0].x < element.x &&
                      element.x < rj[1].x &&
                      rj[0].y < element.y &&
                      element.y < rj[1].y &&
                      element.text === 'MF',
                  );

                  const vendrediElements = parsedData.filter(
                    (element) =>
                      rv[0].x < element.x &&
                      element.x < rv[1].x &&
                      rv[0].y < element.y &&
                      element.y < rv[1].y &&
                      element.text === 'MF',
                  );

                  const samediElements = parsedData.filter(
                    (element) =>
                      rs[0].x < element.x &&
                      element.x < rs[1].x &&
                      rs[0].y < element.y &&
                      element.y < rs[1].y &&
                      element.text === 'MF',
                  );

                  const dimancheElements = parsedData.filter(
                    (element) =>
                      rd[0].x < element.x &&
                      element.x < rd[1].x &&
                      rd[0].y < element.y &&
                      element.y < rd[1].y &&
                      element.text === 'MF',
                  );

                  let x;
                  let y;
                  let debut;
                  let fin;

                  // Lundi
                  if (lundiElements.length > 1) {
                    x = lundiElements[1].y - lundiElements[0].y;
                    debut = Math.ceil((x / 0.24) * 0.5 + 6);
                    horairesParJour.lundi.push(debut);

                    lundiElements
                      .slice(2) // Exclure les deux premiers éléments
                      .map((element, index, array) => {
                        if (index > 0) {
                          const deltaY = element.y - array[index - 1].y;
                          if (deltaY > 0.3) {
                            const a =
                              (array[index - 1].y - lundiElements[0].y) / 0.24;
                            const b = a * 0.5 + 7;
                            horairesParJour.lundi.push(Math.round(b));
                          }
                        }
                      });

                    y =
                      lundiElements[lundiElements.length - 1].y -
                      lundiElements[0].y;
                    fin = Math.ceil((y / 0.24) * 0.5 + 6);

                    if (horairesParJour.lundi.length > 1) {
                      horairesParJour.lundi.push(horairesParJour.lundi[1] + 1);
                      horairesParJour.lundi.push(fin);
                    } else {
                      horairesParJour.lundi.push(fin);
                    }
                  }

                  // Mardi
                  if (mardiElements.length > 1) {
                    x = mardiElements[1].y - mardiElements[0].y;
                    debut = Math.ceil((x / 0.24) * 0.5 + 6);
                    horairesParJour.mardi.push(debut);

                    mardiElements
                      .slice(2) // Exclure les deux premiers éléments
                      .map((element, index, array) => {
                        if (index > 0) {
                          const deltaY = element.y - array[index - 1].y;
                          if (deltaY > 0.3) {
                            const a =
                              (array[index - 1].y - mardiElements[0].y) / 0.24;
                            const b = a * 0.5 + 7;
                            horairesParJour.mardi.push(Math.round(b));
                          }
                        }
                      });

                    y =
                      mardiElements[mardiElements.length - 1].y -
                      mardiElements[0].y;
                    fin = Math.ceil((y / 0.24) * 0.5 + 6);

                    if (horairesParJour.mardi.length > 1) {
                      horairesParJour.mardi.push(horairesParJour.mardi[1] + 1);
                      horairesParJour.mardi.push(fin);
                    } else {
                      horairesParJour.mardi.push(fin);
                    }
                  }

                  // Mercredi
                  if (mercrediElements.length > 1) {
                    x = mercrediElements[1].y - mercrediElements[0].y;
                    debut = Math.ceil((x / 0.24) * 0.5 + 6);
                    horairesParJour.mercredi.push(debut);

                    mercrediElements
                      .slice(2) // Exclure les deux premiers éléments
                      .map((element, index, array) => {
                        if (index > 0) {
                          const deltaY = element.y - array[index - 1].y;
                          if (deltaY > 0.3) {
                            const a =
                              (array[index - 1].y - mercrediElements[0].y) /
                              0.24;
                            const b = a * 0.5 + 7;
                            horairesParJour.mercredi.push(Math.round(b));
                          }
                        }
                      });

                    y =
                      mercrediElements[mercrediElements.length - 1].y -
                      mercrediElements[0].y;
                    fin = Math.ceil((y / 0.24) * 0.5 + 6);

                    if (horairesParJour.mercredi.length > 1) {
                      horairesParJour.mercredi.push(
                        horairesParJour.mercredi[1] + 1,
                      );
                      horairesParJour.mercredi.push(fin);
                    } else {
                      horairesParJour.mercredi.push(fin);
                    }
                  }
                  // Jeudi
                  if (jeudiElements.length > 1) {
                    x = jeudiElements[1].y - jeudiElements[0].y;
                    debut = Math.ceil((x / 0.24) * 0.5 + 6);
                    horairesParJour.jeudi.push(debut);

                    jeudiElements
                      .slice(2) // Exclure les deux premiers éléments
                      .map((element, index, array) => {
                        if (index > 0) {
                          const deltaY = element.y - array[index - 1].y;
                          if (deltaY > 0.3) {
                            const a =
                              (array[index - 1].y - jeudiElements[0].y) / 0.24;
                            const b = a * 0.5 + 7;
                            horairesParJour.jeudi.push(Math.round(b));
                          }
                        }
                      });

                    y =
                      jeudiElements[jeudiElements.length - 1].y -
                      jeudiElements[0].y;
                    fin = Math.ceil((y / 0.24) * 0.5 + 6);

                    if (horairesParJour.jeudi.length > 1) {
                      horairesParJour.jeudi.push(horairesParJour.jeudi[1] + 1);
                      horairesParJour.jeudi.push(fin);
                    } else {
                      horairesParJour.jeudi.push(fin);
                    }
                  }

                  // Vendredi
                  if (vendrediElements.length > 1) {
                    x = vendrediElements[1].y - vendrediElements[0].y;
                    debut = Math.ceil((x / 0.24) * 0.5 + 6);
                    horairesParJour.vendredi.push(debut);

                    vendrediElements
                      .slice(2) // Exclure les deux premiers éléments
                      .map((element, index, array) => {
                        if (index > 0) {
                          const deltaY = element.y - array[index - 1].y;
                          if (deltaY > 0.3) {
                            const a =
                              (array[index - 1].y - vendrediElements[0].y) /
                              0.24;
                            const b = a * 0.5 + 7;
                            horairesParJour.vendredi.push(Math.round(b));
                          }
                        }
                      });

                    y =
                      vendrediElements[vendrediElements.length - 1].y -
                      vendrediElements[0].y;
                    fin = Math.ceil((y / 0.24) * 0.5 + 6);

                    if (horairesParJour.vendredi.length > 1) {
                      horairesParJour.vendredi.push(
                        horairesParJour.vendredi[1] + 1,
                      );
                      horairesParJour.vendredi.push(fin);
                    } else {
                      horairesParJour.vendredi.push(fin);
                    }
                  }

                  // Samedi
                  if (samediElements.length > 1) {
                    x = samediElements[1].y - samediElements[0].y;
                    debut = Math.ceil((x / 0.24) * 0.5 + 6);
                    horairesParJour.samedi.push(debut);

                    samediElements
                      .slice(2) // Exclure les deux premiers éléments
                      .map((element, index, array) => {
                        if (index > 0) {
                          const deltaY = element.y - array[index - 1].y;
                          if (deltaY > 0.3) {
                            const a =
                              (array[index - 1].y - samediElements[0].y) / 0.24;
                            const b = a * 0.5 + 7;
                            horairesParJour.samedi.push(Math.round(b));
                          }
                        }
                      });

                    y =
                      samediElements[samediElements.length - 1].y -
                      samediElements[0].y;
                    fin = Math.ceil((y / 0.24) * 0.5 + 6);

                    if (horairesParJour.samedi.length > 1) {
                      horairesParJour.samedi.push(
                        horairesParJour.samedi[1] + 1,
                      );
                      horairesParJour.samedi.push(fin);
                    } else {
                      horairesParJour.samedi.push(fin);
                    }
                  }

                  // Dimanche
                  if (dimancheElements.length > 1) {
                    x = dimancheElements[1].y - dimancheElements[0].y;
                    debut = Math.ceil((x / 0.24) * 0.5 + 6);
                    horairesParJour.dimanche.push(debut);

                    samediElements
                      .slice(2) // Exclure les deux premiers éléments
                      .map((element, index, array) => {
                        if (index > 0) {
                          const deltaY = element.y - array[index - 1].y;
                          if (deltaY > 0.3) {
                            const a =
                              (array[index - 1].y - dimancheElements[0].y) /
                              0.24;
                            const b = a * 0.5 + 7;
                            horairesParJour.dimanche.push(Math.round(b));
                          }
                        }
                      });

                    y =
                      dimancheElements[dimancheElements.length - 1].y -
                      dimancheElements[0].y;
                    fin = Math.ceil((y / 0.24) * 0.5 + 6);

                    if (horairesParJour.dimanche.length > 1) {
                      horairesParJour.dimanche.push(
                        horairesParJour.dimanche[1] + 1,
                      );
                      horairesParJour.dimanche.push(fin);
                    } else {
                      horairesParJour.dimanche.push(fin);
                    }
                  }

                  resolve();
                }
              });
            } else if (item.text) {
              // Ajouter les données extraites au tableau
              parsedData.push({
                x: item.x,
                y: item.y,
                w: item.w,
                sw: item.sw,
                A: item.A,
                R: item.R,
                oc: item.oc,
                text: item.text,
              });
            }
          });
        });

        await promesseTraitement;
      }

      await extraireDonneesDuPDF(file);

      return NextResponse.json(horairesParJour);
    } catch (error) {}
  } else if (file.name.toLowerCase().endsWith('.xlsx')) {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const workbook = xlsx.read(buffer, { type: 'buffer' });

      // Générer un buffer Excel à partir du classeur
      // Sélectionner la première feuille du classeur
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      console.log('oui');
      // Convertir le contenu de la feuille en format JSON
      const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

      const semaineString = jsonData[0].find(
        (cell) => cell && cell.includes('SEMAINE'),
      );
      horairesParJour.semaine.push(semaineString);
      // // On récupère la semaine concernée

      // On va isoler chaque journée dans un JSON
      const lundiJson = [];
      const mardiJson = [];
      const mercrediJson = [];
      const jeudiJson = [];
      const vendrediJson = [];
      const samediJson = [];
      const dimancheJson = [];

      // On part du principe que les jours se trouvent toujours sur la meme ligne, donc a changer au besoin en recherchant et en definissant plus haut sur quelle ligne on trouve lundi
      for (let ligne = 4; ligne < 46; ligne++) {
        const ligneJson = [];
        for (let colonne = 0; colonne < 40; colonne++) {
          ligneJson.push(jsonData[ligne][colonne]);
        }
        lundiJson.push(ligneJson);
      }

      for (let ligne = 4; ligne < 46; ligne++) {
        const ligneJson = [];
        for (let colonne = 41; colonne < 80; colonne++) {
          ligneJson.push(jsonData[ligne][colonne]);
        }
        mardiJson.push(ligneJson);
      }

      for (let ligne = 4; ligne < 46; ligne++) {
        const ligneJson = [];
        for (let colonne = 81; colonne < 120; colonne++) {
          ligneJson.push(jsonData[ligne][colonne]);
        }
        mercrediJson.push(ligneJson);
      }

      for (let ligne = 48; ligne < 88; ligne++) {
        const ligneJson = [];
        for (let colonne = 0; colonne < 40; colonne++) {
          ligneJson.push(jsonData[ligne][colonne]);
        }
        jeudiJson.push(ligneJson);
      }

      for (let ligne = 48; ligne < 88; ligne++) {
        const ligneJson = [];
        for (let colonne = 41; colonne < 80; colonne++) {
          ligneJson.push(jsonData[ligne][colonne]);
        }
        vendrediJson.push(ligneJson);
      }

      for (let ligne = 92; ligne < 132; ligne++) {
        const ligneJson = [];
        for (let colonne = 0; colonne < 40; colonne++) {
          ligneJson.push(jsonData[ligne][colonne]);
        }
        samediJson.push(ligneJson);
      }

      for (let ligne = 92; ligne < 132; ligne++) {
        const ligneJson = [];
        for (let colonne = 41; colonne < 80; colonne++) {
          ligneJson.push(jsonData[ligne][colonne]);
        }
        dimancheJson.push(ligneJson);
      }

      console.log(
        'Lundi, Jeudi et Samedi ont le même nombre de ligne',
        lundiJson.length,
        'et de colonne',
        lundiJson[0].length,
      );
      console.log(
        'Leur dernière ligne est donc la ligne lundiJson[41], et leur dernière colonne est lundiJson[2][39], avec 2 car deux premières lignes ne sont quune colonne chacune',
      );
      console.log(
        'Mardi, Mercredi, Vendredi et Dimanche ont le même nombre de ligne :',
        mardiJson.length,
        'et de colonne',
        mardiJson[0].length,
      );
      console.log(
        'Leur dernière ligne est donc la ligne mardiJson[41] et leur dernière colonne est mardiJson[2][38] avec 2 car deux premières lignes ne sont quune colonne chacune',
      );
      console.log('Attention, les premières lignes sont lundiJson[0][0]');
      console.log(
        lundiJson[0][0],
        mardiJson[0][0],
        mercrediJson[0][0],
        jeudiJson[0][0],
        vendrediJson[0][0],
        samediJson[0][0],
        dimancheJson[0][0],
      );

      let name = 'MF';
      let indiceL;
      let indiceM;
      let indiceMe;
      let indiceJ;
      let indiceV;
      let indiceS;
      let indiceD;

      for (let i = 0; i < lundiJson[2].length; i++) {
        if (jsonData[6][i] === name) {
          indiceL = i;
        }
      }

      for (let i = 0; i < mardiJson[2].length; i++) {
        if (jsonData[6][i] === name) {
          indiceM = i;
        }
      }

      for (let i = 0; i < mercrediJson[2].length; i++) {
        if (jsonData[6][i] === name) {
          indiceMe = i;
        }
      }
      for (let i = 0; i < jeudiJson[2].length; i++) {
        if (jsonData[6][i] === name) {
          indiceJ = i;
        }
      }
      for (let i = 0; i < vendrediJson[2].length; i++) {
        if (jsonData[6][i] === name) {
          indiceV = i;
        }
      }
      for (let i = 0; i < samediJson[2].length; i++) {
        if (jsonData[6][i] === name) {
          indiceS = i;
        }
      }
      for (let i = 0; i < dimancheJson[2].length; i++) {
        if (jsonData[6][i] === name) {
          indiceD = i;
        }
      }

      let consecutive = 0;
      let i = 6.5;
      for (let rowIndex = 3; rowIndex < lundiJson.length; rowIndex++) {
        i = i + 0.5;
        if (lundiJson[rowIndex][indiceL] === name) {
          if (consecutive === 0) {
            console.log(rowIndex, 'début Lundi', i);
            horairesParJour.lundi.push(i);
          }
          consecutive++;
        } else {
          if (consecutive !== 0) {
            console.log(rowIndex, 'fin Lundi', i);
            horairesParJour.lundi.push(i);
          }
          consecutive = 0;
        }
      }

      i = 6.5;
      consecutive = 0;
      for (let rowIndex = 3; rowIndex < mardiJson.length; rowIndex++) {
        i = i + 0.5;

        if (mardiJson[rowIndex][indiceM - 1] === name) {
          if (consecutive === 0) {
            console.log(rowIndex, 'début Mardi', i);
            horairesParJour.mardi.push(i);
          }
          consecutive++;
        } else {
          if (consecutive !== 0) {
            console.log(rowIndex, 'fin Mardi', i);
            horairesParJour.mardi.push(i);
          }
          consecutive = 0;
        }
      }

      i = 6.5;
      consecutive = 0;
      for (let rowIndex = 3; rowIndex < mercrediJson.length; rowIndex++) {
        i = i + 0.5;

        if (mercrediJson[rowIndex][indiceM - 1] === name) {
          if (consecutive === 0) {
            console.log(rowIndex, 'début Mercredi', i);
            horairesParJour.mercredi.push(i);
          }
          consecutive++;
        } else {
          if (consecutive !== 0) {
            console.log(rowIndex, 'fin Mercredi', i);
            horairesParJour.mercredi.push(i);
          }
          consecutive = 0;
        }
      }

      i = 6.5;
      consecutive = 0;
      for (let rowIndex = 3; rowIndex < jeudiJson.length; rowIndex++) {
        i = i + 0.5;

        if (jeudiJson[rowIndex][indiceJ] === name) {
          if (consecutive === 0) {
            console.log(rowIndex, 'début Jeudi', i);
            horairesParJour.jeudi.push(i);
          }
          consecutive++;
        } else {
          if (consecutive !== 0) {
            console.log(rowIndex, 'fin Jeudi', i);
            horairesParJour.jeudi.push(i);
          }
          consecutive = 0;
        }
      }

      i = 6.5;
      consecutive = 0;
      for (let rowIndex = 3; rowIndex < vendrediJson.length; rowIndex++) {
        i = i + 0.5;

        if (vendrediJson[rowIndex][indiceV - 1] === name) {
          if (consecutive === 0) {
            console.log(rowIndex, 'début Vendredi', i);
            horairesParJour.vendredi.push(i);
          }
          consecutive++;
        } else {
          if (consecutive !== 0) {
            console.log(rowIndex, 'fin Vendredi', i);
            horairesParJour.vendredi.push(i);
          }
          consecutive = 0;
        }
      }

      i = 6.5;
      consecutive = 0;
      for (let rowIndex = 2; rowIndex < samediJson.length; rowIndex++) {
        i = i + 0.5;

        if (samediJson[rowIndex][indiceS] === name) {
          if (consecutive === 0) {
            console.log(rowIndex, 'début Samedi', i);
            horairesParJour.samedi.push(i);
          }
          consecutive++;
        } else {
          if (consecutive !== 0) {
            console.log(rowIndex, 'fin Samedi', i);
            horairesParJour.samedi.push(i);
          }
          consecutive = 0;
        }
      }

      i = 6.5;
      consecutive = 0;
      for (let rowIndex = 2; rowIndex < dimancheJson.length; rowIndex++) {
        i = i + 0.5;

        if (dimancheJson[rowIndex][indiceD - 1] === name) {
          if (consecutive === 0) {
            console.log(rowIndex, 'début Dimanche', i);
            horairesParJour.dimanche.push(i);
          }
          consecutive++;
        } else {
          if (consecutive !== 0) {
            console.log(rowIndex, 'fin Dimanche', i);
            horairesParJour.dimanche.push(i);
          }
          consecutive = 0;
        }
      }

      console.log(horairesParJour);

      return NextResponse.json(horairesParJour);
    } catch (error) {}
    // Fichier Excel
    console.log("C'est un fichier Excel (XLSX).");
  }
}
