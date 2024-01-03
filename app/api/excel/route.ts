import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
const xlsx = require('xlsx');


export async function POST(request: NextRequest) {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
  
    if (!file) {
      return NextResponse.json({ success: false })
    }
  
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    let horairesParJour : any;
    try {
      // Lire le contenu du fichier Excel
      const workbook = xlsx.read(buffer, { type: 'buffer' })
  
      // Sélectionner la première feuille du classeur
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
  
      // Convertir le contenu de la feuille en format JSON
      const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  
      // On cherche la ligne ou se trouve MF
      let mfline = null;
  
      for (
        let rowIndex = 0;
        rowIndex < jsonData.length && mfline === null;
        rowIndex++
      ) {
        for (let colIndex = 0; colIndex < jsonData[rowIndex].length; colIndex++) {
          if (jsonData[rowIndex][colIndex] === "JB") {
            mfline = rowIndex + 1;
            break;
          }
        }
      }
  
      let mfIndices = [];
      let h = [];
  
      // On stocke chaque colonne ou se trouve MF dans notre ligne
      for (let i = 0; i < jsonData[6].length; i++) {
        if (jsonData[6][i] === "JB") {
          mfIndices.push(i);
        }
      }
  
      // On va itérer sur chaque colonne ou se trouve MF
      // Pour en tirer des informations
      for (let index = 0; index < mfIndices.length; index++) {
        let consecutiveMF = 0;
        let consecutiveNotMF = 0;
        let begin = false;
        let conge = 0;
  
        for (let rowIndex = 6; rowIndex < jsonData.length; rowIndex++) {
          const cellValue = jsonData[rowIndex][mfIndices[index]];
          // console.log(rowIndex, mfIndices[index])
  
          if (cellValue === "JB") {
            consecutiveMF++;
            // console.log(rowIndex, consecutiveMF)
  
            if (consecutiveMF === 2) {
              begin = true;
              if (rowIndex % 2 === 1) {
                let heures = jsonData[rowIndex][0];
                let parties = heures.split("-");
                let premierePartie = parties[0];
                h.push(premierePartie);
              } else {
                let heures = jsonData[rowIndex - 1][0];
                let parties = heures.split("-");
                let premierePartie = parties[0] + "30";
                h.push(premierePartie);
              }
  
              conge = 0;
            }
          } else {
            if (begin === true) {
              consecutiveNotMF++;
              if (consecutiveNotMF === 3) {
                if (rowIndex % 2 === 1) {
                  let heures = jsonData[rowIndex][0];
                  let parties = heures.split("-");
                  let premierePartie = parties[0];
                  h.push(premierePartie);
                } else {
                  let heures = jsonData[rowIndex - 1][0];
                  let parties = heures.split("-");
                  let premierePartie = parties[0] + "30";
                  h.push(premierePartie);
                }
  
                begin = false;
                consecutiveMF = 0;
                consecutiveNotMF = 0;
              }
            } else {
              conge++;
              if (conge === 55) {
                // console.log('conge',rowIndex, mfIndices[index])
                console.log(rowIndex);
                h.push("congé", " congé");
                conge = 0;
              }
            }
          }
        }
  
        // Avec le tableau h, on va vérifier combien d'objet avec l'index 0 existe(1, 2 ou 3), correspondant a Lundi Jeudi Samedi
        // Pareil pour l'index 1, correspondant a Mardi Vendredi Dimanche
        // Et index 2 pour Mercredi
      }
  
      horairesParJour = {
        lundi: [],
        jeudi: [],
        samedi: [],
        mardi: [],
        vendredi: [],
        dimanche: [],
        mercredi: [],
      };
  
      // horairesParJour.lundi.push(h[0], h[1])
      // horairesParJour.mardi.push(h[2], h[3])
      for (let i = 0; i < Object.keys(horairesParJour).length; i++) {
        let jour = Object.keys(horairesParJour)[i];
  
        // Ajouter les horaires correspondants pour chaque jour
        horairesParJour[jour].push(h[i * 2], h[i * 2 + 1]);
      }
  
  
      console.log(horairesParJour);
  
      // const outputFilePath = "./output.json";
      // fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 2));
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier Excel:", error);
    }


   

  
    return NextResponse.json(horairesParJour)
  }


