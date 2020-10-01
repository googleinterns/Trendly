import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

const EMPTY_STR = '';
const COUNTRY_CODES: Object = {
  'Albania': 'AL',
  'Algeria': 'DZ',
  'Angola': 'AO',
  'Anguilla': 'AI',
  'Antigua and Barbuda': 'AG',
  'Argentina': 'AR',
  'Armenia': 'AM',
  'Australia': 'AU',
  'Austria': 'AT',
  'Azerbaijan': 'AZ',
  'Bahamas': 'BS',
  'Bahrain': 'BH',
  'Barbados': 'BB',
  'Belarus': 'BY',
  'Belgium': 'BE',
  'Belize': 'BZ',
  'Benin': 'BJ',
  'Bermuda': 'BM',
  'Bhutan': 'BT',
  'Bolivia': 'BO',
  'Botswana': 'BW',
  'Brazil': 'BR',
  'British Virgin Islands': 'VG',
  'Brunei': 'BN',
  'Bulgaria': 'BG',
  'Burkina Faso': 'BF',
  'Cambodia': 'KH',
  'Canada': 'CA',
  'Cape Verde': 'CV',
  'Cayman Islands': 'KY',
  'Chad': 'TD',
  'Chile': 'CL',
  'China': 'CN',
  'Colombia': 'CO',
  'Costa Rica': 'CR',
  'Croatia': 'HR',
  'Cyprus': 'CY',
  'Czech Republic': 'CZ',
  'Denmark': 'DK',
  'Dominica': 'DM',
  'Dominican Republic': 'DO',
  'Ecuador': 'EC',
  'Egypt': 'EG',
  'El Salvador': 'SV',
  'Estonia': 'EE',
  'Federated States Of Micronesia': 'FM',
  'Fiji': 'FJ',
  'Finland': 'FI',
  'France': 'FR',
  'Gambia': 'GM',
  'Germany': 'DE',
  'Ghana': 'GH',
  'Greece': 'GR',
  'Grenada': 'GD',
  'Guatemala': 'GT',
  'Guinea-Bissau': 'GW',
  'Guyana': 'GY',
  'Honduras': 'HN',
  'Hong Kong': 'HK',
  'Hungary': 'HU',
  'Iceland': 'IS',
  'India': 'IN',
  'Indonesia': 'ID',
  'Ireland': 'IE',
  'Israel': 'IL',
  'Italy': 'IT',
  'Jamaica': 'JM',
  'Japan': 'JP',
  'Jordan': 'JO',
  'Kazakstan': 'KZ',
  'Kenya': 'KE',
  'Kuwait': 'KW',
  'Kyrgyzstan': 'KG',
  'Lao People’s Democratic Republic': 'LA',
  'Latvia': 'LV',
  'Lebanon': 'LB',
  'Liberia': 'LR',
  'Lithuania': 'LT',
  'Luxembourg': 'LU',
  'Macau': 'MO',
  'Macedonia': 'MK',
  'Madagascar': 'MG',
  'Malawi': 'MW',
  'Malaysia': 'MY',
  'Mali': 'ML',
  'Malta': 'MT',
  'Mauritania': 'MR',
  'Mauritius': 'MU',
  'Mexico': 'MX',
  'Mongolia': 'MN',
  'Montserrat': 'MS',
  'Mozambique': 'MZ',
  'Namibia': 'NA',
  'Nepal': 'NP',
  'Netherlands': 'NL',
  'New Zealand': 'NZ',
  'Nicaragua': 'NI',
  'Niger': 'NE',
  'Nigeria': 'NG',
  'Norway': 'NO',
  'Oman': 'OM',
  'Pakistan': 'PK',
  'Palau': 'PW',
  'Panama': 'PA',
  'Papua New Guinea': 'PG',
  'Paraguay': 'PY',
  'Peru': 'PE',
  'Philippines': 'PH',
  'Poland': 'PL',
  'Portugal': 'PT',
  'Qatar': 'QA',
  'Republic Of Congo': 'CG',
  'Republic Of Korea': 'KR',
  'Republic Of Moldova': 'MD',
  'Romania': 'RO',
  'Russia': 'RU',
  'Sao Tome and Principe': 'ST',
  'Saudi Arabia': 'SA',
  'Senegal': 'SN',
  'Seychelles': 'SC',
  'Sierra Leone': 'SL',
  'Singapore': 'SG',
  'Slovakia': 'SK',
  'Slovenia': 'SI',
  'Solomon Islands': 'SB',
  'South Africa': 'ZA',
  'Spain': 'ES',
  'Sri Lanka': 'LK',
  'St. Kitts and Nevis': 'KN',
  'St. Lucia': 'LC',
  'St. Vincent and The Grenadines': 'VC',
  'Suriname': 'SR',
  'Swaziland': 'SZ',
  'Sweden': 'SE',
  'Switzerland': 'CH',
  'Taiwan': 'TW',
  'Tajikistan': 'TJ',
  'Tanzania': 'TZ',
  'Thailand': 'TH',
  'Trinidad and Tobago': 'TT',
  'Tunisia': 'TN',
  'Turkey': 'TR',
  'Turkmenistan': 'TM',
  'Turks and Caicos': 'TC',
  'Uganda': 'UG',
  'Ukraine': 'UA',
  'United Arab Emirates': 'AE',
  'United Kingdom': 'GB',
  'United States': 'US',
  'Uruguay': 'UY',
  'Uzbekistan': 'UZ',
  'Venezuela': 'VE',
  'Vietnam': 'VN',
  'Yemen': 'YE',
  'Zimbabwe': 'ZW'
}

/**
 * responsibeles for the country input.
 */
@Component({
  selector: 'app-country-input',
  templateUrl: './country-input.component.html',
  styleUrls: ['./country-input.component.css']
}) export class CountryInputComponent implements OnInit {
  @Output() emitter = new EventEmitter<string>();
  countryValue: string = '';
  myControl = new FormControl();
  options = Object.keys(COUNTRY_CODES);
  filteredOptions: Observable<string[]>;

  constructor() {}

  /**
   * called on init and initiallizes the filteredOptions variable.
   */
  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''), map(value => this._filter(value)));
  }

  /**
   * filter forthe options.
   * @param value
   */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(
        option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  /**
   * emit to parent component the country name while the input value changes.
   */
  emitCountry(): void {
    const countryCode = this.countryValue === EMPTY_STR ?
        EMPTY_STR :
        COUNTRY_CODES[this.countryValue];
    this.emitter.emit(countryCode);
  }

  /**
   * emit to parent component the country name while the input value selected
   * from the options list.
   */
  updateAndemitCountry(newCountry: string): void {
    this.countryValue = newCountry;
    const countryCode = COUNTRY_CODES[this.countryValue] || EMPTY_STR;
    this.emitter.emit(countryCode);
  }
}
