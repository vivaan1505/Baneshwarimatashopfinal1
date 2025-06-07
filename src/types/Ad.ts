export type AdProvider =
  | 'Google AdSense'
  | 'Meta Pixel'
  | 'Ezoic'
  | 'Mediavine'
  | 'AdThrive'
  | 'Monumetric'
  | 'Media.net'
  | 'PropellerAds'
  | 'RevenueHits'
  | 'SHE Media'
  | 'Playwire'
  | 'Newor Media'
  | 'Freestar'
  | 'Sortable'
  | 'AdPushup'
  | 'Bidvertiser'
  | 'Infolinks'
  | 'Amazon Publisher Services'
  | 'Index Exchange'
  | 'OpenX'
  | 'AppNexus'
  | 'Primis'
  | 'Custom';

export type AdType =
  | 'banner'
  | 'in-article'
  | 'in-feed'
  | 'multiplex'
  | 'pixel'
  | 'script'
  | 'analytics'
  | 'tag'
  | 'video'
  | 'other';

export interface Ad {
  id: string;
  name: string;
  provider: AdProvider;
  ad_type: AdType;
  status: 'active' | 'hidden' | 'deleted';
  device_types: ('desktop' | 'mobile')[];
  placement: string;
  script_code: string; // The full ad/script to inject
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}