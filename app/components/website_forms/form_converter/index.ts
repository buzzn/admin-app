import XLSX from 'xlsx';
import get from 'lodash/get';
import fields from './fields';

const formConverter = ({ forms, fields }) => {
  const converted = forms.map((f) => {
    const res: { [key: string]: string } = {};
    const { calculator: { customerType } } = f;

    if (get(f, 'oldSupplier.type') === 'move') res.Transaktionsgrund = 'E01';
    if (get(f, 'oldSupplier.type') === 'change') res.Transaktionsgrund = 'E03';

    if (customerType === 'person') {
      res['RA Anrede'] = get(f, 'personalInfo.person.prefix', '');
      res['RA Titel'] = get(f, 'personalInfo.person.title', '');
      res['RA Vorname'] = get(f, 'personalInfo.person.firstName', '');
      res['RA Nachname'] = get(f, 'personalInfo.person.lastName', '');
    }

    if (customerType === 'organization') {
      res['RA Firma'] = get(f, 'personalInfo.organization.contractingParty.name', '');
      res['RA Anrede'] = get(f, 'personalInfo.organization.contactPerson.prefix', '');
      res['RA Titel'] = get(f, 'personalInfo.organization.contactPerson.title', '');
      res['RA Vorname'] = get(f, 'personalInfo.organization.contactPerson.firstName', '');
      res['RA Nachname'] = get(f, 'personalInfo.organization.contactPerson.lastName', '');
    }
  });
  const ws = XLSX.utils.json_to_sheet(converted, { header: fields });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'WebsiteForms');
  XLSX.writeFile(wb, 'websiteforms.xlsx');
};

export default forms => formConverter({ forms, fields });
