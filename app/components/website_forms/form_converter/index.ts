import XLSX from 'xlsx';
import moment from 'moment';
import get from 'lodash/get';
import fields from './fields';

const formConverter = ({ forms, fields }) => {
  const converted = forms.map((f) => {
    const res: { [key: string]: string | number } = {};
    const { calculator: { customerType } } = f;
    const prefixes = {
      '': '',
      herr: 'Herr',
      frau: 'Frau',
      keineAngabe: 'Keine Angabe',
    };
    const formatNumber = number => new Intl.NumberFormat('de-DE').format(number);

    if (get(f, 'oldSupplier.type') === 'move') {
      res.Transaktionsgrund = 'E01';
      res.Einzugsdatum = moment(get(f, 'oldSupplier.deliveryStart', '')).format('DD.MM.YYYY');
    }
    if (get(f, 'oldSupplier.type') === 'change') res.Transaktionsgrund = 'E03';

    if (customerType === 'person') {
      const billingAddress = get(f, 'address.person.billingAddress.anotherAddress')
        ? 'billingAddress'
        : 'shippingAddress';
      res['RA Straße'] = get(f, `address.person.${billingAddress}.street`, '');
      res['RA Hausnummer'] = get(f, `address.person.${billingAddress}.houseNum`, '');
      res['RA Postleitzahl'] = get(f, `address.person.${billingAddress}.zip`, '');
      res['RA Ort'] = get(f, `address.person.${billingAddress}.city`, '');
      res['RA Telefon privat'] = get(f, 'personalInfo.person.phone', '');
      res['RA E-Mailadresse'] = get(f, 'personalInfo.person.email', '');

      if (get(f, 'address.person.billingAddress.anotherAddress')) {
        res['RA Anrede'] = prefixes[get(f, 'address.person.billingAddress.prefix', '')];
        res['RA Titel'] = get(f, 'address.person.billingAddress.title', '');
        res['RA Vorname'] = get(f, 'address.person.billingAddress.firstName', '');
        res['RA Nachname'] = get(f, 'address.person.billingAddress.lastName', '');

        res['LS Vorname '] = get(f, 'personalInfo.person.firstName', '');
        res['LS Nachname'] = get(f, 'personalInfo.person.lastName', '');
        res['LS Straße'] = get(f, 'address.person.shippingAddress.street', '');
        res['LS Hausnummer'] = get(f, 'address.person.shippingAddress.houseNum', '');
        res['LS PLZ'] = get(f, 'address.person.shippingAddress.zip', '');
        res['LS Ort'] = get(f, 'address.person.shippingAddress.city', '');
      } else {
        res['RA Anrede'] = prefixes[get(f, 'personalInfo.person.prefix', '')];
        res['RA Titel'] = get(f, 'personalInfo.person.title', '');
        res['RA Vorname'] = get(f, 'personalInfo.person.firstName', '');
        res['RA Nachname'] = get(f, 'personalInfo.person.lastName', '');

        res['LS Vorname '] = res['RA Vorname'];
        res['LS Nachname'] = res['RA Nachname'];
        res['LS Straße'] = res['RA Straße'];
        res['LS Hausnummer'] = res['RA Hausnummer'];
        res['LS PLZ'] = res['RA Postleitzahl'];
        res['LS Ort'] = res['RA Ort'];
      }
    }

    if (customerType === 'organization') {
      res['RA Firma'] = get(f, 'personalInfo.organization.contractingParty.name', '');
      res['RA Anrede'] = prefixes[get(f, 'personalInfo.organization.contactPerson.prefix', '')];
      res['RA Titel'] = get(f, 'personalInfo.organization.contactPerson.title', '');
      res['RA Vorname'] = get(f, 'personalInfo.organization.contactPerson.firstName', '');
      res['RA Nachname'] = get(f, 'personalInfo.organization.contactPerson.lastName', '');

      res['RA Straße'] = get(f, 'personalInfo.organization.contractingParty.street', '');
      res['RA Hausnummer'] = get(f, 'personalInfo.organization.contractingParty.houseNum', '');
      res['RA Postleitzahl'] = get(f, 'personalInfo.organization.contractingParty.zip', '');
      res['RA Ort'] = get(f, 'personalInfo.organization.contractingParty.city', '');
      res['RA Telefon privat'] = get(f, 'personalInfo.organization.contactPerson.phone', '');
      res['RA E-Mailadresse'] = get(f, 'personalInfo.organization.contactPerson.email', '');

      if (get(f, 'address.organization.shippingAddress.sameAddress')) {
        res['LS Vorname '] = res['RA Vorname'];
        res['LS Nachname'] = res['RA Nachname'];
        res['LS Firma'] = res['RA Firma'];
        res['LS Straße'] = res['RA Straße'];
        res['LS Hausnummer'] = res['RA Hausnummer'];
        res['LS PLZ'] = res['RA Postleitzahl'];
        res['LS Ort'] = res['RA Ort'];
      } else {
        res['LS Vorname '] = res['RA Vorname'];
        res['LS Nachname'] = res['RA Nachname'];
        res['LS Firma'] = res['RA Firma'];
        res['LS Straße'] = get(f, 'address.organization.shippingAddress.street', '');
        res['LS Hausnummer'] = get(f, 'address.organization.shippingAddress.houseNum', '');
        res['LS PLZ'] = get(f, 'address.organization.shippingAddress.zip', '');
        res['LS Ort'] = get(f, 'address.organization.shippingAddress.city', '');
      }
    }

    res['LE Straße'] = res['RA Straße'];
    res['LE Hausnummer'] = res['RA Hausnummer'];
    res['LE PLZ'] = res['RA Postleitzahl'];
    res['LE Ort'] = res['RA Ort'];

    res['RA Kontoinhaber'] = get(f, 'bank.accountName', '');
    res['RA IBAN'] = get(f, 'bank.iban', '');

    res['RA Datum Unterschrift'] = get(f, 'createdAt', '') ? moment(get(f, 'createdAt', '')).format('DD.MM.YYYY') : '';
    res['RA Selbstzahler'] = 'nein';
    res['RA Zahlungstermin'] = 1;

    res['Zählernummer'] = get(f, 'oldSupplier.meterNumber', '');
    res['Verbrauch kWh/a HT'] = get(f, 'calculator.annualKwh', '');
    res['Zählverfahren'] = 'SLP';
    // res.Abschlag = formatNumber(get(f, 'price.totalCentsPerMonth', 0) / 100);
    res['bisheriger Lieferant'] = get(f, 'oldSupplier.previousProvider', '');
    res['Kundennummer bei Altlieferant'] = get(f, 'oldSupplier.previousCustomerNumber', '');

    // Remove prefix 'Energiegruppe' because it is added in the report afterwards.
    res['Handelsvertreter / VM Nr.'] = get(f, 'calculator.group', '').replace(new RegExp('^Energiegruppe '), '');
    res['Kategorie bei NN'] = 'Haushalt';
    res.Kundengruppe = 'Ja';
    res['T-ID'] = `H-${res['RA Postleitzahl']}-ET----`;
    res['gültig_ab'] = get(f, 'createdAt', '')
      ? moment(get(f, 'createdAt', ''))
        .subtract(6, 'weeks')
        .format('DD.MM.YYYY')
      : '';
    res.Bezeichnung_intern = 'People Power';
    res.Tarifart = 1;
    res['monatlicher Grundpreis netto'] = formatNumber(
      (get(f, 'price.basepriceCentsPerMonth', 0) / 1.19 / 100).toFixed(3),
    );
    res['Arbeitspreis_HT excl. Stromsteuer und USt'] = formatNumber(
      (get(f, 'price.energypriceCentsPerKilowattHour', 0) / 1.19 - 2.05).toFixed(3),
    );
    res['Arbeitspreis_NT excl. Stromsteuer und USt'] = formatNumber(
      (get(f, 'price.energypriceCentsPerKilowattHour', 0) / 1.19 - 2.05).toFixed(3),
    );
    res.Stromsteuer_HT = formatNumber(2.05);
    res.Stromsteuer_NT = formatNumber(2.05);
    res['USt %'] = 19;
    res['Kündigungsfrist'] = '01MM';
    res['Zonenpreise ja/nein'] = 'nein';

    res['RA Identnummer'] = `${f.formId}/1`;

    return res;
  });
  const ws = XLSX.utils.aoa_to_sheet([
    [
      'Codenummer:',
      '9905229000008',
      '',
      '',
      '',
      '',
      '',
      '',
      'Laufende Nummer:',
      '',
      '',
      '',
      'Übertragungsdatum:',
      moment().format('DD.MM.YYYY'),
    ],
    [],
    fields,
  ]);
  XLSX.utils.sheet_add_json(ws, converted, { header: fields, skipHeader: true, origin: 3 });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'WebsiteForms');
  XLSX.writeFile(wb, 'websiteforms.xlsx');
};

export default forms => formConverter({ forms, fields });
