import { Armorial } from '../../src/domain/models/Armorial';

export const SampleArmorial: Armorial = {
  name: 'A sample armorial',
  slug: 'sample',
  language: 'french',
  entries: [
    {
      name: 'Halberstadt',
      blazon: "Parti d'argent et de gueules",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/FRA_heraldy_-_parti.svg/120px-FRA_heraldy_-_parti.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
      source: {
        name: 'Wikipedia: Partition héraldique',
        url: 'https://fr.wikipedia.org/wiki/Partition_h%C3%A9raldique#Les_partitions_g%C3%A9om%C3%A9triques',
      },
    },
    {
      name: 'France',
      blazon: "D'azur semé de fleurs-de-lis d'or",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/Arms_of_the_Kingdom_of_France_%28Ancien%29.svg/120px-Arms_of_the_Kingdom_of_France_%28Ancien%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
      source: {
        name: 'Wikipedia: Armoiries de la France',
        url: "https://fr.wikipedia.org/wiki/Armoiries_de_la_France#Armoiries_sous_la_monarchie_et_l'Empire",
      },
    },
    {
      name: 'Bourgogne (Capétien)',
      blazon: "Bandé d'or et d'azur en six pièces, à la bordure de gueules",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Blason_Ducs_Bourgogne_%28ancien%29.svg/langfr-250px-Blason_Ducs_Bourgogne_%28ancien%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
      source: {
        name: 'Wikipédia: Maison capétienne de Bourgogne',
        url: 'https://fr.wikipedia.org/wiki/Maison_cap%C3%A9tienne_de_Bourgogne',
      },
    },
    {
      name: 'Anne de Bretagne',
      blazon: "Parti d'azur à trois fleurs de lys d'or et d'hermine",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e2/Blason_Anne_de_Bretagne_%281476-1514%29_Reine_de_France.svg/250px-Blason_Anne_de_Bretagne_%281476-1514%29_Reine_de_France.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
      source: {
        name: 'Wikipédia: Anne de Bretagne',
        url: 'https://fr.wikipedia.org/wiki/Anne_de_Bretagne#Ses_embl%C3%A8mes_et_devises',
      },
    },
  ],
};
