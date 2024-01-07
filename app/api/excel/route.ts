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
  
      let horairesParJour: any = {
        Semaine: [],
        Lundi: [],
        Mardi: [],
        Mercredi: [],
        Jeudi: [],
        Vendredi: [],
        Samedi: [],
        Dimanche: []
      };
      
    

      try {
      // Lire le contenu du fichier Excel
      const workbook = xlsx.read(buffer, { type: 'buffer' })
  
      // Sélectionner la première feuille du classeur
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
  
      // Convertir le contenu de la feuille en format JSON
      const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });


      const semaineString = jsonData[0].find((cell : any) => cell && cell.includes('SEMAINE'));
      horairesParJour.Semaine.push(semaineString)
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


          
          console.log('Lundi, Jeudi et Samedi ont le même nombre de ligne', lundiJson.length, 'et de colonne', lundiJson[0].length)
          console.log('Leur dernière ligne est donc la ligne lundiJson[41], et leur dernière colonne est lundiJson[2][39], avec 2 car deux premières lignes ne sont quune colonne chacune')
          console.log('Mardi, Mercredi, Vendredi et Dimanche ont le même nombre de ligne :', mardiJson.length, 'et de colonne', mardiJson[0].length)
          console.log('Leur dernière ligne est donc la ligne mardiJson[41] et leur dernière colonne est mardiJson[2][38] avec 2 car deux premières lignes ne sont quune colonne chacune')
          console.log('Attention, les premières lignes sont lundiJson[0][0]')
          console.log(lundiJson[0][0], mardiJson[0][0], mercrediJson[0][0],jeudiJson[0][0],vendrediJson[0][0],samediJson[0][0],dimancheJson[0][0],)

          let name = 'MF';
          let indiceL : any;
          let indiceM : any;
          let indiceMe : any;
          let indiceJ : any;
          let indiceV : any;
          let indiceS : any;
          let indiceD : any;

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

              
        let consecutive : number = 0
        let i = 6.5;
        for (let rowIndex = 3; rowIndex < lundiJson.length; rowIndex++) {
          i = i + 0.5
          if(lundiJson[rowIndex][indiceL] === name) {
            if (consecutive === 0) {
              console.log(rowIndex,'début Lundi', i)
              horairesParJour.Lundi.push(i)
            }  
            consecutive++;
          }   
          else {
            if (consecutive !== 0) {
              console.log(rowIndex,'fin Lundi', i)
              horairesParJour.Lundi.push(i)
            }
            consecutive = 0
             
          }

         }

         i = 6.5;
         consecutive = 0
         for (let rowIndex = 3; rowIndex < mardiJson.length; rowIndex++) {
          i = i + 0.5
          
          if(mardiJson[rowIndex][indiceM - 1] === name) {
            if (consecutive === 0) {
              console.log(rowIndex,'début Mardi', i)
              horairesParJour.Mardi.push(i)

            }  
            consecutive++;
          }   
          else {
            if (consecutive !== 0) {
              console.log(rowIndex,'fin Mardi', i)
              horairesParJour.Mardi.push(i)

            }
            consecutive = 0
          }

         }


         i = 6.5;
         consecutive = 0
         for (let rowIndex = 3; rowIndex < mercrediJson.length; rowIndex++) {
          i = i + 0.5

          
          if(mercrediJson[rowIndex][indiceM - 1] === name) {
            if (consecutive === 0) {
              console.log(rowIndex,'début Mercredi', i)
              horairesParJour.Mercredi.push(i)

            }  
            consecutive++;
          }   
          else {
            if (consecutive !== 0) {
              console.log(rowIndex,'fin Mercredi', i)
              horairesParJour.Mercredi.push(i)

            }
            consecutive = 0
          }

         }


         i = 6.5;
         consecutive = 0
         for (let rowIndex = 3; rowIndex < jeudiJson.length; rowIndex++) {
          i = i + 0.5

          
          if(jeudiJson[rowIndex][indiceJ] === name) {
            if (consecutive === 0) {
              console.log(rowIndex,'début Jeudi', i)
              horairesParJour.Jeudi.push(i)

            }  
            consecutive++;
          }   
          else {
            if (consecutive !== 0) {
              console.log(rowIndex,'fin Jeudi', i)
              horairesParJour.Jeudi.push(i)

            }
            consecutive = 0
          }

         }

         i = 6.5;
         consecutive = 0
         for (let rowIndex = 3; rowIndex < vendrediJson.length; rowIndex++) {
          i = i + 0.5

          
          if(vendrediJson[rowIndex][indiceV - 1] === name) {
            if (consecutive === 0) {
              console.log(rowIndex,'début Vendredi', i)
              horairesParJour.Vendredi.push(i)

            }  
            consecutive++;
          }   
          else {
            if (consecutive !== 0) {
              console.log(rowIndex,'fin Vendredi', i)
              horairesParJour.Vendredi.push(i)

            }
            consecutive = 0
          }

         }

         i = 6.5;
         consecutive = 0
         for (let rowIndex = 2; rowIndex < samediJson.length; rowIndex++) {
          i = i + 0.5

          
          if(samediJson[rowIndex][indiceS] === name) {
            if (consecutive === 0) {
              console.log(rowIndex,'début Samedi', i)
              horairesParJour.Samedi.push(i)

            }  
            consecutive++;
          }   
          else {
            if (consecutive !== 0) {
              console.log(rowIndex,'fin Samedi', i)
              horairesParJour.Samedi.push(i)

            }
            consecutive = 0
          }

         }


         i = 6.5;
         consecutive = 0
         for (let rowIndex = 2; rowIndex < dimancheJson.length; rowIndex++) {
          i = i + 0.5

          
          if(dimancheJson[rowIndex][indiceD - 1] === name) {
            if (consecutive === 0) {
              console.log(rowIndex,'début Dimanche', i)
              horairesParJour.Dimanche.push(i)

            }  
            consecutive++;
          }   
          else {
            if (consecutive !== 0) {
              console.log(rowIndex,'fin Dimanche', i)
              horairesParJour.Dimanche.push(i)

            }
            consecutive = 0
          }

         }

      console.log(horairesParJour)

      return NextResponse.json(horairesParJour)

      } catch (error) {
        
      }
}


