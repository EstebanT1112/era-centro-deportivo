export interface HomeContent {
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
}

export interface ClubServiceContent {
  id: string;
  title: string;
  description: string;
}

export interface ClubContent {
  introTitle: string;
  introText: string;
  history: string;
  images: string[];
  serviceIds: string[];
}

export interface SiteContent {
  home: HomeContent;
  club: ClubContent;
  services: ClubServiceContent[];
}
