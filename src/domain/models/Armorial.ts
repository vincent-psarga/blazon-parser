export type ArmorialSource = {
  name: string;
  url: string;
};

export type ArmorialEntry = {
  name: string;
  blazon: string;
  image: string;
  source?: ArmorialSource;
};

export type Armorial = {
  name: string;
  slug: string;
  language: 'french' | 'english';
  source?: ArmorialSource;
  licence?: string;
  entries: ArmorialEntry[];
};
