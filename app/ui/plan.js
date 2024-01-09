export default function Plan({ data }) {
  const joursSemaine = [
    'lundi',
    'mardi',
    'mercredi',
    'jeudi',
    'vendredi',
    'samedi',
    'dimanche',
  ];

  joursSemaine.forEach((jour) => {
    data[jour] = JSON.parse(data[jour]);
  });

  console.log(data);
}
