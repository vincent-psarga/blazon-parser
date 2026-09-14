import { Armorial } from '../../src/domain/models/Armorial';

/**
 * The families of Franche-Comté, copied from the French Wikipedia armorial as
 * it stands. One source is named for the whole roll rather than per entry,
 * since every entry comes from the same page.
 *
 * Two rows of the source are left out: one whose arms are still a "to be
 * drawn" placeholder, and one whose blazon leaves its tinctures unwritten. A
 * row the source cannot fill says nothing about what the parser can read.
 * Where a family records a second set of arms, the first is kept and the
 * alias ignored, and alternative spellings of a name are dropped.
 */
export const FrancheComteArmorial: Armorial = {
  name: 'Familles de Franche-Comté',
  slug: 'franche-comte',
  language: 'french',
  licence: 'CC BY-SA 4.0',
  source: {
    name: 'Wikipedia: Armorial des familles de Franche-Comté',
    url: 'https://fr.wikipedia.org/wiki/Armorial_des_familles_de_Franche-Comt%C3%A9',
  },
  entries: [
    {
      name: 'Comtes de Bourgogne',
      blazon: "De gueules à l'aigle éployée d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Blason_Bourgogne-comt%C3%A9_ancien%28aigle%29.svg/120px-Blason_Bourgogne-comt%C3%A9_ancien%28aigle%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Comtes de Bourgogne',
      blazon:
        "Au lion d'or, couronné de même, armé et lampassé de gueules (ou d'or), sur champ d'azur semé de billettes d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/Blason_fr_Franche-Comt%C3%A9.svg/120px-Blason_fr_Franche-Comt%C3%A9.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Abbans",
      blazon: "D'argent à la croix de gueules cantonnée en chef de deux roses de même.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Blason_ville_fr_Abbans-Dessus_%28Doubs%29.svg/120px-Blason_ville_fr_Abbans-Dessus_%28Doubs%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Abriot de Grusse',
      blazon: "De gueules à trois besants d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Blason-gueules-3-besants-or.svg/120px-Blason-gueules-3-besants-or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Accolans",
      blazon: "De gueules au chevron d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/80/Blason_ville_fr_Accolans_25.svg/120px-Blason_ville_fr_Accolans_25.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Achey de Thoraise",
      blazon: "De gueules, à deux haches d'armes posées en pal, et adossées, d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/Blason_famille_fr_d%27Achey.svg/120px-Blason_famille_fr_d%27Achey.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Agay",
      blazon: "D'or au lion de gueules ; au chef d'azur.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/Blason_famille_fr_Agay_Franche-Comt%C3%A9.svg/120px-Blason_famille_fr_Agay_Franche-Comt%C3%A9.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Amance",
      blazon:
        "Burelé d'argent et de sable de douze pièces ; à la bande de gueules brochant sur le tout.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e5/Blason_Amance_70.svg/120px-Blason_Amance_70.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Amancey",
      blazon: "De gueules à trois coquilles d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Blason-gueules-3-coquilles-or.svg/120px-Blason-gueules-3-coquilles-or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Ambly",
      blazon: "D'argent à trois lionceaux de sable lampassés de gueules, 2 et 1.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Blason_famille_fr_d%27Ambly_%28Champagne%29.svg/120px-Blason_famille_fr_d%27Ambly_%28Champagne%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Amoncourt",
      blazon: "De gueules au sautoir d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/Blason_de_gueules_au_sautoir_d%27or.svg/120px-Blason_de_gueules_au_sautoir_d%27or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Amondans",
      blazon: "D'azur à trois coquilles d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Blason-azur-3-coquilles-or.svg/120px-Blason-azur-3-coquilles-or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Ancier",
      blazon: "D'argent à la fasce de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Blason-argent-fasce-gueules.svg/120px-Blason-argent-fasce-gueules.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Andelot",
      blazon:
        "Échiqueté d'argent et d'azur ; au lion de gueules armé, lampassé et couronné d'or, brochant sur le tout.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Blason_Andelot-en-Montagne.svg/120px-Blason_Andelot-en-Montagne.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Arguel",
      blazon: "De gueules à une comète à huit rais d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/Blason_ville_fr_Arguel_25.svg/120px-Blason_ville_fr_Arguel_25.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Aubonne",
      blazon:
        "D'azur au chevron d'argent accompagné de deux étoiles en chef et d'un croissant en pointe.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Blason_ville_fr_Aubonne_25.svg/120px-Blason_ville_fr_Aubonne_25.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Augerans",
      blazon: "Bandé de gueules et d'argent de six pièces.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/Blason_Augerans.svg/120px-Blason_Augerans.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Augicourt",
      blazon: "De gueules à une croix ancrée d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/Blason_ville_fr_Augicourt_%28Haute-Sa%C3%B4ne%29.svg/120px-Blason_ville_fr_Augicourt_%28Haute-Sa%C3%B4ne%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Autrey",
      blazon: "De gueules à trois chevrons d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Blason_Autrey-l%C3%A8s-Gray.svg/120px-Blason_Autrey-l%C3%A8s-Gray.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Avanne",
      blazon: "D'or à trois quintefeuilles de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Blason_ville_fr_Avanne-Aveney_%28Doubs%29.svg/120px-Blason_ville_fr_Avanne-Aveney_%28Doubs%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Bachelu',
      blazon:
        "Écartelé : au 1, contre-écartelé denché d'argent et de gueules ; au 2, de gueules à une épée haute d'argent en pal ; au 3, parti d'argent au chevron de gueules accompagné de trois mains appaumées du même, et de gueules à trois feuilles de chêne d'argent ; au 4, coupé, au 1 écartelé d'argent et de gueules, au 2 fascé d'or et d'azur de quatre pièces.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Blason_famille_fr_Gilbert_D%C3%A9sir%C3%A9_Joseph_Bachelu_%28Baron%29.svg/120px-Blason_famille_fr_Gilbert_D%C3%A9sir%C3%A9_Joseph_Bachelu_%28Baron%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Des Barres',
      blazon: "D'azur à la fasce d'or accompagnée de trois croissants de même.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Blason_ville_fr_LaCelle_%28Cher%29.svg/120px-Blason_ville_fr_LaCelle_%28Cher%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Bauffremont',
      blazon: "Vairé d'or et de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/76/Blason_famille_fr_de_Bauffremont.svg/120px-Blason_famille_fr_de_Bauffremont.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De La Baume-Montrevel',
      blazon: "D'or à la bande vivrée d'azur.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Blason_famille_fr_de_La_Baume_de_Montrevel.svg/120px-Blason_famille_fr_de_La_Baume_de_Montrevel.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De La Baume-Saint-Amour',
      blazon: "D'or à la bande d'azur.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Blason_Famille_de_La_Balme.svg/120px-Blason_Famille_de_La_Balme.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Baumotte',
      blazon: "De sable au sautoir d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Blason-sable-sautoir-argent.svg/120px-Blason-sable-sautoir-argent.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Belenet',
      blazon: "D'azur au chevron d'or accompagné de trois roses du même.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/Blason_famille_Belenet.svg/120px-Blason_famille_Belenet.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Belvoir-lez-Baume',
      blazon:
        "De gueules à trois quintefeuilles percées d'or ; au lambel d'azur à trois pendants en chef.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Blason_ville_fr_Belvoir_25.svg/120px-Blason_ville_fr_Belvoir_25.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Besancenot de Cendrecourt',
      blazon: "D'azur à un palmier arraché de sinople.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Blason_famille_fr_Besancenot.svg/120px-Blason_famille_fr_Besancenot.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Blicterswick',
      blazon: "D'or à une émanchure de gueules de trois pièces.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/Ecu-de_Bliterswich_de_Moncley.svg/120px-Ecu-de_Bliterswich_de_Moncley.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Bonvalot',
      blazon: "D'argent à trois jumelles de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Blason-argent-3-jumelles-gueules.svg/120px-Blason-argent-3-jumelles-gueules.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Borrey',
      blazon:
        "D'argent à trois bandes d'azur ; au chef de gueules chargé d'un lion léopardé d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Blason_famille_fr_Borrey.svg/120px-Blason_famille_fr_Borrey.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Boudran',
      blazon: "D'azur à une bande d'or chargée de trois cœurs de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/Blason_Famille_fr_Boudran.svg/120px-Blason_Famille_fr_Boudran.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Bouhelier',
      blazon: "De gueules à trois fasces d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ae/Blason-gueules-3-fasces-or.svg/120px-Blason-gueules-3-fasces-or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Bouvier',
      blazon: "D'azur au chevron d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Blason-azur-chevron-or.svg/120px-Blason-azur-chevron-or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Boyvin',
      blazon:
        "Tranché en onde d'azur et d'argent, à un croissant renversé d'argent sur l'azur, au raisin au naturel feuillé de sinople sur l'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/Blason_famille_Boyvin_%28Franche-Comt%C3%A9%29.svg/120px-Blason_famille_Boyvin_%28Franche-Comt%C3%A9%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Branges de Bourcia',
      blazon: "De gueules au sautoir d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/Blason_de_gueules_au_sautoir_d%27or.svg/120px-Blason_de_gueules_au_sautoir_d%27or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Brun',
      blazon: "D'or à trois grappes de raisin au naturel tigées et feuillées de sinople.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/Blason_famille_Brun_%28Franche-Comt%C3%A9%29.svg/120px-Blason_famille_Brun_%28Franche-Comt%C3%A9%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Buretel de Chassey',
      blazon: "D'azur à deux fasces d'or, accompagnées de trois buretels d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/Blason_famille_Buretel_de_Chassey_%28alias%29.svg/120px-Blason_famille_Buretel_de_Chassey_%28alias%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Buson de Champdiviers',
      blazon:
        "Parti d'argent et de gueules à trois quintefeuilles de même posées en bande de l'un en l'autre.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/Blason_famille_Buson_de_Champdiviers_%28Franche-Comt%C3%A9%29.svg/120px-Blason_famille_Buson_de_Champdiviers_%28Franche-Comt%C3%A9%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Butte',
      blazon: "De gueules à la croix d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Blason-gueules-croix-or.svg/120px-Blason-gueules-croix-or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Buyer',
      blazon:
        "D'azur au lion passant d'argent tenant entre ses griffes un écu d'or chargé d'un chêne arraché de sinople.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Blason_famille_fr_de_Buyer.svg/120px-Blason_famille_fr_de_Buyer.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Byans-lez-Usiers',
      blazon: "De gueules au sautoir d'or cantonné de douze billettes du même.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Blason_famille_de_Byans-lez-Usiers_%28Franche-Comt%C3%A9%29.svg/120px-Blason_famille_de_Byans-lez-Usiers_%28Franche-Comt%C3%A9%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Carondelet',
      blazon: "D'azur à la bande d'or, accompagnée de six besants de même en orle.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Blason_ville_fr_Potelle_%28Nord%29.svg/120px-Blason_ville_fr_Potelle_%28Nord%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Carteron',
      blazon: "D'or à une bande d'azur accompagnée de deux roses de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/17/Blason_famille_du_Carteron.svg/120px-Blason_famille_du_Carteron.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Cellier',
      blazon: "D'or au lion de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Blason-or-lion-gueules.svg/120px-Blason-or-lion-gueules.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Cemboing',
      blazon: "D'or à trois bandes de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Blason-or-3-bandes-gueules.svg/120px-Blason-or-3-bandes-gueules.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Chaffoy-Mugnans',
      blazon: "Losangé d'or et d'azur à la fasce d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6a/Blason_ville_fr_Chaffois_%28Doubs%29.svg/120px-Blason_ville_fr_Chaffois_%28Doubs%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Maison de Chalon',
      blazon: "De gueules à la bande d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Blason_maison_fr_de_Chalon.svg/120px-Blason_maison_fr_de_Chalon.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Chamberet',
      blazon:
        "Coupé : au 1, de gueules à deux étoiles d'or ; au 2, d'azur au lion passant d'or ; à la fasce d'argent brochant sur le coupé.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Blason_famille_fr_Tyrbas_de_Chamberet.svg/120px-Blason_famille_fr_Tyrbas_de_Chamberet.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Chamole',
      blazon: "De gueules à trois rocs d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6a/Blason_ville_fr_Chamole_%28Jura%29.svg/120px-Blason_ville_fr_Chamole_%28Jura%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Champagne',
      blazon: "D'or au lion de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Blason-or-lion-gueules.svg/120px-Blason-or-lion-gueules.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Champdivers',
      blazon: "D'azur au chevron d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Blason_Champdivers.svg/120px-Blason_Champdivers.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Champlitte',
      blazon: "De gueules au lion d'or couronné de même.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Blason_famille_de_Champlitte.svg/120px-Blason_famille_de_Champlitte.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Chantrans',
      blazon: "De gueules à trois chevrons d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Blason_ville_fr_Chantrans_%28Doubs%29.svg/120px-Blason_ville_fr_Chantrans_%28Doubs%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Chassal',
      blazon: "De gueules au sautoir d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Blason-gueules-sautoir-argent.svg/120px-Blason-gueules-sautoir-argent.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Chassey',
      blazon: "De gueules à la fasce d'argent frettée d'azur.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Blason_de_la_famille_Chassey.svg/120px-Blason_de_la_famille_Chassey.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Chaudet',
      blazon: "D'azur à l'escarboucle fleurdelisée d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Blason-azur-escarboucle-or.svg/120px-Blason-azur-escarboucle-or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Chaussin',
      blazon: "De sable à une fasce d'argent accompagnée en chef d'un croissant de même.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Blason_famille_de_Chaussin_%28Franche-Comt%C3%A9%29.svg/120px-Blason_famille_de_Chaussin_%28Franche-Comt%C3%A9%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Chifflet',
      blazon:
        "De gueules au sautoir d'argent accompagné en chef d'un serpent d'or se mordant la queue.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a8/Blason_famille_fr_Chifflet.svg/120px-Blason_famille_fr_Chifflet.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Chilley',
      blazon: "D'or à la fasce de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/Blason-or-fasce-gueules.svg/120px-Blason-or-fasce-gueules.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Choiseul',
      blazon:
        "D'azur à la croix d'or cantonnée de dix-huit billettes de même, dix en chef, huit en pointe.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Blason_maison_fr_de_Choiseul.svg/120px-Blason_maison_fr_de_Choiseul.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Cicon',
      blazon: "D'or à la fasce de sable.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Blason_de_la_famille_de_Cicon.svg/120px-Blason_de_la_famille_de_Cicon.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Clerc de Neurey',
      blazon: "D'argent au chevron de sable.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4f/Blason-argent-chevron-sable.svg/120px-Blason-argent-chevron-sable.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Cléron',
      blazon: "De gueules à une croix d'argent cantonnée de quatre croisettes fleuronnées de même.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/Blason_famille_fr_de_Clairon.svg/120px-Blason_famille_fr_de_Clairon.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Cointet',
      blazon: "De sable au sautoir d'argent ; au chef d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Blason_famille_fr_de_Cointet_de_Filain.svg/120px-Blason_famille_fr_de_Cointet_de_Filain.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Coligny',
      blazon: "De gueules à l'aigle d'argent, becquée, membrée et couronnée d'azur.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/Blason_de_Coligny.svg/120px-Blason_de_Coligny.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Colombier',
      blazon: "De gueules au chef d'argent chargé de trois coquilles de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Blason_de_la_ville_de_Colombier_%2821%29.svg/120px-Blason_de_la_ville_de_Colombier_%2821%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Cotebrune',
      blazon: "De gueules au sautoir d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/Blason_de_gueules_au_sautoir_d%27or.svg/120px-Blason_de_gueules_au_sautoir_d%27or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Courlet de Vregille',
      blazon:
        "D'azur au chevron d'or accompagné en chef de deux étoiles de même et en pointe d'un cœur aussi d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Blason_famille_Courlet_de_Vregille_%28Franche-Comt%C3%A9%29.svg/120px-Blason_famille_Courlet_de_Vregille_%28Franche-Comt%C3%A9%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Cousin',
      blazon:
        "D'azur à la fasce d'argent chargée d'un serpent étendu de sinople et accompagnée en chef d'un oiseau essorant d'argent becqué et membré d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/Blason_famille_fr_Cousin_%28Nozeroy%29.svg/120px-Blason_famille_fr_Cousin_%28Nozeroy%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Cusance',
      blazon: "D'or à l'aigle de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/Blason_ville_fr_Cusance_%28Doubs%29.svg/120px-Blason_ville_fr_Cusance_%28Doubs%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Dampierre-sur-le-Doubs',
      blazon:
        "De gueules à deux clefs d'argent passées en sautoir, surhaussées d'une fleur de lys d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/Blason_ville_fr_Dampierre-sur-le-Doubs_%28Doubs%29.svg/120px-Blason_ville_fr_Dampierre-sur-le-Doubs_%28Doubs%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Desbiez de Saint-Juan',
      blazon:
        "De gueules à trois étoiles d'or, posées 2 et 1, et une bande ondée d'argent abaissée sous les étoiles.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Blason_famille_Desbiez_de_Saint-Juan_%28Franche-Comt%C3%A9%29.svg/120px-Blason_famille_Desbiez_de_Saint-Juan_%28Franche-Comt%C3%A9%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Doubs',
      blazon: "Palé et contre-palé d'or et de gueules de six pièces.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Blason_ville_fr_Doubs_%28Doubs%29.svg/120px-Blason_ville_fr_Doubs_%28Doubs%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Dramelay',
      blazon: "D'or au chef de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/Blason_d%27or_au_chef_de_gueules.svg/120px-Blason_d%27or_au_chef_de_gueules.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Duprel',
      blazon: "De gueules au chevron engrêlé d'or accompagné de trois étoiles rayonnantes de même.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Blason_famille_fr_Duprel_%28Franche-Comt%C3%A9%29.svg/120px-Blason_famille_fr_Duprel_%28Franche-Comt%C3%A9%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Épenoy",
      blazon: "De gueules à trois croissants d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d8/Blason_Epenoy.svg/120px-Blason_Epenoy.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Épercy",
      blazon: "D'azur à la croix dentelée d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Blason_ville_fr_Lavancia-Epercy_%28Jura%29.svg/120px-Blason_ville_fr_Lavancia-Epercy_%28Jura%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Estrabonne",
      blazon: "D'or au lion d'azur.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Blason-or-lion-azur.svg/120px-Blason-or-lion-azur.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Esvans",
      blazon: "De gueules à la croix d'argent cantonnée de quatre coquilles de même.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Blason_ville_fr_%C3%89vans_39.svg/120px-Blason_ville_fr_%C3%89vans_39.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "Faivre d'Arcier",
      blazon: "De gueules à deux bandes d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/Blason_famille_fr_Faivre_d%27Arcier.svg/120px-Blason_famille_fr_Faivre_d%27Arcier.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Falletans',
      blazon: "De gueules à l'aigle d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Blason_Bourgogne-comt%C3%A9_ancien%28aigle%29.svg/120px-Blason_Bourgogne-comt%C3%A9_ancien%28aigle%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Fauche',
      blazon:
        "De gueules à trois têtes de licorne d'argent, deux affrontées en chef, une en pointe.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/Ecu-Fauche_de_Domprel.svg/120px-Ecu-Fauche_de_Domprel.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Faucogney',
      blazon: "D'or à trois bandes (ou cotices) de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/Blason_Aymon_de_Faucogney.svg/120px-Blason_Aymon_de_Faucogney.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Faulquier',
      blazon: "D'azur à trois faux d'or, les deux du chef affrontées.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Blason_famille_fr_deFaulquier.svg/120px-Blason_famille_fr_deFaulquier.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Fertans',
      blazon: "D'argent à la fasce d'azur chargée de trois étoiles d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f2/Blason_ville_fr_Fertans_25.svg/120px-Blason_ville_fr_Fertans_25.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Fourcault',
      blazon: "D'azur au sautoir d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Blason_d%27azur_au_sautoir_d%27or.svg/120px-Blason_d%27azur_au_sautoir_d%27or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Franchet de Rans',
      blazon: "D'azur à la tête de cheval d'argent, sans bride, lampassée de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/Ecu-Franchet-de-Rans.svg/120px-Ecu-Franchet-de-Rans.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Frasne-le-Château',
      blazon: "De vair à la fasce d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/Blason_ville_fr_Frasne-le-Ch%C3%A2teau_70.svg/120px-Blason_ville_fr_Frasne-le-Ch%C3%A2teau_70.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "Frémy d'Argillières",
      blazon: "D'or à la fasce de gueules accompagnée de trois trèfles de même.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Blason_famille_fr_d%27Argilli%C3%A8res_%28Champagne%29.svg/120px-Blason_famille_fr_d%27Argilli%C3%A8res_%28Champagne%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Froissard',
      blazon: "D'azur au cerf passant d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/34/Blason_famille_de_Froissard.svg/120px-Blason_famille_de_Froissard.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Galafin',
      blazon: "Échiqueté d'argent et d'azur.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Blason_Echiquet%C3%A9.svg/120px-Blason_Echiquet%C3%A9.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Gilley',
      blazon: "D'argent à un chêne arraché et chargé de glands de sinople.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Blason_Famille_fr_Gilley.svg/120px-Blason_Famille_fr_Gilley.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Girardot de Nozeroy',
      blazon:
        "Écartelé : aux 1 et 4 d'azur au chevron d'or, accompagné de trois croisettes de même, qui est Girardot ; aux 2 et 3, d'azur à trois colombes d'argent becquées et membrées de gueules, qui est de Nozeroy.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/59/Blason_Jean_Girardot_de_Nozeroy.svg/120px-Blason_Jean_Girardot_de_Nozeroy.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Gollut',
      blazon: "D'argent au pélican de sable nourrissant ses petits.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Blason_famille_Gollut_%28Franche-Comt%C3%A9%29.svg/120px-Blason_famille_Gollut_%28Franche-Comt%C3%A9%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Gonsans',
      blazon: "D'or à la bande de gueules chargée de trois roses d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Blason_Gonsans.svg/120px-Blason_Gonsans.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Gorrevod',
      blazon: "D'azur au chevron d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Blason-azur-chevron-or.svg/120px-Blason-azur-chevron-or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Grammont',
      blazon:
        "Écartelé : aux 1 et 4, de gueules au sautoir d'or, qui est de Granges ; aux 2 et 3, d'azur à trois bustes de femme de carnation couronnées d'or à l'antique, qui est de Grammont.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Blason-famille-de-Grammont-Granges.svg/120px-Blason-famille-de-Grammont-Granges.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Granges',
      blazon: "De gueules au sautoir d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/Blason_de_gueules_au_sautoir_d%27or.svg/120px-Blason_de_gueules_au_sautoir_d%27or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Grivel',
      blazon: "D'azur à trois taus ou croix potencées d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Blason_famille_de_Grivel_%28Franche-Comt%C3%A9%29.svg/120px-Blason_famille_de_Grivel_%28Franche-Comt%C3%A9%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Grospain',
      blazon: "D'azur à la fasce d'or accompagnée de trois besants de même 2 et 1.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Blason_famille_de_Grospain_%28Franche-Comt%C3%A9%29.svg/120px-Blason_famille_de_Grospain_%28Franche-Comt%C3%A9%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Grozon',
      blazon: "D'azur à une émanchure de deux pièces d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c0/Blason_Grozon.svg/120px-Blason_Grozon.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Guillaume de Pontamougeard',
      blazon: "Tranché d'or et de gueules, à deux lions armés et lampassés de l'un en l'autre.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Blason_Guillaume_de_Pontamougeard_%281628-1689%29.svg/120px-Blason_Guillaume_de_Pontamougeard_%281628-1689%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Jacquelin',
      blazon: "D'azur à trois étoiles d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/Blason-azur-3-%C3%A9toiles-or.svg/120px-Blason-azur-3-%C3%A9toiles-or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De La Jonchère',
      blazon: "De gueules à la fasce d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Gules_a_fess_argent.svg/120px-Gules_a_fess_argent.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Maison de Jonvelle',
      blazon: "D'argent au lion de gueules armé et lampassé d'azur.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Blason_des_seigneurs_de_Jonvelle.svg/120px-Blason_des_seigneurs_de_Jonvelle.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Jouffroy',
      blazon:
        "Fascé d'or et de sable de six pièces, la première de sable chargée de deux croisettes fleuronnées d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Coat_of_arms_Jouffroy_d%27Abbans.svg/120px-Coat_of_arms_Jouffroy_d%27Abbans.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Jougne',
      blazon:
        "Parti de gueules à l'épée d'or mise en pal au 1er, et d'argent à la clef de gueules au 2d.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/Blason_Jougne.svg/120px-Blason_Jougne.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Joux',
      blazon: "D'or fretté de sable.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Blason_Famille_Joux.svg/120px-Blason_Famille_Joux.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Lallemand',
      blazon: "D'argent à la fasce de sable, accompagnée de trois trèfles de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Blason_Jean_Lallemand_%281470-1560%29.svg/120px-Blason_Jean_Lallemand_%281470-1560%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Lambrey',
      blazon: "D'azur au chevron d'or accompagné de trois fermaux losangés d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/Blason_famille_de_Lambrey.svg/120px-Blason_famille_de_Lambrey.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Lamy de La Perrière',
      blazon: "D'azur à trois lézards d'argent en pal 2 et 1.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ef/Blason_famille_fr_Lamy.svg/120px-Blason_famille_fr_Lamy.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Lantenne',
      blazon: "De sable à la croix d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/Blason_famille_de_Lantenne_%28Franche-Comt%C3%A9%29.svg/120px-Blason_famille_de_Lantenne_%28Franche-Comt%C3%A9%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Laurencin-Beaufort',
      blazon: "De sable au chevron d'or accompagné de trois étoiles d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/Blason_famille_Laurencin_de_Riveri.svg/120px-Blason_famille_Laurencin_de_Riveri.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Laviron',
      blazon: "D'or à la fasce d'azur.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Blason-or-fasce-azur.svg/120px-Blason-or-fasce-azur.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Lavoncourt',
      blazon: "D'azur à sept coquilles d'argent posées alternativement 1 et 2.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Blason_ville_fr_Lavoncourt_70.svg/120px-Blason_ville_fr_Lavoncourt_70.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Lezay-Marnésia',
      blazon:
        "Parti d'argent et de gueules, à la croix ancrée, ajourée en carré de l'un en l'autre.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Blason_famille_fr_de_Lezay-Marn%C3%A9sia.svg/120px-Blason_famille_fr_de_Lezay-Marn%C3%A9sia.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Liesle',
      blazon: "D'argent à trois fasces de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Blason-argent-3-fasces-gueules.svg/120px-Blason-argent-3-fasces-gueules.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Longin',
      blazon:
        "De gueules à cinq billettes d'or mises en sautoir ; écartelé d'or à trois bandes de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8d/Blason_famille_Longin_%28Lyon%29.svg/120px-Blason_famille_Longin_%28Lyon%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Longwy',
      blazon: "D'azur à la bande d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Blason_Longwy-sur-le-Doubs.svg/120px-Blason_Longwy-sur-le-Doubs.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Loyte',
      blazon: "D'azur à un agneau pascal d'argent onglé d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Blason_famille_Loyte.svg/120px-Blason_famille_Loyte.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Luc',
      blazon: "D'azur au sautoir haussé d'or accompagné en pointe d'un croissant d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Blason_Claude_Luc_%28c.1510-1590%29.svg/120px-Blason_Claude_Luc_%28c.1510-1590%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Luxeul',
      blazon: "D'azur au soleil d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/Blason-azur-soleil-or.svg/120px-Blason-azur-soleil-or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "Macon d'Esboz",
      blazon: "Parti d'or et d'argent ; au sautoir engrêlé de gueules brochant sur le tout.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/34/Blason_famille_de_M%C3%A2con_d%27Esboz.svg/120px-Blason_famille_de_M%C3%A2con_d%27Esboz.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Maisod',
      blazon: "De gueules à deux épées d'argent passées en sautoir.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Blason_famille_de_Maisod_%28Franche-Comt%C3%A9%29.svg/120px-Blason_famille_de_Maisod_%28Franche-Comt%C3%A9%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Mareschal',
      blazon:
        "D'argent à la bande d'azur chargée de trois étoiles d'or et accompagnée de deux grappes de raisin de pourpre, feuillées et tigées de sinople, celle de la pointe ayant la queue en bas.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e5/Blason_famille_de_Charentenay.svg/120px-Blason_famille_de_Charentenay.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Marmier',
      blazon: "De gueules à une marmotte rampante d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/33/Blason_fam_fr_Marmier_%28de%29.svg/120px-Blason_fam_fr_Marmier_%28de%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Marnay',
      blazon: "De sable au soleil d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Blason_Marnay.svg/120px-Blason_Marnay.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "Masson d'Ivrey",
      blazon: "De gueules à trois maillets d'or, posés 2 et 1.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/Blason_famille_de_Mailly_%28Bourgogne%29.svg/120px-Blason_famille_de_Mailly_%28Bourgogne%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Matal',
      blazon: "D'azur à un éléphant passant d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Blason_Jean_Matal_%281510-1597%29.svg/120px-Blason_Jean_Matal_%281510-1597%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Molpré',
      blazon:
        "De gueules au chevron d'argent chargé de trois trèfles tigés de sinople et brisé d'un croissant d'or en pointe.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Blason_ville_fr_Molpr%C3%A9_%28Jura%29.svg/120px-Blason_ville_fr_Molpr%C3%A9_%28Jura%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Monnier de Noironte',
      blazon: "D'azur à la bande d'or accompagnée de deux besants de même.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/Blason_famille_Monnier_de_Noironte_%28Franche-Comt%C3%A9%29.svg/120px-Blason_famille_Monnier_de_Noironte_%28Franche-Comt%C3%A9%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Mont-Saint-Léger',
      blazon: "D'argent à la croix ancrée de sable.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6a/Blason-argent-croix-ancr%C3%A9e-sable.svg/120px-Blason-argent-croix-ancr%C3%A9e-sable.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Montagu-Boutavant',
      blazon: "De gueules au croissant d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Blason_famille_de_Montaigu_%28Franche-Comt%C3%A9%29.svg/120px-Blason_famille_de_Montaigu_%28Franche-Comt%C3%A9%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Montaigu',
      blazon: "De gueules à l'aigle d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Blason_Bourgogne-comt%C3%A9_ancien%28aigle%29.svg/120px-Blason_Bourgogne-comt%C3%A9_ancien%28aigle%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Maison de Montbéliard',
      blazon: "De gueules à deux bars adossés d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ec/Blason_comt%C3%A9_de_Montb%C3%A9liard.svg/120px-Blason_comt%C3%A9_de_Montb%C3%A9liard.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Montfaucon',
      blazon: "De gueules à deux bars adossés d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Blason_ville_fr_Montfaucon_Doubs.svg/120px-Blason_ville_fr_Montfaucon_Doubs.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Montgesoye',
      blazon:
        "De gueules, au chef d'or émanché de quatre pièces chargées chacune d'une croisette recroisetée de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/Blason_Montgesoye.svg/120px-Blason_Montgesoye.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Maison de Montjoie',
      blazon: "De gueules à la clef d'or mise en pal.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Blason-gueules-clef-or.svg/120px-Blason-gueules-clef-or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Montmirey',
      blazon: "Burelé d'argent et de sable ; au lion brochant de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Blason_Montmirey-la-Ville.svg/120px-Blason_Montmirey-la-Ville.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Montrichard',
      blazon: 'De vair à une croix de gueules.',
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Blason_famille_de_Montrichard_%28Franche-Comt%C3%A9%29.svg/120px-Blason_famille_de_Montrichard_%28Franche-Comt%C3%A9%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Montrond',
      blazon: "De gueules au chevron d'argent accompagné de trois besants d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Blason_Montrond.svg/120px-Blason_Montrond.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Montrost',
      blazon: "D'or au chevron de sable.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Blason-or-chevron-sable.svg/120px-Blason-or-chevron-sable.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Montureux-sur-Saône',
      blazon: "D'or à une bande d'azur.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Blason_ville_fr_Montureux-l%C3%A8s-Baulay_70.svg/120px-Blason_ville_fr_Montureux-l%C3%A8s-Baulay_70.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Mouchet de Battefort de Laubespin',
      blazon:
        "Écartelé : aux 1 et 4 d'azur au sautoir d'or accompagné de quatre billettes du même ; aux 2 et 3 de gueules à l'épée d'argent ; sur le tout de gueules à la fasce d'argent, accompagnée de trois émouchets d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Blason_famille_fr_Mouchet_de_Battefort_de_Laubespin.svg/120px-Blason_famille_fr_Mouchet_de_Battefort_de_Laubespin.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Moustier',
      blazon: "De gueules au chevron d'argent accompagné de trois aiglettes d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Blason_famille_fr_de_Moustier.svg/120px-Blason_famille_fr_de_Moustier.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Nancuise',
      blazon: "D'or à la bande componée d'azur et de sable.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/Blason_ville_fr_Nancuise_%28Jura%29.svg/120px-Blason_ville_fr_Nancuise_%28Jura%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Neuchâtel',
      blazon: "D'or à un pal de gueules chevronné de trois pièces d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/29/Blason_Comtes_de_Neuch%C3%A2tel_%28Neubourg%29.svg/120px-Blason_Comtes_de_Neuch%C3%A2tel_%28Neubourg%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Neufchâtel',
      blazon: "De gueules à la bande d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Blason-gueules-bande-argent.svg/120px-Blason-gueules-bande-argent.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Oiselay",
      blazon: "De gueules à la bande vivrée d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e9/Blason_ville_fr_Oiselay-et-Grachaux_70.svg/120px-Blason_ville_fr_Oiselay-et-Grachaux_70.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Orchamps",
      blazon: "De gueules au chevron d'or accompagné de trois étoiles de même.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c0/Blason-gueules-chevron-or-3-%C3%A9toiles.svg/120px-Blason-gueules-chevron-or-3-%C3%A9toiles.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Oricourt",
      blazon: "D'argent à trois jumelles de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Blason-argent-3-jumelles-gueules.svg/120px-Blason-argent-3-jumelles-gueules.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: "D'Orsans",
      blazon: "D'argent au sautoir de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/Type_pi%C3%A8ce_Sautoir.svg/120px-Type_pi%C3%A8ce_Sautoir.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De La Palud',
      blazon: "De gueules à la croix d'hermine.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Blason_Famille_de_La_Palud.svg/120px-Blason_Famille_de_La_Palud.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Patornay du Fied',
      blazon: "D'azur à trois croissants d'or 2 et 1, et une quintefeuille de même en cœur.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/Blason_ville_fr_Patornay_%28Jura%29.svg/120px-Blason_ville_fr_Patornay_%28Jura%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Pernot',
      blazon: "D'azur à trois poires d'or tigées et feuillées de même.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Blason-azur-3-poires-or.svg/120px-Blason-azur-3-poires-or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Perrenot de Granvelle',
      blazon:
        "D'argent à trois bandes de sable ; au chef cousu d'Empire (d'or à l'aigle éployée de sable).",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/Blason_famille_Perrenot_de_Granvelle.svg/120px-Blason_famille_Perrenot_de_Granvelle.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Pillot',
      blazon: "D'azur à trois fers de pique d'argent la pointe en bas posés 2 et 1.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/Blason_de_la_famille_de_Pillot.svg/120px-Blason_de_la_famille_de_Pillot.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Du Pin',
      blazon: "D'argent à la fasce de gueules chargée d'un lion naissant d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/Blason_Pin_%28Le%29.svg/120px-Blason_Pin_%28Le%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Plaine',
      blazon: "De gueules à la fasce d'argent sommée de trois grelots de même rangés en fasce.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/76/Blason-plasne.svg/120px-Blason-plasne.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De La Platière',
      blazon: "D'argent au chevron de gueules accompagné de trois anilles de sable.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/LaPlatiere_ancien_reflet.svg/120px-LaPlatiere_ancien_reflet.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Poitiers',
      blazon: "D'azur, à six besants d'argent ; au chef d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e9/Blason_maison_fr_de_Poitiers-Valentinois.svg/120px-Blason_maison_fr_de_Poitiers-Valentinois.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Poligny',
      blazon: "De gueules au chevron d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Blason_famille_de_Poligny_%28Franche-Comt%C3%A9%29.svg/120px-Blason_famille_de_Poligny_%28Franche-Comt%C3%A9%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Pontailler',
      blazon: "De gueules au lion d'or couronné de même, armé et lampassé d'azur.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/19/Blason_famille_de_Champlitte-Pontailler.svg/120px-Blason_famille_de_Champlitte-Pontailler.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Poupet',
      blazon:
        "D'or au chevron brisé d'azur, accompagné de trois perroquets de sinople becqués et membrés de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Blason_Jean_de_Poupet_%281512-1564%29.svg/120px-Blason_Jean_de_Poupet_%281512-1564%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Precipiano',
      blazon: "De gueules à une épée d'argent pommetée d'or posée en fasce, la pointe à dextre.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/Ecu-famille-Precipiano.svg/120px-Ecu-famille-Precipiano.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Présentevillers',
      blazon: "Chevronné d'or et de gueules de six pièces.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ec/Chevronny_or_and_gules.svg/120px-Chevronny_or_and_gules.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Prost de Lacuzon',
      blazon:
        "Coupé de gueules et d'azur, au souci d'or sur les gueules et à l'épée d'argent en pal sur l'azur.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/34/Blason_Claude_Prost_%28Lacuzon%29.svg/120px-Blason_Claude_Prost_%28Lacuzon%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Pusel de Boursières',
      blazon: "D'azur à trois fasces ondées d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Blason-azur-3-fasces-ond%C3%A9es-or.svg/120px-Blason-azur-3-fasces-ond%C3%A9es-or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Quingey',
      blazon: "D'azur à la croix d'argent chargée de cinq coquilles de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/Blason_famille_de_Quingey.svg/120px-Blason_famille_de_Quingey.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Raincourt',
      blazon:
        "De gueules à la croix d'or cantonnée de dix-huit billettes de même, dix en chef, huit en pointe.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Blason_de_la_famille_de_de_Raincourt.svg/120px-Blason_de_la_famille_de_de_Raincourt.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Rance de Guiseul',
      blazon: "D'azur au croissant d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Blason-azur-croissant-argent.svg/120px-Blason-azur-croissant-argent.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Raulin',
      blazon: "De gueules à trois clefs d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Blason-gueules-3-clefs-or.svg/120px-Blason-gueules-3-clefs-or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Ray',
      blazon: "De gueules à un rais d'escarboucle d'or, pommeté et fleuronné de même.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Blason_Jean_de_Ray.svg/120px-Blason_Jean_de_Ray.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Renard de Bermont',
      blazon:
        "D'azur à une ancre d'argent, accompagnée de deux dauphins renversés d'argent, mordant les branches de l'ancre et passés en sautoir ; au chef triangulaire d'or chargé d'une aigle éployée d'azur.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/92/Blason_Simon_Renard_de_Bermont_%281513-1573%29.svg/120px-Blason_Simon_Renard_de_Bermont_%281513-1573%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Richardot',
      blazon: "D'azur à deux palmes d'or mises en sautoir, cantonnées de quatre étoiles de même.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Blason_famille_Richardot_%28Franche-Comt%C3%A9%29.svg/120px-Blason_famille_Richardot_%28Franche-Comt%C3%A9%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Rochefort',
      blazon:
        "D'azur semé de billettes d'or ; au chef d'argent chargé d'un lion léopardé de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Blason_ville_fr_Billey_%28C%C3%B4te-d%27Or%29.svg/120px-Blason_ville_fr_Billey_%28C%C3%B4te-d%27Or%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Ronchamp',
      blazon: "De gueules à trois cotices d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Blason_de_Miles_de_Ronchamp.svg/120px-Blason_de_Miles_de_Ronchamp.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Rougemont',
      blazon: "D'or à l'aigle de gueules, becquée, membrée et couronnée d'azur.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/19/Blason_Rougemont_%28Doubs%29.svg/120px-Blason_Rougemont_%28Doubs%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Roulans',
      blazon: "De gueules à la bande d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Blason_ville_fr_Roulans_25.svg/120px-Blason_ville_fr_Roulans_25.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Le Roy de Lisa de Chateaubrun',
      blazon:
        "Écartelé : aux 1 et 4, échiqueté d'argent et de gueules (de Forges de Chateaubrun) ; aux 2 et 3, de Montmorency ; sur le tout, d'argent au chevron de gueules accompagné en chef de deux merlettes de sable et en pointe d'un lion de gueules, au chef d'azur chargé de trois étoiles d'or (Le Roy).",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/Blason_famille_fr_Le_Roy_de_Lisa_de_Chateaubrun.svg/120px-Blason_famille_fr_Le_Roy_de_Lisa_de_Chateaubrun.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Rupt',
      blazon:
        "D'azur à la bande d'or accompagnée de sept croisettes fleuronnées et fichées de même.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Blason_ville_fr_Rupt-sur-Sa%C3%B4ne_70.svg/120px-Blason_ville_fr_Rupt-sur-Sa%C3%B4ne_70.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Rye',
      blazon: "D'azur à l'aigle d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/Blason_Rye.svg/120px-Blason_Rye.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Sagey',
      blazon: "D'azur à la croix ancrée d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a1/Blason-azur-croix-ancr%C3%A9e-or.svg/120px-Blason-azur-croix-ancr%C3%A9e-or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Saint-Amour',
      blazon: "D'argent au lion de sable armé et couronné d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Blason_alias_Saint-Amour.svg/120px-Blason_alias_Saint-Amour.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Saint-Germain',
      blazon: "De gueules au chevron d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/Blason-gueules-chevron-argent.svg/120px-Blason-gueules-chevron-argent.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Saint-Germain',
      blazon: "D'or à la fasce de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/Blason-or-fasce-gueules.svg/120px-Blason-or-fasce-gueules.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Saint-Julien',
      blazon: "De gueules à trois jumelles d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Blason_Famille_de_Saint-Julien.svg/120px-Blason_Famille_de_Saint-Julien.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Saint-Mauris en Montagne',
      blazon: "De sable à deux fasces d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Blason_famille_fr_de_Saint-Mauris.svg/120px-Blason_famille_fr_de_Saint-Mauris.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Saint-Moris-Salins',
      blazon:
        "De gueules au chevron d'argent accompagné de deux étoiles en chef et d'une rose de même en pointe.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Blason_Saint-Maurice-Crillat.svg/120px-Blason_Saint-Maurice-Crillat.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Sainte-Colombe',
      blazon: "Écartelé d'argent et d'azur.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/Blason-%C3%A9cartel%C3%A9-argent-azur.svg/120px-Blason-%C3%A9cartel%C3%A9-argent-azur.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Salins',
      blazon: "D'or à la bande de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/Blason_Salins-les-Bains.svg/120px-Blason_Salins-les-Bains.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Salins-la-Bande',
      blazon: "De gueules à la bande d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Blason-gueules-bande-or.svg/120px-Blason-gueules-bande-or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Salins-Vincelles',
      blazon: "D'azur à trois fusées d'or rangées en fasce.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Blason-azur-3-fus%C3%A9es-or-fasce.svg/120px-Blason-azur-3-fus%C3%A9es-or-fasce.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Scey',
      blazon:
        "De sable au lion d'or couronné de même, armé et lampassé de gueules, avec neuf croisettes recroisetées au pied fiché d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Blason_famille_de_Scey-Montb%C3%A9liard_%28Franche-Comt%C3%A9%29.svg/120px-Blason_famille_de_Scey-Montb%C3%A9liard_%28Franche-Comt%C3%A9%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Tartarin',
      blazon: "D'argent à trois têtes de Maure de sable tortillées d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Blason-argent-3-t%C3%AAtes-de-Maure.svg/120px-Blason-argent-3-t%C3%AAtes-de-Maure.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Thurey',
      blazon: "De gueules au sautoir d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/Blason_de_gueules_au_sautoir_d%27or.svg/120px-Blason_de_gueules_au_sautoir_d%27or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Tissot',
      blazon: "D'azur au sautoir engrêlé d'or, chargé en cœur d'une rose d'azur.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/Blason_famille_Tissot_de_la_Barre_de_M%C3%A9rona.svg/120px-Blason_famille_Tissot_de_la_Barre_de_M%C3%A9rona.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Tranchant de Borrey',
      blazon:
        "D'azur au dauphin d'argent couronné d'or ; au chef d'argent chargé de trois mouchetures d'hermine de sable.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/Blason_duTranchant-deLaVerne.svg/120px-Blason_duTranchant-deLaVerne.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Trévillers',
      blazon: "D'azur à deux bars adossés d'argent accompagnés en chef d'une croisette de même.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/82/Blason_ville_fr_Tr%C3%A9villers_25.svg/120px-Blason_ville_fr_Tr%C3%A9villers_25.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Vandenesse',
      blazon:
        "D'or à quatre pals de gueules, au chevron d'argent brochant sur le tout ; au chef d'Empire (d'or à une aigle éployée de sable).",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Blason_de_la_ville_de_Vandenesse-en-Auxois_%28C%C3%B4te-d%27Or%29.svg/120px-Blason_de_la_ville_de_Vandenesse-en-Auxois_%28C%C3%B4te-d%27Or%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Vaudrey',
      blazon: "De gueules émanché d'argent de deux pièces.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Blason_fr_famille_de_Vaudrey_%28Doubs%29.svg/120px-Blason_fr_famille_de_Vaudrey_%28Doubs%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Vaulchier du Deschaux',
      blazon: "D'azur au chevron d'or accompagné de trois étoiles de même.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/Blason-azur-chevron-or-3-%C3%A9toiles.svg/120px-Blason-azur-chevron-or-3-%C3%A9toiles.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Vaux',
      blazon: "D'azur à trois bonnets ou chapeaux d'Albanais d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Blason_Vaux-sur-Poligny.svg/120px-Blason_Vaux-sur-Poligny.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Vennes',
      blazon: "De gueules à la fasce d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Blason-gueules-fasce-or.svg/120px-Blason-gueules-fasce-or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Vercel',
      blazon: "D'azur à trois bandes d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e2/Blason-azur-3-bandes-or.svg/120px-Blason-azur-3-bandes-or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Vergy',
      blazon: "De gueules à trois quintefeuilles percées d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Blason_maison_fr_de_Vergy.svg/120px-Blason_maison_fr_de_Vergy.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De La Verne',
      blazon: "De gueules au lambel d'or à deux pendants.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/Blason_famille_fr_de_la_Verne.svg/120px-Blason_famille_fr_de_la_Verne.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Du Vernois',
      blazon: "De gueules émanché de deux pièces d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Blason_Le_Vernois.svg/120px-Blason_Le_Vernois.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Maison de Vienne',
      blazon: "De gueules à l'aigle d'or.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Blason_famille_fr_De_Vienne.svg/120px-Blason_famille_fr_De_Vienne.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'Vigoureux',
      blazon: "D'azur à trois poires feuillées d'or, la queue en haut.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Blason-azur-3-poires-or.svg/120px-Blason-azur-3-poires-or.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Villers',
      blazon: "D'or à la fasce de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Blason_famille_fr_de_Villers-la-Faye.svg/120px-Blason_famille_fr_de_Villers-la-Faye.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Villey',
      blazon:
        "Coupé : en chef échiqueté d'or et de gueules, au franc-quartier d'argent chargé d'une merlette de sable ; en pointe, d'azur à trois quintefeuilles d'argent.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ea/Blason_Villey.svg/120px-Blason_Villey.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Watteville',
      blazon: "De gueules à trois demi-vols d'argent 2 et 1.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Blason_famille_de_Watteville_%28Wattenwyl%29.svg/120px-Blason_famille_de_Watteville_%28Wattenwyl%29.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
    {
      name: 'De Wiltz',
      blazon: "D'or au chef de gueules.",
      image:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Armoiries_de_Wiltz_1.svg/120px-Armoiries_de_Wiltz_1.svg.png?utm_source=fr.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    },
  ],
};
