import { Globe, GlobeLock } from 'lucide-react';
import type { ComponentType } from 'react';

export interface Country {
  name: string;
  areaCode: string;
  phoneCode: string;
  flagUrl?: string;
  icon?: ComponentType<{ className?: string }>;
}

export const COUNTRIES: Country[] = [
  {
    name: 'Worldwide / Remote',
    areaCode: 'WW',
    phoneCode: '',
    flagUrl: 'https://flagcdn.com/w40/un.png',
    // icon: GlobeLock
  },
  {
    name: 'Nigeria',
    areaCode: 'NG',
    phoneCode: '+234',
    flagUrl: 'https://flagcdn.com/w40/ng.png'
  },
  {
    name: 'Ghana',
    areaCode: 'GH',
    phoneCode: '+233',
    flagUrl: 'https://flagcdn.com/w40/gh.png'
  },
  {
    name: "United States",
    areaCode: "US",
    phoneCode: "+1",
    flagUrl: "https://flagcdn.com/w40/us.png"
  },
  {
    name: "United Kingdom",
    areaCode: "GB",
    phoneCode: "+44",
    flagUrl: "https://flagcdn.com/w40/gb.png"
  },
  {
    name: "Canada",
    areaCode: "CA",
    phoneCode: "+1",
    flagUrl: "https://flagcdn.com/w40/ca.png"
  },
  {
    name: "France",
    areaCode: "FR",
    phoneCode: "+33",
    flagUrl: "https://flagcdn.com/w40/fr.png"
  },
  {
    name: "Germany",
    areaCode: "DE",
    phoneCode: "+49",
    flagUrl: "https://flagcdn.com/w40/de.png"
  },
  {
    name: "Netherlands",
    areaCode: "NL",
    phoneCode: "+31",
    flagUrl: "https://flagcdn.com/w40/nl.png"
  },
  {
    name: "Belgium",
    areaCode: "BE",
    phoneCode: "+32",
    flagUrl: "https://flagcdn.com/w40/be.png"
  },
  {
    name: "Spain",
    areaCode: "ES",
    phoneCode: "+34",
    flagUrl: "https://flagcdn.com/w40/es.png"
  },
  {
    name: "Italy",
    areaCode: "IT",
    phoneCode: "+39",
    flagUrl: "https://flagcdn.com/w40/it.png"
  },
  {
    name: "Portugal",
    areaCode: "PT",
    phoneCode: "+351",
    flagUrl: "https://flagcdn.com/w40/pt.png"
  },
  {
    name: "Austria",
    areaCode: "AT",
    phoneCode: "+43",
    flagUrl: "https://flagcdn.com/w40/at.png"
  },
  {
    name: "Switzerland",
    areaCode: "CH",
    phoneCode: "+41",
    flagUrl: "https://flagcdn.com/w40/ch.png"
  },
  {
    name: "United Arab Emirates",
    areaCode: "AE",
    phoneCode: "+971",
    flagUrl: "https://flagcdn.com/w40/ae.png"
  },
  {
    name: "Qatar",
    areaCode: "QA",
    phoneCode: "+974",
    flagUrl: "https://flagcdn.com/w40/qa.png"
  },
  {
    name: "Saudi Arabia",
    areaCode: "SA",
    phoneCode: "+966",
    flagUrl: "https://flagcdn.com/w40/sa.png"
  },
  {
    name: "Türkiye",
    areaCode: "TR",
    phoneCode: "+90",
    flagUrl: "https://flagcdn.com/w40/tr.png"
  },
  {
    name: "South Africa",
    areaCode: "ZA",
    phoneCode: "+27",
    flagUrl: "https://flagcdn.com/w40/za.png"
  },
  {
    name: "Kenya",
    areaCode: "KE",
    phoneCode: "+254",
    flagUrl: "https://flagcdn.com/w40/ke.png"
  },
  {
    name: "Uganda",
    areaCode: "UG",
    phoneCode: "+256",
    flagUrl: "https://flagcdn.com/w40/ug.png"
  },
  {
    name: "Rwanda",
    areaCode: "RW",
    phoneCode: "+250",
    flagUrl: "https://flagcdn.com/w40/rw.png"
  },
  {
    name: "Tanzania",
    areaCode: "TZ",
    phoneCode: "+255",
    flagUrl: "https://flagcdn.com/w40/tz.png"
  },
  {
    name: "Egypt",
    areaCode: "EG",
    phoneCode: "+20",
    flagUrl: "https://flagcdn.com/w40/eg.png"
  },
  {
    name: "Morocco",
    areaCode: "MA",
    phoneCode: "+212",
    flagUrl: "https://flagcdn.com/w40/ma.png"
  },
  {
    name: "India",
    areaCode: "IN",
    phoneCode: "+91",
    flagUrl: "https://flagcdn.com/w40/in.png"
  },
  {
    name: "Singapore",
    areaCode: "SG",
    phoneCode: "+65",
    flagUrl: "https://flagcdn.com/w40/sg.png"
  },
  {
    name: "Japan",
    areaCode: "JP",
    phoneCode: "+81",
    flagUrl: "https://flagcdn.com/w40/jp.png"
  },
  {
    name: "South Korea",
    areaCode: "KR",
    phoneCode: "+82",
    flagUrl: "https://flagcdn.com/w40/kr.png"
  },
  {
    name: "China",
    areaCode: "CN",
    phoneCode: "+86",
    flagUrl: "https://flagcdn.com/w40/cn.png"
  },
  {
    name: "Hong Kong",
    areaCode: "HK",
    phoneCode: "+852",
    flagUrl: "https://flagcdn.com/w40/hk.png"
  },
  {
    name: "Thailand",
    areaCode: "TH",
    phoneCode: "+66",
    flagUrl: "https://flagcdn.com/w40/th.png"
  },
  {
    name: "Australia",
    areaCode: "AU",
    phoneCode: "+61",
    flagUrl: "https://flagcdn.com/w40/au.png"
  },
  {
    name: "New Zealand",
    areaCode: "NZ",
    phoneCode: "+64",
    flagUrl: "https://flagcdn.com/w40/nz.png"
  }
];